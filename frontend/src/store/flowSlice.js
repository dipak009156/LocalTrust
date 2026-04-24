import { createSlice } from '@reduxjs/toolkit';
import { TEST_QUESTIONS } from '../data/constants';

const initialState = {
  // Step control
  step: 'phone',       // 'phone' | 'otp' | 'profile' | 'location' | 'skills' | 'test' | 'aadhaar' | 'submitted'

  // Phone step
  phone: '',
  phoneValid: false,
  phoneError: '',
  loading: false,

  // OTP step
  otpDigits: ['', '', '', '', '', ''],
  otpError: '',
  otpShake: false,
  resendTimer: 30,

  // Profile step (WORKER)
  profile: { name: '', city: '' },

  // Location step (WORKER)
  radius: 10,

  // Skills step (WORKER)
  selectedSkills: [],

  // Test step (WORKER)
  testIndex: 0,
  testQuestions: TEST_QUESTIONS.map(q => ({ ...q, selected: null })),

  // KYC step (WORKER)
  kyc: { front: false, back: false, selfie: false },
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setStep(state, action) { state.step = action.payload; },
    setPhone(state, action) {
      state.phone = action.payload;
      const digits = action.payload.replace(/\D/g, '');
      state.phoneValid = digits.length === 10;
      state.phoneError = '';
    },
    validatePhone(state) {
      const digits = state.phone.replace(/\D/g, '');
      if (!digits) state.phoneError = 'Enter a mobile number';
      else if (digits.length !== 10) state.phoneError = 'Must be 10 digits';
      else state.phoneError = '';
    },
    setLoading(state, action) { state.loading = action.payload; },
    setPhoneError(state, action) { state.phoneError = action.payload; },
    goToOtp(state) { state.step = 'otp'; state.resendTimer = 30; state.otpDigits = ['','','','','','']; state.otpError = ''; },
    handleOtpInput(state, action) {
      const { val, idx } = action.payload;
      state.otpDigits[idx] = val;
    },
    setOtpError(state, action) { state.otpError = action.payload; },
    setOtpShake(state, action) { state.otpShake = action.payload; },
    tickResend(state) { if (state.resendTimer > 0) state.resendTimer -= 1; },
    resetResend(state) { state.resendTimer = 30; },
    setProfile(state, action) { state.profile = action.payload; },
    setRadius(state, action) { state.radius = action.payload; },
    toggleSkill(state, action) {
      const id = action.payload;
      if (state.selectedSkills.includes(id)) {
        state.selectedSkills = state.selectedSkills.filter(s => s !== id);
      } else {
        state.selectedSkills.push(id);
      }
    },
    startTest(state) { state.testIndex = 0; state.testQuestions = TEST_QUESTIONS.map(q => ({ ...q, selected: null })); state.step = 'test'; },
    selectAnswer(state, action) {
      state.testQuestions[state.testIndex].selected = action.payload;
    },
    nextQuestion(state) {
      if (state.testIndex < state.testQuestions.length - 1) {
        state.testIndex += 1;
      } else {
        state.step = 'aadhaar';
      }
    },
    setKyc(state, action) { state.kyc = action.payload; },
    resetFlow() { return initialState; },
  },
});

export const {
  setStep, setPhone, validatePhone, setLoading, setPhoneError,
  goToOtp, handleOtpInput, setOtpError, setOtpShake, tickResend, resetResend,
  setProfile, setRadius, toggleSkill, startTest, selectAnswer, nextQuestion,
  setKyc, resetFlow,
} = flowSlice.actions;

export default flowSlice.reducer;
