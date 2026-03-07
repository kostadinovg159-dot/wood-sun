/* CraftProcess — "From Forest to Frame"
   A 4-step rugged craftsmanship section with SVG tool icons.
   Insert between StoryStrip and FeaturedProducts in app/page.tsx */

const steps = [
  {
    number: '01',
    title: 'The Wood',
    body: 'We source oak, walnut, and bamboo from certified sustainable forests. Every plank is chosen by hand — for grain character, density, and the story written into the wood itself.',
    // Tree / timber icon
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 6 L12 26 H20 L14 42 H34 L28 26 H36 Z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'The Shaping',
    body: 'Blanks are hand-cut and shaped using traditional woodworking tools. No plastic molds. No mass extrusion. Each frame takes its form the way furniture has for centuries — through patience and skill.',
    // Chisel icon
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="20" y="4" width="8" height="30" rx="2" strokeLinejoin="round" />
        <polygon points="16,34 32,34 24,44" fill="currentColor" opacity="0.4" />
        <rect x="20" y="4" width="8" height="8" rx="1" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'The Finish',
    body: 'Eight rounds of sanding — coarse to silk-smooth. Sealed with beeswax and cold-pressed linseed oil. No lacquer, no varnish, nothing synthetic. The wood breathes. The grain glows.',
    // Sandpaper / texture icon
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="16" width="32" height="20" rx="3" />
        <path strokeLinecap="round" d="M14 24 H34" />
        <path strokeLinecap="round" d="M14 30 H28" />
        <path strokeLinecap="round" d="M16 8 L24 16 L32 8" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Your Mark',
    body: 'Laser engraving to order. Name, brand, coordinates, a phrase you\'ll still mean in ten years. Burned into the frame. Permanent. Yours alone.',
    // Laser / engraving icon
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 42 L20 28" />
        <circle cx="26" cy="22" r="6" />
        <path strokeLinecap="round" d="M30 18 L42 6" />
        <path strokeLinecap="round" d="M12 38 L18 38 L18 44" opacity="0.5" />
      </svg>
    ),
  },
]

export default function CraftProcess() {
  return (
    <section className="section-padding bg-[#FAF7F2] border-t border-wood-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-amber-700 text-sm font-semibold uppercase tracking-widest mb-3">
            The Process
          </p>
          <h2 className="mb-4">From Forest to Frame</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No shortcuts. No injection molds. Four honest steps between a living tree and the pair on your face.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              {/* Connector line (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-0px)] w-full h-px bg-wood-200 z-0" style={{ width: 'calc(100% - 2.5rem)', left: '2.5rem' }} />
              )}

              <div className="relative z-10 flex flex-col gap-4">
                {/* Icon circle */}
                <div className="w-16 h-16 rounded-full bg-wood-800 text-amber-200 flex items-center justify-center flex-shrink-0 shadow-md">
                  {step.icon}
                </div>

                {/* Step number */}
                <p className="text-amber-600 text-xs font-bold uppercase tracking-widest">
                  Step {step.number}
                </p>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{step.title}</h3>

                {/* Body */}
                <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="mt-16 bg-wood-800 rounded-2xl px-8 py-10 text-center">
          <p className="text-amber-100 text-xl italic font-playfair max-w-2xl mx-auto leading-relaxed">
            &ldquo;There&rsquo;s a particular smell in the workshop just before the chisel bites — sawdust,
            linseed oil, and the faint warmth of the lamp overhead. WoodSun was born in that smell.&rdquo;
          </p>
          <p className="text-wood-300 text-sm mt-4">— The WoodSun Workshop</p>
        </div>
      </div>
    </section>
  )
}
