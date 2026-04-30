'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
  max?: number
}

export default function ImageUploader({ images, onChange, max = 6 }: Props) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of files) {
        if (images.length + uploaded.length >= max) break
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.error || 'Upload failed')
          continue
        }
        uploaded.push(data.url)
      }
      if (uploaded.length) onChange([...images, ...uploaded])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleAddUrl = () => {
    if (!urlInput.trim()) return
    if (!urlInput.startsWith('http')) {
      toast.error('Image URL must start with http(s)://')
      return
    }
    if (images.length >= max) {
      toast.error(`Maximum ${max} images`)
      return
    }
    onChange([...images, urlInput.trim()])
    setUrlInput('')
  }

  const removeImage = (idx: number) => onChange(images.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="group relative aspect-square overflow-hidden rounded-lg border border-warmgray/20 bg-parchment"
          >
            <Image
              src={src}
              alt={`Product ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover"
              unoptimized={!/^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com|placehold\.co)/.test(src)}
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute right-1.5 top-1.5 rounded-full bg-charcoal/70 p-1 text-cream opacity-0 transition group-hover:opacity-100"
              aria-label="Remove"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {images.length < max && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-warmgray/30 bg-parchment/30 text-warmgray transition hover:bg-parchment">
            <Upload size={20} />
            <span className="mt-1 text-xs font-semibold">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste an image URL (https://...)"
          className="flex-1 rounded-lg border border-warmgray/30 bg-cream px-3 py-2 text-sm outline-none focus:border-forest"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="rounded-lg border-2 border-forest px-4 py-2 text-sm font-semibold text-forest hover:bg-forest hover:text-cream"
        >
          Add URL
        </button>
      </div>
      <p className="text-xs text-warmgray">
        Up to {max} images. Cloudinary upload requires CLOUDINARY_* env vars; otherwise paste image URLs.
      </p>
    </div>
  )
}
