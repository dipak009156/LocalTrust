import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck } from 'lucide-react';

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
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Confirm Booking</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32 max-w-2xl mx-auto w-full">
        <div className="text-center py-4">
          <h2 className="text-3xl font-extrabold text-gray-900">Tap Repair</h2>
          <p className="text-blue-700 font-bold text-2xl mt-1">₹249</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Service Address</h3>
            <button onClick={() => navigate('/customer/address-picker')} className="text-blue-700 text-sm font-bold hover:underline">Edit</button>
          </div>
          {/* TODO: Use Real GPS Address from AddressPicker */}
          <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-xl shrink-0 flex items-center justify-center text-blue-700">
              <MapPin size={24} />
            </div>
            <p className="text-sm font-semibold text-gray-900 leading-relaxed">12/4, Sai Nagar, Near Water Tank, Andheri West, Mumbai</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between text-sm font-bold text-gray-600">
            <span>Service fee</span>
            <span>₹249</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-600">
            <span>Platform fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="h-px w-full bg-gray-100 my-1"></div>
          <div className="flex justify-between text-xl font-black text-gray-900">
            <span>Total to pay</span>
            <span className="text-blue-700">₹249</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 text-sm font-bold text-blue-900">
          <ShieldCheck size={24} className="shrink-0 text-blue-700" />
          <p className="leading-relaxed">
            Payment is held safely in escrow. Worker gets paid only after job completion.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 lg:sticky lg:bg-transparent lg:border-none">
        <div className="max-w-2xl mx-auto w-full">
          <button onClick={handleConfirm} className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all active:scale-[0.98] text-lg">
            Confirm and Pay ₹249
          </button>
        </div>
      </div>
    </div>
  );
}
