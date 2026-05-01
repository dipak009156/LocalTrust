import { useNavigate, useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import Api from '../../utils/api';
import { ArrowLeft, AlertCircle, Plus, Loader2 } from 'lucide-react';

export default function Dispute() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [reason, setReason] = useState('Job not completed properly');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmitDispute = async () => {
    // 1. Submit a formal dispute against a booking
    // Why: To freeze the escrow payment and initiate an investigation by the TrustWork support team
    if (!description.trim()) return alert('Please provide a description');
    
    setLoading(true);
    try {
      await Api.post('/disputes', {
        bookingId,
        reason,
        description,
        evidence: fileName // Ideally would be a file upload to S3/Cloudinary
      });
      navigate('/customer/dispute-status');
    } catch (err) {
      console.error('Dispute submission failed:', err);
      alert('Could not submit dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Raise Dispute</h1>
      </div>

      <div className="p-6 flex flex-col gap-8 overflow-y-auto pb-32 max-w-2xl mx-auto w-full">
        <div className="bg-red-50 border border-red-100 rounded-[28px] p-6 flex gap-4 text-sm font-bold text-red-900 shadow-sm shadow-red-50">
          <AlertCircle size={28} className="shrink-0 text-red-600" />
          <div>
            <span className="font-black block mb-1 uppercase text-xs tracking-tight">Payment Frozen</span>
            <p className="opacity-80 text-xs leading-relaxed">
              Your money is held in escrow safely while our support team investigates your claim.
            </p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Primary Reason</label>
          <select 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl p-5 font-bold text-gray-900 outline-none focus:border-blue-700 transition-all shadow-sm"
          >
            <option>Job not completed properly</option>
            <option>Worker asked for more money</option>
            <option>Unprofessional behavior</option>
            <option>Worker didn't show up</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Upload Evidence (Photos/Videos)</label>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <div 
            onClick={() => fileInputRef.current.click()}
            className="w-28 h-28 bg-white border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center text-gray-400 gap-2 hover:border-blue-700 hover:text-blue-700 cursor-pointer transition-all shadow-sm group"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center px-2 truncate w-full">{fileName || 'Add Media'}</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Detailed Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-[32px] p-6 text-sm font-bold text-gray-900 outline-none focus:border-blue-700 h-40 resize-none shadow-sm" 
            placeholder="Please explain the issue in detail..."
          ></textarea>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 lg:sticky lg:border-none lg:bg-transparent">
        <button 
          onClick={handleSubmitDispute} 
          disabled={loading}
          className="max-w-2xl mx-auto w-full bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-[0.98] uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Submit Dispute'}
        </button>
      </div>
    </div>
  );
}
