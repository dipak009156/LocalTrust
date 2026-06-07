import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, ShieldCheck } from 'lucide-react';
import { securePost } from '../../utils/securePost';
import { useSelector } from 'react-redux';
import StepUpAuthModal from '../ui/StepUpAuthModal';

export default function BookingConfirm() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Passed from Category.jsx via Link state
  const {
    categoryId,
    categoryName = 'Service',
    price        = 0,
  } = location.state ?? {};

  const [address, setAddress]   = useState('');
  const [lat, setLat]           = useState(null);
  const [lng, setLng]           = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [note, setNote]         = useState('');
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [stepUp, setStepUp]     = useState(false);

  const phone = useSelector(s => s.auth.phone) || '';

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(latitude);
          setLng(longitude);
          try {
            const res  = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } },
            );
            const data = await res.json();
            setAddress(data.display_name ?? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } catch {
            setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } finally {
            setLocating(false);
          }
        },
        (err) => {
          setLocating(false);
          if (err.code === 1) {
            setGeoError('Location access denied. Tap \'Edit\' to pick your address on the map.');
          } else {
            setGeoError('Could not detect location. Tap \'Edit\' to set your address.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      setGeoError('Location not supported. Tap \'Edit\' to enter your address.');
    }
  }, []);

  // Receive address from AddressPicker navigation
  useEffect(() => {
    if (location.state?.address) setAddress(location.state.address);
    if (location.state?.lat)     setLat(location.state.lat);
    if (location.state?.lng)     setLng(location.state.lng);
  }, [location.state]);

  const handleConfirm = async () => {
    if (!categoryId) { setError('No service selected. Go back and try again.'); return; }
    if (!address)    { setError('Please provide a service address.'); return; }

    setLoading(true);
    setError('');

    try {
      const result = await securePost('/booking', {
        categoryId,
        address,
        lat:         lat   ?? null,
        lng:         lng   ?? null,
        problemDesc: note  || null,
      });

      // Sentinel verdict handling
      if (result.sentinelVerdict === 'STEP_UP_AUTH') {
        setStepUp(true);
        return;
      }
      if (result.sentinelVerdict === 'BLOCK') {
        setError('This action was blocked due to unusual activity. Please try again later.');
        return;
      }
      if (result.sentinelVerdict === 'TERMINATE_SESSION') {
        localStorage.removeItem('lt_token');
        window.location.href = '/';
        return;
      }

      // Normal success — navigate to Waiting screen
      navigate('/customer/waiting', { state: { bookingId: result.id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Sentinel step-up OTP modal */}
      {stepUp && (
        <StepUpAuthModal
          phone={phone}
          onVerified={() => { setStepUp(false); handleConfirm(); }}
          onDismiss={() => setStepUp(false)}
        />
      )}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Confirm Booking</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32 max-w-2xl mx-auto w-full">
        <div className="text-center py-4">
          <h2 className="text-3xl font-extrabold text-gray-900">{categoryName}</h2>
          <p className="text-blue-700 font-bold text-2xl mt-1">₹{price}</p>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Service Address</h3>
            <button
              onClick={() => navigate('/customer/address-picker', {
                state: { returnTo: '/customer/book', categoryId, categoryName, price },
              })}
              className="text-blue-700 text-sm font-bold hover:underline"
            >
              Edit
            </button>
          </div>
          {locating ? (
            <div className="flex gap-4 items-start bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl shrink-0 flex items-center justify-center">
                <svg className="animate-spin w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              </div>
              <p className="text-sm font-semibold text-blue-700 leading-relaxed pt-1">Detecting your location…</p>
            </div>
          ) : address ? (
            <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl shrink-0 flex items-center justify-center text-blue-700">
                <MapPin size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-relaxed">{address}</p>
            </div>
          ) : geoError ? (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm font-semibold text-amber-800">
              ⚠️ {geoError}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 text-sm">
              Tap 'Edit' to set your address
            </div>
          )}
        </div>

        {/* Optional note */}
        <div>
          <label className="text-sm font-bold text-gray-900 mb-2 block">Problem Description (optional)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 resize-none"
            placeholder="Describe the problem e.g. 'kitchen tap leaking badly'"
          />
        </div>

        {/* Bill */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between text-sm font-bold text-gray-600">
            <span>Service fee</span>
            <span>₹{price}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-600">
            <span>Platform fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="h-px w-full bg-gray-100 my-1" />
          <div className="flex justify-between text-xl font-black text-gray-900">
            <span>Total to pay</span>
            <span className="text-blue-700">₹{price}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 text-sm font-bold text-blue-900">
          <ShieldCheck size={24} className="shrink-0 text-blue-700" />
          <p className="leading-relaxed">Payment is held safely in escrow. Worker gets paid only after job completion.</p>
        </div>

        {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto w-full">
          <button
            onClick={handleConfirm}
            disabled={loading || !address}
            className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-2
              ${loading || !address
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Booking…
              </>
            ) : `Confirm Booking — ₹${price}`}
          </button>
        </div>
      </div>
    </div>
  );
}
