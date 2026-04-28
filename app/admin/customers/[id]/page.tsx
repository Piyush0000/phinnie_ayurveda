import { notFound } from 'next/navigation'
import Link from 'next/link'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import AdminHeader from '@/components/admin/AdminHeader'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  if (!isDatabaseConfigured()) return notFound()
  await connectDB()
  const user = await User.findById(params.id).select('-password').lean()
  if (!user) return notFound()
  const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean()
  const agg = await Order.aggregate([
    { $match: { userId: user._id, paymentStatus: 'PAID' } },
    { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$total' } } },
  ])
  const stats = agg[0] ?? { count: 0, total: 0 }

  return (
    <>
      <AdminHeader title={user.name ?? user.email} />
      <div className="p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
            <h2 className="font-display text-xl text-forest">Profile</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-xs uppercase text-warmgray">Name</dt><dd>{user.name ?? '—'}</dd></div>
              <div><dt className="text-xs uppercase text-warmgray">Email</dt><dd>{user.email}</dd></div>
              <div><dt className="text-xs uppercase text-warmgray">Phone</dt><dd>{user.phone ?? '—'}</dd></div>
              <div><dt className="text-xs uppercase text-warmgray">Joined</dt><dd>{formatDate(user.createdAt)}</dd></div>
              <div><dt className="text-xs uppercase text-warmgray">Role</dt><dd>{user.role}</dd></div>
            </dl>
          </div>

          <div className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
            <h2 className="font-display text-xl text-forest">Stats</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-warmgray">Total orders</span><span className="font-bold">{orders.length}</span></div>
              <div className="flex justify-between"><span className="text-warmgray">Paid orders</span><span className="font-bold">{stats.count}</span></div>
              <div className="flex justify-between"><span className="text-warmgray">Total spent</span><span className="font-bold text-forest">{formatPrice(stats.total)}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
            <h2 className="font-display text-xl text-forest">Addresses</h2>
            {user.addresses?.length ? (
              <ul className="mt-3 space-y-3 text-sm">
                {user.addresses.map((a, i) => (
                  <li key={i} className="rounded-lg bg-parchment/50 p-3">
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-warmgray">{a.line1}, {a.city}, {a.state} - {a.pincode}</div>
                    <div className="text-warmgray">{a.phone}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-warmgray">No saved addresses</p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-forest/10 bg-cream shadow-warm">
          <div className="flex items-center justify-between border-b border-forest/10 p-5">
            <h2 className="font-display text-xl text-forest">Order History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-parchment/40 text-left text-xs uppercase text-warmgray">
                <tr>
                  <th className="py-3 pl-5 pr-2">Order</th>
                  <th className="py-3 pr-2">Total</th>
                  <th className="py-3 pr-2">Status</th>
                  <th className="py-3 pr-2">Payment</th>
                  <th className="py-3 pr-5">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-warmgray">No orders</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={String(o._id)} className="border-t border-forest/5">
                      <td className="py-3 pl-5 pr-2">
                        <Link href={`/admin/orders/${String(o._id)}`} className="font-semibold text-forest hover:underline">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 pr-2 font-semibold">{formatPrice(o.total)}</td>
                      <td className="py-3 pr-2"><OrderStatusBadge status={o.status} /></td>
                      <td className="py-3 pr-2"><PaymentStatusBadge status={o.paymentStatus} /></td>
                      <td className="py-3 pr-5 text-warmgray">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
