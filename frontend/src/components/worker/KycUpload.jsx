import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2, ShieldCheck, ChevronLeft } from 'lucide-react';
import api from '../../utils/api';

export default function KycUpload() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    aadhaarSelfie: null
  });
  const [uploading, setUploading] = useState(false);

  const handleFakeUpload = (key) => {
    // For demo, we just set a dummy URL
    setImages(prev => ({ ...prev, [key]: `https://firebasestorage.googleapis.com/v0/b/localtrust/o/kyc%2F${key}.jpg?alt=media` }));
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      await api.post('/worker/kyc', images);
      alert('KYC submitted successfully!');
      navigate('/worker/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setUploading(false);
    }
  };

  const steps = [
    { id: 1, key: 'aadhaarFront', label: 'Aadhaar Front', desc: 'Ensure all details are clearly visible' },
    { id: 2, key: 'aadhaarBack', label: 'Aadhaar Back', desc: 'Scan the address side of your card' },
    { id: 3, key: 'aadhaarSelfie', label: 'Selfie with Aadhaar', desc: 'Hold your Aadhaar card next to your face' }
  ];

  const current = steps.find(s => s.id === step);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-900"><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-extrabold text-gray-900">Identity Verification</h1>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 mx-1 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step <= 3 ? (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-2">{current.label}</h2>
              <p className="text-sm font-semibold text-gray-500">{current.desc}</p>
            </div>

            <div className="flex-1 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              {images[current.key] ? (
                <>
                  <img src={images[current.key]} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Preview" />
                  <CheckCircle2 size={60} className="text-green-500 mb-4 relative z-10" />
                  <p className="text-lg font-bold text-gray-900 relative z-10">Photo Captured!</p>
                  <button onClick={() => setImages({ ...images, [current.key]: null })} className="mt-4 text-blue-700 font-bold text-sm relative z-10">Retake</button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
                    <Camera size={32} />
                  </div>
                  <p className="font-bold text-gray-400 mb-8 max-w-[200px]">Place your card within the frame</p>
                  <button 
                    onClick={() => handleFakeUpload(current.key)}
                    className="bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest text-xs"
                  >
                    Take Photo
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Ready to Submit</h2>
            <p className="text-sm font-semibold text-gray-500 mb-10 max-w-xs">All 3 documents have been captured. Our team will verify them within 24 hours.</p>
            
            <button 
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {uploading ? 'Submitting...' : 'Complete Verification'}
            </button>
            <button onClick={() => setStep(1)} className="mt-4 text-gray-400 font-bold text-sm">Review Photos</button>
          </div>
        )}

        {step < 4 && images[current.key] && (
          <button 
            onClick={() => setStep(step + 1)}
            className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest text-sm mt-6"
          >
            Next Step
          </button>
        )}
      </div>
    </div>
  );
}
