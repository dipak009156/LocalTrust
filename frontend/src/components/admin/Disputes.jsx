import { useState } from 'react';
import { mockData } from '../../utils/mockData';
import { useAdmin } from '../../context/AdminContext';

export default function Disputes() {
  const { activeDisputes, setActiveDisputes } = useAdmin();
  const [tab, setTab] = useState('Open');
  const [items, setItems] = useState(mockData.disputes.map(d => ({ ...d, status: 'Open' })));
  
  const [splitModalData, setSplitModalData] = useState(null);
  const [customerRefund, setCustomerRefund] = useState('');
  const [workerRelease, setWorkerRelease] = useState('');

  // TODO: GET /admin/disputes

  const filtered = items.filter(d => d.status === tab);

  const handleResolve = (id, resolution) => {
    // TODO: PATCH /admin/disputes/:id/resolve
    setItems(items.map(i => i.id === id ? { ...i, status: 'Resolved', resolution } : i));
    setActiveDisputes(prev => prev > 0 ? prev - 1 : 0);
    alert(`Dispute resolved - ${resolution}`);
  };

  const handleOpenSplitModal = (dispute) => {
    setSplitModalData(dispute);
    setCustomerRefund('');
    setWorkerRelease('');
  };

  const handleConfirmSplit = () => {
    const total = parseFloat(customerRefund || 0) + parseFloat(workerRelease || 0);
    if (total !== splitModalData.amount) {
      alert(`Amounts must add up to ₹${splitModalData.amount}`);
      return;
    }
    handleResolve(splitModalData.id, `Split: ₹${customerRefund} to Customer, ₹${workerRelease} to Worker`);
    setSplitModalData(null);
  };

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Disputes</h1>
          <p className="text-slate-500 font-medium mt-1">Review evidence and resolve customer-worker conflicts.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          {['Open', 'Resolved'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${tab === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              {t} {t === 'Open' && <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${tab === t ? 'bg-white text-indigo-700' : 'bg-slate-300 text-slate-700'}`}>{activeDisputes}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 bg-slate-50/30">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-bold text-slate-600 mb-1">No {tab.toLowerCase()} disputes</h3>
              <p className="text-sm">Everything is running smoothly.</p>
            </div>
          ) : (
            filtered.map(d => (
              <div key={d.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-50 text-red-700 border border-red-100 px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide">Disputed</span>
                      <span className="text-sm font-bold text-slate-900">Booking #{d.bookingId}</span>
                      <span className="text-slate-400 text-xs font-bold">• {d.time}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">{d.service}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Escrow Locked</p>
                    <p className="text-2xl font-black text-red-600">₹{d.amount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Customer Side */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Customer Claim</p>
                    <p className="font-bold text-slate-900 mb-1">{d.customer}</p>
                    <p className="text-sm font-medium text-slate-700 italic mb-4">"{d.reason}"</p>
                    
                    <p className="text-xs font-bold text-slate-500 mb-2">Evidence Provided</p>
                    <div className="h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold cursor-pointer hover:border-indigo-500 transition-colors">
                      [View Photo]
                    </div>
                  </div>

                  {/* Worker Side */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Worker Response</p>
                    <p className="font-bold text-slate-900 mb-1">{d.worker}</p>
                    <p className="text-sm font-medium text-slate-700 italic mb-4">"{d.workerResponse}"</p>
                    
                    <p className="text-xs font-bold text-slate-500 mb-2">Evidence Provided</p>
                    <div className="h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold cursor-pointer hover:border-indigo-500 transition-colors">
                      [View Photo]
                    </div>
                  </div>
                </div>

                {tab === 'Open' ? (
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button onClick={() => handleResolve(d.id, 'Refund Customer')} className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors">
                      Refund Customer (₹{d.amount})
                    </button>
                    <button onClick={() => handleOpenSplitModal(d)} className="flex-1 bg-white border border-amber-200 text-amber-600 font-bold py-3 rounded-xl hover:bg-amber-50 transition-colors">
                      Split Payment
                    </button>
                    <button onClick={() => handleResolve(d.id, 'Release to Worker')} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-green-700 transition-colors">
                      Release to Worker (₹{d.amount})
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-bold text-slate-700 text-sm">Resolution: {d.resolution}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Split Payment Modal */}
      {splitModalData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Split Payment</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Allocate the ₹{splitModalData.amount} locked in escrow.</p>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="text-sm font-bold text-slate-900 mb-2 block">Refund Customer</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input 
                    type="number" 
                    value={customerRefund}
                    onChange={(e) => setCustomerRefund(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-bold text-slate-900 mb-2 block">Release to Worker</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input 
                    type="number" 
                    value={workerRelease}
                    onChange={(e) => setWorkerRelease(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSplitModalData(null)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={handleConfirmSplit} className="flex-[1.5] bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 shadow-md">Confirm Split</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
