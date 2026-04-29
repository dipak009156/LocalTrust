import { useRef } from 'react';

export default function Testimonials() {
  const scrollRef = useRef(null);

  const testimonials = [
    { quote: '"Finally knew exactly what I\'d pay before the guy even left. No more bargaining."', author: '— Priya, Solapur' },
    { quote: '"Showed me his ID badge before entering. Never had that security before."', author: '— Ramesh, Pune' },
    { quote: '"Raised a complaint and got a call back in 10 mins. Shocked honestly."', author: '— Fatima, Nashik' },
    { quote: '"Best service experience I have ever had. Truly reliable and transparent."', author: '— Anil, Mumbai' },
    { quote: '"Transparent pricing and verified workers. Highly recommend their service."', author: '— Sunita, Nagpur' },
  ]

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 md:gap-0">
        <h2 className="text-3xl font-bold text-gray-900 text-center md:text-left">What our customers say</h2>
        <div className="flex gap-4">
          <button onClick={scrollLeft} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm" aria-label="Previous testimonials">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={scrollRight} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm" aria-label="Next testimonials">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
        <div 
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="w-[85vw] md:w-auto md:min-w-[400px] md:max-w-[400px] flex-shrink-0 bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all snap-center md:snap-start flex flex-col justify-between"
            >
              <p className="text-gray-700 mb-8 text-lg italic leading-relaxed">{testimonial.quote}</p>
              <p className="font-bold text-blue-900">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}