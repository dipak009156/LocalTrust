import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center font-bold text-white text-xl">T</div>
          <span className="font-bold text-xl tracking-tight text-blue-900 uppercase">TrustWork</span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
          <a href="#how-it-works" className="hover:text-blue-700 transition-colors">How it works</a>
          <a href="#workers" className="hover:text-blue-700 transition-colors">For Workers</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/join')}
            className="hidden sm:block text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Join as Partner
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.97] shadow-md shadow-blue-100"
          >
            Book Now
          </button>
        </div>
      </nav>
    </header>
  );
}