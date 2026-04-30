import ServiceCard from '../ui/ServiceCard'

const services = [
  { icon: '🚰', title: 'Plumbing', price: 'Starting ₹249' },
  { icon: '⚡', title: 'Electrical', price: 'Starting ₹199' },
  { icon: '🧹', title: 'Cleaning', price: 'Starting ₹499' },
  { icon: '🔨', title: 'Carpentry', price: 'Starting ₹299' },
]

export default function Services() {
  return (
    <section className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What do you need help with?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 0.5} />
          ))}
        </div>
      </div>
    </section>
  )
}