'use client'

const testimonials = [
  {
    name: 'Luka Petrov',
    role: 'Mountain Guide, Rhodopes',
    text: 'Wore them through two summers of hiking — Rila, Pirin, Rhodopes. The grain on mine is like a fingerprint. I\'ve never seen another pair like it. Still going strong.',
    rating: 5,
    tag: 'Outdoor',
  },
  {
    name: 'Marta Veselinova',
    role: 'People Director, TechCorp Sofia',
    text: "Gifted 150 pairs to our team. Two years later people still wear them to the office. You don't get that ROI from a branded pen.",
    rating: 5,
    tag: 'Corporate',
  },
  {
    name: 'Tom Eriksen',
    role: 'Sustainable Living Blogger',
    text: "I've bought 'eco' products that were just greenwashed plastic. WoodSun is the real thing. You feel the craft the moment you hold them.",
    rating: 5,
    tag: 'Lifestyle',
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-wood-50">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3">
            Real people. Real wood.
          </p>
          <h2 className="mb-4">What They Say</h2>
          <p className="text-xl text-gray-600">
            From mountain guides to HR directors — people who wear WoodSun keep wearing it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-wood-100 shadow-sm p-6 border-l-4 border-l-amber-500 flex flex-col gap-4"
            >
              {/* Tag */}
              <span className="self-start text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                {t.tag}
              </span>

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 1l2.3 6.5H19l-5.4 4 2 6.4L10 14l-5.6 3.9 2-6.4L1 7.5h6.7z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 italic leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>

              {/* Author */}
              <div className="border-t border-wood-100 pt-4">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
