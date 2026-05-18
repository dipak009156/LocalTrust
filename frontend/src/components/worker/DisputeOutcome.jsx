import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function DisputeOutcome() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) { setLoading(false); return; }
    api.get(`/dispute/${bookingId}`)
      .then(r => setDispute(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-semibold">Loading outcome…</p>
      </div>
    );
  }

  const outcome    = dispute?.outcome ?? 'pending';
  const booking    = dispute?.booking;
  const grossAmt   = booking?.finalPrice ?? booking?.basePrice ?? 0;
  const netAmt     = parseFloat((grossAmt * 0.85).toFixed(2));
  const adminNote  = dispute?.adminNote ?? '';

  const renderOutcome = () => {
    switch (outcome) {
      case 'released_to_worker':
        return (
          <>
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Dispute Resolved in Your Favour</h1>
            <p className="text-gray-600 font-medium mb-8 text-center px-4">
              Our team reviewed the evidence and confirmed the job was completed properly. The full payment has been released to you.
            </p>
            <div className="bg-green-50 w-full rounded-3xl p-6 border border-green-100 shadow-sm text-center">
              <p className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-1">Net Amount Released</p>
              <p className="text-3xl font-black text-green-700">₹{netAmt}</p>
              {adminNote && <p className="text-xs text-green-700 mt-2 font-medium italic">"{adminNote}"</p>}
            </div>
          </>
        );

      case 'refunded_to_user':
        return (
          <>
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Dispute Resolved in Customer's Favour</h1>
            <p className="text-gray-600 font-medium mb-8 text-center px-4">
              Based on the review, the customer's claim was validated. The payment has been refunded to the customer.
            </p>
            {adminNote && (
              <div className="bg-red-50 w-full rounded-2xl p-4 border border-red-100 text-sm text-red-700 font-medium mb-6 text-center italic">
                "{adminNote}"
              </div>
            )}
            <a href="tel:18001234567" className="bg-gray-50 border border-gray-200 text-gray-900 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100">
              📞 Call Support for Clarification
            </a>
          </>
        );

      case 'split':
        return (
          <>
            <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Admin Split the Payment</h1>
            <p className="text-gray-600 font-medium mb-8 text-center px-4">
              After reviewing both sides, our team decided to split the outcome fairly.
            </p>
            <div className="bg-amber-50 w-full rounded-3xl p-6 border border-amber-100 shadow-sm">
              {adminNote ? (
                <p className="text-sm font-semibold text-amber-800 italic text-center mb-4">"{adminNote}"</p>
              ) : null}
              <div className="text-sm font-semibold text-amber-800 text-center">
                Check your earnings for the exact amount released.
              </div>
            </div>
          </>
        );

      default:
        // Still pending — shouldn't land here normally
        return (
          <>
            <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 shadow-sm animate-pulse">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Awaiting Admin Decision</h1>
            <p className="text-gray-600 font-medium mb-8 text-center px-4">
              Our team is still reviewing the evidence. You'll be notified once the dispute is resolved.
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto pb-32 pt-8">
        {renderOutcome()}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
        <button onClick={() => navigate('/worker/dashboard')} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-colors">
          Go to Dashboard
        </button>
        {(outcome === 'released_to_worker' || outcome === 'split') && (
          <button onClick={() => navigate('/worker/earnings')} className="w-full text-blue-700 font-bold py-3 text-sm hover:underline">
            View Earnings
          </button>
        )}
      </div>
    </div>
  );
}
