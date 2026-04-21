export default function Features() {
  const features = [
    {
      emoji: '🔒',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      title: 'Price locked before we arrive',
      description: 'No surprises at the door. What you see on the app is exactly what you pay.',
    },
    {
      emoji: '🪪',
      bg: 'bg-green-50',
      border: 'border-green-100',
      title: 'Every worker ID verified',
      description: 'Aadhaar verified, background checked, and skill tested. Safe for your family.',
    },
    {
      emoji: '✅',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      title: 'Pay only when you\'re happy',
      description: 'We hold your payment safely until you confirm the job is done perfectly.',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`${feature.bg} p-10 rounded-3xl border ${feature.border} shadow-sm hover:shadow-xl transition-shadow`}
          >
            <div className="text-3xl mb-6">{feature.emoji}</div>
            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}