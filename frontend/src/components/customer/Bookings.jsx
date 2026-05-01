import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, RotateCcw, Droplets, Zap, Wrench, ShowerHead } from 'lucide-react';
import Api from '../../utils/api';

export default function Bookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('active'); // 'active' or 'past'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch all bookings for the customer
    // Why: To display history and current status of service requests
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await Api.get('/bookings');
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const activeBookings = bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status));
  const pastBookings = bookings.filter(b => ['completed', 'cancelled', 'disputed'].includes(b.status));

  const getIcon = (catName) => {
    if (catName?.toLowerCase().includes('plumb')) return <Droplets size={28} />;
    if (catName?.toLowerCase().includes('elect')) return <Zap size={28} />;
    if (catName?.toLowerCase().includes('show')) return <ShowerHead size={28} />;
    return <Wrench size={28} />;
  };

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
          {loading ? (
             [1,2].map(i => (
              <div key={i} className="bg-white p-5 rounded-3xl h-48 animate-pulse shadow-sm border border-gray-100"></div>
            ))
          ) : (
            (tab === 'active' ? activeBookings : pastBookings).length > 0 ? (
              (tab === 'active' ? activeBookings : pastBookings).map((booking) => (
                <Link 
                  key={booking.id}
                  to={`/customer/booking/${booking.id}`} 
                  className={`bg-white p-5 rounded-3xl shadow-sm border ${booking.status === 'disputed' ? 'border-red-100' : 'border-gray-100'} flex flex-col gap-5 hover:border-blue-300 transition-all group`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className={`w-14 h-14 ${booking.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'} flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform`}>
                        {getIcon(booking.category?.name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{booking.category?.name || 'Service'}</h3>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                          <Clock size={14} className="text-blue-600" />
                          <p className="text-xs font-bold uppercase tracking-wide">
                            {new Date(booking.createdAt).toLocaleDateString()} • ₹{booking.finalPrice || booking.basePrice}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-gray-100 text-gray-600' :
                      booking.status === 'disputed' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  {booking.status === 'in_progress' && (
                    <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-3 border border-blue-100/50">
                      <div className="relative">
                        <div className="w-2.5 h-2.5 bg-blue-700 rounded-full"></div>
                        <div className="absolute inset-0 w-2.5 h-2.5 bg-blue-700 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <p className="text-sm font-bold text-blue-900">Job in progress...</p>
                    </div>
                  )}

                  {booking.status === 'completed' && (
                     <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                        <div className="flex items-center gap-3">
                          <img src={booking.worker?.profilePhoto || "https://i.pravatar.cc/150?img=11"} alt="Worker" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                          <span className="text-sm font-bold text-gray-900">{booking.worker?.name || 'Partner'}</span>
                        </div>
                        <button className="flex items-center gap-1.5 text-blue-700 text-xs font-black uppercase tracking-wider hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors">
                          <RotateCcw size={14} />
                          Rebook
                        </button>
                      </div>
                  )}

                  {booking.status === 'disputed' && (
                     <div className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
                      <AlertCircle size={18} className="text-red-600 shrink-0" />
                      <p className="text-sm font-bold text-red-900">Dispute under investigation</p>
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <X size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-900">No {tab} bookings</h3>
                <p className="text-sm font-medium mt-2">Any services you book will appear here.</p>
                <Link to="/customer/home" className="mt-6 bg-blue-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all">
                  Book a Service
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
