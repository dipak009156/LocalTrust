import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setRole } from '../../store/authSlice';
import BottomNav from './BottomNav';
import { useWorker } from '../../context/WorkerContext';

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
    <div className="flex flex-col h-full bg-gray-50 relative pb-20">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
        <button onClick={() => navigate('/worker/settings')} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 border border-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col items-center">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
          <div className="relative mb-3 cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <img src={avatarPreview} alt="Worker" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-700 rounded-full border-2 border-white flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          
          {isEditingName ? (
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              onBlur={() => setIsEditingName(false)}
              autoFocus
              className="text-xl font-extrabold text-center border-b-2 border-blue-700 outline-none bg-transparent w-48 mb-1"
            />
          ) : (
            <h2 onClick={() => setIsEditingName(true)} className="text-xl font-extrabold text-gray-900 cursor-text hover:text-blue-700">{name} ✎</h2>
          )}
          <p className="text-sm font-bold text-gray-500">{workerInfo.role}</p>
        </div>

        <div className="flex gap-4 mb-2">
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-xl font-black text-gray-900 flex items-center gap-1">{workerInfo.rating} <svg className="w-4 h-4 text-orange-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Avg Rating</span>
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-xl font-black text-gray-900">{workerInfo.jobs}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Total Jobs</span>
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-xl font-black text-gray-900">1 Yr</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Member Since</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
          <div>
            <label className="text-sm font-extrabold text-gray-900 mb-2 block">City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:border-blue-700">
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-extrabold text-gray-900">Service Radius</label>
              <span className="text-sm font-bold text-blue-700">{radius} km</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={radius} 
              onChange={(e) => setRadius(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
            />
          </div>

          <div>
            <label className="text-sm font-extrabold text-gray-900 mb-2 block">Skill Badges</label>
            <div className="flex gap-2">
              <div className="bg-green-50 border border-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Aadhaar Verified
              </div>
              <div className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Skill Tested
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Save Changes
        </button>

        <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 mt-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
