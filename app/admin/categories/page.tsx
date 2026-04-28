'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { slugify } from '@/lib/utils'

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  productCount: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Category>>({})
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data.categories ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!newName.trim()) return
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, description: newDesc, slug: slugify(newName) }),
    })
    const data = await res.json()
    if (!res.ok) return toast.error(data.error || 'Could not add')
    setNewName('')
    setNewDesc('')
    toast.success('Category added')
    load()
  }

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    const data = await res.json()
    if (!res.ok) return toast.error(data.error || 'Could not save')
    toast.success('Category updated')
    setEditingId(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) return toast.error(data.error || 'Could not delete')
    toast.success('Category deleted')
    load()
  }

  return (
    <>
      <AdminHeader title="Categories" />
      <div className="p-6 lg:p-8">
        <div className="mb-6 grid gap-4 rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm md:grid-cols-[1fr,2fr,auto] md:items-end">
          <Input label="New Category Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Hair Care" />
          <Input label="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <Button onClick={handleAdd}>
            <Plus size={14} /> Add
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-cream shadow-warm">
          <table className="w-full text-sm">
            <thead className="border-b border-forest/10 bg-parchment/40 text-left text-xs uppercase text-warmgray">
              <tr>
                <th className="py-3 pl-4 pr-2">Name</th>
                <th className="py-3 pr-2">Slug</th>
                <th className="py-3 pr-2">Description</th>
                <th className="py-3 pr-2">Products</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-warmgray">Loading…</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-warmgray">No categories yet</td></tr>
              ) : (
                categories.map((c) => (
                  <tr key={c._id} className="border-b border-forest/5">
                    {editingId === c._id ? (
                      <>
                        <td className="py-2 pl-4 pr-2">
                          <input
                            value={editForm.name ?? c.name}
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full rounded border border-warmgray/30 bg-white px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="py-2 pr-2">{c.slug}</td>
                        <td className="py-2 pr-2">
                          <input
                            value={editForm.description ?? c.description ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full rounded border border-warmgray/30 bg-white px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="py-2 pr-2">{c.productCount}</td>
                        <td className="py-2 pr-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleSave(c._id)} className="rounded p-1.5 text-forest hover:bg-parchment">
                              <Save size={14} />
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setEditForm({}) }}
                              className="rounded p-1.5 text-warmgray hover:bg-parchment"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 pl-4 pr-2 font-semibold text-charcoal">{c.name}</td>
                        <td className="py-3 pr-2 text-warmgray">{c.slug}</td>
                        <td className="py-3 pr-2 text-warmgray">{c.description ?? '—'}</td>
                        <td className="py-3 pr-2">{c.productCount}</td>
                        <td className="py-3 pr-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setEditingId(c._id); setEditForm({ name: c.name, description: c.description }) }}
                              className="rounded-lg border border-warmgray/30 p-2 hover:bg-parchment"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="rounded-lg border border-warmgray/30 p-2 text-terracotta hover:bg-terracotta-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
