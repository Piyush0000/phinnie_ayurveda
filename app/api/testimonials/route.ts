import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import { handleApiError } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 12, 500)
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

export function POST() {
  return NextResponse.json(
    { error: 'Reviews can only be added by an administrator.' },
    { status: 403 },
  )
}
