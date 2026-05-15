import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, X, Smartphone } from 'lucide-react';
import api from '../../utils/api';

const CATEGORY_ICONS = {
  'Plumbing':'🚰','Electrical':'⚡','Cleaning':'🧹',
  'AC Repair':'❄️','Carpentry':'🪚','Painting':'🎨',
};

export default function Earnings() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [upiId, setUpiId]     = useState('');
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    api.get('/worker/earnings')
      .then(r => {
        // API returns { totalGross, totalNet, earnings: [] }
        const list = Array.isArray(r.data) ? r.data : (r.data.earnings ?? []);
        setEarnings(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now    = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
  const monthKey = target.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const monthEarnings = earnings.filter(e => {
    const d = new Date(e.createdAt);
    return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
  });

  const gross = monthEarnings.reduce((s, e) => s + (e.grossAmount ?? 0), 0);
  const comm  = monthEarnings.reduce((s, e) => s + (e.commission  ?? 0), 0);
  const net   = monthEarnings.reduce((s, e) => s + (e.netAmount   ?? 0), 0);

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 lg:pb-0 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Earnings</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Month picker */}
        <div className="flex justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto w-full">
          <button onClick={() => setMonthOffset(p => p + 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-xl">
            <ChevronLeft size={24} />
          </button>
          <span className="font-black text-gray-900 uppercase tracking-widest text-xs">{monthKey}</span>
          <button onClick={() => setMonthOffset(p => Math.max(0, p - 1))} disabled={monthOffset === 0}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-xl disabled:opacity-30">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Summary card */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><CreditCard size={120} /></div>
          <div className="relative z-10">
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Net Earnings</p>
            <h2 className="text-5xl font-black flex items-baseline gap-1 mb-8">
              <span className="text-2xl font-bold opacity-70">₹</span>
              {loading ? '—' : Math.round(net).toLocaleString('en-IN')}
            </h2>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Total Earned</p>
                <p className="font-bold text-lg">₹{Math.round(gross).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Commission (15%)</p>
                <p className="font-bold text-lg text-red-200">-₹{Math.round(comm).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setShowPayoutModal(true)}
          className="w-full bg-white text-blue-700 font-black py-4 rounded-2xl shadow-sm border-2 border-blue-50 hover:bg-blue-50 transition-all uppercase tracking-widest text-xs">
          Request Payout
        </button>

        {/* Transactions */}
        <div>
          <h3 className="font-black text-gray-900 text-lg mb-4">Transactions</h3>
          {loading && [...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100 mb-3" />)}
          {!loading && monthEarnings.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              <span className="text-3xl block mb-2">💸</span>
              <p className="font-bold text-sm">No earnings in {monthKey}</p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {monthEarnings.map(e => {
              const catName = e.booking?.category?.name ?? '';
              return (
                <div key={e.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-xl">
                      {CATEGORY_ICONS[catName] ?? '🔧'}
                    </div>
                    <div>
                      <p className="font-black text-gray-900">{catName || 'Service'}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        {fmt(e.createdAt)} · Commission: ₹{Math.round(e.commission ?? 0)}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-green-600 text-lg">+₹{Math.round(e.netAmount ?? 0)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payout modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center"><Smartphone size={20} /></div>
                <h3 className="text-xl font-black text-gray-900">Withdraw to UPI</h3>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
            </div>
            <div className="mb-8">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">UPI ID</label>
              <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 font-black text-gray-900 outline-none focus:border-blue-700 focus:bg-white transition-all text-lg"
                placeholder="e.g. 9876543210@okicici" />
              <p className="text-[10px] text-gray-500 font-bold mt-3">* Payouts are processed within 24 hours.</p>
            </div>
            <button onClick={() => { alert('Payout requested!'); setShowPayoutModal(false); }} disabled={!upiId}
              className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs ${upiId ? 'bg-blue-700 text-white shadow-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}>
              Confirm Withdrawal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
