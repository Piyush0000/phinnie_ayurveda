import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Product from '@/models/Product'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const cat = await Category.findByIdAndUpdate(params.id, parsed.data, { new: true })
    if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (parsed.data.name || parsed.data.slug) {
      await Product.updateMany(
        { categoryId: cat._id },
        { categoryName: cat.name, categorySlug: cat.slug },
      )
    }
    return NextResponse.json(cat)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const cat = await Category.findById(params.id)
    if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (cat.productCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Reassign or delete them first.' },
        { status: 400 },
      )
    }
    await cat.deleteOne()
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
