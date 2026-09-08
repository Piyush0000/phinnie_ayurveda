import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Promotion from '@/models/Promotion'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { promotionSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const promotions = await Promotion.find({}).sort({ placement: 1, sortOrder: 1, createdAt: -1 }).lean()
    return NextResponse.json({ promotions })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = promotionSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const promotion = await Promotion.create({
      ...parsed.data,
      badgeText: parsed.data.badgeText || undefined,
      subtitle: parsed.data.subtitle || undefined,
      highlight1: parsed.data.highlight1 || undefined,
      highlight2: parsed.data.highlight2 || undefined,
      description: parsed.data.description || undefined,
      imageBadge: parsed.data.imageBadge || undefined,
      imageUrl: parsed.data.imageUrl || undefined,
      publicId: parsed.data.publicId || undefined,
      ctaText: parsed.data.ctaText || 'Shop Now',
      ctaLink: parsed.data.ctaLink || '/shop',
      footnote: parsed.data.footnote || undefined,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    return NextResponse.json(promotion)
  } catch (err) {
    return handleApiError(err)
  }
}
