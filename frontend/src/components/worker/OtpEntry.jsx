import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import api from '../../utils/api';
import { securePost } from '../../utils/securePost';
import { useSelector } from 'react-redux';
import StepUpAuthModal from '../ui/StepUpAuthModal';

/**
 * OtpEntry — Worker types the 4-digit OTP shown to the customer.
 * POSTs to /api/booking/:id/verify-otp
 * On success → job moves to in_progress, navigate to job-in-progress.
 */
export default function OtpEntry() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [otp, setOtp]         = useState(['', '', '', '']);
  const [error, setError]     = useState(false);
  const [errMsg, setErrMsg]   = useState('Incorrect OTP. Try again.');
  const [loading, setLoading] = useState(false);
  const inputRefs             = [useRef(), useRef(), useRef(), useRef()];
  const [stepUp, setStepUp]   = useState(false);
  const phone = useSelector(s => s.auth.phone) || '';

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);
    if (value && index < 3) inputRefs[index + 1].current.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const isComplete = otp.every(d => d !== '');

  const handleSubmit = async () => {
    if (!isComplete || loading) return;
    setLoading(true);
    setError(false);

    try {
      const result = await securePost(`/booking/${bookingId}/verify-otp`, { otp: otp.join('') });

      if (result.sentinelVerdict === 'STEP_UP_AUTH') { setStepUp(true); return; }
      if (result.sentinelVerdict === 'BLOCK') { setErrMsg('Action blocked due to unusual activity.'); setError(true); return; }
      if (result.sentinelVerdict === 'TERMINATE_SESSION') { localStorage.removeItem('lt_token'); window.location.href = '/'; return; }

      navigate('/worker/job-in-progress', { state: { bookingId } });
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Incorrect OTP. Try again.');
      setError(true);
      setOtp(['', '', '', '']);
      inputRefs[0].current.focus();
    } finally {
      setLoading(false);
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
      <div className="px-6 py-5 sticky top-0 z-10 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 border border-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      </div>

      <div className="p-6 flex flex-col items-center flex-1 justify-center pb-32">
        <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Enter Customer OTP</h1>
        <p className="text-gray-500 font-medium mb-10 text-center max-w-xs">
          Ask the customer to show you their 4-digit PIN to start the job.
        </p>

        <div className={`flex gap-4 justify-center mb-6 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`w-16 h-16 text-center text-3xl font-extrabold rounded-2xl border-2 outline-none transition-colors
                ${error
                  ? 'border-red-500 text-red-600 bg-red-50'
                  : 'border-gray-200 text-gray-900 bg-gray-50 focus:border-blue-700 focus:bg-white'}`}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{errMsg}</p>}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={!isComplete || loading}
          className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2
            ${isComplete && !loading ? 'bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          ) : null}
          Start Job
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
