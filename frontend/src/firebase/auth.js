import { auth } from './config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export function initRecaptcha() {
  if (window.recaptchaVerifier) return;
  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible'
  });
}

export async function sendOTP(phone) {
  initRecaptcha();
  const result = await signInWithPhoneNumber(auth, '+91' + phone, window.recaptchaVerifier);
  return result;
}

export async function verifyOTP(confirmationResult, code) {
  const userCredential = await confirmationResult.confirm(code);
  return userCredential.user;
}