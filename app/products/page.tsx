'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  material: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filterMaterial, setFilterMaterial] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    // TODO: Fetch products from API with filters
    setProducts([
      { id: '1', name: 'Classic Walnut', slug: 'classic-walnut', price: 79.99, material: 'Walnut' },
      { id: '2', name: 'Modern Bamboo', slug: 'modern-bamboo', price: 89.99, material: 'Bamboo' },
      { id: '3', name: 'Vintage Oak', slug: 'vintage-oak', price: 84.99, material: 'Oak' },
      { id: '4', name: 'Polarized Maple', slug: 'polarized-maple', price: 99.99, material: 'Maple' },
      { id: '5', name: 'Executive Ebony', slug: 'executive-ebony', price: 119.99, material: 'Ebony' },
      { id: '6', name: 'Eco Bamboo', slug: 'eco-bamboo', price: 74.99, material: 'Bamboo' },
    ])
  }, [filterMaterial, sortBy])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-sage-50 py-8 sm:py-12">
        <div className="container">
          <h1>Shop Our Collection</h1>
          <p className="text-gray-600 mt-2">Discover our range of eco-friendly wooden sunglasses</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>

              {/* Material Filter */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Material</p>
                <div className="space-y-2">
                  {['All', 'Walnut', 'Bamboo', 'Oak', 'Maple', 'Ebony'].map((material) => (
                    <label key={material} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="material"
                        value={material.toLowerCase()}
                        checked={filterMaterial === material.toLowerCase()}
                        onChange={(e) => setFilterMaterial(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="mb-6" />

              {/* Price Range */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Price Range</p>
                <input type="range" min="0" max="150" className="w-full" />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>$0</span>
                  <span>$150</span>
                </div>
              </div>

              <hr className="mb-6" />

              {/* Other Filters */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">Polarized Lenses</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <strong>{products.length}</strong> products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input max-w-xs"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <div className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-square bg-gradient-to-br from-wood-100 to-sage-100 flex items-center justify-center text-5xl p-4">
                      😎
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{product.material} Wood</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-wood-600">${product.price.toFixed(2)}</span>
                        <button className="btn btn-primary px-3 py-1 text-sm">Add</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
