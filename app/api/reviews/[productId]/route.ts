import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import { handleApiError } from '@/lib/api-helpers'

export async function GET(_req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    await connectDB()
    const reviews = await Review.find({ productId: params.productId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
    return NextResponse.json({ reviews })
  } catch (err) {
    return handleApiError(err)
  }
}
