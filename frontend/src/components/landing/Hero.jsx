import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import HeroScene from '../../scene/HeroScene';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Home services you can <span className="text-blue-700">actually trust.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Fixed prices. Verified workers. Money held safely until you're satisfied with the work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-sm">
          {/* Book Now → /login (CUSTOMER) */}
          <button
            onClick={() => navigate('/login')}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-2xl text-base transition-all active:scale-[0.98] shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Book Now
          </button>

          {/* Join as Partner → /join (WORKER) */}
          <button
            onClick={() => navigate('/join')}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-base transition-all active:scale-[0.98] shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Join as Partner
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
  );
}