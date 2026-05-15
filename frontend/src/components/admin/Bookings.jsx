import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function Bookings() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/bookings')
      .then(res => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b => {
    // b.status is lowercased (e.g. 'pending', 'in_progress', 'completed')
    // We map statusFilter (e.g. 'Pending', 'In Progress') to match it
    let filterStatus = statusFilter.toLowerCase().replace(' ', '_');
    const matchStatus = statusFilter === 'All' || b.status === filterStatus;
    
    const serviceName = b.category?.name || '';
    const matchService = serviceFilter === 'All' || serviceName.toLowerCase().includes(serviceFilter.toLowerCase());
    
    return matchStatus && matchService;
  });

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bookings</h1>
          <p className="text-slate-500 font-medium mt-1">View all jobs and their financial status.</p>
        </div>
        <button 
          onClick={() => alert('Export coming soon.')}
          className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="flex gap-4 flex-1">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-4 py-2 outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Disputed">Disputed</option>
            </select>
            <select 
              value={serviceFilter} 
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-4 py-2 outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="All">All Services</option>
              <option value="Repair">Repair</option>
              <option value="Cleaning">Cleaning</option>
            </select>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 border border-slate-200 bg-white rounded-lg px-3 shadow-sm">
              <input type="date" className="outline-none py-2 text-slate-700" />
              <span>to</span>
              <input type="date" className="outline-none py-2 text-slate-700" />
            </div>
          </div>
          <span className="text-sm font-bold text-slate-500">{filtered.length} results</span>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 shadow-sm z-10">
              <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-200">ID & Date</th>
                <th className="p-4 border-b border-slate-200">Service</th>
                <th className="p-4 border-b border-slate-200">Customer</th>
                <th className="p-4 border-b border-slate-200">Worker</th>
                <th className="p-4 border-b border-slate-200">Status</th>
                <th className="p-4 border-b border-slate-200 text-right">Escrow</th>
                <th className="p-4 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">No bookings found</td></tr>
              ) : filtered.map(b => {
                let displayStatus = b.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                let escrowStatus = 'Locked';
                if (b.status === 'completed' || b.status === 'resolved') escrowStatus = 'Released';
                if (b.status === 'cancelled') escrowStatus = 'Refunded';

                return (
                <tr 
                  key={b.id} 
                  onClick={() => navigate(`/admin/bookings/${b.id}`)}
                  className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 cursor-pointer group"
                >
                  <td className="p-4">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600">{b.id.substring(0, 8)}...</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{b.category?.name || '—'}</td>
                  <td className="p-4 font-medium text-slate-700">{b.user?.name || b.user?.phone || '—'}</td>
                  <td className="p-4 font-medium text-slate-700">{b.worker?.name || b.worker?.phone || 'Unassigned'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      displayStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                      displayStatus === 'Disputed' ? 'bg-red-100 text-red-700' :
                      displayStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {displayStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-black text-slate-900">₹{b.basePrice}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${escrowStatus === 'Released' ? 'text-green-600' : escrowStatus === 'Locked' ? 'text-amber-600' : 'text-slate-500'}`}>
                      {escrowStatus}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 font-bold text-sm hover:underline">View</button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
