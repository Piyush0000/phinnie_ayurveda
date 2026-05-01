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

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = 'thinnie-aurvadic',
): Promise<{ url: string; publicId: string }> {
  const cld = getCloudinary()
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload failed'))
        resolve({ url: result.secure_url, publicId: result.public_id })
      },
    )
    stream.end(buffer)
  })
}
