import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

const OUTCOME_LABELS = {
  pending:            { label: 'Under Review',       color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  released_to_worker: { label: 'Released to Worker', color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  refunded_to_user:   { label: 'Refunded to You',    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  split:              { label: 'Split Decision',      color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
};

export default function DisputeStatus() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!bookingId) { setLoading(false); return; }
    api.get(`/dispute/${bookingId}`)
      .then(r => setDispute(r.data))
      .catch(err => setError(err.response?.data?.message || 'Could not load dispute.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const outcome = dispute?.outcome ?? 'pending';
  const info    = OUTCOME_LABELS[outcome] ?? OUTCOME_LABELS.pending;
  const isResolved = outcome !== 'pending';

  const fmt = (iso) => iso ? new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : '—';

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center relative overflow-y-auto">
      <button
        onClick={() => navigate('/customer/bookings')}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-900 border border-gray-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading dispute status…</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="text-blue-700 font-bold underline text-sm">Go Back</button>
        </div>
      ) : (
        <>
          <div className={`w-24 h-24 ${info.bg} ${info.color} rounded-full flex items-center justify-center mb-6`}>
            {isResolved ? (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            {isResolved ? 'Dispute Resolved' : 'Dispute Under Review'}
          </h1>
          <p className="text-gray-600 font-medium mb-6 max-w-xs leading-relaxed">
            {isResolved
              ? outcome === 'refunded_to_user'
                ? 'The issue was resolved in your favour. A refund has been processed.'
                : outcome === 'released_to_worker'
                ? 'After review, the payment has been released to the worker.'
                : 'The dispute was resolved with a split decision.'
              : 'Our admin team will review the evidence and respond within 24 hours. Your payment is frozen.'}
          </p>

          {dispute?.reason && (
            <div className={`w-full ${info.bg} border ${info.border} rounded-2xl p-4 text-left mb-6`}>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Your Reason</p>
              <p className={`text-sm font-semibold ${info.color}`}>{dispute.reason}</p>
            </div>
          )}

          {/* Status timeline */}
          <div className="bg-white w-full rounded-2xl p-4 border border-gray-100 text-left shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Status Timeline</h3>
            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-blue-700 border-4 border-white shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Dispute Raised</p>
                  <p className="text-xs text-gray-500 font-medium">{fmt(dispute?.createdAt)}</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full border-4 border-white shrink-0 ${!isResolved ? 'bg-orange-400 animate-pulse' : 'bg-blue-700'}`} />
                <div>
                  <p className="text-sm font-bold text-gray-900">Admin Review</p>
                  <p className="text-xs text-gray-500 font-medium">{!isResolved ? 'In progress…' : 'Completed'}</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full border-4 border-white shrink-0 ${isResolved ? 'bg-green-600' : 'bg-gray-200'}`} />
                <div>
                  <p className={`text-sm font-bold ${isResolved ? 'text-gray-900' : 'text-gray-400'}`}>Resolution</p>
                  <p className={`text-xs font-medium ${isResolved ? 'text-gray-500' : 'text-gray-400'}`}>
                    {isResolved ? info.label : 'Pending'}
                  </p>
                  {dispute?.resolvedAt && (
                    <p className="text-xs text-gray-400 font-medium">{fmt(dispute.resolvedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/customer/bookings')}
            className="mt-6 w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-colors"
          >
            Back to Bookings
          </button>
        </>
      )}
    </div>
  );
}
