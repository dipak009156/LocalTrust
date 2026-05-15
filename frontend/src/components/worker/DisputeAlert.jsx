import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function DisputeAlert() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  // 48-hour response window in seconds
  const [timeLeft, setTimeLeft] = useState(48 * 3600);
  const [dispute,  setDispute]  = useState(null);

  // Fetch the dispute details
  useEffect(() => {
    if (!bookingId) return;
    api.get(`/dispute/${bookingId}`)
      .then(r => {
        setDispute(r.data);
        // Calculate remaining time from createdAt
        const created   = new Date(r.data.createdAt).getTime();
        const deadline  = created + 48 * 60 * 60 * 1000; // 48 hours
        const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
        setTimeLeft(remaining);
      })
      .catch(console.error);
  }, [bookingId]);

  // Countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-red-600 text-white px-6 py-4 sticky top-0 z-10 shadow-sm flex items-center justify-center">
        <h1 className="text-base font-bold uppercase tracking-widest flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Customer raised a dispute
        </h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Dispute Reason</h2>
          <p className="text-lg font-extrabold text-red-700 mb-2">
            {dispute?.reason ?? 'Loading…'}
          </p>
        </div>

        {dispute?.workerResponse ? (
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Your Response (Submitted)</p>
            <p className="text-sm font-medium text-green-900">{dispute.workerResponse}</p>
          </div>
        ) : (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-sm font-medium text-amber-900">
            ⚠️ You have not submitted a response yet. Please respond before the deadline.
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <div className="flex justify-center mb-4">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${timeLeft < 3600 ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
            Respond within {formatTime(timeLeft)}
          </span>
        </div>
        {!dispute?.workerResponse && (
          <button
            onClick={() => navigate('/worker/dispute-response', { state: { bookingId } })}
            className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors mb-3"
          >
            Submit My Response
          </button>
        )}
        <a href="tel:18001234567" className="w-full flex justify-center text-gray-500 font-bold py-2 text-sm hover:underline">
          Call Support
        </a>
      </div>
    </div>
  );
}
