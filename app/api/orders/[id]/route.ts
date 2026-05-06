import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId } from 'mongoose'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

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
      !!session?.user && !!order.userId && String(order.userId) === session.user.id
    // Guest checkout fallback: order has no userId — allow lookup by orderNumber only
    const isGuestLookup = !order.userId && !isValidObjectId(id) && id === order.orderNumber

    if (!isAdmin && !isOwner && !isGuestLookup) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(order)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const order = await Order.findByIdAndDelete(params.id)
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
