import { useFlow, DEMO_PHONE, DEMO_OTP } from '../../store/useFlow';

export default function PhoneStep() {
  const { phone, phoneValid, phoneError, loading, role,
          setPhone, validatePhone, sendOTP } = useFlow();

  const HEADINGS = {
    USER:   { title: 'Welcome to TrustWork', sub: 'Enter your mobile number to continue' },
    WORKER: { title: 'Join as a Partner',    sub: 'Enter your mobile number to get started' },
    ADMIN:  { title: 'Admin Login',          sub: 'Enter your mobile number' },
  };
  const heading = HEADINGS[role] ?? HEADINGS.USER;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{heading.title}</h1>
        <p className="text-slate-500 text-sm">{heading.sub}</p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mobile Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-500 font-bold text-sm border-r border-slate-300 pr-3">+91</span>
          </div>
          <input
            type="text"
            value={phone}
            onChange={e => { setPhone(e.target.value); validatePhone(); }}
            onKeyDown={e => e.key === 'Enter' && phoneValid && sendOTP()}
            maxLength={10}
            placeholder="9876543210"
            inputMode="numeric"
            className="w-full pl-16 pr-4 py-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-blue-600 focus:bg-white focus:outline-none text-lg font-bold tracking-widest transition-all"
          />
        </div>
        {phoneError && <p className="text-red-500 text-xs font-semibold pl-1 pt-1">{phoneError}</p>}
      </div>

      <button
        onClick={sendOTP}
        disabled={!phoneValid || loading}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2
          ${phoneValid ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        {loading && <Spinner />}
        {loading ? 'Sending OTP...' : 'Continue →'}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}