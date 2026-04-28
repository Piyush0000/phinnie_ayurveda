import AdminHeader from '@/components/admin/AdminHeader'
import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <>
      <AdminHeader title="New Product" />
      <div className="p-6 lg:p-8">
        <ProductForm />
      </div>
    </>
  )
}
