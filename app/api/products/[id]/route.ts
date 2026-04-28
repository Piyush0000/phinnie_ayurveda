import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId } from 'mongoose'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { productSchema } from '@/lib/validations'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = params
    const product = isValidObjectId(id)
      ? await Product.findById(id).lean()
      : await Product.findOne({ slug: id }).lean()
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const body = await req.json()
    const parsed = productSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const update: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.categoryId) {
      const cat = await Category.findById(parsed.data.categoryId).lean()
      if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 400 })
      update.categoryName = cat.name
      update.categorySlug = cat.slug
    }
    const product = await Product.findByIdAndUpdate(params.id, update, { new: true })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const product = await Product.findByIdAndDelete(params.id)
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await Category.findByIdAndUpdate(product.categoryId, { $inc: { productCount: -1 } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
