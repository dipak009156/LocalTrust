import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BottomNav from './BottomNav';
import api from '../../utils/api';

const CATEGORY_ICONS = {
  'Plumbing':   { icon: '🚰', color: 'bg-blue-50' },
  'Electrical': { icon: '⚡', color: 'bg-orange-50' },
  'Cleaning':   { icon: '🧹', color: 'bg-green-50' },
  'AC Repair':  { icon: '❄️', color: 'bg-cyan-50' },
  'Carpentry':  { icon: '🪚', color: 'bg-amber-50' },
  'Painting':   { icon: '🎨', color: 'bg-purple-50' },
};

export default function Home() {
  const navigate    = useNavigate();
  const auth        = useSelector(s => s.auth);

  const [categories, setCategories]   = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [catLoading, setCatLoading]   = useState(true);

  // Fetch categories from API
  useEffect(() => {
    api.get('/booking/categories')
      .then(r => setCategories(r.data))
      .catch(console.error)
      .finally(() => setCatLoading(false));
  }, []);

  // Fetch active booking (if any)
  useEffect(() => {
    api.get('/user/bookings/active')
      .then(r => setActiveBooking(r.data))
      .catch(() => setActiveBooking(null));
  }, []);

  // Group into parent categories only (no parentId)
  const parentCats = categories.filter(c => !c.parentId);

  const initials = auth.name
    ? auth.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : auth.phone?.slice(-2) ?? 'U';

  const statusLabel = {
    pending:     { label: 'Finding Worker…', color: 'bg-amber-500', route: '/customer/waiting' },
    accepted:    { label: 'Worker En Route',  color: 'bg-blue-600',  route: '/customer/live-tracking' },
    in_progress: { label: 'Job In Progress',  color: 'bg-green-600', route: '/customer/job-in-progress' },
    completed:   { label: 'Awaiting Review',  color: 'bg-purple-600',route: '/customer/job-completed' },
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 lg:pb-0 relative">
      {/* Header */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Welcome back</p>
            <p className="text-gray-900 font-bold text-lg">{auth.name || 'Valued Customer'}</p>
          </div>
          <Link to="/customer/profile" className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm text-sm">
            {initials}
          </Link>
        </div>

        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-3 focus-within:border-blue-700 transition-colors shadow-sm">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search for services..." className="bg-transparent w-full outline-none text-sm font-semibold text-gray-900 placeholder-gray-400" />
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto hide-scroll">
        {/* Active Booking Banner */}
        {activeBooking && statusLabel[activeBooking.status] && (
          <button
            onClick={() => navigate(statusLabel[activeBooking.status].route, { state: { bookingId: activeBooking.id } })}
            className={`w-full mb-6 ${statusLabel[activeBooking.status].color} p-5 rounded-2xl shadow-lg flex items-center justify-between text-white`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  {statusLabel[activeBooking.status].label}
                </span>
              </div>
              <h3 className="font-bold text-lg">{activeBooking.category?.name}</h3>
              {activeBooking.worker && (
                <p className="text-xs text-white/70 mt-0.5">{activeBooking.worker.name}</p>
              )}
            </div>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}

        {/* Categories */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">Services</h2>
        </div>

        {catLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl h-24 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {parentCats.map(cat => {
              const meta = CATEGORY_ICONS[cat.name] ?? { icon: '🔧', color: 'bg-gray-50' };
              return (
                <Link
                  key={cat.id}
                  to={`/customer/category/${cat.id}`}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:border-blue-700 transition-colors active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
