import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const period = req.nextUrl.searchParams.get('period') ?? '30days'
    const now = new Date()
    let from: Date
    let granularity: 'day' | 'month'
    if (period === '7days') {
      from = new Date(now)
      from.setDate(now.getDate() - 6)
      from.setHours(0, 0, 0, 0)
      granularity = 'day'
    } else if (period === '12months') {
      from = new Date(now.getFullYear(), now.getMonth() - 11, 1)
      granularity = 'month'
    } else {
      from = new Date(now)
      from.setDate(now.getDate() - 29)
      from.setHours(0, 0, 0, 0)
      granularity = 'day'
    }

    const groupId =
      granularity === 'day'
        ? { y: { $year: '$createdAt' }, m: { $month: '$createdAt' }, d: { $dayOfMonth: '$createdAt' } }
        : { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }

    const agg = await Order.aggregate([
      { $match: { paymentStatus: 'PAID', createdAt: { $gte: from } } },
      { $group: { _id: groupId, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
    ])

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const map = new Map<string, { revenue: number; orders: number }>()
    for (const a of agg) {
      const key =
        granularity === 'day'
          ? `${a._id.y}-${a._id.m}-${a._id.d}`
          : `${a._id.y}-${a._id.m}`
      map.set(key, { revenue: a.revenue, orders: a.orders })
    }

    const data: { date: string; revenue: number; orders: number }[] = []
    if (granularity === 'day') {
      const cursor = new Date(from)
      while (cursor <= now) {
        const key = `${cursor.getFullYear()}-${cursor.getMonth() + 1}-${cursor.getDate()}`
        const v = map.get(key) ?? { revenue: 0, orders: 0 }
        data.push({ date: `${monthNames[cursor.getMonth()]} ${cursor.getDate()}`, ...v })
        cursor.setDate(cursor.getDate() + 1)
      }
    } else {
      const cursor = new Date(from)
      while (cursor <= now) {
        const key = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`
        const v = map.get(key) ?? { revenue: 0, orders: 0 }
        data.push({ date: `${monthNames[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(2)}`, ...v })
        cursor.setMonth(cursor.getMonth() + 1)
      }
    }

    return NextResponse.json({ data, period })
  } catch (err) {
    return handleApiError(err)
  }
}
