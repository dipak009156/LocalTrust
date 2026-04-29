import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRole } from '../../store/authSlice';
import BottomNav from './BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setRole(null));
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
        <button onClick={() => navigate('/customer/home')} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-extrabold text-blue-700 mb-3 relative">
            P
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-900 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Priya Sharma</h2>
          <p className="text-sm font-bold text-gray-500">+91 98765 43210</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/customer/bookings')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
            <span className="text-2xl">📋</span>
            <span className="text-sm font-extrabold text-gray-900">My Bookings</span>
          </button>
          <button onClick={() => navigate('/customer/favourites')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
            <span className="text-2xl">❤️</span>
            <span className="text-sm font-extrabold text-gray-900">Favourites</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm font-bold text-gray-900">Andheri West, Mumbai</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Methods</p>
              <p className="text-sm font-bold text-gray-900">UPI, Cards</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Help & Support</p>
              <p className="text-sm font-bold text-gray-900">FAQs, Contact Us</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

        <button onClick={handleLogout} className="mt-4 w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
