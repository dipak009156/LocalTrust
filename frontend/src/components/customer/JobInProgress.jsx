import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function JobInProgress() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [hasUnread, setHasUnread] = useState(false);

  // Background check for unread chat messages
  useEffect(() => {
    if (!bookingId) return;

    const checkUnread = async () => {
      try {
        const { data } = await api.get(`/booking/${bookingId}/chat`);
        if (!data || data.length === 0) return;
        const seen = parseInt(localStorage.getItem(`chat_seen_${bookingId}`) || '0', 10);
        if (data.length > seen) {
          const lastMsg = data[data.length - 1];
          if (lastMsg.senderRole === 'worker') {
            setHasUnread(true);
          } else {
            localStorage.setItem(`chat_seen_${bookingId}`, data.length);
            setHasUnread(false);
          }
        } else {
          setHasUnread(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 4000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;
    api.get(`/user/bookings/${bookingId}`)
      .then(r => setBooking(r.data))
      .catch(console.error);
  }, [bookingId]);

  // Poll for completion and price updates
  useEffect(() => {
    if (!bookingId) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/user/bookings/${bookingId}`);
        setBooking(data);
        if (data.status === 'completed') {
          navigate('/customer/job-completed', { state: { bookingId } });
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [bookingId, navigate]);

  // Count UP timer
  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePriceAdjustment = async (action) => {
    try {
      await api.post(`/booking/${bookingId}/respond-price`, { action });
      const { data } = await api.get(`/user/bookings/${bookingId}`);
      setBooking(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response');
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;


  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-blue-700 pt-12 pb-10 px-6 flex flex-col items-center justify-center text-white">
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Job In Progress</span>
        </div>
        <h1 className="text-5xl font-black tabular-nums">{formatTime(secondsElapsed)}</h1>
        <p className="text-blue-200 text-sm font-medium mt-2">
          {booking?.category?.name ?? 'Service in progress…'}
        </p>
      </div>

      <div className="p-6 flex flex-col gap-6 -mt-6 relative z-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          {booking?.worker?.profilePhoto ? (
            <img src={booking.worker.profilePhoto} alt="Worker" className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-black text-2xl flex items-center justify-center border-4 border-white shadow-md mb-4">
              {booking?.worker?.name?.[0] ?? 'W'}
            </div>
          )}
          <h2 className="text-xl font-extrabold text-gray-900">{booking?.worker?.name ?? 'Your Worker'} is working</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {booking?.category?.name ?? 'Service'} • #{bookingId?.slice(-6).toUpperCase()}
          </p>

          <div className="flex w-full gap-3 mt-6">
            <div className="relative flex-1">
              <button
                onClick={() => navigate('/customer/chat', { state: { bookingId } })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                💬 Chat
              </button>
              {hasUnread && (
                <span className="absolute top-2 right-3 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white"></span>
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/customer/dispute', { state: { bookingId } })}
              className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </button>
          </div>
        </div>

        {booking?.address && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed">{booking.address}</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 font-medium">
          Waiting for worker to mark job as complete…
        </p>
      </div>

      {/* Price Adjustment Request Alert / Modal */}
      {booking?.adjustmentPrice && (
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💰</span>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Price Adjustment Request</h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">The worker requested a price update</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-sm font-extrabold text-amber-900">
                <span>Original Price</span>
                <span>₹{booking.basePrice}</span>
              </div>
              <div className="flex justify-between items-center text-base font-black text-amber-950 border-t border-amber-100/50 pt-2.5">
                <span>Adjusted Price</span>
                <span className="text-xl">₹{booking.adjustmentPrice}</span>
              </div>
              {booking.adjustmentReason && (
                <p className="text-xs font-semibold text-amber-800 bg-white/60 p-2.5 rounded-xl border border-amber-100/50 mt-1">
                  💡 "{booking.adjustmentReason}"
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handlePriceAdjustment('reject')}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-gray-50 active:scale-95 transition-transform"
              >
                Decline
              </button>
              <button
                onClick={() => handlePriceAdjustment('accept')}
                className="flex-[1.5] bg-blue-700 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-800 shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                Approve & Pay ₹{booking.adjustmentPrice}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
