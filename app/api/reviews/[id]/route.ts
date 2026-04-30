import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import Product from '@/models/Product'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { reviewModerationSchema } from '@/lib/validations'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = reviewModerationSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const review = await Review.findByIdAndUpdate(params.id, parsed.data, { new: true })
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(review)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const review = await Review.findByIdAndDelete(params.id)
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const agg = await Review.aggregate([
      { $match: { productId: review.productId } },
      { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])
    await Product.findByIdAndUpdate(review.productId, {
      rating: agg[0] ? Math.round(agg[0].avg * 10) / 10 : 0,
      reviewCount: agg[0]?.count ?? 0,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
