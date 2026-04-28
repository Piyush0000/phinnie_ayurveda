import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import Product from '@/models/Product'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const now = new Date()
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    const [thisMonth, lastMonth, ordersByStatus, newCustomers, lowStock, recentOrders, totals] =
      await Promise.all([
        Order.aggregate([
          { $match: { paymentStatus: 'PAID', createdAt: { $gte: startThisMonth } } },
          { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
        ]),
        Order.aggregate([
          {
            $match: {
              paymentStatus: 'PAID',
              createdAt: { $gte: startLastMonth, $lte: endLastMonth },
            },
          },
          { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
        ]),
        Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        User.countDocuments({ role: 'CUSTOMER', createdAt: { $gte: startThisMonth } }),
        Product.find({ stock: { $lt: 10 }, isActive: true })
          .sort({ stock: 1 })
          .limit(10)
          .select('name slug stock images price')
          .lean(),
        Order.find({})
          .sort({ createdAt: -1 })
          .limit(10)
          .select('orderNumber total status paymentStatus createdAt shippingAddress.name shippingAddress.email items')
          .lean(),
        Promise.all([
          User.countDocuments({ role: 'CUSTOMER' }),
          Product.countDocuments({ isActive: true }),
          Order.countDocuments({}),
          Order.aggregate([
            { $match: { paymentStatus: 'PAID' } },
            { $group: { _id: null, total: { $sum: '$total' } } },
          ]),
        ]),
      ])

    const [totalCustomers, totalProducts, totalOrders, lifetimeAgg] = totals
    const revenueThis = thisMonth[0]?.revenue ?? 0
    const revenueLast = lastMonth[0]?.revenue ?? 0
    const ordersThis = thisMonth[0]?.count ?? 0
    const ordersLast = lastMonth[0]?.count ?? 0

    const pct = (a: number, b: number) => (b === 0 ? (a > 0 ? 100 : 0) : ((a - b) / b) * 100)

    return NextResponse.json({
      revenue: {
        thisMonth: revenueThis,
        lastMonth: revenueLast,
        changePct: Math.round(pct(revenueThis, revenueLast) * 10) / 10,
        lifetime: lifetimeAgg[0]?.total ?? 0,
      },
      orders: {
        thisMonth: ordersThis,
        lastMonth: ordersLast,
        changePct: Math.round(pct(ordersThis, ordersLast) * 10) / 10,
        total: totalOrders,
        byStatus: ordersByStatus.reduce(
          (acc, o) => ({ ...acc, [o._id]: o.count }),
          {} as Record<string, number>,
        ),
      },
      customers: { newThisMonth: newCustomers, total: totalCustomers },
      products: { total: totalProducts, lowStock },
      recentOrders,
    })
  } catch (err) {
    return handleApiError(err)
  }
}
