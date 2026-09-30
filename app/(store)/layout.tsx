import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import CartDrawer from '@/components/store/CartDrawer'
import PromoBanner from '@/components/store/PromoBanner'
import OfferCountdownBar from '@/components/store/OfferCountdownBar'
import OfferSync from '@/components/store/OfferSync'
import { getPublicSettings } from '@/lib/site-settings'
import { getDisplayOffer } from '@/lib/offer'

export const dynamic = 'force-dynamic'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, offer] = await Promise.all([getPublicSettings(), getDisplayOffer()])
  return (
    <div className="flex min-h-screen flex-col">
      <OfferSync offer={offer?.phase === 'live' ? offer : null} />
      {offer?.showCountdownBar && <OfferCountdownBar offer={offer} />}
      <Navbar
        bannerText={settings.bannerEnabled ? settings.bannerText : null}
        storeName={settings.storeName}
        freeShippingMin={settings.freeShippingMin}
        shippingCharge={settings.shippingCharge}
      />
      {!offer?.showCountdownBar && <PromoBanner />}
      <main className="flex-1">{children}</main>
      <Footer social={settings.social} />
      <CartDrawer />
    </div>
  )
}
