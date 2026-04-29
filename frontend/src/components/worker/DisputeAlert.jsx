import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function DisputeAlert() {
  const navigate = useNavigate();
  // 24 hours in seconds = 86400
  const [timeLeft, setTimeLeft] = useState(86400);

  // TODO: Socket.io listen for dispute_raised event

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
          <p className="text-lg font-extrabold text-red-700 mb-2">Job not completed properly</p>
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 mt-3 text-sm font-medium text-red-900 italic">
            "The tap is still leaking from the bottom base. He didn't tighten it enough and rushed out."
          </div>
        </div>

        <div>
          <h3 className="font-extrabold text-gray-900 mb-3 text-sm">Your Submitted Proof</h3>
          <div className="w-full h-48 bg-gray-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Mock proof photo */}
            <img src="https://images.unsplash.com/photo-1585058173456-e97d1976a26d?q=80&w=1470&auto=format&fit=crop" alt="Proof" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <div className="flex justify-center mb-4">
          <span className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold border border-red-100 animate-pulse">
            Respond within {formatTime(timeLeft)}
          </span>
        </div>
        <button onClick={() => navigate('/worker/dispute-response')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors mb-3">
          Submit My Response
        </button>
        <a href="tel:18001234567" className="w-full flex justify-center text-gray-500 font-bold py-2 text-sm hover:underline">
          Call Support
        </a>
      </div>
    </div>
  );
}
