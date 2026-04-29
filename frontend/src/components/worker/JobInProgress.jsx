import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWorker } from '../../context/WorkerContext';

export default function JobInProgress() {
  const navigate = useNavigate();
  const { activeBooking } = useWorker();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // TODO: Socket.io emit job_status: in_progress

  // Count UP timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const booking = activeBooking || {
    service: 'Tap Repair',
    customer: 'Priya Sharma',
    address: '12/4, Sai Nagar, Andheri West'
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-center">
        <h1 className="text-xl font-extrabold text-gray-900">Job In Progress</h1>
      </div>

      <div className="p-6 flex flex-col items-center flex-1 justify-center pb-32">
        <div className="relative w-48 h-48 bg-white rounded-full border-[8px] border-blue-50 flex items-center justify-center mb-8 shadow-xl shadow-blue-100/50">
          {/* Animated spinning border ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#1d4ed8" strokeWidth="8" strokeDasharray="60 200" strokeLinecap="round" />
          </svg>
          <div className="text-center z-10">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Elapsed Time</p>
            <p className="text-4xl font-black text-gray-900 font-mono tracking-tighter">{formatTime(secondsElapsed)}</p>
          </div>
        </div>

        <div className="bg-white w-full rounded-3xl p-6 shadow-sm border border-gray-100 text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{booking.service}</h2>
          <p className="text-sm font-bold text-gray-900 mb-2">{booking.customer}</p>
          <p className="text-sm font-medium text-gray-500 flex items-center justify-center gap-1">
            📍 {booking.address}
          </p>
        </div>

        <div className="flex w-full gap-3">
          <button onClick={() => navigate('/worker/chat')} className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-4 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Chat
          </button>
          <button onClick={() => setShowEmergencyModal(true)} className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100 border border-red-100 transition-colors shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button onClick={() => navigate('/worker/proof-upload')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Mark as Complete — Upload Proof
        </button>
      </div>

      {/* Emergency Modal Overlay */}
      {showEmergencyModal && (
        <div className="absolute inset-0 bg-gray-900/40 z-30 flex items-end animate-in fade-in">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 text-center">Emergency / Help</h3>
            
            <div className="flex flex-col gap-3 mb-6">
              <a href="tel:18001234567" className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-gray-100">
                📞 Call Support
              </a>
              <button className="w-full bg-red-50 border border-red-100 text-red-600 font-bold py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-red-100">
                Cancel Job
              </button>
            </div>

            <button onClick={() => setShowEmergencyModal(false)} className="w-full bg-white text-gray-500 font-bold py-4 rounded-2xl">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
