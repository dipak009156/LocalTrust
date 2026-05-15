import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Receipt() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) { setLoading(false); return; }
    api.get(`/user/bookings/${bookingId}`)
      .then(r => setBooking(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [bookingId]);

  const fmt = (iso) => iso ? new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—';

  const amount = booking?.finalPrice ?? booking?.basePrice ?? 0;

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-center relative">
        <h1 className="text-xl font-extrabold text-gray-900">Receipt</h1>
        <button onClick={() => navigate('/customer/home')} className="absolute right-6 text-gray-400 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        {loading ? (
          <div className="bg-white rounded-3xl p-8 animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded-full w-1/2 mx-auto" />
            <div className="h-12 bg-gray-100 rounded-full w-1/3 mx-auto" />
            <div className="h-4 bg-gray-100 rounded-full" />
            <div className="h-4 bg-gray-100 rounded-full w-2/3" />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative">
            {/* Jagged edge */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-between overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-50 rotate-45 transform translate-y-2" />
              ))}
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Paid</h2>
              <p className="text-4xl font-black text-gray-900">₹{amount}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                Paid Successfully
              </span>
            </div>

            <div className="border-t border-dashed border-gray-200 py-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Service</span>
                <span className="text-gray-900 font-bold">{booking?.category?.name ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Completed</span>
                <span className="text-gray-900 font-bold">{fmt(booking?.completedAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Booking ID</span>
                <span className="text-gray-900 font-bold font-mono">#{bookingId?.slice(-8).toUpperCase()}</span>
              </div>
              {booking?.address && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Address</span>
                  <span className="text-gray-900 font-bold text-right max-w-[60%] leading-snug">{booking.address}</span>
                </div>
              )}
            </div>

            {booking?.worker && (
              <div className="border-t border-dashed border-gray-200 pt-4 pb-2">
                <div className="flex gap-3 items-center">
                  {booking.worker.profilePhoto ? (
                    <img src={booking.worker.profilePhoto} alt="Worker" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center">
                      {booking.worker.name?.[0] ?? 'W'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">{booking.worker.name ?? 'Worker'}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      ★ {booking.worker.avgRating?.toFixed(1) ?? '—'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button
          onClick={() => navigate('/customer/home')}
          className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
