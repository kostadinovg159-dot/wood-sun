export default function StoryStrip() {
  const stats = [
    { value: '47 hrs', label: 'of craft per batch' },
    { value: '3 woods', label: 'Oak · Walnut · Bamboo' },
    { value: '0 plastic', label: 'Zero compromise' },
  ]

  return (
    <div className="bg-wood-800 py-8 border-y border-wood-900">
      <div className="container">
        {/* Mobile: single tagline */}
        <p className="block sm:hidden text-amber-100 text-base italic text-center font-playfair">
          &ldquo;Cut from the forest. Finished by hand. Worn in the wild.&rdquo;
        </p>

        {/* Desktop: 3-stat bar */}
        <div className="hidden sm:grid grid-cols-3 divide-x divide-wood-700">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center px-6">
              <p className="text-amber-400 text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-wood-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
