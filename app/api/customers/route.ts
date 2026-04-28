import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const sp = req.nextUrl.searchParams
    const search = sp.get('search')
    const page = Math.max(1, Number(sp.get('page')) || 1)
    const limit = Math.min(50, Number(sp.get('limit')) || 20)

    const query: Record<string, unknown> = { role: 'CUSTOMER' }
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ]
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ])

    const stats = await Promise.all(
      users.map(async (u) => {
        const agg = await Order.aggregate([
          { $match: { userId: u._id, paymentStatus: 'PAID' } },
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$total' } } },
        ])
        return {
          ...u,
          ordersCount: agg[0]?.count ?? 0,
          totalSpent: agg[0]?.total ?? 0,
        }
      }),
    )

    return NextResponse.json({
      customers: stats,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (err) {
    return handleApiError(err)
  }
}
