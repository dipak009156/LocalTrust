import { useRef, useEffect } from 'react';
import { useFlow } from '../../store/useFlow';

export default function OtpStep() {
  const { phone, otpDigits, otpError, otpShake, loading,
          resendTimer, setStep, handleOtpInput, verifyOTP, sendOTP } = useFlow();
  const refs = useRef([]);
  const complete = otpDigits.every(d => d.length === 1);

  useEffect(() => { refs.current[0]?.focus(); }, []);

  const onInput = (e, i) => {
    const val = e.target.value.replace(/\D/g, '');
    handleOtpInput(val, i);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const onBackspace = (e, i) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
      refs.current[i - 1]?.focus();
      handleOtpInput('', i - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => setStep('phone')} className="flex items-center gap-1 text-slate-400 hover:text-slate-700 text-sm font-semibold mb-4 transition-colors">
          ← Back
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Enter OTP</h1>
        <p className="text-slate-500 text-sm">Sent to <span className="font-bold text-slate-800">+91 {phone}</span></p>
      </div>

      <div className={`flex justify-between gap-2 ${otpShake ? 'animate-shake' : ''}`}>
        {otpDigits.map((v, i) => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="number"
            value={v}
            onChange={e => onInput(e, i)}
            onKeyDown={e => onBackspace(e, i)}
            inputMode="numeric"
            maxLength={1}
            className="w-full aspect-square text-center text-xl font-extrabold border-2 border-slate-300 bg-slate-50 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:scale-105 transition-all"
          />
        ))}
      </div>

      {otpError && <p className="text-red-500 text-xs font-semibold text-center">{otpError}</p>}

      <button
        onClick={verifyOTP}
        disabled={!complete || loading}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2
          ${complete ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        {loading ? 'Verifying...' : 'Verify & Login'}
      </button>

      <div className="text-center text-sm">
        {resendTimer > 0
          ? <span className="text-slate-400">Resend OTP in <span className="font-bold text-slate-600">{resendTimer}s</span></span>
          : <button onClick={sendOTP} className="text-blue-600 font-bold hover:underline">Resend OTP</button>
        }
      </div>
    </div>
  );
}