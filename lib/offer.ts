import connectDB, { isDatabaseConfigured } from './mongodb'
import Offer, { type IOffer } from '@/models/Offer'
import SiteSettings from '@/models/SiteSettings'
import type { PublicOffer } from './bundle-offer'
import type { OfferInput } from './validations'

/** Preset created once on a fresh store so the festive offer is live out of the box. */
export const FESTIVE_DHAMAKA_PRESET = {
  title: 'Thinnie Festive Dhamaka',
  subtitle: 'Your Health · Your Festive Glow · Our Special Offer',
  countdownLabel: 'Festive Dhamaka Offer Ends In',
  footnote: '*Mix & match any products. Offer price applied automatically at checkout.',
  ctaText: 'Shop the Offer',
  ctaLink: '/shop',
  imageUrl: '/offers/festive-dhamaka.webp',
  tiers: [
    { quantity: 2, price: 999 },
    { quantity: 3, price: 1499 },
    { quantity: 4, price: 1999 },
  ],
  combineWithCoupons: false,
  showCountdownBar: true,
  isActive: true,
}

export function toPublicOffer(o: Pick<IOffer, keyof IOffer>): PublicOffer {
  return {
    _id: String(o._id),
    title: o.title,
    subtitle: o.subtitle || undefined,
    countdownLabel: o.countdownLabel || undefined,
    footnote: o.footnote || undefined,
    ctaText: o.ctaText || 'Shop the Offer',
    ctaLink: o.ctaLink || '/shop',
    imageUrl: o.imageUrl || undefined,
    tiers: (o.tiers ?? []).map((t) => ({ quantity: t.quantity, price: t.price })),
    productIds: (o.productIds ?? []).map((id) => String(id)),
    combineWithCoupons: !!o.combineWithCoupons,
    showCountdownBar: o.showCountdownBar !== false,
    startsAt: o.startsAt ? new Date(o.startsAt).toISOString() : null,
    endsAt: o.endsAt ? new Date(o.endsAt).toISOString() : null,
  }
}

let presetChecked = false

async function ensurePreset() {
  if (presetChecked) return
  // Claim the one-time bootstrap atomically; if the flag was already set, do nothing.
  const claimed = await SiteSettings.findOneAndUpdate(
    { offersInitialized: { $ne: true } },
    { $set: { offersInitialized: true } },
  )
  if (!claimed) {
    const anySettings = await SiteSettings.exists({})
    if (anySettings) {
      presetChecked = true
      return
    }
    await SiteSettings.create({ offersInitialized: true })
  }
  if (!(await Offer.exists({}))) await Offer.create(FESTIVE_DHAMAKA_PRESET)
  presetChecked = true
}

/** The offer currently running on the storefront (most recently updated live one), or null. */
export async function getActiveOffer(): Promise<PublicOffer | null> {
  if (!isDatabaseConfigured()) return null
  try {
    await connectDB()
    await ensurePreset()
    const now = new Date()
    const offer = await Offer.findOne({
      isActive: true,
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gt: now } }] },
      ],
    })
      .sort({ updatedAt: -1 })
      .lean()
    return offer ? toPublicOffer(offer as unknown as IOffer) : null
  } catch (err) {
    console.error('[offer] could not load active offer', err)
    return null
  }
}

/** Maps validated form input to the stored document shape ('' → unset). */
export function offerDocFromInput(data: OfferInput) {
  const orNull = (v?: string | null) => (v ? v : null)
  return {
    title: data.title,
    subtitle: orNull(data.subtitle),
    countdownLabel: orNull(data.countdownLabel),
    footnote: orNull(data.footnote),
    ctaText: data.ctaText || 'Shop the Offer',
    ctaLink: data.ctaLink || '/shop',
    imageUrl: orNull(data.imageUrl),
    publicId: orNull(data.publicId),
    tiers: [...data.tiers].sort((a, b) => a.quantity - b.quantity),
    productIds: data.productIds,
    combineWithCoupons: data.combineWithCoupons,
    showCountdownBar: data.showCountdownBar,
    isActive: data.isActive,
    startsAt: data.startsAt ? new Date(data.startsAt) : null,
    endsAt: data.endsAt ? new Date(data.endsAt) : null,
  }
}
