'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/components/cart/CartContext'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')
  const [added, setAdded] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { addItem } = useCart()

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/products/${slug}`)
      const data = await res.json()
      if (data.error) {
        router.push('/products')
        return
      }
      setProduct(data)
      if (data.variants?.length > 0) {
        setSelectedVariantId(data.variants[0].id)
      }
    }
    load()
  }, [slug, router])

  if (!product) return <p className="p-8">Loading...</p>

  const displayPrice = (session?.user as any)?.isB2B && product.b2bPrice
    ? product.b2bPrice
    : product.price

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId)
  const finalPrice = selectedVariant ? displayPrice + selectedVariant.priceDifference : displayPrice

  function handleAddToCart() {
    if (!selectedVariant) return
    addItem({
      id: selectedVariant.id,
      name: `${product.name} – ${selectedVariant.name}`,
      slug: product.slug,
      price: finalPrice,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container section-padding max-w-2xl">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← Back
        </button>

        <div className="text-6xl mb-6">{product.image}</div>

        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-bold text-wood-600">${finalPrice.toFixed(2)}</span>
          {(session?.user as any)?.isB2B && product.b2bPrice && (
            <span className="text-sm bg-sage-100 text-sage-700 px-2 py-1 rounded">B2B price</span>
          )}
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-6">
          <span>Material: <strong>{product.material}</strong></span>
          <span>Style: <strong>{product.style}</strong></span>
          {product.isPolarized && <span className="text-wood-600 font-medium">Polarized</span>}
        </div>

        {product.variants?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Select variant</p>
            <div className="space-y-2">
              {product.variants.map((v: any) => (
                <label
                  key={v.id}
                  className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition ${
                    selectedVariantId === v.id ? 'border-wood-600 bg-wood-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="variant"
                      value={v.id}
                      checked={selectedVariantId === v.id}
                      onChange={() => setSelectedVariantId(v.id)}
                      className="accent-wood-600"
                    />
                    <div>
                      <p className="font-medium text-sm">{v.name}</p>
                      <p className="text-xs text-gray-500">{v.lensType} · {v.color}</p>
                    </div>
                  </div>
                  {v.priceDifference > 0 && (
                    <span className="text-sm text-gray-500">+${v.priceDifference.toFixed(2)}</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!selectedVariantId}
          className="btn btn-primary w-full py-3 text-base"
        >
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
