'use client'

import Link from 'next/link'

const benefits = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="8" width="24" height="18" rx="2" />
        <path strokeLinecap="round" d="M4 14 H28" />
        <path strokeLinecap="round" d="M10 8 V6 M22 8 V6" />
      </svg>
    ),
    title: 'From 50 units',
    body: 'Competitive bulk pricing with no filler or minimum fuss.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 32 32" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 4 L20 12 L28 13 L22 19 L24 28 L16 24 L8 28 L10 19 L4 13 L12 12 Z" />
      </svg>
    ),
    title: 'Up to 40% off',
    body: 'Wholesale pricing on all collections — B2C and premium lines.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 32 32" aria-hidden="true">
        <path strokeLinecap="round" d="M8 24 L8 8 Q8 6 10 6 L22 6 Q24 6 24 8 L24 24" />
        <path strokeLinecap="round" d="M12 12 Q16 10 20 12" />
        <path strokeLinecap="round" d="M12 17 Q16 15 20 17" />
        <rect x="4" y="24" width="24" height="4" rx="1" />
      </svg>
    ),
    title: 'Your brand, burned in',
    body: 'Logo and custom text engraving included on every bulk order.',
  },
]

export default function B2BCta() {
  return (
    <section className="section-padding bg-gradient-to-br from-wood-800 via-wood-700 to-[#3D1F08] text-white relative overflow-hidden">
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #C4985A 0px, transparent 1px, transparent 36px, #C4985A 37px)',
        }}
      />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            For Business
          </p>
          <h2 className="text-white text-4xl sm:text-5xl font-bold leading-tight">
            Gifts That Don&apos;t End Up in a Drawer
          </h2>
          <p className="text-xl text-wood-100 leading-relaxed">
            Corporate gifts fail when they feel generic. WoodSun doesn&apos;t. Every pair is shaped
            from real wood, laser-engraved with your brand, and built to last long enough to be
            remembered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/b2b/register"
              className="btn bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-3 font-semibold transition"
            >
              See Wholesale Pricing
            </Link>
            <a
              href="mailto:b2b@woodsun.com"
              className="btn border-2 border-amber-400 text-amber-200 hover:bg-amber-400 hover:text-wood-900 text-lg px-8 py-3 font-semibold transition"
            >
              Talk to Our Team
            </a>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-wood-600">
            {benefits.map((b) => (
              <div key={b.title} className="flex flex-col items-center gap-3 text-center">
                <div className="text-amber-300">{b.icon}</div>
                <p className="font-semibold text-white text-lg">{b.title}</p>
                <p className="text-wood-200 text-sm">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
