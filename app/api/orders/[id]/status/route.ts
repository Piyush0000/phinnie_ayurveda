import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { orderStatusSchema } from '@/lib/validations'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const body = await req.json()
    const parsed = orderStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        status: parsed.data.status,
        $push: {
          statusHistory: {
            status: parsed.data.status,
            timestamp: new Date(),
            note: parsed.data.note,
          },
        },
      },
      { new: true },
    )
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch (err) {
    return handleApiError(err)
  }
}
