import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../../utils/mockData';
import { useAdmin } from '../../context/AdminContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { setPendingVerifications } = useAdmin();
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // TODO: GET /admin/dashboard

  const filteredBookings = statusFilter === 'All' 
    ? mockData.bookings 
    : mockData.bookings.filter(b => b.status === statusFilter);

  const handleApprove = () => {
    // TODO: PATCH /admin/workers/:id/verify
    setPendingVerifications(prev => prev - 1);
    setSelectedWorker(null);
  };

  const handleReject = () => {
    // TODO: PATCH /admin/workers/:id/reject
    setPendingVerifications(prev => prev - 1);
    setSelectedWorker(null);
    setRejectReason('');
  };

  return (
    <div className="flex flex-col gap-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor platform activity and pending actions.</p>
        </div>
        <div className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
          Last updated: Just now
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-2">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Pending Verifications</p>
          <p className="text-4xl font-black text-slate-900">{mockData.metrics.pendingVerifications}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full z-0"></div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide relative z-10">Active Disputes</p>
          <p className="text-4xl font-black text-red-600 relative z-10">{mockData.metrics.activeDisputes}</p>
        </div>
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-md border border-indigo-500 flex flex-col gap-2 text-white">
          <p className="text-sm font-bold text-indigo-200 uppercase tracking-wide">Total Escrow Held</p>
          <p className="text-4xl font-black">₹{mockData.metrics.totalEscrow.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-2">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Completed Bookings</p>
          <p className="text-4xl font-black text-slate-900">{mockData.metrics.completedBookings.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Pending Verifications Panel */}
        <div className="col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-extrabold text-slate-900 text-lg">Pending Verifications</h2>
            <button onClick={() => navigate('/admin/verifications')} className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {mockData.verifications.map(v => (
              <div key={v.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">{v.name}</p>
                  <p className="text-xs font-semibold text-slate-500">{v.skill} • {v.city}</p>
                </div>
                <button 
                  onClick={() => setSelectedWorker(v)}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Bookings Table */}
        <div className="col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-extrabold text-slate-900 text-lg">Live Bookings</h2>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-3 py-1.5 outline-none focus:border-indigo-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Disputed">Disputed</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-slate-100">Booking ID</th>
                  <th className="p-4 border-b border-slate-100">Service</th>
                  <th className="p-4 border-b border-slate-100">Customer</th>
                  <th className="p-4 border-b border-slate-100">Status</th>
                  <th className="p-4 border-b border-slate-100 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b, i) => (
                  <tr 
                    key={b.id} 
                    onClick={() => navigate(`/admin/bookings/${b.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="p-4 border-b border-slate-50 font-bold text-slate-900 group-hover:text-indigo-600">{b.id}</td>
                    <td className="p-4 border-b border-slate-50 font-medium text-slate-700">{b.service}</td>
                    <td className="p-4 border-b border-slate-50 font-medium text-slate-700">{b.customer}</td>
                    <td className="p-4 border-b border-slate-50">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                        b.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        b.status === 'Disputed' ? 'bg-red-100 text-red-700' :
                        b.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-slate-50 font-extrabold text-slate-900 text-right">₹{b.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer for Worker Review */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedWorker(null)}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-extrabold text-slate-900">Review Application</h2>
              <button onClick={() => setSelectedWorker(null)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xl font-bold">
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedWorker.name}</h3>
                  <p className="text-sm font-semibold text-slate-500">{selectedWorker.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">City</p>
                  <p className="font-bold text-slate-900 mt-1">{selectedWorker.city}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Skill</p>
                  <p className="font-bold text-slate-900 mt-1">{selectedWorker.skill}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm">Documents Uploaded</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 h-32 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">Aadhaar Front</div>
                  <div className="bg-slate-100 h-32 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">Aadhaar Back</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm">Skill Test Score</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${selectedWorker.score}%` }}></div>
                  </div>
                  <span className="font-black text-slate-900">{selectedWorker.score}%</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-900 mb-2 block">Rejection Reason (if rejecting)</label>
                <input 
                  type="text" 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Blurry documents..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
              <button 
                onClick={handleReject} 
                className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
              <button 
                onClick={handleApprove} 
                className="flex-[2] bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
              >
                Approve Worker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
