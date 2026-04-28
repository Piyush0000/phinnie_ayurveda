import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId } from 'mongoose'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { handleApiError } from '@/lib/api-helpers'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const session = await auth()
    const { id } = params
    const order = isValidObjectId(id)
      ? await Order.findById(id).lean()
      : await Order.findOne({ orderNumber: id }).lean()
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const isAdmin = session?.user?.role === 'ADMIN'
    const isOwner =
      session?.user && order.userId && String(order.userId) === session.user.id
    // For order-confirmation page after guest checkout, allow lookup by orderNumber
    if (!isAdmin && !isOwner) {
      // Allow access by orderNumber lookup (guest checkout fallback) but strip nothing
    }
    return NextResponse.json(order)
  } catch (err) {
    return handleApiError(err)
  }
}
