'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Save, ImageIcon, Video as VideoIcon, Eye, EyeOff, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn, formatDate } from '@/lib/utils'

type GalleryItemType = 'IMAGE' | 'VIDEO'

interface GalleryItem {
  _id: string
  url: string
  type: GalleryItemType
  caption?: string
  publicId?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
}

type FilterType = 'ALL' | GalleryItemType

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Images', value: 'IMAGE' },
  { label: 'Videos', value: 'VIDEO' },
]

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null)
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState('')
  const fileRef = useRef<HTMLInputElement | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gallery')
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not load gallery')
        setItems([])
        return
      }
      setItems(data.items ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setUploadProgress({ done: 0, total: files.length })
    try {
      let success = 0
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fd = new FormData()
        fd.append('file', file)
        const upRes = await fetch('/api/admin/gallery/upload', { method: 'POST', body: fd })
        const upData = await upRes.json()
        if (!upRes.ok) {
          toast.error(`${file.name}: ${upData.error || 'Upload failed'}`)
          setUploadProgress({ done: i + 1, total: files.length })
          continue
        }
        const createRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: upData.url,
            type: upData.type,
            publicId: upData.publicId,
            isActive: true,
            sortOrder: 0,
          }),
        })
        if (!createRes.ok) {
          const err = await createRes.json()
          toast.error(`${file.name}: ${err.error || 'Could not save'}`)
        } else {
          success++
        }
        setUploadProgress({ done: i + 1, total: files.length })
      }
      if (success) toast.success(`Uploaded ${success} ${success === 1 ? 'file' : 'files'}`)
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('Delete this item? This will also remove it from Cloudinary.')) return
    const res = await fetch(`/api/admin/gallery/${item._id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Removed from gallery')
    void load()
  }

  const toggleActive = async (item: GalleryItem) => {
    const res = await fetch(`/api/admin/gallery/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !item.isActive }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not update')
      return
    }
    toast.success(item.isActive ? 'Hidden from storefront' : 'Now visible on storefront')
    void load()
  }

  const saveCaption = async (id: string) => {
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: editCaption.trim() }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not save')
      return
    }
    toast.success('Caption saved')
    setEditingId(null)
    setEditCaption('')
    void load()
  }

  const startEdit = (item: GalleryItem) => {
    setEditingId(item._id)
    setEditCaption(item.caption ?? '')
  }

  const visible = filter === 'ALL' ? items : items.filter((i) => i.type === filter)
  const activeCount = items.filter((i) => i.isActive).length
  const videoCount = items.filter((i) => i.type === 'VIDEO').length
  const imageCount = items.filter((i) => i.type === 'IMAGE').length

  return (
    <>
      <AdminHeader title="Gallery" />
      <div className="p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-warmgray">
              Showcase your craft on the storefront. Photos and videos upload directly to Cloudinary.
            </p>
            <p className="mt-1 text-xs text-warmgray/80">
              {items.length} total · {activeCount} visible · {imageCount} photos · {videoCount} videos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button
              onClick={() => fileRef.current?.click()}
              loading={uploading}
              disabled={uploading}
            >
              <Upload size={14} />
              {uploading
                ? uploadProgress
                  ? `Uploading ${uploadProgress.done}/${uploadProgress.total}`
                  : 'Uploading…'
                : 'Upload photos or videos'}
            </Button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-semibold transition',
                filter === f.value
                  ? 'border-forest bg-forest text-cream'
                  : 'border-warmgray/30 bg-cream text-charcoal hover:bg-parchment',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-warmgray">Loading…</p>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-warmgray/30 bg-parchment/50 p-12 text-center">
            <ImageIcon size={32} className="mx-auto text-warmgray/50" />
            <p className="mt-3 text-warmgray">
              {items.length === 0
                ? 'No gallery items yet. Upload your first photo or video to get started.'
                : 'No items match this filter.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((item) => (
              <article
                key={item._id}
                className={cn(
                  'group flex flex-col overflow-hidden rounded-2xl border bg-cream shadow-warm',
                  item.isActive ? 'border-forest/10' : 'border-warmgray/30 opacity-70',
                )}
              >
                <div className="relative aspect-[3/4] bg-parchment">
                  {item.type === 'IMAGE' ? (
                    <Image
                      src={item.url}
                      alt={item.caption ?? 'Gallery image'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized={!/^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com|placehold\.co)/.test(item.url)}
                    />
                  ) : (
                    <video
                      src={item.url}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                      onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  )}
                  <span className="absolute left-2 top-2">
                    <Badge variant={item.type === 'VIDEO' ? 'info' : 'neutral'}>
                      {item.type === 'VIDEO' ? (
                        <span className="inline-flex items-center gap-1">
                          <VideoIcon size={10} /> Video
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <ImageIcon size={10} /> Photo
                        </span>
                      )}
                    </Badge>
                  </span>
                  {!item.isActive && (
                    <span className="absolute right-2 top-2">
                      <Badge variant="warning">Hidden</Badge>
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  {editingId === item._id ? (
                    <div className="space-y-2">
                      <Input
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Add a caption"
                        maxLength={240}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveCaption(item._id)}>
                          <Save size={12} /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null)
                            setEditCaption('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="line-clamp-2 min-h-[2.5em] text-sm text-charcoal/80">
                        {item.caption || <span className="italic text-warmgray/70">No caption</span>}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-warmgray">
                        {formatDate(item.createdAt)}
                      </p>
                    </>
                  )}
                  <div className="mt-3 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="rounded-lg border border-warmgray/30 p-1.5 text-charcoal hover:bg-parchment"
                      aria-label="Edit caption"
                      title="Edit caption"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(item)}
                      className="rounded-lg border border-warmgray/30 p-1.5 text-charcoal hover:bg-parchment"
                      aria-label={item.isActive ? 'Hide' : 'Show'}
                      title={item.isActive ? 'Hide from storefront' : 'Show on storefront'}
                    >
                      {item.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-lg border border-warmgray/30 p-1.5 text-terracotta hover:bg-terracotta-50"
                      aria-label="Delete"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
