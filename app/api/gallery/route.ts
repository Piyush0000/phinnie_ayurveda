import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'
import { handleApiError } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 60, 200)
    const items = await GalleryItem.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean()
    return NextResponse.json({ items })
  } catch (err) {
    return handleApiError(err)
  }
}
