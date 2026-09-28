// Pure, client-safe helpers for "Buy N @ ₹X" bundle offers (no mongoose imports here).
import { computeCouponDiscount, type CouponLike } from './coupon'

export interface OfferTier {
  quantity: number
  price: number
}

export interface PublicOffer {
  _id: string
  title: string
  subtitle?: string
  countdownLabel?: string
  footnote?: string
  ctaText: string
  ctaLink: string
  imageUrl?: string
  tiers: OfferTier[]
  /** Empty = every product is eligible. */
  productIds: string[]
  combineWithCoupons: boolean
  showCountdownBar: boolean
  startsAt?: string | null
  endsAt?: string | null
}

export interface OfferLineItem {
  productId: string
  price: number
  quantity: number
}

export interface BundleResult {
  discount: number
  /** Bundles used to reach the best price, largest first. */
  bundles: OfferTier[]
  eligibleUnits: number
}

export function normalizeTiers(tiers: OfferTier[]): OfferTier[] {
  return tiers
    .filter((t) => Number.isInteger(t.quantity) && t.quantity >= 2 && t.price > 0)
    .sort((a, b) => a.quantity - b.quantity)
}

/**
 * Cheapest way to pay for the eligible units using any mix of bundles.
 * Units are sorted most-expensive first so bundles absorb the priciest items;
 * a bundle is only used when it actually beats paying full price.
 */
export function computeBundleDiscount(
  offer: Pick<PublicOffer, 'tiers' | 'productIds'>,
  items: OfferLineItem[],
): BundleResult {
  const tiers = normalizeTiers(offer.tiers)
  const eligible = new Set(offer.productIds)
  const units: number[] = []
  for (const item of items) {
    if (eligible.size > 0 && !eligible.has(item.productId)) continue
    for (let i = 0; i < item.quantity; i++) units.push(item.price)
  }
  const n = units.length
  if (tiers.length === 0 || n < tiers[0].quantity) {
    return { discount: 0, bundles: [], eligibleUnits: n }
  }
  units.sort((a, b) => b - a)

  const prefix = [0]
  for (const u of units) prefix.push(prefix[prefix.length - 1] + u)

  // cost[i] = cheapest price for the first i units; choice[i] = bundle size used last (0 = full price)
  const cost = new Array<number>(n + 1).fill(Infinity)
  const choice = new Array<number>(n + 1).fill(0)
  cost[0] = 0
  for (let i = 1; i <= n; i++) {
    cost[i] = cost[i - 1] + units[i - 1]
    for (const t of tiers) {
      if (t.quantity > i) break
      const groupFull = prefix[i] - prefix[i - t.quantity]
      if (t.price >= groupFull) continue
      const c = cost[i - t.quantity] + t.price
      if (c < cost[i]) {
        cost[i] = c
        choice[i] = t.quantity
      }
    }
  }

  const bundles: OfferTier[] = []
  for (let i = n; i > 0; ) {
    const q = choice[i]
    if (q === 0) {
      i -= 1
    } else {
      bundles.push(tiers.find((t) => t.quantity === q)!)
      i -= q
    }
  }
  bundles.sort((a, b) => b.quantity - a.quantity)
  return { discount: Math.max(0, Math.round(prefix[n] - cost[n])), bundles, eligibleUnits: n }
}

/** The next tier the shopper can unlock by adding more eligible items, if any. */
export function nextOfferTier(offer: Pick<PublicOffer, 'tiers'>, eligibleUnits: number): OfferTier | null {
  return normalizeTiers(offer.tiers).find((t) => t.quantity > eligibleUnits) ?? null
}

export function tierLabel(t: OfferTier): string {
  return `Buy ${t.quantity} @ ₹${t.price}`
}

export function isOfferLive(offer: Pick<PublicOffer, 'startsAt' | 'endsAt'>, now = Date.now()): boolean {
  if (offer.startsAt && new Date(offer.startsAt).getTime() > now) return false
  if (offer.endsAt && new Date(offer.endsAt).getTime() <= now) return false
  return true
}

export interface ResolvedDiscounts {
  offerDiscount: number
  couponDiscount: number
  total: number
  bundle: BundleResult | null
  /** True when a coupon is applied but ignored because the offer gives a better price. */
  couponOverridden: boolean
  /** True when the offer is ignored because the coupon gives a better price. */
  offerOverridden: boolean
}

/**
 * Combines the automatic bundle offer with an (optional) coupon. When the offer
 * does not stack with coupons, whichever saves the customer more wins.
 * Used identically on the client (display) and server (order creation).
 */
export function resolveDiscounts(
  items: OfferLineItem[],
  subtotal: number,
  offer: Pick<PublicOffer, 'tiers' | 'productIds' | 'combineWithCoupons'> | null,
  coupon: CouponLike | null,
): ResolvedDiscounts {
  const bundle = offer ? computeBundleDiscount(offer, items) : null
  const rawOffer = Math.min(bundle?.discount ?? 0, subtotal)
  const rawCoupon = coupon ? computeCouponDiscount(coupon, items, subtotal) : 0

  if (offer?.combineWithCoupons) {
    const couponDiscount = Math.min(rawCoupon, subtotal - rawOffer)
    return {
      offerDiscount: rawOffer,
      couponDiscount,
      total: rawOffer + couponDiscount,
      bundle,
      couponOverridden: false,
      offerOverridden: false,
    }
  }
  if (coupon && rawCoupon > rawOffer) {
    return {
      offerDiscount: 0,
      couponDiscount: rawCoupon,
      total: rawCoupon,
      bundle,
      couponOverridden: false,
      offerOverridden: rawOffer > 0,
    }
  }
  return {
    offerDiscount: rawOffer,
    couponDiscount: 0,
    total: rawOffer,
    bundle,
    couponOverridden: !!coupon && rawOffer > 0,
    offerOverridden: false,
  }
}
