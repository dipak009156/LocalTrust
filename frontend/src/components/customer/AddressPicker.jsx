import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

/**
 * AddressPicker — Customer selects service location
 * Uses Leaflet + OpenStreetMap + Nominatim.
 * On confirm → passes { lat, lng, address } back via navigate state.
 */
export default function AddressPicker() {
  const navigate  = useNavigate();

  const mapRef     = useRef(null);
  const leafletMap = useRef(null);
  const markerRef  = useRef(null);

  const [coords, setCoords]   = useState(null);
  const [address, setAddress] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (leafletMap.current) return;

    // Inject Leaflet CSS once
    if (!document.getElementById('leaflet-css')) {
      const link   = document.createElement('link');
      link.id      = 'leaflet-css';
      link.rel     = 'stylesheet';
      link.href    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      const map = L.map(mapRef.current, { zoomControl: false }).setView([19.076, 72.877], 13);

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

      const marker = L.marker([19.076, 72.877], { icon, draggable: true }).addTo(map);

      const updateLocation = async (lat, lng) => {
        setCoords({ lat, lng });
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } },
          );
          const data = await res.json();
          setAddress(data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
          setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
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

      // Auto-locate on open
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            map.setView([lat, lng], 16);
            marker.setLatLng([lat, lng]);
            updateLocation(lat, lng);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 8000 },
        );
      }
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  const useGPS = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        leafletMap.current?.setView([lat, lng], 17);
        import('leaflet').then(() => markerRef.current?.setLatLng([lat, lng]));
        setCoords({ lat, lng });
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
          headers: { 'Accept-Language': 'en' },
        })
          .then(r => r.json())
          .then(d => setAddress(d.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`))
          .finally(() => setLocating(false));
      },
      () => setLocating(false),
      { enableHighAccuracy: true },
    );
  };

  const handleConfirm = () => {
    // Pass the location back to whoever navigated here
    navigate(-1, {
      state: { lat: coords?.lat, lng: coords?.lng, address },
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
          className="ml-auto flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          {locating ? '⏳' : '📍'} {locating ? 'Locating…' : 'My Location'}
        </button>
      </div>

      {/* Map — full remaining height */}
      <div ref={mapRef} className="flex-1" style={{ minHeight: '300px' }} />

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 -mt-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />
        <h2 className="text-lg font-extrabold text-gray-900 mb-3">Service Location</h2>

        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-semibold text-gray-900 outline-none focus:border-blue-700 resize-none mb-5"
          placeholder="Drop a pin on the map or type your address…"
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
