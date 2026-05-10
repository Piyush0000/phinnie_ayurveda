import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { testimonialSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ testimonials })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = testimonialSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const data = {
      ...parsed.data,
      avatar: parsed.data.avatar || undefined,
      location: parsed.data.location || undefined,
      source: 'ADMIN' as const,
    }
    const testimonial = await Testimonial.create(data)
    return NextResponse.json(testimonial)
  } catch (err) {
    return handleApiError(err)
  }
}
