import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { clearToken } from '../../firebase/auth';
import { X, Pencil, ClipboardList, Heart, HelpCircle, LogOut, ChevronRight, Check } from 'lucide-react';
import api from '../../utils/api';
import BottomNav from './BottomNav';

export default function Profile() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const auth      = useSelector(s => s.auth);

  const [profile, setProfile]   = useState(null);
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState('');
  const [city, setCity]         = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    api.get('/user/profile')
      .then(r => {
        setProfile(r.data);
        setName(r.data.name ?? '');
        setCity(r.data.city ?? '');
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/user/profile', { name, city });
      setProfile(prev => ({ ...prev, name, city }));
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    clearToken();
    dispatch(logout());
    navigate('/');
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : auth.phone?.slice(-2) ?? 'U';

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 lg:pb-0">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profile</h1>
      </div>

      <div className="max-w-2xl mx-auto w-full p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Avatar + name */}
        <div className="flex flex-col items-center pt-4">
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-white">
              {initials}
            </div>
          </div>

          {editing ? (
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-700"
              />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Your city"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-700"
              />
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Check size={14} />
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-gray-900">{profile?.name || 'Set your name'}</h2>
              <p className="text-sm font-bold text-gray-400 mt-1">{profile?.phone ? `+91 ${profile.phone}` : auth.phone}</p>
              {profile?.city && <p className="text-xs text-gray-400 mt-0.5">{profile.city}</p>}
              <button onClick={() => setEditing(true)} className="mt-3 flex items-center gap-2 text-blue-700 text-sm font-bold hover:underline">
                <Pencil size={14} />
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        {profile && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Bookings', value: profile._count?.bookings ?? 0 },
              { label: 'Reviews',  value: profile._count?.reviews  ?? 0 },
              { label: 'Saved',    value: profile._count?.favourites ?? 0 },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Menu */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {[
            { label: 'My Bookings',  sub: 'View all bookings',  icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', to: '/customer/bookings' },
            { label: 'Favourites',   sub: 'Your saved workers', icon: Heart,         color: 'text-red-600',  bg: 'bg-red-50',  to: '/customer/favourites' },
            { label: 'Help',         sub: 'FAQs & Contact',     icon: HelpCircle,    color: 'text-green-600',bg: 'bg-green-50',to: null },
          ].map((item, idx, arr) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => item.to && navigate(item.to)}
                className={`w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors ${idx < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400 font-medium">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}
