import { useNavigate } from 'react-router-dom';

export default function WorkerFound() {
  const navigate = useNavigate();

  // TODO: Wire up actual map and transition to live tracking via Socket.io
  const handleProceed = () => navigate('/customer/live-tracking');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 bg-gray-200 relative">
        {/* Placeholder Map */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">
          [ Live Map Placeholder ]
        </div>
      </div>

      <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 -mt-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Worker Found!</h2>
        <p className="text-gray-600 font-medium mb-6">Ramesh is 12 mins away.</p>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 mb-6">
          <img src="https://i.pravatar.cc/150?img=11" alt="Ramesh" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">Ramesh K.</h3>
            <div className="flex items-center gap-2 mt-1 text-sm font-semibold">
              <span className="text-orange-500">★ 4.9</span>
              <span className="text-gray-300">•</span>
              <span className="text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </span>
            </div>
          </div>
        </div>

        <button onClick={handleProceed} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Track Arrival
        </button>
      </div>
    </div>
  );
}
