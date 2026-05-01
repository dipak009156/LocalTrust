import { Link } from 'react-router-dom';
import { useState } from 'react';
import BottomNav from './BottomNav';

export default function Home() {
  const [hasActiveBooking, setHasActiveBooking] = useState(true);

  const categories = [
    { id: 'plumbing', name: 'Plumbing', icon: '🚰', color: 'bg-blue-50' },
    { id: 'electrical', name: 'Electrical', icon: '⚡', color: 'bg-orange-50' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹', color: 'bg-green-50' },
    { id: 'ac-repair', name: 'AC Repair', icon: '❄️', color: 'bg-cyan-50' },
    { id: 'carpentry', name: 'Carpentry', icon: '🪚', color: 'bg-amber-50' },
    { id: 'painting', name: 'Painting', icon: '🎨', color: 'bg-purple-50' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 lg:pb-0 relative">
      {/* Header */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Current Location</p>
            {/* TODO: Integrate Real GPS Location */}
            <div className="flex items-center gap-1 cursor-pointer group">
              <span className="text-gray-900 font-bold">Andheri West, Mumbai</span>
              <svg className="w-4 h-4 text-blue-700 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          <Link to="/customer/profile" className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm">
            P
          </Link>
        </div>
        
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-3 focus-within:border-blue-700 transition-colors shadow-sm">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search for services..." className="bg-transparent w-full outline-none text-sm font-semibold text-gray-900 placeholder-gray-400" />
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto hide-scroll">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/customer/category/${cat.id}`} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:border-blue-700 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="font-bold text-gray-900">{cat.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">Active Bookings</h2>
          <button onClick={() => setHasActiveBooking(!hasActiveBooking)} className="text-[10px] text-gray-400 font-bold uppercase underline">Toggle Demo</button>
        </div>

        {hasActiveBooking ? (
          <Link to="/customer/live-tracking" className="bg-blue-700 p-5 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-between text-white hover:bg-blue-800 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Worker En Route</span>
              </div>
              <h3 className="font-bold text-lg">Tap Repair</h3>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center text-gray-500">
            <span className="text-3xl mb-2">📦</span>
            <p className="font-semibold text-sm">No active bookings right now.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
