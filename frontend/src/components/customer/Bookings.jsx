import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';

const CATEGORY_ICONS = {
  'Plumbing':'🚰','Electrical':'⚡','Cleaning':'🧹',
  'AC Repair':'❄️','Carpentry':'🪚','Painting':'🎨',
};

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: 'bg-amber-100 text-amber-700', icon: Clock },
  accepted:    { label: 'En Route',    color: 'bg-blue-100 text-blue-700',   icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-green-100 text-green-700', icon: Clock },
  completed:   { label: 'Completed',   color: 'bg-gray-100 text-gray-600',   icon: CheckCircle2 },
  confirmed:   { label: 'Confirmed',   color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  cancelled:   { label: 'Cancelled',   color: 'bg-gray-100 text-gray-500',   icon: XCircle },
  disputed:    { label: 'Disputed',    color: 'bg-red-100 text-red-700',     icon: AlertCircle },
};

const ACTIVE_STATUSES = ['pending', 'accepted', 'in_progress', 'completed'];

export default function Bookings() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState('active');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/bookings')
      .then(r => setBookings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const active = bookings.filter(b => ACTIVE_STATUSES.includes(b.status));
  const past   = bookings.filter(b => !ACTIVE_STATUSES.includes(b.status));
  const list   = tab === 'active' ? active : past;

  const getRoute = (b) => {
    if (b.status === 'accepted')    return '/customer/live-tracking';
    if (b.status === 'in_progress') return '/customer/job-in-progress';
    if (b.status === 'completed')   return '/customer/job-completed';
    if (b.status === 'disputed')    return '/customer/dispute-status';
    if (b.status === 'confirmed')   return '/customer/receipt';
    return '/customer/booking-detail';
  };

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 lg:pb-0">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Bookings</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="px-6 pt-6">
          <div className="flex bg-gray-200/50 p-1 rounded-2xl w-full sm:w-64">
            {['active', 'past'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all capitalize
                  ${tab === t ? 'bg-white text-blue-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t} {t === 'active' ? `(${active.length})` : `(${past.length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          {loading && [...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-3xl animate-pulse border border-gray-100" />
          ))}

          {!loading && list.length === 0 && (
            <div className="col-span-2 text-center py-16 text-gray-400">
              <span className="text-4xl block mb-3">📦</span>
              <p className="font-bold">{tab === 'active' ? 'No active bookings.' : 'No past bookings yet.'}</p>
            </div>
          )}

          {list.map(b => {
            const cfg   = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
            const Icon  = cfg.icon;
            const icon  = CATEGORY_ICONS[b.category?.name] ?? '🔧';

            return (
              <button
                key={b.id}
                onClick={() => navigate(getRoute(b), { state: { bookingId: b.id } })}
                className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-2xl flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{b.category?.name}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-0.5">
                        {fmt(b.createdAt)} • ₹{b.basePrice}
                      </p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.color}`}>
                    <Icon size={10} />
                    {cfg.label}
                  </span>
                </div>

                {b.worker && (
                  <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 border border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-sm font-bold">
                      {b.worker.name?.[0] ?? 'W'}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{b.worker.name}</span>
                    {b.worker.avgRating > 0 && (
                      <span className="text-xs text-amber-500 font-bold ml-auto">★ {b.worker.avgRating.toFixed(1)}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
