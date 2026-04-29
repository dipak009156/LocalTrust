import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock search results
  const searchResults = [
    { type: 'Booking', text: 'TW8492 - Tap Repair', to: '/admin/bookings/TW8492' },
    { type: 'Customer', text: 'Priya Sharma (+91 9876543210)', to: '/admin/customers' },
    { type: 'Worker', text: 'Ramesh K. (Plumber)', to: '/admin/workers' }
  ];

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="relative w-96">
        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookings, customers, workers..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        {search && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
            {searchResults.map((res, i) => (
              <div 
                key={i} 
                onClick={() => { navigate(res.to); setSearch(''); }}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{res.type}</span>
                  <span className="text-sm font-bold text-slate-900">{res.text}</span>
                </div>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 relative"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {showNotifications && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                <p className="text-sm font-bold text-slate-900">New Dispute Raised</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Booking #TW8492 has a new dispute.</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2">2 mins ago</p>
              </div>
              <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                <p className="text-sm font-bold text-slate-900">Verification Pending</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Suresh M. uploaded Aadhaar details.</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2">15 mins ago</p>
              </div>
              <div className="p-4 hover:bg-slate-50 cursor-pointer">
                <p className="text-sm font-bold text-slate-900">Large Escrow Release</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">₹4,500 released for Deep Cleaning.</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2">1 hour ago</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
