import { useFlow } from '../../store/useFlow';

export default function AadhaarStep() {
  const { kyc, setKyc, setStep } = useFlow();
  const valid = kyc.front && kyc.back && kyc.selfie;

  const UploadRow = ({ id, icon, label, sub, capture, field }) => (
    <label htmlFor={id}
      className={`flex items-center justify-between p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all
        ${kyc[field] ? 'border-green-400 bg-green-50' : 'border-slate-300 bg-slate-50'}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-bold text-slate-700">{label}</p>
          <p className="text-xs text-slate-400">{sub}</p>
        </div>
      </div>
      <span className={`text-sm font-bold ${kyc[field] ? 'text-green-600' : 'text-blue-600'}`}>
        {kyc[field] ? '✅' : capture ? 'Camera' : 'Upload'}
      </span>
      <input
        type="file" id={id} accept="image/*"
        capture={capture || undefined}
        className="hidden"
        onChange={() => setKyc({ ...kyc, [field]: true })}
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
        <UploadRow id="selfie" icon="🤳" label="Live Selfie" sub="Must match your Aadhaar photo" capture="user" field="selfie" />
      </div>

      <button
        onClick={() => setStep('submitted')}
        disabled={!valid}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98]
          ${valid ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        Submit Application
      </button>
    </div>
  );
}