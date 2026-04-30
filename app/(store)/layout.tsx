import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import CartDrawer from '@/components/store/CartDrawer'
import { getPublicSettings } from '@/lib/site-settings'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings()
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        bannerText={settings.bannerEnabled ? settings.bannerText : null}
        storeName={settings.storeName}
      />
      <main className="flex-1">{children}</main>
      <Footer social={settings.social} />
      <CartDrawer />
    </div>
  )
}
