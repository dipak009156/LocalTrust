import { Canvas } from '@react-three/fiber'
import HeroScene from '../../scene/HeroScene'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Home services you can <span className="text-blue-700">actually trust.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Fixed prices. Verified workers. Money held safely until you're satisfied with the work.
        </p>

        <div className="space-y-4 max-w-sm">
          <Button variant="orange" className="w-full flex items-center justify-center gap-2 py-4 text-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
            </svg>
            Use my location
          </Button>
          <button className="w-full text-gray-500 text-sm font-semibold hover:text-blue-700 transition-colors">
            Or enter address manually
          </button>
        </div>
      </div>

      <div className="hidden md:block h-[400px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <HeroScene />
        </Canvas>
      </div>
    </section>
  )
}