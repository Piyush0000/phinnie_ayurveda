import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Promotion from '@/models/Promotion'
import { handleApiError } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const placement = req.nextUrl.searchParams.get('placement')
    const query: Record<string, unknown> = { isActive: true }
    if (placement === 'HERO' || placement === 'STRIP') query.placement = placement
    const promotions = await Promotion.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean()
    return NextResponse.json({ promotions })
  } catch (err) {
    return handleApiError(err)
  }
}
