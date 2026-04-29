import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { activeDisputes, pendingVerifications } = useAdmin();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { to: '/admin/customers', label: 'Customers', icon: '👥' },
    { to: '/admin/workers', label: 'Service Providers', icon: '🔧' },
    { to: '/admin/verifications', label: 'Verifications', icon: '🛡️', badge: pendingVerifications },
    { to: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { to: '/admin/disputes', label: 'Disputes', icon: '⚠️', badge: activeDisputes },
    { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">TW</div>
        <h1 className="text-xl font-extrabold tracking-tight">TrustWork Admin</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = link.exact ? path === link.to : path.startsWith(link.to);
          return (
            <Link 
              key={link.to} 
              to={link.to}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-semibold text-sm ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </div>
              {link.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white text-indigo-700' : 'bg-slate-700 text-white'}`}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">A</div>
          <div>
            <p className="text-sm font-bold text-white">Super Admin</p>
            <p className="text-xs text-slate-400 font-medium">admin@trustwork.in</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
