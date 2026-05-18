import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { ref as dbRef, set, remove } from 'firebase/database';
import { useWorker } from '../../context/WorkerContext';
import api from '../../utils/api';

export default function EnRoute() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const bookingId  = location.state?.bookingId ?? 'demo-booking';
  const { activeBooking } = useWorker();

  const mapRef       = useRef(null);
  const leafletMap   = useRef(null);
  const workerMarker = useRef(null);
  const destMarker   = useRef(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const simIntervalRef = useRef(null);
  const watchIdRef     = useRef(null);

  // Price change modal state
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [newPrice,       setNewPrice]       = useState('');
  const [priceReason,    setPriceReason]    = useState('');

  // Booking data from context or fallback
  const booking = activeBooking || {
    service:  'Tap Repair',
    customer: 'Customer',
    address:  '—',
    price:    0,
    otp:      null,
    lat:      null,
    lng:      null,
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
      const defaultLat = booking.lat ?? 20.5937;
      const defaultLng = booking.lng ?? 78.9629;

      const map = L.map(mapRef.current, { zoomControl: false }).setView([defaultLat, defaultLng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Inject pulse animation CSS
      if (!document.getElementById('enroute-pulse-css')) {
        const style = document.createElement('style');
        style.id    = 'enroute-pulse-css';
        style.textContent = `
          @keyframes enroutePulse {
            0%   { box-shadow: 0 0 0 0 rgba(29,78,216,0.6); }
            70%  { box-shadow: 0 0 0 12px rgba(29,78,216,0); }
            100% { box-shadow: 0 0 0 0 rgba(29,78,216,0); }
          }
        `;
        document.head.appendChild(style);
      }

      // Worker = animated blue dot
      const workerIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:18px;height:18px;background:#1d4ed8;border:3px solid white;
          border-radius:50%;box-shadow:0 0 0 4px rgba(29,78,216,0.3);
          animation:enroutePulse 1.5s infinite;
        "></div>`,
        iconSize:   [18, 18],
        iconAnchor: [9, 9],
      });

      // Destination = standard red Leaflet pin
      const destIcon = L.icon({
        iconUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize:   [25, 41],
        iconAnchor: [12, 41],
        shadowUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });

      workerMarker.current = L.marker([defaultLat, defaultLng], { icon: workerIcon }).addTo(map);

      // Place destination pin at customer's booking lat/lng if available
      if (booking.lat && booking.lng) {
        destMarker.current = L.marker([booking.lat, booking.lng], { icon: destIcon })
          .addTo(map)
          .bindPopup("📍 Customer's location");
      }

      leafletMap.current = map;

      // Try to get real GPS position of worker and center map there
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            map.setView([lat, lng], 16);
            workerMarker.current?.setLatLng([lat, lng]);
            // If we have customer destination, fit both in view
            if (booking.lat && booking.lng) {
              map.fitBounds([
                [lat, lng],
                [booking.lat, booking.lng],
              ], { padding: [50, 50] });
            }
          },
          () => {},
          { enableHighAccuracy: true, timeout: 6000 },
        );
      }
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Push GPS to Firebase RTDB (real or simulated) ─────────────────────────
  useEffect(() => {
    if (isSimulating) {
      let step = 0;
      const workerStartLat = booking.lat ? booking.lat - 0.01 : 19.076;
      const workerStartLng = booking.lng ? booking.lng - 0.01 : 72.877;
      const endLat = booking.lat ?? 19.080;
      const endLng = booking.lng ?? 72.890;

      simIntervalRef.current = setInterval(() => {
        step += 0.05;
        if (step > 1) {
          clearInterval(simIntervalRef.current);
          setIsSimulating(false);
          return;
        }
        const lat = workerStartLat + (endLat - workerStartLat) * step;
        const lng = workerStartLng + (endLng - workerStartLng) * step;

        // Update Firebase
        set(dbRef(db, `locations/${bookingId}`), { lat, lng, updatedAt: Date.now() });

        // Move marker on worker's own map
        if (workerMarker.current && leafletMap.current) {
          workerMarker.current.setLatLng([lat, lng]);
          leafletMap.current.panTo([lat, lng], { animate: true, duration: 0.8 });
        }
      }, 1000);
      return () => clearInterval(simIntervalRef.current);
    }

    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Push to Firebase so customer's LiveTracking sees it
        set(dbRef(db, `locations/${bookingId}`), { lat, lng, updatedAt: Date.now() });
        // Move marker on worker's own map
        if (workerMarker.current && leafletMap.current) {
          workerMarker.current.setLatLng([lat, lng]);
          leafletMap.current.panTo([lat, lng], { animate: true, duration: 0.8 });
        }
      },
      (err) => console.warn('GPS error:', err.message),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
    );

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      remove(dbRef(db, `locations/${bookingId}`));
    };
  }, [bookingId, isSimulating, booking.lat, booking.lng]);

  const handleRequestPriceChange = async () => {
    if (!newPrice || !priceReason) return alert('Please enter price and reason');
    try {
      await api.post(`/booking/${bookingId}/request-price`, {
        amount: newPrice,
        reason: priceReason,
      });
      alert('Price adjustment request sent to customer.');
      setShowPriceModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="flex flex-col relative overflow-hidden" style={{ height: '100dvh' }}>
      {/* Real Leaflet Map — full screen behind */}
      <div ref={mapRef} className="absolute inset-0" style={{ zIndex: 0 }} />

      {/* Top controls */}
      <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-center">
        <button onClick={() => navigate('/worker/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-gray-900 border border-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>

        <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-black text-gray-700 uppercase tracking-widest">
            {isSimulating ? 'Simulating…' : 'Live GPS'}
          </span>
        </div>

        {!isSimulating && (
          <button
            onClick={() => setIsSimulating(true)}
            className="h-10 px-4 bg-blue-700 text-white font-bold rounded-full shadow-md text-xs"
          >
            Simulate 🚗
          </button>
        )}
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-20">
        <div className="p-6">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{booking.customer}</h2>
              <p className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1">
                📍 {booking.address}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-500">{booking.service}</p>
              <p className="text-xl font-black text-gray-900 mt-1">₹{booking.price}</p>
            </div>
          </div>

          {booking.otp && (
            <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100 mb-4 flex items-center gap-3">
              <span className="text-lg">🔑</span>
              <div>
                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Check-in OTP</p>
                <p className="text-2xl font-black text-blue-900 tracking-widest">{booking.otp}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-4">
            <button onClick={() => navigate('/worker/chat', { state: { bookingId } })} className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Chat
            </button>
            <a href={`tel:${booking.phone ?? ''}`} className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-100 text-center">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call
            </a>
          </div>

          <button onClick={() => setShowPriceModal(true)} className="w-full text-blue-700 text-sm font-bold bg-blue-50 py-3 rounded-xl mb-3 border border-blue-100 hover:bg-blue-100 transition-colors">
            Request Price Change
          </button>

          <button onClick={() => navigate('/worker/otp-entry', { state: { bookingId } })} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
            I've Arrived — Request OTP
          </button>
        </div>
      </div>

      {/* Price Change Modal */}
      {showPriceModal && (
        <div className="absolute inset-0 bg-gray-900/40 z-30 flex items-end animate-in fade-in">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">Request Price Change</h3>
              <button onClick={() => setShowPriceModal(false)} className="text-gray-400 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">New Price (₹)</label>
                <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-blue-700"
                  placeholder="e.g. 500" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Reason for change</label>
                <textarea value={priceReason} onChange={(e) => setPriceReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 h-24 resize-none"
                  placeholder="Extra materials needed..." />
              </div>
            </div>
            <button onClick={handleRequestPriceChange} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-800 transition-colors">
              Send Request to Customer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
