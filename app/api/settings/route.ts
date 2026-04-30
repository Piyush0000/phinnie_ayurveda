import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import SiteSettings from '@/models/SiteSettings'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { settingsSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

const fullSchema = settingsSchema.extend({
  bannerText: z.string().max(280).optional(),
  bannerEnabled: z.boolean().optional(),
  social: z
    .object({
      instagram: z.string().url().optional().or(z.literal('')),
      facebook: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
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
    const parsed = fullSchema.safeParse(await req.json())
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

// Allow PUT as alias to PATCH for compatibility
export async function PUT(req: NextRequest) {
  return PATCH(req)
}
