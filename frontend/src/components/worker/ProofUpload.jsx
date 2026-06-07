import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import { uploadFile } from '../../firebase/uploadFile';
import { securePost } from '../../utils/securePost';
import { useSelector } from 'react-redux';
import StepUpAuthModal from '../ui/StepUpAuthModal';

/**
 * ProofUpload
 * Worker takes/uploads a completion photo → uploaded to Firebase Storage →
 * URL sent to PATCH /api/booking/:id/complete → navigate to job-confirmed.
 *
 * bookingId is expected in location.state: navigate('/worker/proof-upload', { state: { bookingId } })
 */
export default function ProofUpload() {
  const navigate     = useNavigate();
  const location     = useLocation();
  const bookingId    = location.state?.bookingId;

  const fileInputRef = useRef(null);
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [note, setNote]           = useState('');
  const [progress, setProgress]   = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const [stepUp, setStepUp]       = useState(false);
  const phone = useSelector(s => s.auth.phone) || '';

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSubmit = async () => {
    if (!file || uploading) return;
    if (!bookingId) {
      setError('Booking ID missing. Go back and try again.');
      return;
    }
    setUploading(true);
    setError('');

    try {
      // 1. Upload proof photo to Cloudinary
      const proofUrl = await uploadFile(
        file,
        `proofs/${bookingId}_${Date.now()}`,
        setProgress,
      );

      // 2. Mark booking as complete with the proof URL
      const result = await securePost(`/booking/${bookingId}/complete`, { proofPhoto: proofUrl });

      if (result.sentinelVerdict === 'STEP_UP_AUTH') { setStepUp(true); return; }
      if (result.sentinelVerdict === 'BLOCK') { setError('Action blocked due to unusual activity.'); return; }
      if (result.sentinelVerdict === 'TERMINATE_SESSION') { localStorage.removeItem('lt_token'); window.location.href = '/'; return; }

      navigate('/worker/job-confirmed', { state: { bookingId } });

    } catch (err) {
      console.error('Proof upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white relative" style={{ minHeight: '100dvh' }}>
      {stepUp && (
        <StepUpAuthModal
          phone={phone}
          onVerified={() => { setStepUp(false); handleSubmit(); }}
          onDismiss={() => setStepUp(false)}
        />
      )}
      {/* Header */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Upload Proof</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto pb-32">
        <p className="text-sm font-medium text-gray-600">
          Upload a clear photo showing the completed work. The customer will review this to confirm.
        </p>

        {/* Photo picker */}
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
            {preview ? (
              <img src={preview} alt="Proof preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-sm font-bold">Tap to take / upload photo</span>
              </>
            )}
          </div>

          {/* Upload progress bar */}
          {uploading && (
            <div className="mt-3">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-extrabold text-gray-900 mb-2 block">Notes for Customer</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 h-32 resize-none"
            placeholder="Describe what was done (e.g. replaced washer, fixed leak)..."
          />
        </div>

        {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}
      </div>

      {/* Submit button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={!file || uploading}
          className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2
            ${file && !uploading
              ? 'bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Uploading {progress}%
            </>
          ) : 'Submit for Customer Confirmation'}
        </button>
      </div>
    </div>
  );
}
