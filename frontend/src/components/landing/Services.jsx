import { useNavigate } from 'react-router-dom';
import ServiceCard from '../ui/ServiceCard';

const services = [
  { icon: '🚰', title: 'Plumbing', price: 'Starting ₹249' },
  { icon: '⚡', title: 'Electrical', price: 'Starting ₹199' },
  { icon: '🧹', title: 'Cleaning', price: 'Starting ₹499' },
  { icon: '🔨', title: 'Carpentry', price: 'Starting ₹299' },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What do you need help with?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 0.5} />
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-14">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-10 rounded-2xl text-base transition-all active:scale-[0.98] shadow-lg shadow-blue-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
            </svg>
            Book Now
          </button>
          <button
            onClick={() => navigate('/join')}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-2xl text-base transition-all active:scale-[0.98] shadow-lg shadow-orange-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Join as a Partner
          </button>
        </div>
      </div>
    </section>
  );
}