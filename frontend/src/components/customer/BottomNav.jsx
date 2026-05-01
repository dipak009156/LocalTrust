import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-3 px-6 z-50">
      <Link to="/customer/home" className={`flex flex-col items-center gap-1 ${path.includes('/home') ? 'text-blue-700' : 'text-gray-400'}`}>
        <Home size={22} strokeWidth={path.includes('/home') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      <Link to="/customer/bookings" className={`flex flex-col items-center gap-1 ${path.includes('/bookings') ? 'text-blue-700' : 'text-gray-400'}`}>
        <ClipboardList size={22} strokeWidth={path.includes('/bookings') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Bookings</span>
      </Link>
      <Link to="/customer/profile" className={`flex flex-col items-center gap-1 ${path.includes('/profile') ? 'text-blue-700' : 'text-gray-400'}`}>
        <User size={22} strokeWidth={path.includes('/profile') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Profile</span>
      </Link>
    </div>
  );
}
