import { useState } from 'react';
import BottomNav from './BottomNav';

export default function Earnings() {
  const [selectedMonth, setSelectedMonth] = useState('October 2023');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [upiId, setUpiId] = useState('');

  // Mock data keyed by month
  const earningsData = {
    'September 2023': { gross: 18500, comm: 1850, net: 16650 },
    'October 2023': { gross: 4250, comm: 425, net: 3825 },
  };

  const handlePrevMonth = () => setSelectedMonth('September 2023');
  const handleNextMonth = () => setSelectedMonth('October 2023');

  const handlePayout = () => {
    if (!upiId) return;
    // TODO: POST /workers/payout
    alert('Payout requested. Will reflect in 24 hours.');
    setShowPayoutModal(false);
  };

  const data = earningsData[selectedMonth] || { gross: 0, comm: 0, net: 0 };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Earnings</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="flex justify-between items-center bg-white p-3 rounded-full shadow-sm border border-gray-100">
          <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="font-bold text-gray-900">{selectedMonth}</span>
          <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* TODO: GET /workers/earnings?month= */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wide mb-1">Net Received</p>
              <h2 className="text-4xl font-black">₹{data.net.toLocaleString()}</h2>
            </div>
            <button onClick={() => alert('PDF export coming soon.')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-100 font-medium">Total Earned (Gross)</span>
              <span className="font-bold text-white">₹{data.gross.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-100 font-medium">Platform Commission</span>
              <span className="font-bold text-red-200">-₹{data.comm.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button onClick={() => setShowPayoutModal(true)} className="w-full bg-white text-blue-700 font-bold py-4 rounded-2xl shadow-sm border border-gray-100 hover:bg-blue-50 transition-colors">
          Request Payout
        </button>

        <div>
          <h3 className="font-extrabold text-gray-900 mb-4 text-lg">Transactions</h3>
          <div className="flex flex-col gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900">Tap Repair</p>
                <p className="text-sm font-black text-green-600">+₹224</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-gray-500 font-semibold">
                  <p>12 Oct • Andheri West</p>
                  <p className="mt-0.5 text-gray-400 font-mono">TXN: UPI84920492</p>
                </div>
                <p className="text-[10px] text-gray-400 font-bold">Gross: ₹249 | Comm: ₹25</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900">Shower Fitting</p>
                <p className="text-sm font-black text-green-600">+₹269</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-gray-500 font-semibold">
                  <p>10 Oct • Bandra</p>
                  <p className="mt-0.5 text-gray-400 font-mono">TXN: UPI74829381</p>
                </div>
                <p className="text-[10px] text-gray-400 font-bold">Gross: ₹299 | Comm: ₹30</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayoutModal && (
        <div className="absolute inset-0 bg-gray-900/40 z-30 flex items-end animate-in fade-in">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">Withdraw to UPI</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-gray-400 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-900 mb-2 block">Enter UPI ID</label>
              <input 
                type="text" 
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-blue-700"
                placeholder="e.g. 9876543210@okicici"
              />
            </div>

            <button onClick={handlePayout} disabled={!upiId} className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-colors ${upiId ? 'bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}>
              Confirm Payout
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
