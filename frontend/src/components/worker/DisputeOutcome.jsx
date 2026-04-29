import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function DisputeOutcome() {
  const navigate = useNavigate();
  // Mock outcome: 'won', 'lost', or 'split'
  const [outcomeType, setOutcomeType] = useState('won');

  // TODO: Socket.io listen for dispute_outcome event

  const renderOutcome = () => {
    switch (outcomeType) {
      case 'won':
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
              <p className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-1">Amount Released</p>
              <p className="text-3xl font-black text-green-700">₹249</p>
            </div>
          </>
        );
      case 'lost':
        return (
          <>
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Dispute Resolved in Customer's Favour</h1>
            <p className="text-gray-600 font-medium mb-8 text-center px-4">
              Based on the review, the customer's claim was validated. The payment has been refunded to the customer.
            </p>
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
              <div className="flex justify-between text-sm font-semibold text-amber-800 mb-3">
                <span>Customer Refunded</span>
                <span>₹100</span>
              </div>
              <div className="h-px w-full bg-amber-200 my-1"></div>
              <div className="flex justify-between text-lg font-black text-amber-900 mt-2">
                <span>You Received</span>
                <span>₹149</span>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="absolute top-5 left-5 flex gap-2 z-20">
        <button onClick={() => setOutcomeType('won')} className={`px-2 py-1 text-[10px] rounded ${outcomeType === 'won' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>Won</button>
        <button onClick={() => setOutcomeType('lost')} className={`px-2 py-1 text-[10px] rounded ${outcomeType === 'lost' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}>Lost</button>
        <button onClick={() => setOutcomeType('split')} className={`px-2 py-1 text-[10px] rounded ${outcomeType === 'split' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>Split</button>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto pb-32 pt-16">
        {renderOutcome()}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button onClick={() => navigate('/worker/dashboard')} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-colors">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
