import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import { AdminProvider } from '../context/AdminContext';

export default function AdminLayout() {
  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <Header />
          <main className="flex-1 p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
