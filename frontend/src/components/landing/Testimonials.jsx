import { useRef, useEffect, useState } from 'react';
import api from '../../utils/api';

const generateReviews = () => {
  const templates = [
    '"Great service, highly recommended!"',
    '"Very professional and on time."',
    '"Fixed the issue quickly. Good job."',
    '"Transparent pricing, no hidden costs."',
    '"The worker was polite and skilled."',
    '"Will definitely use TrustWork again."',
    '"Saved me a lot of time and hassle."',
    '"Reliable and trustworthy service."',
    '"Excellent support and quick response."',
    '"Top-notch quality work. Very impressed."',
    '"Cleaned up after the work was done!"',
    '"Arrived exactly on time, no waiting around."',
  ];
  const cities = ['Solapur', 'Pune', 'Nashik', 'Mumbai', 'Nagpur', 'Thane', 'Kolhapur', 'Aurangabad'];
  const names = ['Priya', 'Ramesh', 'Fatima', 'Rahul', 'Sneha', 'Amit', 'Neha', 'Vikram', 'Pooja', 'Suresh', 'Anita', 'Karan', 'Meera', 'Rohan', 'Swati'];

  return Array.from({ length: 50 }).map((_, i) => ({
    id: `static-${i}`,
    quote: i < 3 ? [
      '"Finally knew exactly what I\'d pay before the guy even left. No more bargaining."',
      '"Showed me his ID badge before entering. Never had that security before."',
      '"Raised a complaint and got a call back in 10 mins. Shocked honestly."'
    ][i] : templates[i % templates.length],
    author: `— ${names[i % names.length]}, ${cities[i % cities.length]}`,
    rating: i % 5 === 0 ? 4 : 5
  }));
};

const staticTestimonials = generateReviews();

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [reviews, setReviews] = useState(staticTestimonials);

  useEffect(() => {
    api.get('/booking/recent-reviews')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(r => ({
            id: r.id,
            quote: `"${r.comment || 'Excellent quality work, very professional!'}"`,
            author: `— ${r.user?.name || 'Customer'}${r.user?.city ? `, ${r.user.city}` : ''}`,
            rating: r.rating,
            isReal: true,
          }));
          // Merge real/recent ones at the start of the list
          setReviews([...mapped, ...staticTestimonials]);
        } else {
          setReviews(staticTestimonials);
        }
      })
      .catch(() => {
        setReviews(staticTestimonials);
      });
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-20 relative">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900">What our customers say</h2>
      <p className="text-center text-gray-500 mb-10 md:mb-16">Trusted by 50+ thousands of happy users</p>
      
      <div className="relative group">
        {/* Left Button */}
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-blue-900 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Slider */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={`flex-none w-[85vw] sm:w-[350px] md:w-[400px] snap-center p-5 sm:p-8 rounded-2xl border transition-all flex flex-col justify-between
                ${testimonial.isReal 
                  ? 'bg-blue-50/40 border-blue-100 shadow-[0_4px_20px_rgba(29,78,216,0.06)]' 
                  : 'bg-gray-50 border-gray-100 shadow-sm hover:shadow-md'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex text-amber-400 text-base sm:text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < testimonial.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  {testimonial.isReal && (
                    <span className="bg-blue-600/10 text-blue-700 font-bold uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <span>•</span> Verified Review
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-4 sm:mb-6 italic text-base sm:text-lg leading-relaxed">{testimonial.quote}</p>
              </div>
              <p className="font-bold text-blue-900">{testimonial.author}</p>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button 
          onClick={() => scroll('right')}
          className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-blue-900 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      
      {/* Mobile Swipe Hint */}
      <div className="text-center mt-2 md:hidden">
        <span className="text-sm text-gray-400 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          Swipe to read more reviews
        </span>
      </div>
    </section>
  );
}