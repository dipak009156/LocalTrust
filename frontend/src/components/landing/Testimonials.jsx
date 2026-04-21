export default function Testimonials() {
  const testimonials = [
    { quote: '"Finally knew exactly what I\'d pay before the guy even left. No more bargaining."', author: '— Priya, Solapur' },
    { quote: '"Showed me his ID badge before entering. Never had that security before."', author: '— Ramesh, Pune' },
    { quote: '"Raised a complaint and got a call back in 10 mins. Shocked honestly."', author: '— Fatima, Nashik' },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">What our customers say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
            <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
            <p className="font-bold text-blue-900">{testimonial.author}</p>
          </div>
        ))}
      </div>
    </section>
  )
}