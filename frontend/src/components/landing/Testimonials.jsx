import { useRef } from 'react';

export default function Testimonials() {
  const scrollContainerRef = useRef(null);
  
  const testimonials = [
    { quote: '"Finally knew exactly what I\'d pay before the guy even left. No more bargaining."', author: '— Priya, Solapur' },
    { quote: '"Showed me his ID badge before entering. Never had that security before."', author: '— Ramesh, Pune' },
    { quote: '"Raised a complaint and got a call back in 10 mins. Shocked honestly."', author: '— Fatima, Nashik' },
    { quote: '"Complete peace of mind knowing the background verified professionals are doing the job."', author: '— Karan, Mumbai' },
    { quote: '"The fastest booking experience ever. The transparent pricing is a game changer."', author: '— Riya, Bangalore' },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-0">What our customers say</h2>
        
        {/* Navigation Buttons for the Sliding Bar */}
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all focus:outline-none"
            aria-label="Previous Testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all focus:outline-none"
            aria-label="Next Testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Horizontal Scroll Container (Sliding Bar) */}
      <div className="relative group">
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-8"
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="snap-start shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">{testimonial.quote}</p>
              <p className="font-semibold text-gray-900 tracking-wide">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Hide Scrollbar CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}