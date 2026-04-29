import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { useWorker } from '../../context/WorkerContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isOnline, setIsOnline, setActiveBooking } = useWorker();
  
  // Timer state for incoming request (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [showRequest, setShowRequest] = useState(true);

  useEffect(() => {
    if (!isOnline || !showRequest) return;
    
    if (timeLeft <= 0) {
      setShowRequest(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOnline, showRequest, timeLeft]);

  const handleAccept = () => {
    // Save mock booking to context
    setActiveBooking({
      id: 'TW8492',
      service: 'Tap Repair',
      customer: 'Priya Sharma',
      address: '12/4, Sai Nagar, Andheri West',
      price: 249,
      distance: '1.2 km',
      note: 'Please bring a spare washer.'
    });
    navigate('/worker/en-route');
  };

  const handleDecline = () => {
    setShowRequest(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = (timeLeft / 300) * 100;

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wide ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto hide-scroll">
        {!isOnline && (
          <div className="bg-gray-200 text-gray-600 font-bold text-sm text-center py-3 rounded-xl border border-gray-300 shadow-inner">
            You are currently offline. Go online to receive jobs.
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
          <p className="text-blue-100 text-sm font-bold uppercase tracking-wide mb-1">Total Earnings</p>
          <h2 className="text-4xl font-black mb-6">₹4,250</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-200 text-xs font-semibold mb-1">Today</p>
              <p className="font-bold">₹850</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs font-semibold mb-1">This Week</p>
              <p className="font-bold">₹2,100</p>
            </div>
          </div>
        </div>

        {isOnline && showRequest && (
          <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 relative">
            {/* Timer Progress Bar */}
            <div className="absolute top-0 left-0 h-1 bg-blue-700 transition-all duration-1000 ease-linear" style={{ width: `${progressPercent}%` }}></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-xl">🚰</div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">Tap Repair</h3>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">Andheri West • 1.2 km away</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-blue-700">₹249</p>
                  <p className={`text-xs font-bold mt-1 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button onClick={handleDecline} className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl hover:bg-gray-100 transition-colors">
                  Decline
                </button>
                <button onClick={handleAccept} className="flex-[2] bg-blue-700 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
                  Accept Job
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-extrabold text-gray-900 mb-4 text-lg">Recent Jobs</h3>
          <div className="flex flex-col gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 text-xl flex items-center justify-center rounded-xl border border-gray-100">🚿</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Shower Fitting</p>
                  <p className="text-xs text-gray-500 font-semibold">Today, 2:00 PM</p>
                </div>
              </div>
              <span className="font-extrabold text-green-600">+₹299</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 text-xl flex items-center justify-center rounded-xl border border-gray-100">🔧</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Pipe Leak</p>
                  <p className="text-xs text-gray-500 font-semibold">Yesterday</p>
                </div>
              </div>
              <span className="font-extrabold text-green-600">+₹449</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
