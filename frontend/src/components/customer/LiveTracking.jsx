import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase/config';
import { ref, onValue, off } from 'firebase/database';
import api from '../../utils/api';
import { securePost } from '../../utils/securePost';
import { useSelector } from 'react-redux';
import StepUpAuthModal from '../ui/StepUpAuthModal';

/**
 * LiveTracking — Customer sees worker moving on the map in real time.
 * Worker pushes GPS to Firebase RTDB: /locations/{bookingId}
 * Destination pin uses the booking's real lat/lng.
 */
export default function LiveTracking() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const bookingId  = location.state?.bookingId ?? 'demo-booking';

  const mapRef       = useRef(null);
  const leafletMap   = useRef(null);
  const workerMarker = useRef(null);
  const destMarker   = useRef(null);

  const [workerPos,  setWorkerPos]  = useState(null);
  const [connected,  setConnected]  = useState(false);
  const [booking,    setBooking]    = useState(null);
  const [hasUnread,  setHasUnread]   = useState(false);
  const [stepUp,     setStepUp]     = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const phone = useSelector(s => s.auth.phone) || '';

  // Background check for unread chat messages
  useEffect(() => {
    if (!bookingId || bookingId === 'demo-booking') return;

    const checkUnread = async () => {
      try {
        const { data } = await api.get(`/booking/${bookingId}/chat`);
        if (!data || data.length === 0) return;
        const seen = parseInt(localStorage.getItem(`chat_seen_${bookingId}`) || '0', 10);
        if (data.length > seen) {
          const lastMsg = data[data.length - 1];
          if (lastMsg.senderRole === 'worker') {
            setHasUnread(true);
          } else {
            localStorage.setItem(`chat_seen_${bookingId}`, data.length);
            setHasUnread(false);
          }
        } else {
          setHasUnread(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 4000);
    return () => clearInterval(interval);
  }, [bookingId]);

  // Fetch booking to get customer's lat/lng, worker phone, and price updates
  useEffect(() => {
    if (!bookingId || bookingId === 'demo-booking') return;

    const fetchBooking = () => {
      api.get(`/user/bookings/${bookingId}`)
        .then(r => setBooking(r.data))
        .catch(console.error);
    };

    fetchBooking();
    const interval = setInterval(fetchBooking, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handlePriceAdjustment = async (action) => {
    try {
      const result = await securePost(`/booking/${bookingId}/respond-price`, { action });

      if (result.sentinelVerdict === 'STEP_UP_AUTH') { setPendingAction(action); setStepUp(true); return; }
      if (result.sentinelVerdict === 'BLOCK') { alert('Action blocked due to unusual activity.'); return; }
      if (result.sentinelVerdict === 'TERMINATE_SESSION') { localStorage.removeItem('lt_token'); window.location.href = '/'; return; }

      const { data } = await api.get(`/user/bookings/${bookingId}`);
      setBooking(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response');
    }
  };

  // ── Init Leaflet map ──────────────────────────────────────────────────────
  useEffect(() => {
    if (leafletMap.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link   = document.createElement('link');
      link.id      = 'leaflet-css';
      link.rel     = 'stylesheet';
      link.href    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      const map = L.map(mapRef.current, { zoomControl: false }).setView([20.5937, 78.9629], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Inject pulse CSS
      if (!document.getElementById('worker-pulse-css')) {
        const style = document.createElement('style');
        style.id    = 'worker-pulse-css';
        style.textContent = `
          @keyframes workerPulse {
            0%   { box-shadow: 0 0 0 0 rgba(29,78,216,0.5); }
            70%  { box-shadow: 0 0 0 10px rgba(29,78,216,0); }
            100% { box-shadow: 0 0 0 0 rgba(29,78,216,0); }
          }
        `;
        document.head.appendChild(style);
      }

      // Worker marker — animated blue dot
      const workerIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:18px;height:18px;background:#1d4ed8;border:3px solid white;
          border-radius:50%;box-shadow:0 0 0 4px rgba(29,78,216,0.3);
          animation:workerPulse 1.5s infinite;
        "></div>`,
        iconSize:   [18, 18],
        iconAnchor: [9, 9],
      });

      workerMarker.current = L.marker([20.5937, 78.9629], { icon: workerIcon }).addTo(map);
      leafletMap.current   = map;
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  // ── Place destination pin once booking data is loaded ─────────────────────
  useEffect(() => {
    if (!booking || !leafletMap.current) return;
    if (!booking.lat || !booking.lng) return;

    import('leaflet').then((L) => {
      // Remove old dest marker if exists
      if (destMarker.current) {
        destMarker.current.remove();
      }

      const destIcon = L.icon({
        iconUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize:   [25, 41],
        iconAnchor: [12, 41],
        shadowUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });

      destMarker.current = L.marker([booking.lat, booking.lng], { icon: destIcon })
        .addTo(leafletMap.current)
        .bindPopup('📍 Your location');

      // Center map on destination until worker is tracked
      if (!workerPos) {
        leafletMap.current.setView([booking.lat, booking.lng], 15);
      }
    });
  }, [booking, workerPos]);

  // ── Firebase RTDB — listen for worker location ────────────────────────────
  useEffect(() => {
    const locationRef = ref(db, `locations/${bookingId}`);

    const unsubscribe = onValue(locationRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const { lat, lng, updatedAt } = snapshot.val();
      setWorkerPos({ lat, lng, updatedAt });
      setConnected(true);

      if (workerMarker.current && leafletMap.current) {
        workerMarker.current.setLatLng([lat, lng]);
        leafletMap.current.panTo([lat, lng], { animate: true, duration: 1 });

        // If we have destination too, fit both in bounds
        if (destMarker.current && booking?.lat && booking?.lng) {
          leafletMap.current.fitBounds(
            [[lat, lng], [booking.lat, booking.lng]],
            { padding: [60, 60], maxZoom: 16 },
          );
        }
      }
    });

    return () => off(locationRef);
  }, [bookingId, booking]);

  const secondsAgo = workerPos?.updatedAt
    ? Math.round((Date.now() - workerPos.updatedAt) / 1000)
    : null;

  const workerPhone = booking?.worker?.phone;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {stepUp && (
        <StepUpAuthModal
          phone={phone}
          onVerified={() => { setStepUp(false); if (pendingAction) handlePriceAdjustment(pendingAction); }}
          onDismiss={() => setStepUp(false)}
        />
      )}
      {/* Map */}
      <div ref={mapRef} className="flex-1" style={{ minHeight: '300px' }} />

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 -mt-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Worker En Route</h2>
            {connected ? (
              <p className="text-blue-700 font-bold text-sm flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
                Live tracking active
                {secondsAgo !== null && secondsAgo < 30 && (
                  <span className="text-xs text-gray-400 font-normal ml-1">· {secondsAgo}s ago</span>
                )}
              </p>
            ) : (
              <p className="text-gray-400 font-bold text-sm mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse inline-block" />
                Waiting for worker location…
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center text-2xl">
            🚗
          </div>
        </div>

        {booking?.worker?.name && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-black">
              {booking.worker.name.charAt(0)}
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">{booking.worker.name}</p>
              <p className="text-xs text-gray-500 font-semibold">{booking.category?.name}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <button
              onClick={() => navigate('/customer/chat', { state: { bookingId } })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Chat
            </button>
            {hasUnread && (
              <span className="absolute top-2 right-3 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white"></span>
              </span>
            )}
          </div>
          <a
            href={workerPhone ? `tel:${workerPhone}` : undefined}
            onClick={!workerPhone ? (e) => e.preventDefault() : undefined}
            className={`flex-1 border font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-center transition-colors
              ${workerPhone
                ? 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
                : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </a>
        </div>

        {/* Demo shortcut */}
        <button
          onClick={() => navigate('/customer/otp-checkin', { state: { bookingId } })}
          className="w-full text-xs text-gray-400 font-semibold underline text-center"
        >
          [Simulate: Worker Arrived]
        </button>
      </div>

      {/* Price Adjustment Request Alert / Modal */}
      {booking?.adjustmentPrice && (
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in animate-duration-300">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💰</span>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Price Adjustment Request</h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">The worker requested a price update</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-sm font-extrabold text-amber-900">
                <span>Original Price</span>
                <span>₹{booking.basePrice}</span>
              </div>
              <div className="flex justify-between items-center text-base font-black text-amber-950 border-t border-amber-100/50 pt-2.5">
                <span>Adjusted Price</span>
                <span className="text-xl">₹{booking.adjustmentPrice}</span>
              </div>
              {booking.adjustmentReason && (
                <p className="text-xs font-semibold text-amber-800 bg-white/60 p-2.5 rounded-xl border border-amber-100/50 mt-1">
                  💡 "{booking.adjustmentReason}"
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handlePriceAdjustment('reject')}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-gray-50 active:scale-95 transition-transform"
              >
                Decline
              </button>
              <button
                onClick={() => handlePriceAdjustment('accept')}
                className="flex-[1.5] bg-blue-700 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-800 shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                Approve & Pay ₹{booking.adjustmentPrice}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
