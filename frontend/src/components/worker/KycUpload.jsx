import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { uploadFile } from '../../firebase/uploadFile';
import api from '../../utils/api';

export default function KycUpload() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Stores Cloudinary URLs after upload (null until uploaded)
  const [images, setImages] = useState({
    aadhaarFront:  null,
    aadhaarBack:   null,
    aadhaarSelfie: null,
  });

  // Local preview blobs (before/after upload)
  const [previews, setPreviews] = useState({
    aadhaarFront:  null,
    aadhaarBack:   null,
    aadhaarSelfie: null,
  });

  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const steps = [
    { id: 1, key: 'aadhaarFront',  label: 'Aadhaar Front',       desc: 'Ensure all details are clearly visible' },
    { id: 2, key: 'aadhaarBack',   label: 'Aadhaar Back',        desc: 'Scan the address side of your card' },
    { id: 3, key: 'aadhaarSelfie', label: 'Selfie with Aadhaar', desc: 'Hold your Aadhaar card next to your face' },
  ];

  const current = steps.find(s => s.id === step);

  // Triggered when user picks a file
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [current.key]: localUrl }));
    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const cloudUrl = await uploadFile(file, 'kyc', setProgress);
      setImages(prev => ({ ...prev, [current.key]: cloudUrl }));
    } catch (err) {
      console.error('KYC upload error:', err);
      setError('Upload failed. Please try again.');
      setPreviews(prev => ({ ...prev, [current.key]: null }));
    } finally {
      setUploading(false);
    }
  };

  const handleRetake = () => {
    setImages(prev  => ({ ...prev,  [current.key]: null }));
    setPreviews(prev => ({ ...prev, [current.key]: null }));
    setError('');
  };

  const handleNext = () => {
    if (images[current.key]) setStep(step + 1);
  };

  const handleSubmit = async () => {
    const { aadhaarFront, aadhaarBack, aadhaarSelfie } = images;
    if (!aadhaarFront || !aadhaarBack || !aadhaarSelfie) {
      setError('All 3 photos are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/worker/kyc', { aadhaarFront, aadhaarBack, aadhaarSelfie });
      navigate('/worker/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit KYC. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const preview = previews[current?.key];
  const uploaded = images[current?.key];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Identity Verification</h1>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 mx-1 rounded-full transition-colors ${step > s ? 'bg-blue-700' : step === s ? 'bg-blue-400' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step <= 3 ? (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-2">{current.label}</h2>
              <p className="text-sm font-semibold text-gray-500">{current.desc}</p>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
            />

            {/* Upload zone */}
            <div
              onClick={() => !uploading && !uploaded && fileInputRef.current.click()}
              className={`flex-1 bg-gray-50 rounded-[40px] border-2 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden transition-colors
                ${uploaded ? 'border-green-400 border-solid' : 'border-dashed border-gray-200 hover:border-blue-700 cursor-pointer'}`}
            >
              {preview ? (
                <>
                  <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="KYC preview" />
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-3">
                    {uploading ? (
                      <>
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        <p className="text-white font-bold text-sm">Uploading {progress}%</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={60} className="text-green-400" />
                        <p className="text-white font-bold text-lg">Uploaded ✓</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRetake(); }}
                          className="mt-2 bg-white/20 text-white font-bold text-sm px-4 py-2 rounded-xl border border-white/50"
                        >
                          Retake
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
                    <Camera size={32} />
                  </div>
                  <p className="font-bold text-gray-400 mb-8 max-w-[200px]">Tap to take or upload photo</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                    className="bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest text-xs"
                  >
                    Take Photo
                  </button>
                </>
              )}
            </div>

            {error && <p className="text-red-500 text-sm font-semibold text-center mt-4">{error}</p>}
          </div>
        ) : (
          // All done — review & submit
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Ready to Submit</h2>
            <p className="text-sm font-semibold text-gray-500 mb-8 max-w-xs">
              All 3 documents uploaded to Cloudinary. Our team will verify them within 24 hours.
            </p>

            {/* Thumbnail preview of all 3 */}
            <div className="grid grid-cols-3 gap-3 w-full mb-10">
              {steps.map(s => (
                <div key={s.key} className="flex flex-col gap-1">
                  <div className="h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    {previews[s.key]
                      ? <img src={previews[s.key]} className="w-full h-full object-cover" alt={s.label} />
                      : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">—</div>
                    }
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 text-center">{s.label}</p>
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm font-semibold mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              {submitting ? 'Submitting…' : 'Complete Verification'}
            </button>
            <button onClick={() => setStep(1)} className="mt-4 text-gray-400 font-bold text-sm">
              Review & Retake Photos
            </button>
          </div>
        )}

        {/* Next Step button — shown when current step photo is uploaded */}
        {step < 4 && uploaded && !uploading && (
          <button
            onClick={handleNext}
            className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest text-sm mt-6"
          >
            {step < 3 ? 'Next Step →' : 'Review & Submit'}
          </button>
        )}
      </div>
    </div>
  );
}
