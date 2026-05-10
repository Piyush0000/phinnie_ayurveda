import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { testimonialUpdateSchema } from '@/lib/validations'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = testimonialUpdateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const update: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.avatar !== undefined) {
      update.avatar = parsed.data.avatar || null
    }
    if (parsed.data.location !== undefined) {
      update.location = parsed.data.location || null
    }
    const testimonial = await Testimonial.findByIdAndUpdate(params.id, update, { new: true })
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(testimonial)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const testimonial = await Testimonial.findByIdAndDelete(params.id)
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
