import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import Product from '@/models/Product'
import Order from '@/models/Order'
import { handleApiError, requireUser } from '@/lib/api-helpers'
import { reviewSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireUser()
    if (error || !session) return error!
    await connectDB()
    const body = await req.json()
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const verified = await Order.exists({
      userId: session.user.id,
      'items.productId': parsed.data.productId,
      paymentStatus: 'PAID',
    })

    const review = await Review.findOneAndUpdate(
      { userId: session.user.id, productId: parsed.data.productId },
      {
        userId: session.user.id,
        userName: session.user.name ?? session.user.email,
        userImage: session.user.image,
        productId: parsed.data.productId,
        rating: parsed.data.rating,
        title: parsed.data.title,
        body: parsed.data.body,
        isVerified: !!verified,
      },
      { new: true, upsert: true },
    )

    const agg = await Review.aggregate([
      { $match: { productId: review.productId } },
      { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])
    if (agg[0]) {
      await Product.findByIdAndUpdate(review.productId, {
        rating: Math.round(agg[0].avg * 10) / 10,
        reviewCount: agg[0].count,
      })
    }

    return NextResponse.json(review)
  } catch (err) {
    return handleApiError(err)
  }
}
