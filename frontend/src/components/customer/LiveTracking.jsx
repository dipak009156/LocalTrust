import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Api from '../../utils/api';

export default function LiveTracking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch current live status of the booking
    // Why: To show the user the real-time position and status of the partner
    const fetchBookingStatus = async () => {
      try {
        const res = await Api.get(`/bookings/${id}`);
        setBooking(res.data.booking);
        
        // Auto-redirect if worker has arrived
        if (res.data.booking?.status === 'arrived') {
          navigate(`/customer/otp-checkin/${id}`);
        }
      } catch (err) {
        console.error('Failed to fetch tracking data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStatus();
    const interval = setInterval(fetchBookingStatus, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [id, navigate]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 bg-gray-200 relative">
        {/* Placeholder Map */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold px-12 text-center">
          [ Real-time map will integrate with Google Maps API using worker latitude: {booking?.worker?.lat || '---'} ]
        </div>
      </div>

      <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 -mt-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {booking?.status === 'accepted' ? 'Partner Confirmed' : 'Partner En Route'}
            </h2>
            <p className="text-blue-700 font-bold text-sm">Arriving shortly</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center animate-pulse">
            📍
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => navigate('/customer/chat')} className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Chat
          </button>
          <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </button>
        </div>

        {/* Support Link */}
        <button onClick={() => navigate('/customer/help')} className="w-full text-xs text-gray-400 font-semibold underline text-center mt-2">
          Need help with this booking?
        </button>
      </div>
    </div>
  );
}
