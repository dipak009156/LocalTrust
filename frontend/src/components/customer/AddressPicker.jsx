import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

/**
 * AddressPicker — Customer selects service location
 * Uses Leaflet + OpenStreetMap + Nominatim.
 * On confirm → navigates to returnTo route with { lat, lng, address } in state.
 *
 * Caller must pass in location.state: { returnTo, ...restOfState }
 * e.g. navigate('/customer/address-picker', { state: { returnTo: '/customer/book', categoryId, categoryName, price } })
 */
export default function AddressPicker() {
  const navigate    = useNavigate();
  const location    = useLocation();

  // Whatever the caller passed — we'll forward it back alongside the address
  const { returnTo = '/customer/book', ...callerState } = location.state ?? {};

  const mapRef     = useRef(null);
  const leafletMap = useRef(null);
  const markerRef  = useRef(null);

  const [coords,    setCoords]   = useState(null);
  const [address,   setAddress]  = useState('');
  const [locating,  setLocating] = useState(false);
  const [geoError,  setGeoError] = useState('');

  // ── Reverse-geocode helper ────────────────────────────────────────────────
  const reverseGeocode = async (lat, lng) => {
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } },
      );
      const data = await res.json();
      return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
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
      const map = L.map(mapRef.current, { zoomControl: false }).setView([20.5937, 78.9629], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const icon = L.icon({
        iconUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize:   [25, 41],
        iconAnchor: [12, 41],
        shadowUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });

      const marker = L.marker([20.5937, 78.9629], { icon, draggable: true }).addTo(map);

      const updateLocation = async (lat, lng) => {
        setCoords({ lat, lng });
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
      };

      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        updateLocation(lat, lng);
      });

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updateLocation(lat, lng);
      });

      leafletMap.current = map;
      markerRef.current  = marker;

      // Auto-detect GPS on mount
      if (navigator.geolocation) {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            map.setView([lat, lng], 16);
            marker.setLatLng([lat, lng]);
            await updateLocation(lat, lng);
            setLocating(false);
          },
          (err) => {
            setLocating(false);
            if (err.code === 1) {
              setGeoError('Location access denied. Drop a pin on the map or type your address.');
            } else {
              setGeoError('Could not detect location. Drop a pin on the map instead.');
            }
          },
          { enableHighAccuracy: true, timeout: 10000 },
        );
      } else {
        setGeoError('Geolocation is not supported. Drop a pin on the map.');
      }
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  // ── Manual GPS button ─────────────────────────────────────────────────────
  const useGPS = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported by this browser.');
      return;
    }
    setLocating(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        leafletMap.current?.setView([lat, lng], 17);
        const L = await import('leaflet');
        markerRef.current?.setLatLng([lat, lng]);
        setCoords({ lat, lng });
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setGeoError('Location permission denied. Please enable it in your browser settings and try again.');
        } else {
          setGeoError('Could not get your location. Try again or drop a pin on the map.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // ── Confirm — navigate FORWARD to returnTo with full state ────────────────
  // Using navigate(path, { state }) instead of navigate(-1) because
  // navigate(-1) ignores the state argument in React Router.
  const handleConfirm = () => {
    if (!address) return;
    navigate(returnTo, {
      replace: true,
      state: {
        ...callerState,
        lat:     coords?.lat ?? null,
        lng:     coords?.lng ?? null,
        address,
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Select Address</h1>
        <button
          onClick={useGPS}
          disabled={locating}
          className="ml-auto flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors disabled:opacity-60"
        >
          {locating ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : '📍'}
          {locating ? 'Locating…' : 'Use My Location'}
        </button>
      </div>

      {/* Locating spinner overlay on map */}
      {locating && (
        <div className="absolute inset-0 top-[73px] bg-white/60 z-20 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-700 font-bold text-sm">Detecting your location…</p>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="flex-1" style={{ minHeight: '300px' }} />

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 -mt-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />
        <h2 className="text-lg font-extrabold text-gray-900 mb-1">Service Location</h2>

        {geoError && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 mb-3 text-xs font-semibold text-amber-800">
            <span className="text-base shrink-0">⚠️</span>
            <span>{geoError}</span>
          </div>
        )}

        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-semibold text-gray-900 outline-none focus:border-blue-700 resize-none mb-5"
          placeholder="Drop a pin on the map, tap 'Use My Location', or type your address…"
        />

        <button
          onClick={handleConfirm}
          disabled={!address}
          className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-colors
            ${address ? 'bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}
