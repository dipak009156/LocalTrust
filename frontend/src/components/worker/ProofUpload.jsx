import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

export default function ProofUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Create a local object URL for preview
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = () => {
    // TODO: Firebase Storage upload then PATCH /bookings/:id/complete
    navigate('/worker/job-confirmed');
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Upload Proof</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto pb-32">
        <p className="text-sm font-medium text-gray-600">Please upload a clear photo showing the completed work. The customer will review this to confirm.</p>
        
        <div>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
          />
          <div 
            onClick={() => fileInputRef.current.click()}
            className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 gap-3 hover:border-blue-700 hover:text-blue-700 cursor-pointer overflow-hidden relative transition-colors"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Proof preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-sm font-bold">Tap to upload proof photo</span>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-extrabold text-gray-900 mb-2 block">Notes for Customer</label>
          <textarea 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 h-32 resize-none" 
            placeholder="Describe what was done (e.g. replaced washer, fixed leak)..."
          ></textarea>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button 
          onClick={handleSubmit} 
          disabled={!photoPreview}
          className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-colors ${photoPreview ? 'bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
        >
          Submit for Customer Confirmation
        </button>
      </div>
    </div>
  );
}
