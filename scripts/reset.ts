/* eslint-disable no-console */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import mongoose from 'mongoose'
import Product from '../models/Product'
import Order from '../models/Order'
import Review from '../models/Review'
import Coupon from '../models/Coupon'
import Category from '../models/Category'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local')
  process.exit(1)
}

const WIPE_CATEGORIES = process.argv.includes('--all')

async function main() {
  console.log('🔌 Connecting to MongoDB…')
  await mongoose.connect(MONGODB_URI!)
  console.log('✓ Connected\n')

  const targets: Array<{ label: string; model: typeof Product }> = [
    { label: 'products', model: Product as any },
    { label: 'orders', model: Order as any },
    { label: 'reviews', model: Review as any },
    { label: 'coupons', model: Coupon as any },
  ]

  if (WIPE_CATEGORIES) {
    targets.push({ label: 'categories', model: Category as any })
  }

  for (const { label, model } of targets) {
    const before = await (model as any).countDocuments()
    const res = await (model as any).deleteMany({})
    console.log(`🗑️  ${label}: removed ${res.deletedCount}/${before}`)
  }

  console.log('\n✅ Reset complete. Shop will now be empty until products are added via the Admin panel.')
  if (!WIPE_CATEGORIES) {
    console.log('   (Categories preserved. Pass --all to wipe categories too.)')
  }

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Reset failed:', err)
  process.exit(1)
})
