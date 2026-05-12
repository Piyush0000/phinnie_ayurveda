import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { galleryItemUpdateSchema } from '@/lib/validations'
import { deleteFromCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = galleryItemUpdateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const update: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.caption !== undefined) update.caption = parsed.data.caption || null
    if (parsed.data.publicId !== undefined) update.publicId = parsed.data.publicId || null
    const item = await GalleryItem.findByIdAndUpdate(params.id, update, { new: true })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const item = await GalleryItem.findById(params.id)
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (item.publicId && isCloudinaryConfigured()) {
      try {
        await deleteFromCloudinary(item.publicId, item.type === 'VIDEO' ? 'video' : 'image')
      } catch (err) {
        console.warn('[gallery] cloudinary destroy failed', err)
      }
    }
    await item.deleteOne()
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
