import Product from '@/models/Product'
import Coupon from '@/models/Coupon'
import { sendOrderConfirmation } from './email'
import type { IOrder } from '@/models/Order'

/**
 * Atomically decrement stock for each line item. The `stock: { $gte }` filter
 * prevents the document from being updated when stock has fallen below the
 * ordered quantity between checkout and payment confirmation. The order is
 * still PAID — this only surfaces the discrepancy so it can be reconciled.
 */
async function applyOrderInventory(order: IOrder): Promise<void> {
  await Promise.all(
    order.items.map(async (item) => {
      const result = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, soldCount: item.quantity } },
      )
      if (!result) {
        console.error(
          `[fulfillment] stock decrement failed for order ${order.orderNumber}: ` +
            `product ${String(item.productId)} (${item.name}) qty ${item.quantity}. ` +
            `Manual reconciliation required.`,
        )
      }
    }),
  )
}

async function recordCouponUse(order: IOrder): Promise<void> {
  if (!order.couponCode) return
  await Coupon.findOneAndUpdate(
    { code: order.couponCode },
    { $inc: { usedCount: 1 } },
  )
}

/**
 * Run the side effects that should fire exactly once on a PENDING→PAID transition:
 * decrement inventory, record coupon use, send the order confirmation email.
 *
 * Both /api/payment/verify and the Razorpay webhook can be the path that flips
 * an order to PAID. Each caller is responsible for invoking this only when it
 * observed the transition itself (not on every request) to avoid double-firing.
 */
export async function finalizePaidOrder(order: IOrder): Promise<void> {
  await Promise.all([applyOrderInventory(order), recordCouponUse(order)])
  void sendOrderConfirmation(order)
}
