import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mail, Phone, Package } from 'lucide-react'
import { auth } from '@/lib/auth'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login?from=/profile')
  if (!isDatabaseConfigured()) {
    return <div className="container-wide py-12 text-warmgray">Database not configured.</div>
  }
  await connectDB()
  const [user, ordersCountAgg] = await Promise.all([
    User.findById(session.user.id).select('-password').lean(),
    Order.aggregate([
      { $match: { userId: session.user.id, paymentStatus: 'PAID' } },
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$total' } } },
    ]),
  ])
  const stats = ordersCountAgg[0] ?? { count: 0, total: 0 }

  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="font-display text-4xl text-charcoal md:text-5xl">My Profile</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm md:col-span-2">
          <h2 className="font-display text-2xl text-forest">Account</h2>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-warmgray">Name</div>
              <div className="text-charcoal">{user?.name ?? '—'}</div>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-warmgray" />
              <span className="text-charcoal">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-warmgray" />
                <span className="text-charcoal">{user.phone}</span>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-forest/10 bg-parchment/50 p-6">
          <h2 className="font-display text-2xl text-forest">Activity</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-warmgray">Orders</span>
              <span className="font-bold text-charcoal">{stats.count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-warmgray">Total spent</span>
              <span className="font-bold text-forest">{formatPrice(stats.total)}</span>
            </div>
          </div>
          <Link
            href="/orders"
            className="mt-5 flex items-center justify-center gap-2 rounded-lg border-2 border-forest py-2 text-sm font-semibold text-forest hover:bg-forest hover:text-cream"
          >
            <Package size={14} /> View Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
