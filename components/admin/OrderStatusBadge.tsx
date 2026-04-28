import Badge from '@/components/ui/Badge'
import type { OrderStatus, PaymentStatus } from '@/models/Order'

const ORDER_VARIANTS: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PROCESSING: 'info',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'neutral',
}

const PAYMENT_VARIANTS: Record<PaymentStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  PENDING: 'warning',
  PAID: 'success',
  FAILED: 'danger',
  REFUNDED: 'neutral',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={ORDER_VARIANTS[status]}>{status}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={PAYMENT_VARIANTS[status]}>{status}</Badge>
}
