/**
 * useFlow — compatibility hook used by all login step components.
 * Reads state from Redux (flowSlice + authSlice) and exposes thunk-like actions.
 *
 * OTP: currently mocked — wire up MSG91 in sendOTP / verifyOTP when ready.
 */
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

export function useFlow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const flow  = useSelector(s => s.flow);
  const auth  = useSelector(s => s.auth);

  // ── Resend countdown (runs only when on otp step) ──────────
  useEffect(() => {
    if (flow.step !== 'otp' || flow.resendTimer <= 0) return;
    const id = setInterval(() => dispatch(tickResend()), 1000);
    return () => clearInterval(id);
  }, [flow.step, flow.resendTimer, dispatch]);

  // ── Send OTP ───────────────────────────────────────────────
  // TODO: replace mock with MSG91 → POST /api/auth/send-otp { phone }
  const sendOTP = async () => {
    const digits = flow.phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      dispatch(setPhoneError('Enter a valid 10-digit number'));
      return;
    }
    dispatch(setLoading(true));
    try {
      // ── MSG91 integration point ─────────────────────────────
      // const res = await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone: digits }),
      // });
      // if (!res.ok) throw new Error();
      await new Promise(r => setTimeout(r, 900)); // mock delay
      dispatch(goToOtp());          // moves step to 'otp', resets timer to 30s
    } catch {
      dispatch(setPhoneError('Failed to send OTP. Try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Verify OTP ─────────────────────────────────────────────
  // TODO: replace mock with MSG91 verify → POST /api/auth/verify-otp { phone, otp }
  const verifyOTP = async () => {
    const otp = flow.otpDigits.join('');
    if (otp.length !== 6) return;
    dispatch(setLoading(true));
    try {
      // ── MSG91 integration point ─────────────────────────────
      // const res = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone: flow.phone, otp }),
      // });
      // if (!res.ok) throw new Error('invalid');
      await new Promise(r => setTimeout(r, 900)); // mock delay

      dispatch(loginSuccess({ phone: flow.phone }));

      // Role-based routing after OTP verified
      if (auth.role === 'USER') {
        navigate('/dashboard');
      } else if (auth.role === 'WORKER') {
        dispatch(setStep('profile'));   // continue onboarding flow
      } else if (auth.role === 'ADMIN') {
        navigate('/admin');
      }
    } catch {
      dispatch(setOtpError('Invalid OTP. Please try again.'));
      dispatch(setOtpShake(true));
      setTimeout(() => dispatch(setOtpShake(false)), 600);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Resend = reset timer + re-send
  const resendOTP = () => {
    dispatch(resetResend());
    sendOTP();
  };

  return {
    // ── state ───────────────────────────────────────────────
    ...flow,
    role: auth.role,

    // ── phone ───────────────────────────────────────────────
    setPhone:      (v)   => dispatch(setPhone(v)),
    validatePhone: ()    => dispatch(validatePhoneAction()),
    sendOTP,                            // also used as resend in OtpStep

    // ── otp ─────────────────────────────────────────────────
    handleOtpInput: (val, idx) => dispatch(handleOtpInputAction({ val, idx })),
    verifyOTP,
    resendOTP,

    // ── navigation / step ───────────────────────────────────
    setStep: (s) => dispatch(setStep(s)),

    // ── worker profile ──────────────────────────────────────
    setProfile:    (p)  => dispatch(setProfile(p)),
    setRadius:     (r)  => dispatch(setRadius(r)),
    toggleSkill:   (id) => dispatch(toggleSkill(id)),
    startTest:     ()   => dispatch(startTest()),
    selectAnswer:  (i)  => dispatch(selectAnswer(i)),
    nextQuestion:  ()   => dispatch(nextQuestion()),
    setKyc:        (k)  => dispatch(setKyc(k)),
  };
}
