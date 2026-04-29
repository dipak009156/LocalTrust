import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BottomNav from './BottomNav';

export default function Bookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('active'); // 'active' or 'past'

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">My Bookings</h1>
        <button onClick={() => navigate('/customer/home')} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="px-6 pt-4">
        <div className="flex bg-gray-200 p-1 rounded-xl">
          <button onClick={() => setTab('active')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Active</button>
          <button onClick={() => setTab('past')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Past</button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4 overflow-y-auto">
        {tab === 'active' && (
          <Link to="/customer/live-tracking" className="bg-white p-4 rounded-2xl shadow-sm border border-blue-200 flex flex-col gap-4 active:scale-95 transition-transform">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-xl">🚰</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Tap Leak Repair</h3>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">Today, 10:30 AM • ₹249</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">En Route</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-700 rounded-full animate-ping"></div>
              <p className="text-xs font-bold text-blue-900">Worker arriving in 12 mins.</p>
            </div>
          </Link>
        )}

        {tab === 'past' && (
          <>
            <Link to="/customer/booking-detail" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 active:scale-95 transition-transform">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-50 text-2xl flex items-center justify-center rounded-xl border border-gray-100">🚿</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Shower Fitting</h3>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">12 Oct 2023 • ₹299</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Completed</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-bold text-gray-900">Ramesh K.</span>
                </div>
                <span className="text-xs text-blue-700 font-bold">Rebook</span>
              </div>
            </Link>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 opacity-75">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-orange-50 text-2xl flex items-center justify-center rounded-xl">⚡</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Ceiling Fan Repair</h3>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">05 Oct 2023 • ₹199</p>
                  </div>
                </div>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Cancelled</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-xl">🔧</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Pipe Leak</h3>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">28 Sep 2023 • ₹449</p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Disputed</span>
              </div>
              <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 cursor-pointer" onClick={() => navigate('/customer/dispute-status')}>
                <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-xs font-bold text-red-900 underline">View Status</p>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
