import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 100 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.',
        },
        { status: 503 },
      )
    }
    const form = await req.formData()
    const file = form.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 413 })
    }
    const mime = (file as File).type || ''
    const isVideo = mime.startsWith('video/')
    const isImage = mime.startsWith('image/')
    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Only image or video files are allowed' },
        { status: 400 },
      )
    }
    const buf = Buffer.from(await file.arrayBuffer())
    const result = await uploadToCloudinary(
      buf,
      'thinnie/gallery',
      isVideo ? 'video' : 'image',
    )
    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      type: isVideo ? 'VIDEO' : 'IMAGE',
    })
  } catch (err) {
    return handleApiError(err)
  }
}
