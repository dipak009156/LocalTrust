import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import api from '../../utils/api';

const REASONS = [
  'Job not completed properly',
  'Worker asked for more money',
  'Unprofessional behavior',
  'Worker didn\'t show up',
  'Damage caused to property',
  'Other',
];

export default function Dispute() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [reason,   setReason]   = useState(REASONS[0]);
  const [desc,     setDesc]     = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async () => {
    if (!bookingId) {
      setError('Booking ID is missing. Please go back and try again.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/dispute', {
        bookingId,
        reason: desc ? `${reason} — ${desc}` : reason,
      });
      navigate('/customer/dispute-status', { state: { bookingId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Raise Dispute</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-sm font-medium text-red-900">
          <svg className="w-5 h-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <span className="font-bold block mb-0.5">Payment Frozen</span>
            Your money is held in escrow while our support team investigates.
          </div>
        </div>

        <div>
          <label className="text-sm font-extrabold text-gray-900 mb-2 block">Reason</label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-semibold text-gray-900 outline-none focus:border-blue-700"
          >
            {REASONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-extrabold text-gray-900 mb-2 block">Description (optional)</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 h-32 resize-none"
            placeholder="Provide more details about the issue..."
          />
        </div>

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          ) : null}
          {loading ? 'Submitting…' : 'Submit Dispute'}
        </button>
      </div>
    </div>
  );
}
