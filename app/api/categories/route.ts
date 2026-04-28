import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
})

export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find({}).sort({ name: 1 }).lean()
    return NextResponse.json({ categories })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const slug = parsed.data.slug || slugify(parsed.data.name)
    const exists = await Category.findOne({ $or: [{ slug }, { name: parsed.data.name }] })
    if (exists) return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
    const cat = await Category.create({ ...parsed.data, slug })
    return NextResponse.json(cat)
  } catch (err) {
    return handleApiError(err)
  }
}
