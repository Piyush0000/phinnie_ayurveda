import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import { handleApiError } from '@/lib/api-helpers'
import { testimonialPublicSubmitSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 12, 50)
    const testimonials = await Testimonial.find({
      isActive: true,
      approvalStatus: 'APPROVED',
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    return NextResponse.json({ testimonials })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit(req, {
      key: 'testimonial-submit',
      limit: 5,
      windowMs: 60 * 60 * 1000,
    })
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      )
    }
    await connectDB()
    const parsed = testimonialPublicSubmitSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const testimonial = await Testimonial.create({
      name: parsed.data.name.trim(),
      rating: parsed.data.rating,
      comment: parsed.data.comment.trim(),
      location: parsed.data.location?.trim() || undefined,
      isActive: true,
      approvalStatus: 'PENDING',
      source: 'CUSTOMER',
    })
    return NextResponse.json({
      success: true,
      id: testimonial._id.toString(),
      message: 'Thank you! Your review has been submitted for approval.',
    })
  } catch (err) {
    return handleApiError(err)
  }
}
