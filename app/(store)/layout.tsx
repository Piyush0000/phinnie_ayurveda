import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import CartDrawer from '@/components/store/CartDrawer'
import PromoBanner from '@/components/store/PromoBanner'
import { getPublicSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings()
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        bannerText={settings.bannerEnabled ? settings.bannerText : null}
        storeName={settings.storeName}
        freeShippingMin={settings.freeShippingMin}
        shippingCharge={settings.shippingCharge}
      />
      <PromoBanner />
      <main className="flex-1">{children}</main>
      <Footer social={settings.social} />
      <CartDrawer />
    </div>
  )
}
