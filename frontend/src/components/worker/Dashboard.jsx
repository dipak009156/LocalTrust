import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { 
  Wifi, 
  WifiOff, 
  TrendingUp, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Droplets, 
  ShowerHead, 
  Wrench, 
  DollarSign,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isOnline, setIsOnline, setActiveBooking } = useWorker();
  
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
    <div className="flex flex-col h-full bg-gray-50 relative pb-20 lg:pb-0">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Worker Console</h1>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${isOnline ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-out shadow-sm ${isOnline ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 flex flex-col gap-8 overflow-y-auto hide-scroll">
        {!isOnline && (
          <div className="bg-amber-50 text-amber-800 font-bold text-xs text-center py-4 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-center gap-2">
            <Zap size={14} className="animate-pulse" />
            Go online to start receiving service requests near you.
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-2 opacity-80">Current Balance</p>
            <h2 className="text-5xl font-black mb-8 flex items-baseline gap-1">
              <span className="text-2xl font-bold opacity-70">₹</span>4,250
            </h2>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <DollarSign size={20} className="text-blue-100" />
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-70">Today</p>
                  <p className="font-bold text-lg">₹850</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-100" />
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-70">This Week</p>
                  <p className="font-bold text-lg">₹2,100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isOnline && showRequest && (
          <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-100 border border-blue-50 overflow-hidden relative group">
            <div className="absolute top-0 left-0 h-1.5 bg-blue-600 transition-all duration-1000 ease-linear z-20" style={{ width: `${progressPercent}%` }}></div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-700 flex items-center justify-center rounded-[20px] group-hover:scale-110 transition-transform">
                    <Droplets size={32} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl tracking-tight">Tap Repair</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <MapPin size={14} className="text-blue-600" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Andheri West • 1.2 km</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-blue-700 tracking-tight">₹249</p>
                  <div className={`flex items-center justify-end gap-1.5 mt-2 font-black text-xs ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                    <Clock size={14} />
                    <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-2">
                <button onClick={handleDecline} className="flex-1 bg-gray-50 text-gray-500 font-black py-4 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs border border-gray-100">
                  Decline
                </button>
                <button onClick={handleAccept} className="flex-[2] bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
                  Accept Job
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900 text-xl tracking-tight">Recent Activity</h3>
            <button className="text-blue-700 text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-gray-50 bg-gray-50/30 flex justify-between items-center group hover:bg-white hover:border-blue-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-50 transition-colors">
                  <ShowerHead size={22} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">Shower Fitting</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Today, 2:00 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-green-600">+₹299</p>
                <ChevronRight size={14} className="text-gray-300 ml-auto mt-1" />
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-gray-50 bg-gray-50/30 flex justify-between items-center group hover:bg-white hover:border-blue-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm group-hover:bg-orange-50 transition-colors">
                  <Wrench size={22} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">Pipe Leak</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Yesterday</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-green-600">+₹449</p>
                <ChevronRight size={14} className="text-gray-300 ml-auto mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
