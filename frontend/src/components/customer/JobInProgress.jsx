import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function JobInProgress() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (!bookingId) return;
    api.get(`/user/bookings/${bookingId}`)
      .then(r => setBooking(r.data))
      .catch(console.error);
  }, [bookingId]);

  // Poll for completion
  useEffect(() => {
    if (!bookingId) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/user/bookings/${bookingId}`);
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
            <button
              onClick={() => navigate('/customer/chat', { state: { bookingId } })}
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl hover:bg-gray-100 flex items-center justify-center gap-2"
            >
              💬 Chat
            </button>
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
    </div>
  );
}
