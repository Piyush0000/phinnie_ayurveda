import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Offer from '@/models/Offer'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { offerSchema } from '@/lib/validations'
import { deleteFromCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'
import { offerDocFromInput } from '@/lib/offer'

const toggleSchema = z.object({ isActive: z.boolean() }).strict()

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const body = await req.json()

    // Quick show/hide toggle from the list, or a full save from the edit form.
    const toggle = toggleSchema.safeParse(body)
    let update: Record<string, unknown>
    if (toggle.success) {
      update = toggle.data
    } else {
      const parsed = offerSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
          { status: 400 },
        )
      }
      update = offerDocFromInput(parsed.data)
    }
    const offer = await Offer.findByIdAndUpdate(params.id, update, { new: true })
    if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(offer)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const offer = await Offer.findById(params.id)
    if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (offer.publicId && isCloudinaryConfigured()) {
      try {
        await deleteFromCloudinary(offer.publicId, 'image')
      } catch (err) {
        console.warn('[offers] cloudinary destroy failed', err)
      }
    }
    await offer.deleteOne()
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
