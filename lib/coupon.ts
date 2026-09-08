export interface CouponLike {
  type: 'PERCENT' | 'FIXED' | 'BOGO'
  value: number
  buyQty?: number
  getQty?: number
}

export interface DiscountLineItem {
  price: number
  quantity: number
}

/** Computes the discount amount for a coupon against a set of cart line items. */
export function computeCouponDiscount(
  coupon: CouponLike,
  items: DiscountLineItem[],
  subtotal: number,
): number {
  if (coupon.type === 'PERCENT') {
    return Math.min(Math.round((subtotal * coupon.value) / 100), subtotal)
  }
  if (coupon.type === 'FIXED') {
    return Math.min(Math.round(coupon.value), subtotal)
  }
  // BOGO: buy X, get Y at `value`% off (100 = fully free). Cheapest units are discounted.
  const buyQty = coupon.buyQty && coupon.buyQty > 0 ? coupon.buyQty : 1
  const getQty = coupon.getQty && coupon.getQty > 0 ? coupon.getQty : 1
  const groupSize = buyQty + getQty
  const units: number[] = []
  for (const item of items) {
    for (let i = 0; i < item.quantity; i++) units.push(item.price)
  }
  if (units.length < groupSize) return 0
  units.sort((a, b) => a - b)
  const freeCount = Math.floor(units.length / groupSize) * getQty
  const discountedUnits = units.slice(0, freeCount)
  const percentOff = coupon.value > 0 ? coupon.value : 100
  const raw = (discountedUnits.reduce((sum, price) => sum + price, 0) * percentOff) / 100
  return Math.min(Math.round(raw), subtotal)
}

export function couponOfferLabel(coupon: CouponLike): string {
  if (coupon.type === 'PERCENT') return `${coupon.value}% off`
  if (coupon.type === 'FIXED') return `₹${coupon.value} off`
  const buyQty = coupon.buyQty ?? 1
  const getQty = coupon.getQty ?? 1
  const free = coupon.value >= 100 ? 'Free' : `${coupon.value}% off`
  return `Buy ${buyQty} Get ${getQty} ${free}`
}
