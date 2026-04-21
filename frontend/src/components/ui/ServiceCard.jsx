import { useState } from 'react'

export default function ServiceCard({ icon, title, price, delay = 0 }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="bg-white p-6 rounded-2xl border border-gray-200 text-center service-card transition-all group cursor-pointer hover:border-blue-600 hover:shadow-2xl"
      style={{
        transform: hovered ? 'translateY(-8px) rotateX(5deg)' : 'translateY(0)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-bold mb-1 text-gray-900">{title}</h3>
      <p className="text-blue-700 text-xs font-bold">{price} →</p>
    </div>
  )
}