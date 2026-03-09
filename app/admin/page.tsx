'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  orderNumber: string
  customer: string
  date: string
  total: number
  status: string
  isB2B?: boolean
}

interface Variant {
  id?: string
  name: string
  sku: string
  color: string
  lensType: string
  priceDifference: number
  stock: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  b2bPrice: number | null
  images: string[]
  videoEmbedUrl: string | null
  videoFileUrl: string | null
  material: string
  style: string
  isPolarized: boolean
  variants: Variant[]
}

const emptyProduct = {
  name: '',
  slug: '',
  description: '',
  price: '',
  b2bPrice: '',
  images: [] as string[],
  videoEmbedUrl: '',
  videoFileUrl: '',
  material: '',
  style: '',
  isPolarized: false,
}

const emptyVariant = { name: '', sku: '', color: '', lensType: 'Regular', priceDifference: '0', stock: '0' }

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(
        data.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customer: o.email,
          date: new Date(o.createdAt).toISOString().slice(0, 10),
          total: o.total,
          status: o.status,
          isB2B: o.isB2BOrder,
        }))
      )
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-wood-600 text-white py-8">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p className="mt-2">Manage products, orders, and B2B requests.</p>
        </div>
      </div>

      <div className="container section-padding">
        <ProductManager />

        <h2 className="mt-16 mb-4">Recent Orders</h2>
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.orderNumber}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3">{o.date}</td>
                <td className="p-3">{o.isB2B ? 'B2B' : 'B2C'}</td>
                <td className="p-3">${o.total.toFixed(2)}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value
                      await fetch('/api/orders/update-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: o.id, status: newStatus }),
                      })
                      setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: newStatus } : x)))
                    }}
                    className="input"
                  >
                    {['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3 flex gap-3">
                  <a href={`/account/orders/${o.id}`} className="text-wood-600 hover:underline text-sm">View</a>
                  <a href={`/api/orders/${o.id}/invoice`} className="text-gray-500 hover:underline text-sm" target="_blank">Invoice</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-12 mb-4">Pending B2B Registrations</h2>
        <B2BTable />

        <BulkImport />
      </div>
    </div>
  )
}

function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<any>(emptyProduct)
  const [variants, setVariants] = useState<any[]>([{ ...emptyVariant }])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    const res = await fetch('/api/products')
    setProducts(await res.json())
  }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!data.url) throw new Error(data.error || 'Upload failed')
    return data.url
  }

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyProduct, images: [], videoEmbedUrl: '', videoFileUrl: '' })
    setVariants([{ ...emptyVariant }])
    setMsg('')
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: String(p.price),
      b2bPrice: p.b2bPrice != null ? String(p.b2bPrice) : '',
      images: p.images || [],
      videoEmbedUrl: p.videoEmbedUrl || '',
      videoFileUrl: p.videoFileUrl || '',
      material: p.material,
      style: p.style,
      isPolarized: p.isPolarized,
    })
    setVariants(p.variants.map(v => ({
      name: v.name, sku: v.sku, color: v.color,
      lensType: v.lensType,
      priceDifference: String(v.priceDifference),
      stock: String(v.stock),
    })))
    setMsg('')
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    setMsg('')
    try {
      if (editing) {
        await fetch(`/api/products/${editing.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, variants }),
        })
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, variants }),
        })
      }
      await loadProducts()
      setShowForm(false)
      setMsg(editing ? 'Product updated.' : 'Product created.')
    } catch {
      setMsg('Error saving product.')
    }
    setSaving(false)
  }

  async function handleDelete(slug: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await fetch(`/api/products/${slug}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((p) => p.slug !== slug))
  }

  function setVariantField(i: number, key: string, val: string) {
    setVariants((prev) => prev.map((v, idx) => idx === i ? { ...v, [key]: val } : v))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Products</h2>
        <button onClick={openAdd} className="btn btn-primary px-4 py-2 text-sm">+ Add Product</button>
      </div>

      {msg && <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{msg}</p>}

      <table className="w-full text-left border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Material</th>
            <th className="p-3">Style</th>
            <th className="p-3">Price</th>
            <th className="p-3">B2B Price</th>
            <th className="p-3">Variants</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3 font-medium">{p.name}</td>
              <td className="p-3">{p.material}</td>
              <td className="p-3">{p.style}</td>
              <td className="p-3">${p.price.toFixed(2)}</td>
              <td className="p-3">{p.b2bPrice != null ? `$${p.b2bPrice.toFixed(2)}` : '—'}</td>
              <td className="p-3">{p.variants.length}</td>
              <td className="p-3 flex gap-3">
                <button onClick={() => openEdit(p)} className="text-wood-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(p.slug)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-8">
            <h3 className="text-xl font-bold mb-6">{editing ? 'Edit Product' : 'Add Product'}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="input w-full" value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Slug (URL key, no spaces)</label>
                <input className="input w-full" value={form.slug} onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value }))} disabled={!!editing} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="input w-full h-20" value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (€)</label>
                <input type="number" step="0.01" className="input w-full" value={form.price} onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">B2B Price (€)</label>
                <input type="number" step="0.01" className="input w-full" value={form.b2bPrice} onChange={e => setForm((f: any) => ({ ...f, b2bPrice: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Material</label>
                <input className="input w-full" placeholder="e.g. Walnut" value={form.material} onChange={e => setForm((f: any) => ({ ...f, material: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Style</label>
                <input className="input w-full" placeholder="e.g. Classic" value={form.style} onChange={e => setForm((f: any) => ({ ...f, style: e.target.value }))} />
              </div>
              {/* Images */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {(form.images || []).map((url: string, i: number) => (
                    <div key={i} className="relative w-20 h-20">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-wood-200" />
                      <button
                        type="button"
                        onClick={() => setForm((f: any) => ({ ...f, images: f.images.filter((_: any, idx: number) => idx !== i) }))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                      >×</button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-wood-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-wood-500 text-wood-400 text-2xl">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || [])
                        const urls = await Promise.all(files.map(uploadFile))
                        setForm((f: any) => ({ ...f, images: [...(f.images || []), ...urls] }))
                        e.target.value = ''
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Video embed URL */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Video Embed URL (YouTube / Vimeo)</label>
                <input
                  className="input w-full"
                  placeholder="https://www.youtube.com/embed/..."
                  value={form.videoEmbedUrl || ''}
                  onChange={e => setForm((f: any) => ({ ...f, videoEmbedUrl: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1">Use the embed URL format, e.g. youtube.com/embed/VIDEO_ID</p>
              </div>

              {/* Video file upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Video File (MP4)</label>
                {form.videoFileUrl && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 truncate max-w-xs">{form.videoFileUrl}</span>
                    <button type="button" onClick={() => setForm((f: any) => ({ ...f, videoFileUrl: '' }))} className="text-red-500 text-xs hover:underline">Remove</button>
                  </div>
                )}
                <label className="btn btn-outline text-sm px-3 py-1.5 cursor-pointer">
                  {form.videoFileUrl ? 'Replace video' : 'Upload MP4'}
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const url = await uploadFile(file)
                      setForm((f: any) => ({ ...f, videoFileUrl: url }))
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="polarized" checked={form.isPolarized} onChange={e => setForm((f: any) => ({ ...f, isPolarized: e.target.checked }))} />
                <label htmlFor="polarized" className="text-sm font-medium">Polarized lenses</label>
              </div>
            </div>

            {/* Variants */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Variants</h4>
                <button
                  onClick={() => setVariants(v => [...v, { ...emptyVariant }])}
                  className="text-sm text-wood-600 hover:underline"
                >+ Add variant</button>
              </div>
              {variants.map((v, i) => (
                <div key={i} className="border rounded-lg p-4 mb-3 grid grid-cols-2 gap-3 relative">
                  {variants.length > 1 && (
                    <button
                      onClick={() => setVariants(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs"
                    >✕ Remove</button>
                  )}
                  <div>
                    <label className="block text-xs font-medium mb-1">Variant name</label>
                    <input className="input w-full text-sm" value={v.name} onChange={e => setVariantField(i, 'name', e.target.value)} placeholder="e.g. Natural Brown / Dark Lenses" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">SKU</label>
                    <input className="input w-full text-sm" value={v.sku} onChange={e => setVariantField(i, 'sku', e.target.value)} placeholder="e.g. CW-NAT-DRK" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Color</label>
                    <input className="input w-full text-sm" value={v.color} onChange={e => setVariantField(i, 'color', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Lens type</label>
                    <select className="input w-full text-sm" value={v.lensType} onChange={e => setVariantField(i, 'lensType', e.target.value)}>
                      {['Regular', 'Polarized', 'UV Protection'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Price difference (€)</label>
                    <input type="number" step="0.01" className="input w-full text-sm" value={v.priceDifference} onChange={e => setVariantField(i, 'priceDifference', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Stock</label>
                    <input type="number" className="input w-full text-sm" value={v.stock} onChange={e => setVariantField(i, 'stock', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="btn btn-outline px-4 py-2">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary px-6 py-2">
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function B2BTable() {
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/b2b/pending')
      const data = await res.json()
      setRequests(data)
    }
    load()
  }, [])

  return (
    <table className="w-full text-left border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Company</th>
          <th className="p-3">Email</th>
          <th className="p-3">Submitted</th>
          <th className="p-3">Approved</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <tr key={r.id} className="border-t">
            <td className="p-3">{r.companyName}</td>
            <td className="p-3">{r.email}</td>
            <td className="p-3">{new Date(r.submittedAt).toISOString().slice(0, 10)}</td>
            <td className="p-3">{r.approved ? 'Yes' : 'No'}</td>
            <td className="p-3">
              {!r.approved && (
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary px-2 py-1 text-sm"
                    onClick={async () => {
                      await fetch('/api/b2b/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: r.id }) })
                      setRequests((prev) => prev.map((x) => (x.id === r.id ? { ...x, approved: true } : x)))
                    }}
                  >Approve</button>
                  <button
                    className="btn btn-outline px-2 py-1 text-sm text-red-600"
                    onClick={async () => {
                      await fetch('/api/b2b/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: r.id }) })
                      setRequests((prev) => prev.filter((x) => x.id !== r.id))
                    }}
                  >Reject</button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BulkImport() {
  const TEMPLATE = [
    'email,sku,quantity,street_address,city,state,postal_code,country',
    'customer@example.com,WS-WALNUT-DARK-001,2,123 Main St,Sofia,Sofia,1000,BG',
  ].join('\n')

  const [rows, setRows] = useState<any[]>([])
  const [result, setResult] = useState<{ created: number; errors: any[] } | null>(null)
  const [importing, setImporting] = useState(false)

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-order-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    import('papaparse').then(({ default: Papa }) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => setRows(res.data as any[]),
      })
    })
  }

  async function handleImport() {
    setImporting(true)
    setResult(null)
    const res = await fetch('/api/orders/bulk-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
    })
    const data = await res.json()
    setResult(data)
    setImporting(false)
  }

  return (
    <div className="mt-12">
      <h2 className="mb-4">Bulk Import Orders</h2>
      <div className="flex gap-4 mb-4">
        <button onClick={downloadTemplate} className="btn btn-outline text-sm px-3 py-2">Download CSV Template</button>
        <label className="btn btn-outline text-sm px-3 py-2 cursor-pointer">
          Choose CSV File
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {rows.length > 0 && (
        <>
          <p className="text-sm text-gray-600 mb-2">{rows.length} row{rows.length !== 1 ? 's' : ''} detected. Preview (first 5):</p>
          <table className="w-full text-left border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>{Object.keys(rows[0]).map((k) => <th key={k} className="p-2">{k}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((r, i) => (
                <tr key={i} className="border-t">
                  {Object.values(r).map((v: any, j) => <td key={j} className="p-2">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleImport} disabled={importing} className="btn btn-primary px-4 py-2">
            {importing ? 'Importing…' : `Import ${rows.length} order${rows.length !== 1 ? 's' : ''}`}
          </button>
        </>
      )}

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.errors.length === 0 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
          <p className="font-medium">{result.created} order{result.created !== 1 ? 's' : ''} created successfully.</p>
          {result.errors.length > 0 && (
            <ul className="mt-2 text-sm list-disc list-inside">
              {result.errors.map((e: any, i: number) => <li key={i}>Row {e.row}: {e.message}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
