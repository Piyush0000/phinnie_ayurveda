import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Promotion from '@/models/Promotion'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { promotionUpdateSchema } from '@/lib/validations'
import { deleteFromCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = promotionUpdateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const update: Record<string, unknown> = { ...parsed.data }
    for (const key of ['badgeText', 'subtitle', 'highlight1', 'highlight2', 'description', 'imageBadge', 'imageUrl', 'publicId', 'ctaText', 'ctaLink', 'footnote']) {
      if (parsed.data[key as keyof typeof parsed.data] === '') update[key] = null
    }
    const promotion = await Promotion.findByIdAndUpdate(params.id, update, { new: true })
    if (!promotion) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(promotion)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const promotion = await Promotion.findById(params.id)
    if (!promotion) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (promotion.publicId && isCloudinaryConfigured()) {
      try {
        await deleteFromCloudinary(promotion.publicId, 'image')
      } catch (err) {
        console.warn('[promotions] cloudinary destroy failed', err)
      }
    }
    await promotion.deleteOne()
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
