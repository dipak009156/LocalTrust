import { useSelector } from 'react-redux';
import PhoneStep from '../components/login/PhoneStep';
import OtpStep from '../components/login/OtpStep';
import ProfileStep from '../components/login/ProfileStep';
import LocationStep from '../components/login/LocationStep';
import SkillsStep from '../components/login/SkillStep';
import TestStep from '../components/login/TestStep';
import AadhaarStep from '../components/login/AdhaarStep';
import SubmittedStep from '../components/login/SubmittedStep';
import { PROGRESS_MAP, STEP_LABELS } from '../data/constants';

const STEP_COMPONENTS = {
  phone: PhoneStep,
  otp: OtpStep,
  // WORKER-only steps
  profile: ProfileStep,
  location: LocationStep,
  skills: SkillsStep,
  test: TestStep,
  aadhaar: AadhaarStep,
  submitted: SubmittedStep,
};

export default function LoginPage() {
  const step = useSelector(s => s.flow.step);
  const role = useSelector(s => s.auth.role);
  const StepComponent = STEP_COMPONENTS[step] ?? PhoneStep;

  const isOnboarding = !['phone', 'otp'].includes(step);
  const progress = PROGRESS_MAP[step] ?? 0;
  const label = STEP_LABELS[step] ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden">

          {/* Top brand bar */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-5 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-extrabold text-white text-lg">T</div>
            <span className="font-bold text-white text-lg tracking-tight">TrustWork</span>
            {role && (
              <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full
                ${role === 'WORKER' ? 'bg-orange-400/90 text-white' :
                  role === 'ADMIN'  ? 'bg-red-500/90 text-white' :
                                      'bg-white/20 text-white'}`}>
                {role === 'USER' ? 'Customer' : role === 'WORKER' ? 'Partner' : 'Admin'}
              </span>
            )}
          </div>

          {/* Worker progress bar */}
          {role === 'WORKER' && isOnboarding && (
            <div className="px-8 pt-5">
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>{label}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Step content */}
          <div className="px-8 py-8">
            <StepComponent />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By continuing, you agree to our{' '}
          <span className="text-blue-600 font-semibold cursor-pointer">Terms</span> &amp;{' '}
          <span className="text-blue-600 font-semibold cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
