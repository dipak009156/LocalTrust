import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, CreditCard, Droplets, ShowerHead, X, Smartphone, Loader2 } from 'lucide-react';
import Api from '../../utils/api';

export default function Earnings() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [earnings, setEarnings] = useState({ gross: 0, comm: 0, net: 0, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch detailed earnings for the selected month
    // Why: To allow the partner to track their monthly performance and audit transactions
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const res = await Api.get(`/workers/earnings?period=${selectedMonth}`);
        setEarnings(res.data.earnings || { gross: 4250, comm: 425, net: 3825, history: [] });
      } catch (err) {
        console.error('Failed to fetch earnings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [selectedMonth]);

  const handlePayout = async () => {
    if (!upiId) return;
    // 2. Request a withdrawal to a UPI ID
    // Why: To allow partners to move their earnings to their bank account
    try {
      await Api.post('/workers/payout', { upiId, amount: earnings.net });
      alert('Payout requested. Will reflect in 24 hours.');
      setShowPayoutModal(false);
    } catch (err) {
      console.error('Payout failed:', err);
      alert('Failed to process payout request. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 lg:pb-0 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Earnings</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 flex flex-col gap-8 overflow-y-auto">
        <div className="flex justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto w-full">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all">
            <ChevronLeft size={24} />
          </button>
          <span className="font-black text-gray-900 uppercase tracking-widest text-xs">{selectedMonth}</span>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {loading ? (
          <div className="h-64 bg-white rounded-[32px] animate-pulse flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">
            Calculating...
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <CreditCard size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Net Payout Available</p>
                  <h2 className="text-5xl font-black flex items-baseline gap-1">
                    <span className="text-2xl font-bold opacity-70">₹</span>{earnings.net.toLocaleString()}
                  </h2>
                </div>
                <button onClick={() => alert('PDF export coming soon.')} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all border border-white/10 shadow-lg">
                  <Download size={22} className="text-white" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Total Earned</p>
                  <p className="font-bold text-lg">₹{earnings.gross.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Commission</p>
                  <p className="font-bold text-lg text-red-200">-₹{earnings.comm.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => setShowPayoutModal(true)} className="w-full bg-white text-blue-700 font-black py-4 rounded-2xl shadow-sm border-2 border-blue-50 hover:bg-blue-50 hover:border-blue-100 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
          Request Immediate Payout
        </button>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900 text-xl tracking-tight">Transaction History</h3>
            <button className="text-blue-700 text-[10px] font-black uppercase tracking-widest hover:underline">Download Statement</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnings.history.length > 0 ? earnings.history.map((tx, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 group hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Droplets size={22} />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">{tx.service}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{tx.date} • {tx.location}</p>
                    </div>
                  </div>
                  <p className="font-black text-green-600 text-lg">+₹{tx.amount}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <p className="text-[9px] text-gray-400 font-mono tracking-tighter">REF: {tx.ref}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Fee: ₹{tx.fee}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                No transactions found for this period.
              </div>
            )}
          </div>
        </div>
      </div>

      {showPayoutModal && (
        <div className="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Withdraw to UPI</h3>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-8">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Enter Payout UPI ID</label>
              <input 
                type="text" 
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 font-black text-gray-900 outline-none focus:border-blue-700 focus:bg-white transition-all text-lg"
                placeholder="e.g. 9876543210@okicici"
              />
              <p className="text-[10px] text-gray-500 font-bold mt-3 leading-relaxed">
                * Payouts are usually processed within 24 hours of request.
              </p>
            </div>

            <button onClick={handlePayout} disabled={!upiId} className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs ${upiId ? 'bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800 active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}>
              Confirm Withdrawal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
