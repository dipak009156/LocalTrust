import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { clearToken } from '../../firebase/auth';
import {
  Settings, Star, CheckCircle2, Calendar,
  MapPin, LogOut, ShieldCheck, Award, Briefcase, Pencil
} from 'lucide-react';
import api from '../../utils/api';

export default function WorkerProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth     = useSelector(s => s.auth);

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState('');
  const [city, setCity]         = useState('');
  const [radius, setRadius]     = useState(10);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    api.get('/worker/profile')
      .then(r => {
        setProfile(r.data);
        setName(r.data.name ?? '');
        setCity(r.data.city ?? '');
        setRadius(r.data.serviceRadius ?? 10);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/worker/profile', { name, city, serviceRadius: radius });
      setProfile(prev => ({ ...prev, ...data.worker }));
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

  const joinedYear = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : '—';

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20 lg:pb-0">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Profile</h1>
        <button onClick={() => navigate('/worker/settings')} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 border border-gray-100">
          <Settings size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full p-6 flex flex-col gap-6 overflow-y-auto">

          {/* Avatar + name */}
          <div className="flex flex-col items-center pt-2">
            <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-blue-600 to-indigo-600 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-white mb-4">
              {profile?.name?.[0]?.toUpperCase() ?? 'W'}
            </div>

            {editing ? (
              <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-700"
                />
                <input
                  type="text" value={city} onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-700"
                />
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Service Radius</label>
                    <span className="text-sm font-black text-blue-700">{radius} km</span>
                  </div>
                  <input type="range" min="1" max="30" value={radius} onChange={e => setRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-700" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-900">{profile?.name || 'Set your name'}</h2>
                <p className="text-sm text-gray-400 font-bold mt-1">{profile?.phone ? `+91 ${profile.phone}` : auth.phone}</p>
                {profile?.city && <p className="text-xs text-gray-400 mt-0.5">{profile.city} • {radius} km radius</p>}
                <button onClick={() => setEditing(true)} className="mt-3 flex items-center gap-2 text-blue-700 text-sm font-bold">
                  <Pencil size={14} /> Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Rating', value: profile?.avgRating?.toFixed(1) ?? '0.0', icon: Star,     bg: 'bg-orange-50', color: 'text-orange-500' },
              { label: 'Jobs',   value: profile?.totalJobs ?? 0,                 icon: Briefcase, bg: 'bg-blue-50',   color: 'text-blue-700' },
              { label: 'Joined', value: joinedYear,                              icon: Calendar,  bg: 'bg-green-50',  color: 'text-green-700' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} fill={s.label === 'Rating' ? 'currentColor' : 'none'} />
                  </div>
                  <span className="text-lg font-black text-gray-900">{s.value}</span>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Verification badges */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Verification Status</p>
            <div className="flex flex-wrap gap-3">
              {profile?.aadhaarVerified ? (
                <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2">
                  <ShieldCheck size={14} /> Aadhaar Verified
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/worker/kyc')}
                  className="bg-amber-600 text-white px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-100"
                >
                  <ShieldCheck size={14} /> Complete KYC
                </button>
              )}
              {profile?.policeVerified && (
                <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2">
                  <Award size={14} /> Police Verified
                </div>
              )}
              {profile?.skills?.length > 0 ? (
                <button 
                  onClick={() => navigate('/worker/skills')}
                  className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2"
                >
                  <CheckCircle2 size={14} /> {profile.skills.length} Skill{profile.skills.length > 1 ? 's' : ''}
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/worker/skills')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                  <Briefcase size={14} /> Add Skills
                </button>
              )}
            </div>
          </div>

          {/* Home location */}
          {(profile?.homeLat || profile?.homeAddress) && (
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Home Base</p>
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <MapPin size={16} className="text-blue-600 shrink-0" />
                <span className="leading-relaxed line-clamp-2">{profile.city ?? `${profile.homeLat?.toFixed(4)}, ${profile.homeLng?.toFixed(4)}`}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
