import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase/config';
import { ref, onValue, off } from 'firebase/database';

/**
 * LiveTracking — Customer sees worker moving on the map in real time.
 *
 * Worker pushes their location to:  /locations/{bookingId}
 * This component listens live and moves the map marker.
 *
 * bookingId is expected in location.state.
 */
export default function LiveTracking() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const bookingId  = location.state?.bookingId ?? 'demo-booking';

  const mapRef     = useRef(null);
  const leafletMap = useRef(null);
  const workerMarker = useRef(null);
  const destMarker   = useRef(null);

  const [workerPos, setWorkerPos]   = useState(null);
  const [connected, setConnected]   = useState(false);

  // ── Inject Leaflet CSS + init map ──────────────────────────────────────────
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
      const map = L.map(mapRef.current, { zoomControl: false }).setView([19.076, 72.877], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Worker marker — animated blue dot
      const workerIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:18px;height:18px;background:#1d4ed8;border:3px solid white;
          border-radius:50%;box-shadow:0 0 0 4px rgba(29,78,216,0.3);
          animation: workerPulse 1.5s infinite;
        "></div>`,
        iconSize:   [18, 18],
        iconAnchor: [9, 9],
      });

      // Add CSS for animation
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

      workerMarker.current = L.marker([19.076, 72.877], { icon: workerIcon }).addTo(map);

      // Destination marker (customer's address) — red pin placeholder
      const destIcon = L.icon({
        iconUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize:   [25, 41],
        iconAnchor: [12, 41],
        shadowUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });
      destMarker.current = L.marker([19.080, 72.890], { icon: destIcon })
        .addTo(map)
        .bindPopup('Your location');

      leafletMap.current = map;
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  // ── Firebase RTDB — listen for worker location ─────────────────────────────
  useEffect(() => {
    const locationRef = ref(db, `locations/${bookingId}`);

    const unsubscribe = onValue(locationRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const { lat, lng, updatedAt } = snapshot.val();
      setWorkerPos({ lat, lng, updatedAt });
      setConnected(true);

      if (workerMarker.current && leafletMap.current) {
        workerMarker.current.setLatLng([lat, lng]);
        // Pan map to keep worker in view
        leafletMap.current.panTo([lat, lng], { animate: true, duration: 1 });
      }
    });

    return () => off(locationRef);
  }, [bookingId]);

  const secondsAgo = workerPos?.updatedAt
    ? Math.round((Date.now() - workerPos.updatedAt) / 1000)
    : null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
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
                <span className="w-2 h-2 bg-gray-300 rounded-full inline-block" />
                Waiting for worker location…
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center text-2xl">
            🚗
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate('/customer/chat', { state: { bookingId } })}
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Chat
          </button>
          <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </button>
        </div>

        {/* Demo shortcut */}
        <button
          onClick={() => navigate('/customer/otp-checkin', { state: { bookingId } })}
          className="w-full text-xs text-gray-400 font-semibold underline text-center"
        >
          [Simulate: Worker Arrived]
        </button>
      </div>
    </div>
  );
}
