import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { uploadFile } from '../../firebase/uploadFile';
import api from '../../utils/api';

export default function DisputeResponse() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const fileInputRef  = useRef(null);
  const [dispute,      setDispute]      = useState(null);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [response,     setResponse]     = useState('');
  const [uploading,    setUploading]    = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [isSubmitted,  setIsSubmitted]  = useState(false);

  // Fetch real dispute reason from API
  useEffect(() => {
    if (!bookingId) return;
    api.get(`/dispute/${bookingId}`)
      .then(r => setDispute(r.data))
      .catch(console.error);
  }, [bookingId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async () => {
    if (!bookingId)           { setError('Booking ID missing.'); return; }
    if (response.length < 10) { setError('Please write at least 10 characters.'); return; }

    setLoading(true);
    setError('');

    let evidenceUrls = [];

    // Upload photo to Cloudinary if provided
    if (photoFile) {
      setUploading(true);
      setProgress(0);
      try {
        const url = await uploadFile(photoFile, 'dispute_evidence', setProgress);
        evidenceUrls = [url];
      } catch (err) {
        setError('Photo upload failed. Please try again.');
        setLoading(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      await api.patch(`/dispute/${bookingId}/respond`, {
        workerResponse: response,
        workerEvidence: evidenceUrls,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit response.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col h-full bg-white relative">
        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto pb-32">
          <div className="w-24 h-24 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Response Submitted</h1>
          <div className="bg-blue-50 w-full rounded-3xl p-6 border border-blue-100 text-center mt-6">
            <p className="text-sm font-semibold text-blue-900">
              Our team will review your evidence within 24 hours. You'll be notified of the outcome.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
          <button onClick={() => navigate('/worker/dashboard')} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Submit Response</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto pb-32">
        {/* Customer's real dispute reason */}
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm">
          <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1">Customer Claims</p>
          <p className="text-sm font-bold text-red-900">
            "{dispute?.reason ?? 'Loading dispute details…'}"
          </p>
        </div>

        {/* Worker's response text */}
        <div>
          <label className="text-sm font-extrabold text-gray-900 mb-2 block">
            Explain your side <span className="text-red-500">*</span>
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 h-32 resize-none shadow-sm"
            placeholder="I tightened the base correctly and showed the customer it wasn't leaking before I left..."
          />
          <p className={`text-xs font-semibold mt-2 text-right ${response.length < 20 ? 'text-gray-400' : 'text-blue-700'}`}>
            {response.length} chars
          </p>
        </div>

        {/* Photo evidence upload */}
        <div>
          <label className="text-sm font-extrabold text-gray-900 mb-2 block">Add photo evidence (Optional)</label>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-36 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 gap-2 hover:border-blue-700 hover:text-blue-700 cursor-pointer overflow-hidden relative transition-colors"
          >
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Counter evidence preview" className="w-full h-full object-cover" />
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <p className="text-white font-bold text-xs">Uploading {progress}%</p>
                  </div>
                )}
                {!uploading && (
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    ✓ Uploaded
                  </div>
                )}
              </>
            ) : (
              <>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-xs font-bold">Tap to upload photo evidence</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-2">
        {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={response.length < 10 || loading || uploading}
          className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2
            ${response.length >= 10 && !loading && !uploading
              ? 'bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
        >
          {(loading || uploading) && (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          )}
          {uploading ? `Uploading photo ${progress}%…` : loading ? 'Submitting…' : 'Submit Evidence'}
        </button>
      </div>
    </div>
  );
}
