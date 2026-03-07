'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  b2bPrice?: number
  image: string
  material: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(
        data.slice(0, 4).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          b2bPrice: p.b2bPrice,
          image: p.image || '😎',
          material: p.material,
        }))
      )
    }
    load()
  }, [])

  return (
    <section className="section-padding bg-[#FAF7F2]">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4">Featured Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular designs, loved by customers worldwide.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id}>
              <div className="card overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer h-full">
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-wood-100 flex items-center justify-center text-5xl p-4">
                  {product.image}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.material}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-700">
                      ${(session?.user as any)?.isB2B && product.b2bPrice ? product.b2bPrice : product.price}
                    </span>
                    <button className="btn btn-primary px-3 py-1 text-sm">Add</button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/products" className="btn btn-secondary px-8 py-3 text-lg">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
