import { useNavigate } from 'react-router-dom';

export default function BookingConfirm() {
  const navigate = useNavigate();

  // TODO: Add real booking POST logic and trigger Razorpay payment gateway
  const handleConfirm = () => {
    // Simulate Razorpay success
    navigate('/customer/waiting');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Confirm Booking</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">Tap Repair</h2>
          <p className="text-blue-700 font-bold text-xl mt-1">₹249</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">Service Address</h3>
            <button onClick={() => navigate('/customer/address-picker')} className="text-blue-700 text-sm font-bold">Edit</button>
          </div>
          {/* TODO: Use Real GPS Address from AddressPicker */}
          <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center text-gray-400">
              📍
            </div>
            <p className="text-sm font-medium text-gray-900 leading-snug">12/4, Sai Nagar, Near Water Tank, Andheri West, Mumbai</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex justify-between text-sm font-semibold text-gray-600">
            <span>Service fee</span>
            <span>₹249</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-600">
            <span>Platform fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="h-px w-full bg-gray-100 my-1"></div>
          <div className="flex justify-between text-lg font-extrabold text-gray-900">
            <span>Total to pay</span>
            <span className="text-blue-700">₹249</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm font-medium text-blue-900">
          <svg className="w-5 h-5 shrink-0 text-blue-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          Payment is held safely in escrow. Worker gets paid only after job completion.
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button onClick={handleConfirm} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Confirm and Pay ₹249
        </button>
      </div>
    </div>
  );
}
