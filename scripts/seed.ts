/* eslint-disable no-console */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/User'
import Category from '../models/Category'
import Product from '../models/Product'
import SiteSettings from '../models/SiteSettings'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local')
  process.exit(1)
}

// Real photography from Unsplash. Each ID below has been HEAD-checked (200 OK).
// To swap any image, replace its ID with another from unsplash.com (the part after "photo-" in the URL).
const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const CATEGORY_IMAGES: Record<string, string> = {
  'hair-care': '1522337360788-8b13dee7a37e',
  'skin-care': '1556228720-195a672e8a03',
  'wellness': '1545048702-79362596cdc9',
  'digestive-health': '1495546968767-f0573cca821e',
  'immunity': '1610348725531-843dff563e2c',
  'oils-ghee': '1474979266404-7eaacbcd87c5',
  'face-care': '1571781926291-c477ebfd024b',
  'body-care': '1620916566398-39f1143ab7be',
}

const PRODUCT_IMAGES: Record<string, string> = {
  'bhringraj-hair-oil': '1582719471384-894fbb16e074',
  'onion-black-seed-hair-oil': '1611080626919-7cf5a9dbab5b',
  'kumkumadi-serum': '1594035910387-fea47794261f',
  'neem-tulsi-face-wash': '1599305445671-ac291c95aaa9',
  'ashwagandha-ksm-66-capsules': '1543362906-acfc16c67564',
  'brahmi-memory-capsules': '1612817288484-6f916006741a',
  'triphala-churna': '1556228578-8c89e6adf883',
  'hingvastak-churna': '1564890369478-c89ca6d9cde9',
  'giloy-tulsi-tablets': '1601612628452-9e99ced43524',
  'chyawanprash': '1576091160550-2173dba999ef',
  'pure-a2-cow-ghee': '1612528443702-f6741f70a049',
  'sesame-massage-oil': '1474979266404-7eaacbcd87c5',
  'rose-water-toner': '1571019613454-1cb2f99b2d8b',
  'aloe-vera-gel': '1603833665858-e61d17a86224',
  'ubtan-face-pack': '1556228453-efd6c1ff04f6',
  'sandalwood-body-scrub': '1620916566398-39f1143ab7be',
  'kesh-raksha-hair-mask': '1522337360788-8b13dee7a37e',
  'vitamin-c-face-serum': '1608571423902-eed4a5ad8108',
  'moringa-powder': '1545048702-79362596cdc9',
  'amla-juice': '1610348725531-843dff563e2c',
}

const FALLBACK_IMAGE = '1556228578-8c89e6adf883'

const CATEGORIES = [
  { name: 'Hair Care', slug: 'hair-care', description: 'Nourishing oils, masks and care formulas for lustrous-looking hair.' },
  { name: 'Skin Care', slug: 'skin-care', description: 'Time-honored formulas for radiant, glowing skin.' },
  { name: 'Wellness', slug: 'wellness', description: 'Daily wellness supplements and tonics that help maintain body-mind balance.' },
  { name: 'Digestive Health', slug: 'digestive-health', description: 'Traditional churnas and herbal blends that support healthy digestion.' },
  { name: 'Immunity', slug: 'immunity', description: 'Time-tested herbs that help support your natural wellness.' },
  { name: 'Oils & Ghee', slug: 'oils-ghee', description: 'Pure, cold-pressed oils and traditional ghee for nourishment.' },
  { name: 'Face Care', slug: 'face-care', description: 'Gentle cleansers, serums and packs for your face.' },
  { name: 'Body Care', slug: 'body-care', description: 'Body oils, scrubs and creams from ancient Ayurvedic recipes.' },
]

const PRODUCTS_BY_CAT: Record<string, Array<Omit<Parameters<typeof seedProduct>[0], 'categorySlug' | 'isFeatured'>> & { isFeatured?: boolean }[]> = {}

interface ProductSeed {
  name: string
  slug: string
  shortDesc: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  benefits: string[]
  ingredients?: string
  howToUse?: string
  weight?: string
  tags: string[]
  isFeatured?: boolean
  categorySlug: string
}

const PRODUCTS: ProductSeed[] = [
  {
    name: 'Bhringraj Hair Oil',
    slug: 'bhringraj-hair-oil',
    shortDesc: 'Cold-pressed Bhringraj oil that helps support thick growth and natural hair colour.',
    description:
      'The "King of Hair" — Bhringraj has been revered for centuries for its nourishing benefits. Our cold-pressed Bhringraj oil is slow-cooked with sesame and amla to nourish the scalp, support strong roots, and promote thick, lustrous-looking hair. Known as Eclipta Alba in Sanskrit, this herbal favourite is used in traditional hair care routines.',
    price: 399,
    comparePrice: 499,
    stock: 120,
    benefits: ['Helps reduce hair fall', 'Supports natural hair colour', 'Nourishes scalp', 'Promotes thick-looking growth'],
    ingredients: 'Bhringraj leaves, sesame oil, amla, brahmi, neem, fenugreek seeds.',
    howToUse: 'Massage warmly into scalp 30 minutes before washing. Use 2-3 times a week for best results.',
    weight: '200ml',
    tags: ['hair growth', 'bhringraj', 'oil'],
    isFeatured: true,
    categorySlug: 'hair-care',
  },
  {
    name: 'Onion Black Seed Hair Oil',
    slug: 'onion-black-seed-hair-oil',
    shortDesc: 'Red onion + nigella seed blend for fast hair growth and reduced breakage.',
    description:
      'A blend of red onion extract and nigella (kalonji) seeds — drawn from traditional Ayurveda and used in modern hair care routines that support healthy growth. Rich in sulfur, antioxidants, and essential fatty acids, this oil helps nourish follicles and strengthen hair from root to tip.',
    price: 449,
    comparePrice: 599,
    stock: 95,
    benefits: ['Supports hair growth', 'Helps reduce breakage', 'Conditions deeply', 'Adds shine'],
    ingredients: 'Red onion extract, nigella sativa, coconut oil, castor oil, hibiscus, curry leaves.',
    howToUse: 'Apply to scalp and roots, leave for 1-2 hours, wash with mild shampoo. 2-3 times weekly.',
    weight: '200ml',
    tags: ['onion oil', 'hair growth', 'kalonji'],
    isFeatured: true,
    categorySlug: 'hair-care',
  },
  {
    name: 'Kumkumadi Serum',
    slug: 'kumkumadi-serum',
    shortDesc: 'Saffron-infused face elixir for luminous, even-toned skin.',
    description:
      'A treasured 16-herb formula from ancient Ayurvedic texts, traditionally used by royalty. Real saffron, sandalwood, and lotus combine in a base of pure sesame oil to help brighten the look of skin, reduce the appearance of dark spots, and reveal a natural-looking glow.',
    price: 799,
    comparePrice: 1099,
    stock: 60,
    benefits: ['Brightens complexion', 'Fades dark spots', 'Evens skin tone', 'Restores radiance'],
    ingredients: 'Saffron, sandalwood, manjistha, lotus, vetiver, sesame oil base, 11 more.',
    howToUse: 'Apply 3-5 drops on cleansed face every night. Massage gently in upward strokes.',
    weight: '20ml',
    tags: ['kumkumadi', 'serum', 'glow', 'saffron'],
    isFeatured: true,
    categorySlug: 'skin-care',
  },
  {
    name: 'Neem Tulsi Face Wash',
    slug: 'neem-tulsi-face-wash',
    shortDesc: 'Daily gentle cleanser with neem and holy basil for clear skin.',
    description:
      'A gentle daily cleanser combining neem and tulsi — two of Ayurveda\'s most respected herbs. Cleanses without stripping, helps with blemish-prone skin, and leaves skin feeling soft and balanced.',
    price: 299,
    comparePrice: 349,
    stock: 200,
    benefits: ['Helps with blemish-prone skin', 'Cleanses pores', 'Soothing & gentle', 'Suits all skin types'],
    ingredients: 'Neem, tulsi, aloe vera, glycerin, mild plant-based cleansers.',
    howToUse: 'Wet face, apply small amount, lather, massage gently, rinse with cool water. Use morning and night.',
    weight: '100ml',
    tags: ['face wash', 'neem', 'tulsi', 'acne'],
    isFeatured: true,
    categorySlug: 'face-care',
  },
  {
    name: 'Ashwagandha KSM-66 Capsules',
    slug: 'ashwagandha-ksm-66-capsules',
    shortDesc: 'Premium KSM-66® wellness supplement for everyday calm and vitality.',
    description:
      'A favourite adaptogen in Ayurveda. Our Ashwagandha uses the patented KSM-66® extract — a highly concentrated root extract — traditionally used to help support a sense of calm, restful sleep, and steady energy. Each capsule contains 600mg of full-spectrum extract.',
    price: 549,
    comparePrice: 699,
    stock: 150,
    benefits: ['Helps maintain a sense of calm', 'Supports restful sleep', 'Supports steady energy', 'Helps maintain focus'],
    ingredients: 'KSM-66 Ashwagandha root extract 600mg per capsule. 60 vegetarian capsules.',
    howToUse: '1 capsule twice daily after meals. Best taken consistently for 8-12 weeks.',
    weight: '60 capsules',
    tags: ['ashwagandha', 'KSM-66', 'calm', 'sleep'],
    categorySlug: 'wellness',
  },
  {
    name: 'Brahmi Memory Capsules',
    slug: 'brahmi-memory-capsules',
    shortDesc: 'Brain-boosting Brahmi extract for memory, focus, and clarity.',
    description:
      'Brahmi (Bacopa monnieri) is a classic Ayurvedic herb — used traditionally by sages and students alike to help support memory, focus, and a calm mind. Our standardized extract delivers consistent potency.',
    price: 449,
    comparePrice: 549,
    stock: 100,
    benefits: ['Helps support memory', 'Helps maintain focus', 'Supports a calm mind', 'Supports learning'],
    ingredients: 'Standardized Brahmi extract 500mg, gotu kola, shankhpushpi. 60 capsules.',
    howToUse: '1 capsule twice daily after meals.',
    weight: '60 capsules',
    tags: ['brahmi', 'memory', 'brain'],
    categorySlug: 'wellness',
  },
  {
    name: 'Triphala Churna',
    slug: 'triphala-churna',
    shortDesc: 'Classical three-fruit blend that supports healthy digestion and daily wellness.',
    description:
      'The legendary triphala — a balanced blend of amalaki, bibhitaki, and haritaki. Used daily for over 2000 years to help support healthy digestion and overall wellness. Stone-ground in our facility for maximum freshness.',
    price: 249,
    comparePrice: 299,
    stock: 180,
    benefits: ['Supports healthy digestion', 'Supports daily wellness', 'Rich in vitamin C', 'Promotes regularity'],
    ingredients: 'Amalaki (Indian gooseberry), Bibhitaki, Haritaki — equal parts.',
    howToUse: '1 tsp at bedtime with warm water. Or as suggested by an Ayurvedic wellness expert.',
    weight: '100g',
    tags: ['triphala', 'digestion', 'wellness', 'churna'],
    categorySlug: 'digestive-health',
  },
  {
    name: 'Hingvastak Churna',
    slug: 'hingvastak-churna',
    shortDesc: 'Traditional churna that supports healthy digestion and helps with occasional bloating.',
    description:
      'A classical formula of eight herbs led by hing (asafoetida), trikatu, and saunf. A daily wellness blend for those who want to support healthy digestion, appetite, and comfort after meals.',
    price: 279,
    stock: 110,
    benefits: ['Helps with occasional bloating', 'Helps maintain appetite', 'Supports digestion', 'Supports comfortable digestion'],
    ingredients: 'Hing, ajwain, ginger, black pepper, long pepper, jeera, ajamoda, saindhav.',
    howToUse: '1/2 tsp with warm water before meals.',
    weight: '60g',
    tags: ['hingvastak', 'digestion', 'wellness'],
    categorySlug: 'digestive-health',
  },
  {
    name: 'Giloy Tulsi Tablets',
    slug: 'giloy-tulsi-tablets',
    shortDesc: 'Daily immunity tablets with giloy and holy basil.',
    description:
      'Giloy — the "amrit" of Ayurveda — combined with sacred tulsi for daily wellness and overall vitality. A trusted herbal blend for the whole family.',
    price: 349,
    comparePrice: 449,
    stock: 140,
    benefits: ['Supports natural wellness', 'Daily wellness blend', 'Helps maintain vitality', 'Traditional herbal support'],
    ingredients: 'Giloy stem extract 500mg, tulsi extract 250mg per tablet. 60 tablets.',
    howToUse: '1-2 tablets twice daily after meals.',
    weight: '60 tablets',
    tags: ['giloy', 'tulsi', 'immunity'],
    categorySlug: 'immunity',
  },
  {
    name: 'Chyawanprash',
    slug: 'chyawanprash',
    shortDesc: 'Traditional 40-herb amla rasayana for daily strength.',
    description:
      'The legendary rasayana that gave sage Chyawana eternal youth. Our Chyawanprash uses fresh amla, real honey, ghee and 40+ herbs — slow-cooked in the traditional way for 30 hours.',
    price: 599,
    comparePrice: 749,
    stock: 90,
    benefits: ['Supports daily wellness', 'Helps maintain strength', 'Rich in antioxidants', 'Suitable for all ages'],
    ingredients: 'Fresh amla, honey, ghee, ashwagandha, brahmi, shatavari, dashmool — 40+ herbs.',
    howToUse: '1 tsp twice daily with warm milk. Half dose for children.',
    weight: '500g',
    tags: ['chyawanprash', 'rasayana', 'amla', 'immunity'],
    categorySlug: 'immunity',
  },
  {
    name: 'Pure A2 Cow Ghee',
    slug: 'pure-a2-cow-ghee',
    shortDesc: 'Bilona-method ghee from grass-fed Gir cows.',
    description:
      'Pure A2 ghee made the traditional bilona way — from cultured curd of grass-fed Indian Gir cows. Hand-churned in earthen pots over slow wood fire. Rich in CLA, butyrate, and fat-soluble vitamins.',
    price: 899,
    comparePrice: 1199,
    stock: 70,
    benefits: ['Supports digestion', 'Nourishing for the mind', 'Rich in vitamin A, D, E, K', 'Sattvic & nourishing'],
    ingredients: '100% A2 cow milk from grass-fed Gir cows. Nothing else.',
    howToUse: '1-2 tsp daily. Can be added to dal, rice, rotis, or warm milk.',
    weight: '500ml',
    tags: ['ghee', 'a2', 'gir cow', 'bilona'],
    categorySlug: 'oils-ghee',
  },
  {
    name: 'Sesame Massage Oil',
    slug: 'sesame-massage-oil',
    shortDesc: 'Cold-pressed sesame oil for daily abhyanga.',
    description:
      'The king of oils in Ayurveda — pure cold-pressed sesame oil, ideal for daily abhyanga (self-massage). Warming, grounding, and deeply nourishing for skin, joints, and the nervous system.',
    price: 499,
    stock: 130,
    benefits: ['Nourishes skin', 'Supports joints', 'Vata-balancing', 'Supports restful sleep'],
    ingredients: '100% cold-pressed sesame oil. No fillers.',
    howToUse: 'Warm slightly, massage all over body before bath, leave for 15-20 mins.',
    weight: '500ml',
    tags: ['sesame oil', 'abhyanga', 'massage'],
    categorySlug: 'oils-ghee',
  },
  {
    name: 'Rose Water Toner',
    slug: 'rose-water-toner',
    shortDesc: 'Pure steam-distilled gulab jal from Kannauj.',
    description:
      'Authentic gulab jal steam-distilled in copper vessels from heritage roses of Kannauj. Refreshing, hydrating, and naturally toning — perfect for daily skincare or as a calming face mist.',
    price: 199,
    stock: 250,
    benefits: ['Hydrates skin', 'Tones & refreshes', 'Calms redness', '100% natural'],
    ingredients: 'Steam-distilled rose water. No alcohol, no preservatives.',
    howToUse: 'Spray on cleansed face, or apply with cotton pad. Use anytime.',
    weight: '120ml',
    tags: ['rose water', 'toner', 'gulab jal'],
    categorySlug: 'face-care',
  },
  {
    name: 'Aloe Vera Gel',
    slug: 'aloe-vera-gel',
    shortDesc: '99% pure aloe vera gel for face, body and hair.',
    description:
      'Cold-extracted aloe vera gel from organic farms — multi-purpose hydration for skin, hair, and after-sun care. Free from artificial color, parabens, and SLS.',
    price: 249,
    stock: 220,
    benefits: ['Soothes skin', 'Light hydration', 'Cooling & comforting', 'Multi-use'],
    ingredients: '99% organic aloe vera, citric acid, natural preservatives.',
    howToUse: 'Apply on face, hair, or skin as needed. Refrigerate for cooling effect.',
    weight: '200ml',
    tags: ['aloe vera', 'gel', 'soothing'],
    categorySlug: 'skin-care',
  },
  {
    name: 'Ubtan Face Pack',
    slug: 'ubtan-face-pack',
    shortDesc: 'Traditional ubtan with chickpea, turmeric and sandalwood.',
    description:
      'The pre-wedding glow secret of Indian brides — ubtan. Our authentic blend uses chickpea flour, turmeric, sandalwood, and rose to gently exfoliate, brighten, and unveil radiant skin.',
    price: 349,
    comparePrice: 449,
    stock: 110,
    benefits: ['Brightens skin', 'Gentle exfoliation', 'Reduces tan', 'Adds glow'],
    ingredients: 'Chickpea flour, kasturi haldi, sandalwood, rose petals, multani mitti.',
    howToUse: 'Mix 1 tsp with milk or rose water, apply, leave 15 mins, wash with cool water. 2x weekly.',
    weight: '100g',
    tags: ['ubtan', 'face pack', 'glow'],
    categorySlug: 'face-care',
  },
  {
    name: 'Sandalwood Body Scrub',
    slug: 'sandalwood-body-scrub',
    shortDesc: 'Exfoliating scrub with sandalwood, oats and coconut.',
    description:
      'A luxurious body scrub combining the divine fragrance of sandalwood with gentle oat exfoliants and nourishing coconut. Reveals softer, brighter skin with each use.',
    price: 399,
    stock: 100,
    benefits: ['Exfoliates gently', 'Brightens skin', 'Deeply moisturizing', 'Aromatic'],
    ingredients: 'Sandalwood powder, oats, coconut milk powder, walnut shell, almond oil.',
    howToUse: 'Mix with water, scrub on damp skin in circular motions, rinse. Use 2-3 times a week.',
    weight: '150g',
    tags: ['sandalwood', 'scrub', 'body care'],
    categorySlug: 'body-care',
  },
  {
    name: 'Kesh Raksha Hair Mask',
    slug: 'kesh-raksha-hair-mask',
    shortDesc: 'Deep-conditioning hair mask with hibiscus and yoghurt.',
    description:
      'A weekly indulgence for damaged, dull hair — hibiscus, yoghurt powder, and shea butter restore softness, shine, and strength. Tames frizz and revives over-processed hair.',
    price: 449,
    comparePrice: 549,
    stock: 80,
    benefits: ['Repairs damage', 'Adds shine', 'Tames frizz', 'Deep conditioning'],
    ingredients: 'Hibiscus, yoghurt powder, shea butter, fenugreek, amla, coconut milk.',
    howToUse: 'Mix with water, apply to damp hair, leave 30 mins, wash. Use weekly.',
    weight: '200g',
    tags: ['hair mask', 'hibiscus', 'damaged hair'],
    categorySlug: 'hair-care',
  },
  {
    name: 'Vitamin C Face Serum',
    slug: 'vitamin-c-face-serum',
    shortDesc: 'Stable 15% vitamin C from amla and kakadu plum.',
    description:
      'A vitamin C serum derived from amla (one of nature\'s richest C sources) and kakadu plum. Helps brighten the look of skin, supports antioxidant defence, and supports the look of natural collagen — all in a stable, gentle formula.',
    price: 699,
    comparePrice: 999,
    stock: 75,
    benefits: ['Helps brighten skin', 'Reduces look of dark spots', 'Supports collagen-rich appearance', 'Antioxidant support'],
    ingredients: 'Amla extract, kakadu plum, hyaluronic acid, vitamin E, niacinamide.',
    howToUse: '3-4 drops on cleansed face every morning. Always follow with sunscreen.',
    weight: '30ml',
    tags: ['vitamin c', 'serum', 'brightening'],
    categorySlug: 'skin-care',
  },
  {
    name: 'Moringa Powder',
    slug: 'moringa-powder',
    shortDesc: 'Single-origin moringa leaf powder — superfood from South India.',
    description:
      'Hand-picked, shade-dried moringa leaves stone-ground into nutrient-dense powder. Rich in iron, calcium, vitamin A, and 18 amino acids. A daily wellness superfood for energy and overall vitality.',
    price: 399,
    stock: 100,
    benefits: ['High in iron', 'Rich in protein', 'Supports daily wellness', 'Helps maintain energy'],
    ingredients: '100% pure moringa oleifera leaf powder. Single ingredient.',
    howToUse: '1 tsp in smoothie, juice, or warm water daily.',
    weight: '100g',
    tags: ['moringa', 'superfood', 'iron'],
    categorySlug: 'wellness',
  },
  {
    name: 'Amla Juice',
    slug: 'amla-juice',
    shortDesc: 'Cold-pressed amla juice — vitamin C powerhouse.',
    description:
      'Pure cold-pressed amla juice from sun-ripened Indian gooseberries — one of nature\'s richest natural sources of vitamin C. A daily wellness drink that helps support hair, nails, and digestion as part of a balanced routine.',
    price: 299,
    stock: 130,
    benefits: ['High vitamin C', 'Supports daily wellness', 'Supports hair & nails', 'Wellness support'],
    ingredients: '100% pure amla juice. No added sugar, no preservatives.',
    howToUse: '20-30ml in morning with equal water on empty stomach. Refrigerate after opening.',
    weight: '500ml',
    tags: ['amla juice', 'vitamin c', 'wellness'],
    categorySlug: 'immunity',
  },
]

async function seedProduct(data: ProductSeed, catId: string, catName: string) {
  const primaryId = PRODUCT_IMAGES[data.slug] ?? CATEGORY_IMAGES[data.categorySlug] ?? FALLBACK_IMAGE
  const secondaryId = CATEGORY_IMAGES[data.categorySlug] ?? FALLBACK_IMAGE
  const update = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    shortDesc: data.shortDesc,
    price: data.price,
    comparePrice: data.comparePrice,
    stock: data.stock,
    images: [unsplash(primaryId, 1000), unsplash(secondaryId, 1000)],
    categoryId: catId,
    categoryName: catName,
    categorySlug: data.categorySlug,
    tags: data.tags,
    ingredients: data.ingredients,
    benefits: data.benefits,
    howToUse: data.howToUse,
    weight: data.weight,
    isActive: true,
    isFeatured: !!data.isFeatured,
  }
  return Product.findOneAndUpdate({ slug: data.slug }, update, { upsert: true, new: true })
}

async function main() {
  console.log('🌿 Connecting to MongoDB…')
  await mongoose.connect(MONGODB_URI!)
  console.log('✓ Connected')

  console.log('👤 Seeding admin user…')
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@thinnieayurvedic.com').toLowerCase().trim()
  const rawAdminPassword = process.env.ADMIN_PASSWORD
  if (!rawAdminPassword) {
    console.error('❌ ADMIN_PASSWORD is not set. Add it to .env.local before running the seed.')
    console.error('   Example: ADMIN_PASSWORD="some-strong-secret-of-your-choice"')
    process.exit(1)
  }
  if (rawAdminPassword.length < 8) {
    console.error('❌ ADMIN_PASSWORD must be at least 8 characters.')
    process.exit(1)
  }
  const adminPassword = await bcrypt.hash(rawAdminPassword, 10)
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      email: adminEmail,
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
    { upsert: true, new: true },
  )

  console.log('📁 Seeding categories…')
  const catDocs: Record<string, any> = {}
  for (const c of CATEGORIES) {
    const doc = await Category.findOneAndUpdate(
      { slug: c.slug },
      { ...c, image: unsplash(CATEGORY_IMAGES[c.slug] ?? FALLBACK_IMAGE, 1000) },
      { upsert: true, new: true },
    )
    catDocs[c.slug] = doc
  }

  console.log('🛍️  Seeding products…')
  const counts: Record<string, number> = {}
  for (const p of PRODUCTS) {
    const cat = catDocs[p.categorySlug]
    if (!cat) {
      console.warn(`   ⚠️  Skipping ${p.name} — category ${p.categorySlug} not found`)
      continue
    }
    await seedProduct(p, String(cat._id), cat.name)
    counts[p.categorySlug] = (counts[p.categorySlug] ?? 0) + 1
  }

  for (const [slug, count] of Object.entries(counts)) {
    await Category.findOneAndUpdate({ slug }, { productCount: count })
  }

  console.log('⚙️  Seeding site settings…')
  await SiteSettings.findOneAndUpdate(
    {},
    {
      storeName: 'SLim and Saane',
      storeEmail: 'hello@thinnie.in',
      storeAddress: 'Khewat no. 491, Khatauni No. 583, ward no. 10 Lakhpat colony Karnal 132116',
      currency: 'INR',
      freeShippingMin: 999,
      shippingCharge: 99,
      taxRate: 18,
      metaTitle: 'SLim and Saane — Authentic Ayurveda',
      metaDescription: 'Premium Ayurvedic products handcrafted from time-honored formulas.',
    },
    { upsert: true, new: true },
  )

  console.log('\n✅ Seed complete!')
  console.log(`   Admin login: ${adminEmail} (password from ADMIN_PASSWORD env var)`)
  console.log(`   ${PRODUCTS.length} products across ${CATEGORIES.length} categories`)

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
