import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setStep, setPhone, validatePhone as validatePhoneAction,
  setLoading, setPhoneError, goToOtp,
  handleOtpInput as handleOtpInputAction,
  setOtpError, setOtpShake, tickResend, resetResend,
  setProfile, setRadius, toggleSkill,
  startTest, selectAnswer, nextQuestion,
  setKyc,
} from './flowSlice';
import { loginSuccess } from './authSlice';

// ── Demo credentials ─────────────────────────────────────────
// Phone: 9699236125  |  OTP: 159753
export const DEMO_PHONE = '9699236125';
export const DEMO_OTP   = '159753';

// When VITE_DEMO_MODE=true in .env, Firebase is skipped entirely
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export function useFlow() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const flow      = useSelector(s => s.flow);
  const auth      = useSelector(s => s.auth);

  // ── Resend countdown ────────────────────────────────────────
  useEffect(() => {
    if (flow.step !== 'otp' || flow.resendTimer <= 0) return;
    const id = setInterval(() => dispatch(tickResend()), 1000);
    return () => clearInterval(id);
  }, [flow.step, flow.resendTimer, dispatch]);

  // ── Send OTP ────────────────────────────────────────────────
  const sendOTP = async () => {
    const digits = flow.phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      dispatch(setPhoneError('Enter a valid 10-digit number'));
      return;
    }
    dispatch(setLoading(true));

    if (DEMO_MODE) {
      // Skip Firebase — just move to OTP screen after a short delay
      await new Promise(r => setTimeout(r, 700));
      dispatch(goToOtp());
      dispatch(setLoading(false));
      return;
    }

    // Real Firebase path
    try {
      const { sendOTP: firebaseSendOTP } = await import('../firebase/auth');
      const result = await firebaseSendOTP(digits);
      window.confirmationResult = result;
      dispatch(goToOtp());
    } catch (err) {
      dispatch(setPhoneError('Failed to send OTP. Try again.'));
      window.recaptchaVerifier?.clear();
      window.recaptchaVerifier = null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────
  const verifyOTP = async () => {
    const otp = flow.otpDigits.join('');
    if (otp.length !== 6) return;
    dispatch(setLoading(true));

    if (DEMO_MODE) {
      // Demo mode — validate against hardcoded OTP
      await new Promise(r => setTimeout(r, 500));

      if (otp !== DEMO_OTP) {
        dispatch(setOtpError(`Demo OTP is ${DEMO_OTP}. Try again.`));
        dispatch(setOtpShake(true));
        setTimeout(() => dispatch(setOtpShake(false)), 600);
        dispatch(setLoading(false));
        return;
      }

      dispatch(loginSuccess({ phone: flow.phone, uid: 'demo-uid-' + Date.now() }));

      if (auth.role === 'USER')        navigate('/customer/home');
      else if (auth.role === 'WORKER') dispatch(setStep('profile'));
      else if (auth.role === 'ADMIN')  navigate('/admin');

      dispatch(setLoading(false));
      return;
    }

    // Real Firebase path
    try {
      const { verifyOTP: firebaseVerifyOTP } = await import('../firebase/auth');
      const user = await firebaseVerifyOTP(window.confirmationResult, otp);

      const { default: api } = await import('../utils/api');
      await api.post('/auth/user-init', {
        firebaseUid: user.uid,
        role: auth.role,
        phone: flow.phone,
      });

      dispatch(loginSuccess({ phone: flow.phone, uid: user.uid }));

      if (auth.role === 'USER')        navigate('/customer/home');
      else if (auth.role === 'WORKER') dispatch(setStep('profile'));
      else if (auth.role === 'ADMIN')  navigate('/admin');
    } catch (err) {
      console.error('OTP verification error:', err);
      dispatch(setOtpError('Invalid OTP. Please try again.'));
      dispatch(setOtpShake(true));
      setTimeout(() => dispatch(setOtpShake(false)), 600);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Resend ──────────────────────────────────────────────────
  const resendOTP = () => {
    dispatch(resetResend());
    if (!DEMO_MODE) {
      window.recaptchaVerifier?.clear();
      window.recaptchaVerifier = null;
    }
    sendOTP();
  };

  return {
    ...flow,
    role: auth.role,

    setPhone:      (v)   => dispatch(setPhone(v)),
    validatePhone: ()    => dispatch(validatePhoneAction()),
    sendOTP,

    handleOtpInput: (val, idx) => dispatch(handleOtpInputAction({ val, idx })),
    verifyOTP,
    resendOTP,

    setStep: (s) => dispatch(setStep(s)),

    setProfile:   (p)  => dispatch(setProfile(p)),
    setRadius:    (r)  => dispatch(setRadius(r)),
    toggleSkill:  (id) => dispatch(toggleSkill(id)),
    startTest:    ()   => dispatch(startTest()),
    selectAnswer: (i)  => dispatch(selectAnswer(i)),
    nextQuestion: ()   => dispatch(nextQuestion()),
    setKyc:       (k)  => dispatch(setKyc(k)),
  };
}