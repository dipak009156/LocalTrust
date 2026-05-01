import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setRole } from '../../store/authSlice';
import { useWorker } from '../../context/WorkerContext';
import { 
  Settings, 
  Camera, 
  Star, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  Award,
  Briefcase
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workerInfo } = useWorker();
  
  const [name, setName] = useState(workerInfo.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [radius, setRadius] = useState(5);
  const [city, setCity] = useState('Mumbai');
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(workerInfo.avatar);

  const handleLogout = () => {
    dispatch(setRole(null));
    navigate('/login');
  };

  const handleSave = () => {
    // TODO: PATCH /workers/profile
    alert('Profile updated');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20 lg:pb-0">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Worker Profile</h1>
        <button onClick={() => navigate('/worker/settings')} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100 transition-colors">
          <Settings size={20} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 flex flex-col gap-8 overflow-y-auto hide-scroll">
        <div className="flex flex-col items-center">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
          <div className="relative mb-6 cursor-pointer group" onClick={() => fileInputRef.current.click()}>
            <img src={avatarPreview} alt="Worker" className="w-28 h-28 rounded-[40px] border-4 border-white shadow-xl object-cover group-hover:scale-105 transition-transform" />
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-700 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
              <Camera size={18} />
            </button>
          </div>
          
          {isEditingName ? (
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              onBlur={() => setIsEditingName(false)}
              autoFocus
              className="text-2xl font-black text-center border-b-2 border-blue-700 outline-none bg-transparent w-64 mb-1"
            />
          ) : (
            <h2 onClick={() => setIsEditingName(true)} className="text-2xl font-black text-gray-900 cursor-text hover:text-blue-700 tracking-tight">{name}</h2>
          )}
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{workerInfo.role}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center gap-2 group hover:border-blue-200 transition-all">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star size={20} fill="currentColor" />
            </div>
            <div className="text-center">
              <span className="text-lg font-black text-gray-900 block leading-none">{workerInfo.rating}</span>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rating</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center gap-2 group hover:border-blue-200 transition-all">
            <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase size={20} />
            </div>
            <div className="text-center">
              <span className="text-lg font-black text-gray-900 block leading-none">{workerInfo.jobs}</span>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Jobs</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center gap-2 group hover:border-blue-200 transition-all">
            <div className="w-10 h-10 bg-green-50 text-green-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
            <div className="text-center">
              <span className="text-lg font-black text-gray-900 block leading-none">1 Yr</span>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Joined</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Primary City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[20px] p-4 pl-12 text-sm font-black text-gray-900 outline-none focus:border-blue-700 focus:bg-white transition-all appearance-none"
                >
                  <option value="Mumbai">Mumbai, MH</option>
                  <option value="Delhi">Delhi, NCR</option>
                  <option value="Bangalore">Bangalore, KA</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Service Radius</label>
                <span className="text-sm font-black text-blue-700">{radius} km</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Verification Badges</label>
            <div className="flex flex-wrap gap-3">
              <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm shadow-green-50">
                <ShieldCheck size={16} />
                Aadhaar Verified
              </div>
              <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm shadow-blue-50">
                <Award size={16} />
                Expert Skill Badge
              </div>
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm shadow-indigo-50">
                <CheckCircle2 size={16} />
                Background Checked
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button onClick={handleSave} className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
            Save Profile Changes
          </button>

          <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
            <LogOut size={18} />
            Logout Account
          </button>
        </div>
      </div>
    </div>
  );
}
