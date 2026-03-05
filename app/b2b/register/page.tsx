'use client'

import { useState } from 'react'

export default function B2BRegisterPage() {
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    vatNumber: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/b2b/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      alert('Failed to submit. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="container section-padding text-center">
        <h1>Thank you!</h1>
        <p>Your request has been received. We'll contact you shortly.</p>
      </div>
    )
  }

  return (
    <div className="container section-padding max-w-lg">
      <h1>Wholesale Registration</h1>
      <p className="text-gray-600 mb-6">Fill out the form and we will review your application.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">VAT Number (optional)</label>
          <input
            type="text"
            name="vatNumber"
            value={form.vatNumber}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="input"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Submit Application
        </button>
      </form>
    </div>
  )
}
