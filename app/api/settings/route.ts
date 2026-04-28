import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import SiteSettings from '@/models/SiteSettings'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

const schema = z.object({
  storeName: z.string().min(2).optional(),
  storeEmail: z.string().email().optional().or(z.literal('')),
  storePhone: z.string().optional(),
  storeAddress: z.string().optional(),
  currency: z.string().optional(),
  freeShippingMin: z.number().nonnegative().optional(),
  shippingCharge: z.number().nonnegative().optional(),
  taxRate: z.number().nonnegative().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

export async function GET() {
  try {
    await connectDB()
    let settings = await SiteSettings.findOne().lean()
    if (!settings) {
      await SiteSettings.create({})
      settings = await SiteSettings.findOne().lean()
    }
    return NextResponse.json(settings)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const settings = await SiteSettings.findOneAndUpdate({}, parsed.data, {
      new: true,
      upsert: true,
    })
    return NextResponse.json(settings)
  } catch (err) {
    return handleApiError(err)
  }
}
