import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, RotateCcw, Droplets, Zap, Wrench, ShowerHead } from 'lucide-react';

export default function Bookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('active'); // 'active' or 'past'

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20 lg:pb-0">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Bookings</h1>
        <button onClick={() => navigate('/customer/home')} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="px-6 pt-6">
          <div className="flex bg-gray-200/50 backdrop-blur-sm p-1 rounded-2xl w-full sm:w-64">
            <button 
              onClick={() => setTab('active')} 
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tab === 'active' ? 'bg-white text-blue-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setTab('past')} 
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tab === 'past' ? 'bg-white text-blue-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Past
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {tab === 'active' && (
            <Link to="/customer/live-tracking" className="bg-white p-5 rounded-3xl shadow-sm border border-blue-100 flex flex-col gap-5 hover:border-blue-300 transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-700 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                    <Droplets size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Tap Leak Repair</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Clock size={14} className="text-blue-600" />
                      <p className="text-xs font-bold uppercase tracking-wide">Today, 10:30 AM • ₹249</p>
                    </div>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">En Route</span>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-3 border border-blue-100/50">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-blue-700 rounded-full"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-blue-700 rounded-full animate-ping opacity-75"></div>
                </div>
                <p className="text-sm font-bold text-blue-900">Worker arriving in 12 mins.</p>
              </div>
            </Link>
          )}

          {tab === 'past' && (
            <>
              <Link to="/customer/booking-detail" className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-green-50 text-green-700 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                      <ShowerHead size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Shower Fitting</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">12 Oct 2023 • ₹299</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 size={12} />
                    <span>Completed</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-sm font-bold text-gray-900">Ramesh K.</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-blue-700 text-xs font-black uppercase tracking-wider hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors">
                    <RotateCcw size={14} />
                    Rebook
                  </button>
                </div>
              </Link>

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 flex items-center justify-center rounded-2xl">
                      <Zap size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Ceiling Fan Repair</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">05 Oct 2023 • ₹199</p>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Cancelled</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-red-100 flex flex-col gap-5 hover:border-red-200 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-red-50 text-red-600 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                      <Wrench size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Pipe Leak</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">28 Sep 2023 • ₹449</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <AlertCircle size={12} />
                    <span>Disputed</span>
                  </div>
                </div>
                <div 
                  className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 border border-red-100 cursor-pointer hover:bg-red-100/50 transition-colors" 
                  onClick={() => navigate('/customer/dispute-status')}
                >
                  <AlertCircle size={18} className="text-red-600 shrink-0" />
                  <p className="text-sm font-bold text-red-900 underline decoration-red-900/30 underline-offset-4">View Resolution Status</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
