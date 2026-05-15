import { useFlow } from '../../store/useFlow';
import { useEffect, useState, useRef } from 'react';

/**
 * LocationStep — Worker onboarding Step 2
 * Worker drops a pin on the map to set their home location.
 * Uses Leaflet + OpenStreetMap (free, no API key).
 * Nominatim reverse geocodes the pin to a human-readable address.
 */
export default function LocationStep() {
  const { radius, setRadius, setStep, setLocation } = useFlow();

  const mapRef      = useRef(null);   // DOM element ref
  const leafletMap  = useRef(null);   // Leaflet map instance
  const markerRef   = useRef(null);   // Draggable marker

  const [coords, setCoords]     = useState(null);   // { lat, lng }
  const [address, setAddress]   = useState('');
  const [locating, setLocating] = useState(false);
  const [error, setError]       = useState('');

  // Initialise the map once — guards against React StrictMode double-invoke
  useEffect(() => {
    let mounted = true;

    // Leaflet CSS — inject once
    if (!document.getElementById('leaflet-css')) {
      const link   = document.createElement('link');
      link.id      = 'leaflet-css';
      link.rel     = 'stylesheet';
      link.href    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      // If the effect was cleaned up (StrictMode unmount) before the import
      // resolved, bail out immediately — don't touch the DOM.
      if (!mounted || !mapRef.current) return;

      // If a previous instance is stuck on the same DOM node, remove it first.
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markerRef.current  = null;
      }

      const map = L.map(mapRef.current, { zoomControl: true }).setView([19.076, 72.877], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Custom blue pin icon
      const icon = L.icon({
        iconUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize:   [25, 41],
        iconAnchor: [12, 41],
        popupAnchor:[1, -34],
        shadowUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });

      const marker = L.marker([19.076, 72.877], { icon, draggable: true }).addTo(map);
      marker.bindPopup('Drag to set your home location').openPopup();

      marker.on('dragend', async (e) => {
        const { lat, lng } = e.target.getLatLng();
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
        setLocation({ lat, lng });
      });

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
        setLocation({ lat, lng });
      });

      leafletMap.current = map;
      markerRef.current  = marker;
    });

    return () => {
      mounted = false;
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markerRef.current  = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } },
      );
      const data = await res.json();
      const addr = data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setAddress(addr);
      setLocation({ lat, lng, address: addr });
    } catch {
      const addr = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setAddress(addr);
      setLocation({ lat, lng, address: addr });
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        leafletMap.current?.setView([lat, lng], 15);
        import('leaflet').then((L) => {
          markerRef.current?.setLatLng([lat, lng]);
        });
        reverseGeocode(lat, lng);
        setLocation({ lat, lng });
        setLocating(false);
      },
      (err) => {
        setError('Location access denied. Drop the pin manually.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep('profile')} className="text-slate-400 hover:text-slate-700 transition-colors">←</button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-0.5">Service Area</h2>
          <p className="text-slate-500 text-sm">Drop a pin at your home / base location</p>
        </div>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden border border-slate-200"
        style={{ height: '220px' }}
      />

      {/* GPS button */}
      <button
        onClick={useMyLocation}
        disabled={locating}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-2xl text-sm hover:bg-blue-50 transition-colors disabled:opacity-50"
      >
        <span>{locating ? '⏳' : '📍'}</span>
        {locating ? 'Getting location…' : 'Use my current location'}
      </button>

      {/* Address preview */}
      {address && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Selected Location</p>
          <p className="text-sm font-semibold text-slate-800 leading-snug">{address}</p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

      {/* Radius slider */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-700">Service Radius</span>
          <span className="text-sm font-extrabold text-blue-600">{radius} km</span>
        </div>
        <input
          type="range" min="5" max="30"
          value={radius}
          onChange={e => setRadius(Number(e.target.value))}
          className="w-full h-2 accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
          <span>5 km</span><span>30 km</span>
        </div>
      </div>

      <button
        onClick={() => setStep('skills')}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-blue-100"
      >
        Continue
      </button>
    </div>
  );
}