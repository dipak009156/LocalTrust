import { useNavigate } from 'react-router-dom';

export default function WorkersCTA() {
  const navigate = useNavigate();

  return (
    <section id="workers" className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-24 border-t border-gray-100">
      <div className="bg-orange-50 rounded-2xl md:rounded-3xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 border border-orange-100 text-center md:text-left">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Are you a professional helper?</h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">Join the TrustWork family. Get jobs, get paid instantly, and build a real name.</p>
        </div>
        <button
          onClick={() => navigate('/join')}
          className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl text-sm sm:text-base transition-all active:scale-[0.98] shadow-lg shadow-orange-100 whitespace-nowrap"
        >
          Join as a Partner
        </button>
      </div>
    </section>
  );
}