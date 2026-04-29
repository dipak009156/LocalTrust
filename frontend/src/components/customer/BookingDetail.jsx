import { useNavigate } from 'react-router-dom';

export default function BookingDetail() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Booking Details</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Tap Leak Repair</h2>
            <p className="text-sm font-semibold text-gray-500">12 Oct 2023, 10:30 AM</p>
          </div>
          <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide">Completed</span>
        </div>

        <div>
          <h3 className="font-extrabold text-gray-900 mb-3 text-sm">Professional</h3>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-14 h-14 rounded-full border border-gray-200" />
            <div>
              <p className="text-base font-bold text-gray-900">Ramesh K.</p>
              <div className="flex items-center gap-1 mt-1 text-sm font-semibold">
                <span className="text-orange-500">★ 4.9</span>
                <span className="text-gray-400 text-xs">(124 jobs)</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-extrabold text-gray-900 mb-3 text-sm">Payment Details</h3>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Service Fee</span>
              <span>₹249</span>
            </div>
            <div className="h-px w-full bg-gray-100 my-1"></div>
            <div className="flex justify-between text-base font-extrabold text-gray-900">
              <span>Total Paid</span>
              <span className="text-blue-700">₹249</span>
            </div>
            <button onClick={() => alert('Invoice downloading...')} className="text-blue-700 text-xs font-bold text-left mt-1 underline">Download Invoice</button>
          </div>
        </div>

        <div>
          <h3 className="font-extrabold text-gray-900 mb-3 text-sm">Need Help?</h3>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/customer/dispute')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-sm font-bold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors">
              Report an issue with this booking
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button onClick={() => navigate('/customer/worker-detail')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Book Ramesh Again
        </button>
      </div>
    </div>
  );
}
