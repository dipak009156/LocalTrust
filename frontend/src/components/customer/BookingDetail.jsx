import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Api from '../../utils/api';
import { ArrowLeft, Star, Download, ChevronRight, Loader2 } from 'lucide-react';

export default function BookingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch comprehensive booking details including worker info and status history
    // Why: To allow the user to review their past service or check current status
    const fetchBooking = async () => {
      try {
        const res = await Api.get(`/bookings/${id}`);
        setBooking(res.data.booking);
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 bg-gray-50">
      <Loader2 className="w-10 h-10 text-blue-700 animate-spin" />
      <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Fetching Booking Details...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Booking Info</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase text-xs opacity-50 mb-1">Service Type</h2>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{booking?.category?.name || 'Service Request'}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              {new Date(booking?.createdAt).toLocaleString()}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
            booking?.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
          }`}>
            {booking?.status || 'Pending'}
          </span>
        </div>

        <div>
          <h3 className="font-black text-gray-900 mb-3 text-xs uppercase tracking-widest opacity-50">Service Partner</h3>
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4">
            <img src={booking?.worker?.profilePhoto || "https://i.pravatar.cc/150?img=11"} alt="Worker" className="w-14 h-14 rounded-2xl object-cover border border-gray-50 shadow-sm" />
            <div>
              <p className="text-base font-black text-gray-900 leading-tight">{booking?.worker?.name || 'Assigned Partner'}</p>
              <div className="flex items-center gap-1 mt-1 text-sm font-bold">
                <span className="text-orange-500 flex items-center gap-1">★ {booking?.worker?.avgRating || '5.0'}</span>
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">({booking?.worker?.totalJobs || '0'} jobs)</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-black text-gray-900 mb-3 text-xs uppercase tracking-widest opacity-50">Payment Breakdown</h3>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between text-sm font-bold text-gray-500">
              <span className="uppercase tracking-widest text-[10px]">Service Base Price</span>
              <span>₹{booking?.basePrice || '---'}</span>
            </div>
            <div className="h-px w-full bg-gray-50"></div>
            <div className="flex justify-between text-lg font-black text-gray-900">
              <span className="uppercase tracking-widest text-[10px] mt-1.5">Total Amount</span>
              <span className="text-blue-700">₹{booking?.finalPrice || booking?.basePrice || '---'}</span>
            </div>
            <button className="flex items-center gap-2 text-blue-700 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">
              <Download size={14} /> Download Tax Invoice
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-black text-gray-900 mb-3 text-xs uppercase tracking-widest opacity-50">Help & Support</h3>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate(`/customer/dispute/${booking?.id}`)} className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-900 flex justify-between items-center hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all group">
              Report an issue with this service
              <ChevronRight size={16} className="text-gray-300 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 lg:sticky lg:border-none lg:bg-transparent">
        <button onClick={() => navigate('/customer')} className="max-w-2xl mx-auto w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all active:scale-[0.98] uppercase tracking-widest text-xs">
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
