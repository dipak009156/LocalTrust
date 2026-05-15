import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const STATUS_COLOR = {
  pending:     'bg-amber-100 text-amber-700',
  accepted:    'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed:   'bg-gray-100 text-gray-600',
  confirmed:   'bg-green-100 text-green-700',
  cancelled:   'bg-gray-100 text-gray-400',
  disputed:    'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats]         = useState(null);
  const [bookings, setBookings]   = useState([]);
  const [pendingKyc, setPendingKyc] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading]     = useState(true);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [rejectReason, setRejectReason]     = useState('');
  const [approving, setApproving]           = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/bookings'),
      api.get('/admin/workers?status=pending_kyc'),
    ])
      .then(([s, b, w]) => {
        setStats(s.data);
        setBookings(b.data);
        setPendingKyc(w.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = statusFilter
    ? bookings.filter(b => b.status === statusFilter)
    : bookings;

  const handleApprove = async (workerId) => {
    setApproving(true);
    try {
      await api.patch(`/admin/workers/${workerId}/verify`);
      setPendingKyc(prev => prev.filter(w => w.id !== workerId));
      setStats(prev => ({ ...prev, pendingKyc: (prev.pendingKyc ?? 1) - 1 }));
      setSelectedWorker(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (workerId) => {
    try {
      await api.patch(`/admin/workers/${workerId}/reject`, { reason: rejectReason });
      setPendingKyc(prev => prev.filter(w => w.id !== workerId));
      setStats(prev => ({ ...prev, pendingKyc: (prev.pendingKyc ?? 1) - 1 }));
      setSelectedWorker(null);
      setRejectReason('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

  return (
    <div className="flex flex-col gap-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor platform activity and pending actions.</p>
        </div>
        <div className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
          Live
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending KYC',    value: stats?.pendingKyc,          color: 'text-amber-600' },
          { label: 'Active Disputes',value: stats?.activeDisputes,       color: 'text-red-600' },
          { label: 'Total Escrow',   value: `₹${(stats?.totalEscrow ?? 0).toLocaleString('en-IN')}`, color: 'text-indigo-700' },
          { label: 'Confirmed Jobs', value: stats?.completedBookings,    color: 'text-green-700' },
        ].map(m => (
          <div key={m.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{m.label}</p>
            <p className={`text-4xl font-black ${m.color}`}>{loading ? '—' : m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Pending KYC panel */}
        <div className="col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-extrabold text-slate-900 text-lg">Pending KYC</h2>
            <button onClick={() => navigate('/admin/verifications')} className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-80">
            {loading && <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />}
            {!loading && pendingKyc.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">No pending verifications ✅</p>
            )}
            {pendingKyc.map(w => (
              <div key={w.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">{w.name}</p>
                  <p className="text-xs font-semibold text-slate-500">{w.skills?.[0]?.category?.name ?? '—'} · {w.city ?? '—'}</p>
                </div>
                <button
                  onClick={() => setSelectedWorker(w)}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Bookings Table */}
        <div className="col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-extrabold text-slate-900 text-lg">Live Bookings</h2>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-3 py-1.5 outline-none focus:border-indigo-600">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="confirmed">Confirmed</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-slate-100">ID</th>
                  <th className="p-4 border-b border-slate-100">Service</th>
                  <th className="p-4 border-b border-slate-100">Customer</th>
                  <th className="p-4 border-b border-slate-100">Status</th>
                  <th className="p-4 border-b border-slate-100 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading…</td></tr>
                )}
                {!loading && filteredBookings.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">No bookings found</td></tr>
                )}
                {filteredBookings.map(b => (
                  <tr key={b.id} onClick={() => navigate(`/admin/bookings/${b.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group">
                    <td className="p-4 border-b border-slate-50 font-bold text-slate-900 group-hover:text-indigo-600 text-xs font-mono">{b.id.slice(0, 8)}…</td>
                    <td className="p-4 border-b border-slate-50 font-medium text-slate-700">{b.category?.name}</td>
                    <td className="p-4 border-b border-slate-50 font-medium text-slate-700">{b.user?.name ?? b.user?.phone}</td>
                    <td className="p-4 border-b border-slate-50">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${STATUS_COLOR[b.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-slate-50 font-extrabold text-slate-900 text-right">₹{b.basePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Worker Review Drawer */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedWorker(null)} />
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-extrabold text-slate-900">Review KYC</h2>
              <button onClick={() => setSelectedWorker(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xl font-bold">
                  {selectedWorker.name?.[0] ?? 'W'}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedWorker.name}</h3>
                  <p className="text-sm font-semibold text-slate-500">{selectedWorker.phone}</p>
                </div>
              </div>

              {/* Aadhaar documents */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm">Uploaded Documents</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedWorker.aadhaarFront ? (
                    <a href={selectedWorker.aadhaarFront} target="_blank" rel="noreferrer">
                      <img src={selectedWorker.aadhaarFront} alt="Aadhaar Front"
                        className="h-32 w-full object-cover rounded-xl border border-slate-200 hover:opacity-80" />
                    </a>
                  ) : (
                    <div className="bg-slate-100 h-32 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">Front — Not Uploaded</div>
                  )}
                  {selectedWorker.aadhaarBack ? (
                    <a href={selectedWorker.aadhaarBack} target="_blank" rel="noreferrer">
                      <img src={selectedWorker.aadhaarBack} alt="Aadhaar Back"
                        className="h-32 w-full object-cover rounded-xl border border-slate-200 hover:opacity-80" />
                    </a>
                  ) : (
                    <div className="bg-slate-100 h-32 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">Back — Not Uploaded</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Rejection Reason (optional)</label>
                <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g., Blurry documents"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-indigo-600" />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
              <button onClick={() => handleReject(selectedWorker.id)}
                className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 text-sm">
                Reject
              </button>
              <button onClick={() => handleApprove(selectedWorker.id)} disabled={approving}
                className="flex-[2] bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-700 text-sm disabled:opacity-50">
                {approving ? 'Approving…' : 'Approve Worker ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
