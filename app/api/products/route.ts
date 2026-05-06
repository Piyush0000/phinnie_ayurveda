import { NextRequest, NextResponse } from 'next/server'
import type { FilterQuery, SortOrder } from 'mongoose'
import connectDB from '@/lib/mongodb'
import Product, { type IProduct } from '@/models/Product'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { productSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const sp = req.nextUrl.searchParams
    const search = sp.get('search')
    const sort = sp.get('sort') ?? 'newest'
    const featured = sp.get('featured') === 'true'
    const page = Math.max(1, Number(sp.get('page')) || 1)
    const limit = Math.min(60, Math.max(1, Number(sp.get('limit')) || 12))
    const minPrice = sp.get('minPrice') ? Number(sp.get('minPrice')) : undefined
    const maxPrice = sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined
    const includeInactive = sp.get('includeInactive') === 'true'

    const query: FilterQuery<IProduct> = {}
    if (!includeInactive) query.isActive = true
    if (featured) query.isFeatured = true
    if (search && search.trim()) query.$text = { $search: search.trim() }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) query.price.$gte = minPrice
      if (maxPrice !== undefined) query.price.$lte = maxPrice
    }

    const sortMap: Record<string, Record<string, SortOrder>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1, reviewCount: -1 },
      newest: { createdAt: -1 },
      featured: { isFeatured: -1, soldCount: -1 },
      bestselling: { soldCount: -1 },
    }
    const sortBy = sortMap[sort] ?? sortMap.newest

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
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
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const exists = await Product.findOne({ slug: parsed.data.slug })
    if (exists) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    const product = await Product.create(parsed.data)
    return NextResponse.json(product)
  } catch (err) {
    return handleApiError(err)
  }
}
