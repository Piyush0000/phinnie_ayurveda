import { NextResponse } from 'next/server'
import { getActiveOffer } from '@/lib/offer'

export const dynamic = 'force-dynamic'

export async function GET() {
  const offer = await getActiveOffer()
  return NextResponse.json({ offer })
}
