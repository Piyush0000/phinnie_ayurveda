import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.' },
        { status: 503 },
      )
    }
    const form = await req.formData()
    const file = form.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }
    const buf = Buffer.from(await file.arrayBuffer())
    const result = await uploadToCloudinary(buf)
    return NextResponse.json(result)
  } catch (err) {
    return handleApiError(err)
  }
}
