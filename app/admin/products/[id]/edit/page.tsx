import { notFound } from 'next/navigation'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Product from '@/models/Product'
import AdminHeader from '@/components/admin/AdminHeader'
import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  if (!isDatabaseConfigured()) return notFound()
  await connectDB()
  const product = await Product.findById(params.id).lean()
  if (!product) return notFound()
  const initial = JSON.parse(JSON.stringify(product)) as Record<string, unknown> & {
    name?: string
    categoryId?: string
  }
  return (
    <>
      <AdminHeader title={`Edit: ${initial.name ?? ''}`} />
      <div className="p-6 lg:p-8">
        <ProductForm
          productId={params.id}
          initial={{
            ...initial,
            categoryId: String(initial.categoryId ?? ''),
          }}
        />
      </div>
    </>
  )
}
