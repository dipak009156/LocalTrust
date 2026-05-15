import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';

/**
 * Waiting — polls GET /api/user/bookings/active every 3 seconds.
 * When status changes to 'accepted' → navigate to worker-found.
 */
export default function WaitingScreen() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const bookingId  = location.state?.bookingId;
  const pollRef    = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        // If we have a specific ID, poll that. Otherwise poll the general active endpoint.
        const url = bookingId ? `/user/bookings/${bookingId}` : '/user/bookings/active';
        const { data } = await api.get(url);
        
        if (cancelled) return;
        if (!data) return;

        // If polling by ID, the response might be the full booking object
        const status = data.status;

        if (status === 'accepted') {
          navigate('/customer/worker-found', { state: { bookingId: data.id, booking: data } });
        } else if (status === 'in_progress') {
          navigate('/customer/otp-checkin', { state: { bookingId: data.id } });
        } else if (status === 'completed') {
          navigate('/customer/job-completed', { state: { bookingId: data.id } });
        } else if (status === 'cancelled') {
          navigate('/customer/home');
        }
      } catch (err) {
        console.error('Poll error:', err.message);
      }
    };

    // Poll immediately then every 3s
    poll();
    pollRef.current = setInterval(poll, 3000);

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
    };
  }, [navigate, bookingId]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-blue-700 text-white p-6">
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-4xl">🔍</span>
      </div>
      <h2 className="text-2xl font-extrabold mb-2 text-center">Finding a trusted worker</h2>
      <p className="text-blue-200 text-center font-medium mb-8">
        Scanning your area for available and verified professionals…
      </p>
      <button
        onClick={() => {
          if (bookingId) api.post(`/booking/${bookingId}/cancel`).catch(() => {});
          navigate('/customer/home');
        }}
        className="text-blue-200 text-sm font-semibold underline mt-4"
      >
        Cancel booking
      </button>
    </div>
  );
}
