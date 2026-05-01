import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Admin · Thinnie Aurvadic' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get('x-pathname') ?? ''
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const session = await auth()
  if (!session?.user) redirect('/admin/login')
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
