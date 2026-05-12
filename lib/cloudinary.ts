import { v2 as cloudinary } from 'cloudinary'

let configured = false

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
}

export function getCloudinary(): typeof cloudinary {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured.')
  }
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
      secure: true,
    })
    configured = true
  }
  return cloudinary
}

type CloudinaryResourceType = 'image' | 'video' | 'auto'

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = 'thinnie-ayurvedic',
  resourceType: CloudinaryResourceType = 'image',
): Promise<{ url: string; publicId: string; resourceType: 'image' | 'video' }> {
  const cld = getCloudinary()
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload failed'))
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: (result.resource_type as 'image' | 'video') ?? 'image',
        })
      },
    )
    stream.end(buffer)
  })
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' = 'image',
): Promise<void> {
  if (!publicId) return
  const cld = getCloudinary()
  await cld.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true })
}
