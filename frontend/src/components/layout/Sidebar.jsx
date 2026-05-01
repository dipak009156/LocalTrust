import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User, Shield, Star, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ role = 'customer' }) {
  const location = useLocation();
  const path = location.pathname;

  const customerLinks = [
    { name: 'Home', icon: Home, path: '/customer/home' },
    { name: 'Bookings', icon: ClipboardList, path: '/customer/bookings' },
    { name: 'Favourites', icon: Star, path: '/customer/favourites' },
    { name: 'Profile', icon: User, path: '/customer/profile' },
  ];

  const workerLinks = [
    { name: 'Dashboard', icon: Home, path: '/worker/dashboard' },
    { name: 'Job History', icon: ClipboardList, path: '/worker/job-history' },
    { name: 'Earnings', icon: Shield, path: '/worker/earnings' },
    { name: 'Profile', icon: User, path: '/worker/profile' },
    { name: 'Settings', icon: Settings, path: '/worker/settings' },
  ];

  const links = role === 'worker' ? workerLinks : customerLinks;

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="text-xl font-black text-gray-900 tracking-tight">LocalTrust</span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = path.includes(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 font-bold hover:text-red-600 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
