import { useState } from 'react';
import { useFlow } from '../../store/useFlow';
import { uploadFile } from '../../firebase/uploadFile';
import api from '../../utils/api';

/**
 * AadhaarStep
 * - Worker uploads Aadhaar front, back, and a live selfie
 * - Files are uploaded to Firebase Storage
 * - URLs are sent to POST /api/worker/kyc
 * - On success → calls submitWorkerOnboarding (saves profile + skills) → step = 'submitted'
 */
export default function AadhaarStep() {
  const { kyc, setKyc, setStep, loading, submitWorkerOnboarding } = useFlow();

  // Store actual File objects separately from kyc boolean flags
  const [files, setFiles] = useState({ front: null, back: null, selfie: null });
  const [progress, setProgress] = useState({ front: 0, back: 0, selfie: 0 });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const valid = kyc.front && kyc.back && kyc.selfie;

  const handleFile = (field, file) => {
    if (!file) return;
    setFiles(prev => ({ ...prev, [field]: file }));
    setKyc({ ...kyc, [field]: true });
  };

  const handleSubmit = async () => {
    if (!valid || uploading) return;
    setError('');
    setUploading(true);

    try {
      // 1. Upload all 3 photos to Cloudinary via Backend
      const workerUid = Date.now();

      const [frontUrl, backUrl, selfieUrl] = await Promise.all([
        uploadFile(files.front,  `kyc/worker_${workerUid}_front`,  (p) => setProgress(prev => ({ ...prev, front: p }))),
        uploadFile(files.back,   `kyc/worker_${workerUid}_back`,   (p) => setProgress(prev => ({ ...prev, back: p }))),
        uploadFile(files.selfie, `kyc/worker_${workerUid}_selfie`, (p) => setProgress(prev => ({ ...prev, selfie: p }))),
      ]);

      // 2. Save KYC URLs to backend
      await api.post('/worker/kyc', {
        aadhaarFront:  frontUrl,
        aadhaarBack:   backUrl,
        aadhaarSelfie: selfieUrl,
      });

      // 3. Save profile + skills, then move to submitted
      await submitWorkerOnboarding();

    } catch (err) {
      console.error('KYC upload error:', err);
      setError('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const UploadRow = ({ id, icon, label, sub, capture, field }) => (
    <label htmlFor={id}
      className={`flex items-center justify-between p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all
        ${kyc[field] ? 'border-green-400 bg-green-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400'}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-bold text-slate-700">{label}</p>
          <p className="text-xs text-slate-400">
            {uploading && progress[field] > 0 && progress[field] < 100
              ? `Uploading ${progress[field]}%`
              : sub}
          </p>
        </div>
      </div>
      <span className={`text-sm font-bold ${kyc[field] ? 'text-green-600' : 'text-blue-600'}`}>
        {uploading && progress[field] > 0 && progress[field] < 100
          ? <span className="text-blue-600">{progress[field]}%</span>
          : kyc[field] ? '✅' : capture ? 'Camera' : 'Upload'}
      </span>
      <input
        type="file" id={id} accept="image/*"
        capture={capture || undefined}
        className="hidden"
        onChange={(e) => handleFile(field, e.target.files?.[0])}
      />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep('test')} className="text-slate-400 hover:text-slate-700 transition-colors">←</button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-0.5">Identity Verification</h2>
          <p className="text-slate-500 text-sm">Required to become a verified partner</p>
        </div>
      </div>

      <div className="space-y-3">
        <UploadRow id="aadhaar-front" icon="🪪" label="Aadhaar Front" sub="Clear photo of front side" field="front" />
        <UploadRow id="aadhaar-back"  icon="🪪" label="Aadhaar Back"  sub="Clear photo of back side"  field="back" />
        <UploadRow id="aadhaar-selfie" icon="🤳" label="Live Selfie" sub="Must match your Aadhaar photo" capture="user" field="selfie" />
      </div>

      {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!valid || uploading || loading}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2
          ${valid && !uploading && !loading
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        {(uploading || loading) ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {uploading ? 'Uploading photos...' : 'Submitting...'}
          </>
        ) : 'Submit Application'}
      </button>
    </div>
  );
}