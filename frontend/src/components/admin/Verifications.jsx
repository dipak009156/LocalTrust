import { useState } from 'react';
import { mockData } from '../../utils/mockData';
import { useAdmin } from '../../context/AdminContext';

export default function Verifications() {
  const { pendingVerifications, setPendingVerifications } = useAdmin();
  const [tab, setTab] = useState('Pending');
  const [rejectModalData, setRejectModalData] = useState(null); // holds the worker ID
  const [rejectReason, setRejectReason] = useState('Failed Aadhaar');
  const [rejectNotes, setRejectNotes] = useState('');

  // Use state to allow local manipulation without altering mockData immediately
  const [items, setItems] = useState(mockData.verifications);

  // TODO: GET /admin/verifications

  const filtered = items.filter(v => 
    tab === 'Pending' ? v.aadhaarStatus === 'Pending' :
    tab === 'Approved' ? v.aadhaarStatus === 'Approved' :
    v.aadhaarStatus === 'Rejected'
  );

  const handleApprove = (id) => {
    // TODO: PATCH /admin/workers/:id/verify
    setItems(items.map(i => i.id === id ? { ...i, aadhaarStatus: 'Approved' } : i));
    setPendingVerifications(prev => prev > 0 ? prev - 1 : 0);
  };

  const handleOpenReject = (id) => {
    setRejectModalData(id);
  };

  const handleConfirmReject = () => {
    // TODO: PATCH /admin/workers/:id/reject
    setItems(items.map(i => i.id === rejectModalData ? { ...i, aadhaarStatus: 'Rejected' } : i));
    setPendingVerifications(prev => prev > 0 ? prev - 1 : 0);
    setRejectModalData(null);
    setRejectReason('Failed Aadhaar');
    setRejectNotes('');
  };

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verifications</h1>
          <p className="text-slate-500 font-medium mt-1">Review onboarding documents and approve workers.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          {['Pending', 'Approved', 'Rejected'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${tab === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              {t} {t === 'Pending' && <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${tab === t ? 'bg-white text-indigo-700' : 'bg-slate-300 text-slate-700'}`}>{pendingVerifications}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 bg-slate-50/30">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-bold text-slate-600 mb-1">No {tab.toLowerCase()} verifications</h3>
              <p className="text-sm">You are all caught up!</p>
            </div>
          ) : (
            filtered.map(v => (
              <div key={v.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">{v.name}</h3>
                      <p className="text-sm font-semibold text-slate-500 mt-0.5">{v.phone} • {v.city}</p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">{v.skill}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Skill Test Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${v.score}%` }}></div>
                        </div>
                        <span className="font-black text-slate-900 text-sm">{v.score}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Police Verification</p>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${v.police === 'Cleared' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {v.police}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 mt-auto">Submitted on {v.date}</p>
                </div>

                <div className="flex-[1.5] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Identity Documents</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white h-24 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-indigo-500 transition-colors">
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
                      <span className="text-[10px] font-bold">Aadhaar Front</span>
                    </div>
                    <div className="bg-white h-24 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-indigo-500 transition-colors">
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
                      <span className="text-[10px] font-bold">Aadhaar Back</span>
                    </div>
                    <div className="bg-white h-24 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-indigo-500 transition-colors">
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[10px] font-bold">Selfie Video</span>
                    </div>
                  </div>
                  
                  {tab === 'Pending' && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                      <button onClick={() => handleOpenReject(v.id)} className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 text-sm shadow-sm transition-colors">
                        Reject
                      </button>
                      <button onClick={() => handleApprove(v.id)} className="flex-[2] bg-green-600 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 text-sm shadow-md transition-colors">
                        Approve Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">Reject Application</h3>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Reason</label>
                <select 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:border-red-500"
                >
                  <option>Failed Aadhaar</option>
                  <option>Low Skill Score</option>
                  <option>Suspicious Documents</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Notes</label>
                <textarea 
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Additional details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-red-500 h-24 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setRejectModalData(null)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={handleConfirmReject} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 shadow-md">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
