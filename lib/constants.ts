export const SITE_CONFIG = {
  name: 'WoodSun Gifts',
  description: 'Eco-friendly wooden sunglasses with personalization and B2B options',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/woodsungifts',
    github: 'https://github.com/woodsungi',
  },
}

export const PRODUCT_CATEGORIES = ['Classic', 'Modern', 'Vintage', 'Polarized']

export const WOOD_TYPES = ['Walnut', 'Bamboo', 'Oak', 'Maple', 'Ebony', 'Cherry']

export const SHIPPING_COST = 10
export const TAX_RATE = 0.1
export const FREE_SHIPPING_THRESHOLD = 100

export const B2B_DISCOUNT_TIERS = [
  { min: 50, discount: 0.15 },
  { min: 100, discount: 0.25 },
  { min: 500, discount: 0.35 },
]

export const CUSTOMIZATION_OPTIONS = {
  maxTextLength: 20,
  fonts: ['Arial', 'Times New Roman', 'Comic Sans', 'Georgia'],
  positions: ['left', 'center', 'right'],
}
