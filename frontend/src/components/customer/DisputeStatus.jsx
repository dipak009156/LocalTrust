import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function DisputeStatus() {
  const navigate = useNavigate();
  // Demo states: 'review', 'resolved_refund', 'resolved_release'
  const [status, setStatus] = useState('review'); 

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center relative">
      <button onClick={() => navigate(-1)} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-900 border border-gray-200">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Demo toggles */}
      <div className="absolute top-5 left-5 flex gap-2">
        <button onClick={() => setStatus('review')} className={`px-2 py-1 text-[10px] rounded ${status === 'review' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'}`}>Review</button>
        <button onClick={() => setStatus('resolved_refund')} className={`px-2 py-1 text-[10px] rounded ${status === 'resolved_refund' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>Refund</button>
      </div>

      {status === 'review' ? (
        <>
          <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Dispute Under Review</h1>
          <p className="text-gray-600 font-medium mb-8">
            We have received your dispute. Our admin team will review the evidence and contact you within 24 hours. Your payment remains frozen.
          </p>
        </>
      ) : (
        <>
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Dispute Resolved</h1>
          <p className="text-gray-600 font-medium mb-8">
            {status === 'resolved_refund' ? 'The issue was settled in your favor. A full refund of ₹249 has been initiated to your original payment method.' : 'The dispute was resolved and the payment has been released to the worker.'}
          </p>
        </>
      )}

      <div className="bg-white w-full rounded-2xl p-4 border border-gray-100 text-left shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Status Timeline</h3>
        <div className="flex flex-col gap-4 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
          
          <div className="flex gap-4 relative z-10">
            <div className="w-6 h-6 rounded-full bg-blue-700 border-4 border-white shrink-0"></div>
            <div>
              <p className="text-sm font-bold text-gray-900">Dispute Raised</p>
              <p className="text-xs text-gray-500 font-medium">12 Oct 2023, 4:15 PM</p>
            </div>
          </div>
          
          <div className="flex gap-4 relative z-10">
            <div className={`w-6 h-6 rounded-full border-4 border-white shrink-0 ${status === 'review' ? 'bg-orange-400 animate-pulse' : 'bg-blue-700'}`}></div>
            <div>
              <p className="text-sm font-bold text-gray-900">Admin Review</p>
              <p className="text-xs text-gray-500 font-medium">{status === 'review' ? 'In progress' : 'Completed'}</p>
            </div>
          </div>

          <div className="flex gap-4 relative z-10">
            <div className={`w-6 h-6 rounded-full border-4 border-white shrink-0 ${status === 'review' ? 'bg-gray-200' : 'bg-green-600'}`}></div>
            <div>
              <p className={`text-sm font-bold ${status === 'review' ? 'text-gray-500' : 'text-gray-900'}`}>Resolution</p>
              <p className={`text-xs font-medium ${status === 'review' ? 'text-gray-400' : 'text-gray-500'}`}>
                {status === 'review' ? 'Pending' : (status === 'resolved_refund' ? 'Refund Issued' : 'Payment Released')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
