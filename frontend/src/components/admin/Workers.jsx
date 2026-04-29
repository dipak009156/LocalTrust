import { useState } from 'react';
import { mockData } from '../../utils/mockData';

export default function Workers() {
  const [skillFilter, setSkillFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // TODO: GET /admin/workers

  const filtered = mockData.workers.filter(w => {
    const matchSkill = skillFilter === 'All' || w.skill === skillFilter;
    const matchStatus = statusFilter === 'All' || w.status === statusFilter;
    return matchSkill && matchStatus;
  });

  const handleToggleSuspend = () => {
    if (selectedWorker.status !== 'Suspended') {
      setShowSuspendModal(true);
    } else {
      // TODO: PATCH /admin/workers/:id/unsuspend
      alert('Worker unsuspended.');
      setSelectedWorker({ ...selectedWorker, status: 'Verified' });
    }
  };

  const handleConfirmSuspend = () => {
    // TODO: PATCH /admin/workers/:id/suspend
    alert('Worker suspended.');
    setShowSuspendModal(false);
    setSelectedWorker({ ...selectedWorker, status: 'Suspended' });
  };

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Service Providers</h1>
          <p className="text-slate-500 font-medium mt-1">Manage workers, view their performance, and handle suspensions.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="flex gap-4 flex-1">
            <select 
              value={skillFilter} 
              onChange={(e) => setSkillFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-4 py-2 outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="All">All Skills</option>
              <option value="Plumber">Plumbing</option>
              <option value="Electrician">Electrical</option>
              <option value="AC Repair">AC Repair</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-4 py-2 outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <span className="text-sm font-bold text-slate-500">{filtered.length} total workers</span>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 shadow-sm z-10">
              <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-200">Name</th>
                <th className="p-4 border-b border-slate-200">Phone & City</th>
                <th className="p-4 border-b border-slate-200">Skill</th>
                <th className="p-4 border-b border-slate-200">Rating & Jobs</th>
                <th className="p-4 border-b border-slate-200">Verification</th>
                <th className="p-4 border-b border-slate-200">Availability</th>
                <th className="p-4 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <td className="p-4 font-bold text-slate-900">{w.name}</td>
                  <td className="p-4 font-medium text-slate-700">
                    {w.phone}<br/>
                    <span className="text-xs text-slate-500">{w.city}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{w.skill}</td>
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-1">
                    <span className="text-amber-500">★</span> {w.rating} <span className="text-slate-400 font-medium text-xs ml-1">({w.jobs} jobs)</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${w.status === 'Verified' ? 'bg-green-100 text-green-700' : w.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${w.availability === 'Online' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span className="text-xs font-bold text-slate-700">{w.availability}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedWorker(w)}
                      className="text-indigo-600 font-bold text-sm hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedWorker(null)}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-extrabold text-slate-900">Worker Profile</h2>
              <button onClick={() => setSelectedWorker(null)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-xl font-bold">
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedWorker.name}</h3>
                  <p className="text-sm font-semibold text-slate-500">{selectedWorker.skill} • {selectedWorker.city}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-900 flex items-center gap-1">★ {selectedWorker.rating}</span>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Rating</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
                  <p className="text-lg font-black text-slate-900">{selectedWorker.jobs}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Jobs</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
                  <p className="text-lg font-black text-slate-900">₹45k</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Earned</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm">Verification Details</h4>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">Aadhaar KYC</span>
                    <span className="font-bold text-green-600 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Verified</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">Skill Test Score</span>
                    <span className="font-bold text-slate-900">85%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">Police Verification</span>
                    <span className="font-bold text-amber-600">Pending</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm">Recent Jobs</h4>
                <div className="flex flex-col gap-3">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Tap Repair</p>
                        <p className="text-xs font-medium text-slate-500">12 Oct 2023</p>
                      </div>
                      <span className="text-sm font-extrabold text-green-600">Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={handleToggleSuspend}
                className={`w-full font-bold py-3 rounded-xl border transition-colors ${selectedWorker.status !== 'Suspended' ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' : 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'}`}
              >
                {selectedWorker.status !== 'Suspended' ? 'Suspend Worker' : 'Unsuspend Worker'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Suspend Worker</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Are you sure you want to suspend {selectedWorker?.name}? They will not receive any new jobs.</p>
            
            <div className="flex gap-3">
              <button onClick={() => setShowSuspendModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={handleConfirmSuspend} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 shadow-md">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
