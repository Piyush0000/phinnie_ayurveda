import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Admin · Phinnie Aurvadic' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login?from=/admin')
  if (session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="flex-1 lg:ml-0">
        {children}
      </div>
    </div>
  )
}
