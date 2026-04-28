import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const user = await User.findById(params.id).select('-password').lean()
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean()
    const agg = await Order.aggregate([
      { $match: { userId: user._id, paymentStatus: 'PAID' } },
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$total' } } },
    ])
    return NextResponse.json({
      customer: user,
      orders,
      ordersCount: agg[0]?.count ?? 0,
      totalSpent: agg[0]?.total ?? 0,
    })
  } catch (err) {
    return handleApiError(err)
  }
}
