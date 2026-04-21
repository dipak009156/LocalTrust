import Button from '../ui/Button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center font-bold text-white text-xl">T</div>
          <span className="font-bold text-xl tracking-tight text-blue-900 uppercase">TrustWork</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
          <a href="#how-it-works" className="hover:text-blue-700 transition-colors">How it works</a>
          <a href="#workers" className="hover:text-blue-700 transition-colors">For Workers</a>
        </div>
        <Button variant="primary">Book Now</Button>
      </nav>
    </header>
  )
}