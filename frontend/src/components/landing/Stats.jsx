export default function Stats() {
  return (
    <div className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 md:py-8 flex flex-col md:flex-row justify-center md:justify-around gap-6 md:gap-8 text-center">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-2xl font-bold text-blue-900">500+</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Workers</span>
        </div>
        <div className="hidden md:block border-l border-gray-200 h-10"></div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-2xl font-bold text-blue-900">4.8★</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average Rating</span>
        </div>
        <div className="hidden md:block border-l border-gray-200 h-10"></div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-2xl font-bold text-blue-900">₹0</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unresolved Disputes</span>
        </div>
      </div>
    </div>
  )
}