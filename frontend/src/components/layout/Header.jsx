import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center font-bold text-white text-xl">T</div>
          <span className="font-bold text-xl tracking-tight text-blue-900 uppercase">TrustWork</span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
          <a href="#how-it-works" className="hover:text-blue-700 transition-colors">How it works</a>
          <a href="#workers" className="hover:text-blue-700 transition-colors">For Workers</a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => navigate('/join')}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
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

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-6 pb-6 pt-4 space-y-3 animate-fade-in shadow-lg">
          <a href="#how-it-works" className="block text-sm font-semibold text-gray-600 hover:text-blue-700 py-2">How it works</a>
          <a href="#workers" className="block text-sm font-semibold text-gray-600 hover:text-blue-700 py-2">For Workers</a>
          <hr className="border-gray-100" />
          <button
            onClick={() => { navigate('/login'); setMenuOpen(false); }}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-sm transition-all"
          >
            Book Now
          </button>
          <button
            onClick={() => { navigate('/join'); setMenuOpen(false); }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition-all"
          >
            Join as Partner
          </button>
        </div>
      )}
    </header>
  );
}