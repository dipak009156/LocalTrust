import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setRole } from '../../store/authSlice';
import { X, Pencil, ClipboardList, Heart, MapPin, CreditCard, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import Api from '../../utils/api';
import { getAuth, signOut } from 'firebase/auth';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch current user profile data
    // Why: To display personal information like name, phone, and saved settings
    const fetchProfile = async () => {
      try {
        const res = await Api.get('/auth/me');
        setProfile(res.data.user?.data || null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    // 2. Log out the user
    // Why: To clear the session securely from both Firebase and Local State
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(setRole(null));
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if Firebase fails, we clear local state to prevent UI lock
      dispatch(setRole(null));
      navigate('/');
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Profile...</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20 lg:pb-0">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profile</h1>
        <button onClick={() => navigate('/customer/home')} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full p-6 flex flex-col gap-8 overflow-y-auto">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-white mb-4 overflow-hidden">
              {profile?.name ? profile.name.charAt(0) : 'U'}
            </div>
            <button className="absolute bottom-2 right-0 w-9 h-9 bg-white rounded-full border border-gray-200 shadow-md flex items-center justify-center text-blue-700 hover:scale-110 transition-transform">
              <Pencil size={16} />
            </button>
          </div>
          <h2 className="text-2xl font-black text-gray-900">{profile?.name || 'New User'}</h2>
          <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest">{profile?.phone || 'No Phone linked'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/customer/bookings')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardList size={24} />
            </div>
            <span className="text-sm font-black text-gray-900 uppercase tracking-wide">My Bookings</span>
          </button>
          <button onClick={() => navigate('/customer/favourites')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:border-red-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart size={24} />
            </div>
            <span className="text-sm font-black text-gray-900 uppercase tracking-wide">Favourites</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {[
            { label: 'Location', value: profile?.city || 'Select City', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Payment Methods', value: 'UPI, Cards', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Help & Support', value: 'FAQs, Contact Us', icon: HelpCircle, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors ${idx !== 2 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{item.value}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            );
          })}
        </div>

        <button onClick={handleLogout} className="mt-4 w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-sm shadow-red-100">
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}
