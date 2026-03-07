'use client'

import Link from 'next/link'

/* Inline SVG: abstract wood-grain + sunglass frame illustration */
function WoodSunIllustration() {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Background panel */}
      <rect width="480" height="480" rx="24" fill="#F5ECD7" />

      {/* Wood grain lines — horizontal, organic feel */}
      {[40, 68, 91, 112, 131, 149, 166, 183, 200, 217, 234, 251, 268, 285, 302, 319, 336, 353, 370, 387, 404, 421, 440].map(
        (y, i) => (
          <path
            key={i}
            d={`M0 ${y} Q${120 + (i % 3) * 20} ${y + (i % 2 === 0 ? -6 : 5)} ${240} ${y + (i % 3 === 0 ? 4 : -3)} Q${360 - (i % 2) * 15} ${y + (i % 2 === 0 ? 7 : -5)} 480 ${y}`}
            stroke={i % 4 === 0 ? '#C4985A' : '#D4AA70'}
            strokeWidth={i % 7 === 0 ? '1.5' : '0.7'}
            opacity={0.35}
          />
        )
      )}

      {/* Sunglass frame — left lens */}
      <rect x="60" y="170" width="150" height="110" rx="36" fill="#8B5E3C" opacity="0.92" />
      <rect x="70" y="180" width="130" height="90" rx="28" fill="#3D1F08" />
      {/* Left lens inner shine */}
      <ellipse cx="120" cy="210" rx="28" ry="18" fill="#6B3E26" opacity="0.5" />
      <ellipse cx="110" cy="200" rx="10" ry="6" fill="white" opacity="0.12" />

      {/* Sunglass frame — right lens */}
      <rect x="270" y="170" width="150" height="110" rx="36" fill="#8B5E3C" opacity="0.92" />
      <rect x="280" y="180" width="130" height="90" rx="28" fill="#3D1F08" />
      {/* Right lens inner shine */}
      <ellipse cx="330" cy="210" rx="28" ry="18" fill="#6B3E26" opacity="0.5" />
      <ellipse cx="320" cy="200" rx="10" ry="6" fill="white" opacity="0.12" />

      {/* Bridge */}
      <path d="M210 218 Q240 202 270 218" stroke="#8B5E3C" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Left arm */}
      <path d="M60 225 Q20 225 12 260" stroke="#8B5E3C" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Right arm */}
      <path d="M420 225 Q460 225 468 260" stroke="#8B5E3C" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Wood grain detail on frame top */}
      <path d="M65 178 Q120 172 205 178" stroke="#C4985A" strokeWidth="1.2" opacity="0.5" fill="none" />
      <path d="M275 178 Q330 172 415 178" stroke="#C4985A" strokeWidth="1.2" opacity="0.5" fill="none" />

      {/* Chisel tool — bottom right, subtle craft nod */}
      <g transform="translate(310, 330) rotate(-30)">
        <rect x="0" y="0" width="10" height="70" rx="2" fill="#8B5E3C" opacity="0.7" />
        <polygon points="0,70 10,70 5,90" fill="#C4985A" opacity="0.8" />
        <rect x="1" y="2" width="8" height="14" rx="1" fill="#C4985A" opacity="0.4" />
      </g>

      {/* Leaf accent — top left */}
      <g transform="translate(68, 60)" opacity="0.6">
        <path d="M0 30 Q15 0 30 30 Q15 45 0 30Z" fill="#6B8F6B" />
        <path d="M15 0 L15 45" stroke="#4A6741" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Small sawdust dots */}
      {[[160, 340], [180, 355], [145, 360], [200, 348], [170, 370]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#C4985A" opacity="0.3" />
      ))}

      {/* Grain knot — decorative */}
      <ellipse cx="390" cy="120" rx="22" ry="14" fill="none" stroke="#C4985A" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="390" cy="120" rx="12" ry="7" fill="none" stroke="#C4985A" strokeWidth="1" opacity="0.25" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#FAF7F2] via-wood-50 to-amber-50 section-padding overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #8B5E3C 0px, transparent 1px, transparent 28px, #8B5E3C 29px)',
        }}
      />

      <div className="container relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm font-medium px-4 py-1.5 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Handcrafted in small batches
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
            Born in the{' '}
            <span className="text-amber-700">Workshop.</span>
            <br />
            Built for the Wild.
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Every pair is shaped by hand — chiseled, sanded, and finished by craftsmen who
            respect the wood as much as the wilderness it came from.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/products" className="btn btn-primary text-lg px-8 py-3">
              Shop the Collection
            </Link>
            <Link href="/b2b/register" className="btn btn-outline text-lg px-8 py-3">
              B2B &amp; Wholesale
            </Link>
          </div>

          {/* Trust Signals — no emojis, SVG icons */}
          <div className="flex flex-wrap gap-6 pt-8 border-t border-wood-200 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              {/* Leaf icon */}
              <svg className="w-5 h-5 text-wood-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2C6 2 2 6 2 10c0 3.5 2.5 6.5 6 7.5V10a2 2 0 114 0v7.5c3.5-1 6-4 6-7.5 0-4-4-8-8-8z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Oak, Walnut &amp; Bamboo</p>
                <p>Sustainably sourced hardwood only</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              {/* Sparkle / unique icon */}
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1l2.3 6.5H19l-5.4 4 2 6.4L10 14l-5.6 3.9 2-6.4L1 7.5h6.7z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Each Pair Unique</p>
                <p>No two wood grains are ever the same</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              {/* Recycle / no plastic icon */}
              <svg className="w-5 h-5 text-wood-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Zero Plastic</p>
                <p>Nothing synthetic. Nothing that doesn&apos;t belong.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden lg:block">
          <div className="aspect-square rounded-2xl overflow-hidden border border-wood-200 shadow-lg">
            <WoodSunIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}
