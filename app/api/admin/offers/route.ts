import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Offer from '@/models/Offer'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { offerSchema } from '@/lib/validations'
import { offerDocFromInput } from '@/lib/offer'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const offers = await Offer.find({}).sort({ updatedAt: -1 }).lean()
    return NextResponse.json({ offers })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = offerSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const offer = await Offer.create(offerDocFromInput(parsed.data))
    return NextResponse.json(offer)
  } catch (err) {
    return handleApiError(err)
  }
}
