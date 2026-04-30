import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroScene from '../../scene/HeroScene';

export default function Hero() {
  const [mode, setMode] = useState(null); // 'live' | 'manual'
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [address, setAddress] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [coords, setCoords] = useState(null);

  const handleLiveLocation = () => {
    setMode('live');
    setLocationStatus('loading');
    setAddress('');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      setAddress('Geolocation not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        // Reverse geocode using free API
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            const parts = [];
            const a = data.address || {};
            if (a.road) parts.push(a.road);
            if (a.suburb || a.neighbourhood) parts.push(a.suburb || a.neighbourhood);
            if (a.city || a.town || a.village) parts.push(a.city || a.town || a.village);
            if (a.state) parts.push(a.state);
            const readable = parts.length > 0
              ? parts.join(', ')
              : `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
            setAddress(readable);
            setLocationStatus('success');
          })
          .catch(() => {
            setAddress(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
            setLocationStatus('success');
          });
      },
      () => {
        setLocationStatus('error');
        setAddress('Unable to fetch location. Please allow location access.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualAddress = () => {
    setMode('manual');
    setLocationStatus('idle');
    setAddress('');
    setManualAddress('');
  };

  const handleSaveManual = () => {
    if (manualAddress.trim()) {
      setAddress(manualAddress.trim());
      setLocationStatus('success');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-6 md:py-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className="text-center md:text-left flex flex-col items-center md:items-start">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-6">
          Home services you can <span className="text-blue-700">actually trust.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed">
          Fixed prices. Verified workers. Money held safely until you're satisfied with the work.
        </p>

        {/* Location Options */}
        <div className="flex flex-col sm:flex-row w-full max-w-md gap-4">
          <button
            onClick={handleLiveLocation}
            className={`flex-1 font-bold py-3 md:py-4 px-6 rounded-2xl text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg
              ${mode === 'live' && locationStatus === 'success'
                ? 'bg-green-600 text-white shadow-green-200'
                : 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-200'}`}
          >
            {locationStatus === 'loading' && mode === 'live' ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            )}
            {locationStatus === 'loading' && mode === 'live' ? 'Detecting...' : 'Use Current Location'}
          </button>

          <button
            onClick={handleManualAddress}
            className={`flex-1 font-bold py-3 md:py-4 px-6 rounded-2xl text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg
              ${mode === 'manual' && locationStatus === 'success'
                ? 'bg-green-600 text-white shadow-green-200'
                : 'bg-white hover:bg-gray-50 text-gray-800 shadow-gray-200 border-2 border-gray-200'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            Enter Address
          </button>
        </div>

        {/* Manual Address Input */}
        {mode === 'manual' && locationStatus !== 'success' && (
          <div className="w-full max-w-md mt-4 animate-fade-in">
            <div className="flex gap-2">
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveManual()}
                placeholder="e.g. 123 Main St, Mumbai"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-semibold text-sm focus:border-blue-600 focus:outline-none transition-colors"
                autoFocus
              />
              <button
                onClick={handleSaveManual}
                disabled={!manualAddress.trim()}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all
                  ${manualAddress.trim() ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Address Display */}
        {address && locationStatus === 'success' && (
          <div className="mt-4 w-full max-w-md text-sm font-medium px-4 py-3 rounded-xl border flex items-center gap-3 text-green-700 bg-green-50 border-green-200 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="flex-1">{address}</span>
            <button
              onClick={() => { setMode(null); setLocationStatus('idle'); setAddress(''); }}
              className="text-green-500 hover:text-green-700 font-bold text-xs ml-2"
            >
              Change
            </button>
          </div>
        )}

        {/* Error Display */}
        {locationStatus === 'error' && (
          <div className="mt-4 w-full max-w-md text-sm font-medium px-4 py-3 rounded-xl border flex items-center gap-3 text-red-700 bg-red-50 border-red-200 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <span className="flex-1">{address}</span>
            <button
              onClick={handleLiveLocation}
              className="text-red-500 hover:text-red-700 font-bold text-xs ml-2 whitespace-nowrap"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="h-[200px] sm:h-[300px] md:h-[400px] w-full mt-4 sm:mt-8 md:mt-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <HeroScene />
        </Canvas>
      </div>
    </section>
  );
}