import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setRole } from '../../store/authSlice';

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [toggles, setToggles] = useState({
    jobRequests: true,
    reminders: true,
    disputes: true,
    payouts: false,
    autoOnline: true
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    // TODO: PATCH /workers/settings
  };

  const handleLogout = () => {
    dispatch(setRole(null));
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Settings</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
        
        <div>
          <h2 className="text-sm font-extrabold text-gray-900 mb-3 ml-1">Notifications</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {[
              { id: 'jobRequests', label: 'New Job Requests', desc: 'Get alerted for new leads' },
              { id: 'reminders', label: 'Job Reminders', desc: 'Alerts for upcoming bookings' },
              { id: 'disputes', label: 'Dispute Alerts', desc: 'Crucial alerts regarding claims' },
              { id: 'payouts', label: 'Payout Updates', desc: 'When money hits your bank' },
            ].map((item, idx) => (
              <div key={item.id} className={`p-5 flex justify-between items-center ${idx !== 3 ? 'border-b border-gray-100' : ''}`}>
                <div>
                  <p className="font-bold text-gray-900">{item.label}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <button 
                  onClick={() => handleToggle(item.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles[item.id] ? 'bg-blue-700' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles[item.id] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-gray-900 mb-3 ml-1">App Preferences</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-5 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-900">Default Availability</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">Go online automatically on app open</p>
            </div>
            <button 
              onClick={() => handleToggle('autoOnline')}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles.autoOnline ? 'bg-blue-700' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles.autoOnline ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full bg-white text-red-600 font-bold py-4 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors mt-4">
          Log Out
        </button>

        <p className="text-center text-xs font-bold text-gray-400 mt-4">App Version 1.0.0</p>
      </div>
    </div>
  );
}
