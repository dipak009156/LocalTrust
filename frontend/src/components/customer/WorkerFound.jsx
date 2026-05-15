import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function WorkerFound() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;
  const booking   = location.state?.booking;

  const worker = booking?.worker;

  // Poll for tracking to start (accepted → go to live tracking)
  useEffect(() => {
    if (!bookingId) return;
    const timer = setTimeout(() => {
      navigate('/customer/live-tracking', { state: { bookingId } });
    }, 5000); // show worker card for 5s then go to map
    return () => clearTimeout(timer);
  }, [bookingId, navigate]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Map area */}
      <div className="flex-1 bg-gradient-to-b from-blue-50 to-gray-100 relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚗</div>
          <p className="text-gray-500 font-semibold text-sm">Worker is heading your way</p>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 -mt-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Worker Found! 🎉</h2>
        <p className="text-gray-500 font-medium mb-6 text-sm">
          {worker?.name ?? 'Your worker'} is on the way. Live tracking starts shortly…
        </p>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl border-2 border-white shadow-sm flex-shrink-0">
            {worker?.name?.[0] ?? 'W'}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{worker?.name ?? 'Verified Worker'}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm font-semibold">
              <span className="text-orange-500">★ {worker?.avgRating?.toFixed(1) ?? '—'}</span>
              <span className="text-gray-300">•</span>
              <span className="text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/customer/live-tracking', { state: { bookingId } })}
          className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors"
        >
          Track Arrival
        </button>
      </div>
    </div>
  );
}
