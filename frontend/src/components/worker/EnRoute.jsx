import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useWorker } from '../../context/WorkerContext';

export default function EnRoute() {
  const navigate = useNavigate();
  const { activeBooking } = useWorker();
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [priceReason, setPriceReason] = useState('');

  // Fallback if accessed without active booking
  const booking = activeBooking || {
    service: 'Tap Repair',
    customer: 'Priya Sharma',
    address: '12/4, Sai Nagar, Andheri West',
    price: 249,
    distance: '1.2 km',
    note: 'Please bring a spare washer.'
  };

  const handleRequestPriceChange = () => {
    // TODO: Socket.io emit price_change_request
    alert('Request sent to customer.');
    setShowPriceModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gray-200" style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-blue-700 rounded-full border-4 border-white shadow-lg animate-pulse z-10"></div>
        <div className="absolute top-1/2 left-2/3 w-8 h-8 text-2xl flex items-center justify-center -translate-x-1/2 -translate-y-full z-10">📍</div>
        
        {/* Navigation path line demo */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M150 200 L200 250 L250 400" fill="none" stroke="#1d4ed8" strokeWidth="4" strokeDasharray="8 8" className="opacity-50" />
        </svg>
      </div>

      <div className="absolute top-5 left-5 z-20">
        <button onClick={() => navigate('/worker/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-gray-900 border border-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 transition-transform">
        <div className="p-6">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{booking.customer}</h2>
              <p className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1">
                📍 {booking.address} <span className="text-blue-700 font-bold ml-1">({booking.distance})</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-500">{booking.service}</p>
              <p className="text-xl font-black text-gray-900 mt-1">₹{booking.price}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 mb-6">
            <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">Customer Note</p>
            <p className="text-sm font-medium text-yellow-900 italic">"{booking.note}"</p>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={() => navigate('/worker/chat')} className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Chat
            </button>
            <a href="tel:+919876543210" className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 text-center">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call
            </a>
          </div>

          <button onClick={() => setShowPriceModal(true)} className="w-full text-blue-700 text-sm font-bold bg-blue-50 py-3 rounded-xl mb-4 border border-blue-100 hover:bg-blue-100 transition-colors">
            Request Price Change
          </button>

          <button onClick={() => navigate('/worker/otp-entry')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
            I've Arrived — Request OTP
          </button>
        </div>
      </div>

      {/* Price Change Modal Overlay */}
      {showPriceModal && (
        <div className="absolute inset-0 bg-gray-900/40 z-30 flex items-end animate-in fade-in">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">Request Price Change</h3>
              <button onClick={() => setShowPriceModal(false)} className="text-gray-400 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">New Price (₹)</label>
                <input 
                  type="number" 
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-blue-700"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Reason for change</label>
                <textarea 
                  value={priceReason}
                  onChange={(e) => setPriceReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 h-24 resize-none"
                  placeholder="Extra materials needed..."
                ></textarea>
              </div>
            </div>

            <button onClick={handleRequestPriceChange} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-800 transition-colors">
              Send Request to Customer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
