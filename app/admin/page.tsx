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

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/orders')
      const data = await res.json()
      // map to our UI shape
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
          <p className="mt-2">Manage orders and B2B requests.</p>
        </div>
      </div>

      <div className="container section-padding">
        <h2 className="mb-4">Recent Orders</h2>
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
                  <a href={`/account/orders/${o.id}`} className="text-wood-600 hover:underline text-sm">
                    View
                  </a>
                  <a
                    href={`/api/orders/${o.id}/invoice`}
                    className="text-gray-500 hover:underline text-sm"
                    target="_blank"
                  >
                    Invoice
                  </a>
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
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-outline px-2 py-1 text-sm text-red-600"
                    onClick={async () => {
                      await fetch('/api/b2b/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: r.id }) })
                      setRequests((prev) => prev.filter((x) => x.id !== r.id))
                    }}
                  >
                    Reject
                  </button>
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
        <button onClick={downloadTemplate} className="btn btn-outline text-sm px-3 py-2">
          Download CSV Template
        </button>
        <label className="btn btn-outline text-sm px-3 py-2 cursor-pointer">
          Choose CSV File
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {rows.length > 0 && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            {rows.length} row{rows.length !== 1 ? 's' : ''} detected. Preview (first 5):
          </p>
          <table className="w-full text-left border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(rows[0]).map((k) => (
                  <th key={k} className="p-2">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((r, i) => (
                <tr key={i} className="border-t">
                  {Object.values(r).map((v: any, j) => (
                    <td key={j} className="p-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleImport}
            disabled={importing}
            className="btn btn-primary px-4 py-2"
          >
            {importing ? 'Importing…' : `Import ${rows.length} order${rows.length !== 1 ? 's' : ''}`}
          </button>
        </>
      )}

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.errors.length === 0 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
          <p className="font-medium">
            {result.created} order{result.created !== 1 ? 's' : ''} created successfully.
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 text-sm list-disc list-inside">
              {result.errors.map((e: any, i: number) => (
                <li key={i}>Row {e.row}: {e.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}