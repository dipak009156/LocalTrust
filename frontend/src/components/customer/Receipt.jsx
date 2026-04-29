import { useNavigate } from 'react-router-dom';

export default function Receipt() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-center relative">
        <h1 className="text-xl font-extrabold text-gray-900">Receipt</h1>
        <button onClick={() => navigate('/customer/home')} className="absolute right-6 text-gray-400 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative">
          {/* Jagged bottom edge simulation */}
          <div className="absolute -bottom-2 left-0 right-0 flex justify-between overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-50 rotate-45 transform translate-y-2"></div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Paid</h2>
            <p className="text-4xl font-black text-gray-900">₹249</p>
            <span className="inline-block mt-2 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">Paid Successfully</span>
          </div>

          <div className="border-t border-dashed border-gray-200 py-4 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Service</span>
              <span className="text-gray-900 font-bold">Tap Repair</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Date</span>
              <span className="text-gray-900 font-bold">12 Oct 2023, 10:30 AM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Booking ID</span>
              <span className="text-gray-900 font-bold">#TW8492</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 pb-2">
            <div className="flex gap-3 items-center">
              <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-bold text-gray-900">Ramesh K.</p>
                <p className="text-xs text-gray-500 font-medium">Plumber</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button onClick={() => navigate('/customer/home')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Back to Home
        </button>
      </div>
    </div>
  );
}
