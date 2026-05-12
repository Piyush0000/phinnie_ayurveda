import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { galleryItemSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const items = await GalleryItem.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean()
    return NextResponse.json({ items })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = galleryItemSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const item = await GalleryItem.create({
      url: parsed.data.url,
      type: parsed.data.type,
      caption: parsed.data.caption || undefined,
      publicId: parsed.data.publicId || undefined,
      sortOrder: parsed.data.sortOrder ?? 0,
      isActive: parsed.data.isActive,
    })
    return NextResponse.json(item)
  } catch (err) {
    return handleApiError(err)
  }
}
