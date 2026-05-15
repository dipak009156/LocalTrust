import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setStep, setPhone, validatePhone as validatePhoneAction,
  setLoading, setPhoneError, goToOtp,
  handleOtpInput as handleOtpInputAction,
  setOtpError, setOtpShake, tickResend, resetResend,
  setProfile, setRadius, setLocation, toggleSkill,
  startTest, selectAnswer, nextQuestion,
  setKyc,
} from './flowSlice';
import { loginSuccess } from './authSlice';
import { SKILLS_LIST } from '../data/constants';

// ── Demo credentials (only used when VITE_DEMO_MODE=true) ────────────────────
export const DEMO_PHONE = '9699236125';
export const DEMO_OTP   = '159753';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export function useFlow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const flow     = useSelector(s => s.flow);
  const auth     = useSelector(s => s.auth);

  // ── Resend countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (flow.step !== 'otp' || flow.resendTimer <= 0) return;
    const id = setInterval(() => dispatch(tickResend()), 1000);
    return () => clearInterval(id);
  }, [flow.step, flow.resendTimer, dispatch]);

  // ── Send OTP ────────────────────────────────────────────────────────────────
  const sendOTP = async () => {
    const digits = flow.phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      dispatch(setPhoneError('Enter a valid 10-digit number'));
      return;
    }
    dispatch(setLoading(true));

    if (DEMO_MODE) {
      // Skip everything — just move to OTP screen
      await new Promise(r => setTimeout(r, 700));
      dispatch(goToOtp());
      dispatch(setLoading(false));
      return;
    }

    // Real path — call our backend which sends SMS via Fast2SMS
    try {
      const { default: api } = await import('../utils/api');
      await api.post('/auth/send-otp', {
        phone: digits,
        role: auth.role === 'ADMIN' ? 'USER' : auth.role,
      });
      dispatch(goToOtp());
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Try again.';
      dispatch(setPhoneError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const verifyOTP = async () => {
    const otp = flow.otpDigits.join('');
    if (otp.length !== 6) return;
    dispatch(setLoading(true));

    if (DEMO_MODE) {
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

    // Real path — verify OTP on backend, get JWT
    try {
      const { default: api } = await import('../utils/api');
      const { setToken }     = await import('../firebase/auth');

      const digits   = flow.phone.replace(/\D/g, '');

      // Admin uses a dedicated endpoint; USER/WORKER use verify-otp
      const endpoint = auth.role === 'ADMIN' ? '/auth/admin-login' : '/auth/verify-otp';

      // 1. Validate OTP on backend → get JWT + account
      const { data } = await api.post(endpoint, {
        phone: digits,
        otp,
        ...(auth.role !== 'ADMIN' && { role: auth.role }),
      });

      // 2. Store JWT in localStorage — api.js will attach it to every request
      setToken(data.token);

      // 3. Save to Redux
      const account = data.account ?? {};
      dispatch(loginSuccess({ phone: flow.phone, uid: account.id, ...account }));

      // Also save phone + name at top level for easy access in UI
      const { setPhone: setAuthPhone, setName: setAuthName } = await import('./authSlice');
      dispatch(setAuthPhone(flow.phone));
      if (account.name) dispatch(setAuthName(account.name));

      // 4. Navigate based on role
      if (auth.role === 'USER') {
        navigate('/customer/home');
      } else if (auth.role === 'WORKER') {
        if (account.status === 'verified') {
          navigate('/worker/dashboard');
        } else if (account.name) {
          // They already filled out their profile but aren't verified yet
          dispatch(setStep('submitted'));
        } else {
          dispatch(setStep('profile'));
        }
      } else if (auth.role === 'ADMIN') {
        navigate('/admin');
      }


    } catch (err) {
      console.error('OTP verification error:', err);
      const msg = err.response?.data?.message || err.message || 'Invalid OTP. Please try again.';
      dispatch(setOtpError(msg));
      dispatch(setOtpShake(true));
      setTimeout(() => dispatch(setOtpShake(false)), 600);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Resend ──────────────────────────────────────────────────────────────────
  const resendOTP = () => {
    dispatch(resetResend());
    sendOTP();
  };

  // ── Submit Worker Onboarding ─────────────────────────────────────────────────
  // Called from SubmittedStep — saves everything to backend in one shot.
  const submitWorkerOnboarding = async () => {
    dispatch(setLoading(true));
    try {
      const { default: api } = await import('../utils/api');

      // 1. Save profile (name + city + serviceRadius + home coords)
      await api.patch('/worker/profile', {
        name:          flow.profile.name,
        city:          flow.profile.city,
        serviceRadius: flow.radius,
        ...(flow.homeLat && { homeLat: flow.homeLat, homeLng: flow.homeLng }),
      });

      // 2. Save skills — map slug IDs to category IDs from seeded DB
      //    We fetch categories from backend and match by name
      const { data: categories } = await api.get('/booking/categories');
      const skillPayload = flow.selectedSkills.map(skillId => {
        const skillMeta = SKILLS_LIST.find(s => s.id === skillId);
        const cat = categories.find(c =>
          c.name.toLowerCase() === skillMeta?.label.toLowerCase()
        );
        return cat ? { categoryId: cat.id, badge: 'skill_tested' } : null;
      }).filter(Boolean);

      if (skillPayload.length > 0) {
        await api.post('/worker/skills', { skills: skillPayload });
      }

      // 3. KYC — in this flow the files were selected locally;
      //    actual upload to Firebase Storage happens here or is deferred.
      //    For now we just mark the step complete.
      //    When Firebase Storage is integrated, upload files and send URLs.

      dispatch(setStep('submitted'));
    } catch (err) {
      console.error('Onboarding submission error:', err);
      dispatch(setOtpError('Submission failed. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
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
    setLocation:  (l)  => dispatch(setLocation(l)),
    toggleSkill:  (id) => dispatch(toggleSkill(id)),
    startTest:    ()   => dispatch(startTest()),
    selectAnswer: (i)  => dispatch(selectAnswer(i)),
    nextQuestion: ()   => dispatch(nextQuestion()),
    setKyc:       (k)  => dispatch(setKyc(k)),
    submitWorkerOnboarding,
  };
}