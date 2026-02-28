'use client'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, Tech Startup',
      text: 'We ordered 200 pairs for our company retreat. The quality exceeded expectations and our team loved the personalization!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'HR Manager',
      text: 'Best corporate gift we\'ve given. The eco-friendly aspect resonated with our employees and customers.',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Lifestyle Blogger',
      text: 'Sustainable, stylish, and comfortable. WoodSun sunglasses are my go-to gift for friends who care about the environment.',
      rating: 5,
    },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Trusted by thousands of happy customers and businesses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="card p-6">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-xl">⭐</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

              {/* Author */}
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
