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
import { sendOTP as firebaseSendOTP, verifyOTP as firebaseVerifyOTP } from '../firebase/auth';
import api from '../utils/api';

export function useFlow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const flow = useSelector(s => s.flow);
  const auth = useSelector(s => s.auth);

  // ── Resend countdo wn ────────────────────────────────────────
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
    try {
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
    try {
      const user = await firebaseVerifyOTP(window.confirmationResult, otp);
      
      // Call backend API to initialize user
      await api.post('/auth/user-init', {
        firebaseUid: user.uid,
        role: auth.role,
        phone: flow.phone,
      });

      dispatch(loginSuccess({ phone: flow.phone, uid: user.uid }));

      if (auth.role === 'USER')        navigate('/dashboard');
      else if (auth.role === 'WORKER') dispatch(setStep('profile'));
      else if (auth.role === 'ADMIN')  navigate('/admin');
    } catch (err) {
      console.error("OTP verification error:", err);
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
    window.recaptchaVerifier?.clear();
    window.recaptchaVerifier = null;
    sendOTP();
  };

  return {
    // state
    ...flow,
    role: auth.role,

    // phone
    setPhone:      (v)   => dispatch(setPhone(v)),
    validatePhone: ()    => dispatch(validatePhoneAction()),
    sendOTP,

    // otp
    handleOtpInput: (val, idx) => dispatch(handleOtpInputAction({ val, idx })),
    verifyOTP,
    resendOTP,

    // navigation
    setStep: (s) => dispatch(setStep(s)),

    // worker onboarding
    setProfile:   (p)  => dispatch(setProfile(p)),
    setRadius:    (r)  => dispatch(setRadius(r)),
    toggleSkill:  (id) => dispatch(toggleSkill(id)),
    startTest:    ()   => dispatch(startTest()),
    selectAnswer: (i)  => dispatch(selectAnswer(i)),
    nextQuestion: ()   => dispatch(nextQuestion()),
    setKyc:       (k)  => dispatch(setKyc(k)),
  };
}