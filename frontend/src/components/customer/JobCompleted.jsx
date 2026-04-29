import { useNavigate } from 'react-router-dom';

export default function JobCompleted() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 text-center">
        <h1 className="text-xl font-extrabold text-gray-900">Review Job</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-40">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 text-sm font-medium text-orange-900">
          <svg className="w-5 h-5 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <span className="font-bold block mb-0.5">Action Required</span>
            Please confirm the work is satisfactory to release payment.
          </div>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">Proof of Completion</h2>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" className="w-full h-48 object-cover rounded-xl mb-3" alt="Proof" />
            <p className="text-sm font-medium text-gray-700 italic">"Replaced the washer and fixed the leak."</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">Final Amount</h2>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Original Quote</span>
              <span>₹249</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Additional Parts</span>
              <span>₹0</span>
            </div>
            <div className="h-px w-full bg-gray-100 my-1"></div>
            <div className="flex justify-between text-lg font-extrabold text-gray-900">
              <span>Total Pay</span>
              <span className="text-blue-700">₹249</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
        <button onClick={() => navigate('/customer/review')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Confirm & Release Payment
        </button>
        <button onClick={() => navigate('/customer/dispute')} className="w-full bg-white border border-red-500 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-50 transition-colors">
          Raise Dispute
        </button>
      </div>
    </div>
  );
}
