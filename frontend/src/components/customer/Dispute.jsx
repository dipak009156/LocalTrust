import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

export default function Dispute() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
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
          <select className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-semibold text-gray-900 outline-none focus:border-blue-700">
            <option>Job not completed properly</option>
            <option>Worker asked for more money</option>
            <option>Unprofessional behavior</option>
            <option>Worker didn't show up</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-extrabold text-gray-900 mb-2 block">Upload Evidence</label>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <div 
            onClick={() => fileInputRef.current.click()}
            className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-1 hover:border-blue-700 hover:text-blue-700 cursor-pointer transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            <span className="text-xs font-bold text-center px-1 truncate w-full">{fileName || 'Add Media'}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-extrabold text-gray-900 mb-2 block">Description</label>
          <textarea className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 h-32 resize-none" placeholder="Provide details about the issue..."></textarea>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button onClick={() => navigate('/customer/dispute-status')} className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 transition-colors">
          Submit Dispute
        </button>
      </div>
    </div>
  );
}
