import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function JobConfirmed() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Poll for booking status
  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const fetchBooking = () => {
      api.get(`/worker/bookings/${bookingId}`)
        .then(r => setBooking(r.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchBooking();
    const poller = setInterval(fetchBooking, 5000);
    return () => clearInterval(poller);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (booking?.status === 'completed') {
    return (
      <div className="flex flex-col h-full bg-white relative">
        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto pb-32">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-sm">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Proof Uploaded!</h1>
          <p className="text-gray-500 font-medium mb-10 text-center">
            Waiting for the customer to review the proof and confirm the job.
          </p>
          
          <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl border border-amber-100 text-sm font-semibold text-center">
            Once confirmed, your payment will be released.
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
          <button onClick={() => navigate('/worker/dashboard')} className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto pb-32">
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 shadow-sm">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100">Job Confirmed!</h1>
        <p className="text-gray-500 font-medium mb-10 text-center animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200">
          The customer confirmed your work. Escrow has been released to your wallet.
        </p>

        <div className="bg-gray-50 w-full rounded-3xl p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
          <h3 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wide">Escrow Released</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Gross Earnings</span>
              <span>₹{booking?.earning?.grossAmount ?? booking?.basePrice ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Platform Fee (10%)</span>
              <span className="text-red-500">-₹{booking?.earning?.commission ?? ((booking?.basePrice ?? 0) * 0.1).toFixed(1)}</span>
            </div>
            <div className="h-px w-full bg-gray-200 my-1"></div>
            <div className="flex justify-between text-xl font-black text-gray-900">
              <span>Net Received</span>
              <span className="text-green-600">₹{booking?.earning?.netAmount ?? ((booking?.basePrice ?? 0) * 0.9).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
        <button onClick={() => navigate('/worker/dashboard')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Go to Dashboard
        </button>
        <button onClick={() => navigate('/worker/earnings')} className="w-full text-blue-700 font-bold py-3 text-sm hover:underline">
          View Earnings
        </button>
      </div>
    </div>
  );
}
