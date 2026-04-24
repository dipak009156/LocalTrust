import { useFlow } from '../../store/useFlow';
import { CITIES } from '../../data/constants';

export default function ProfileStep() {
  const { profile, setProfile, setStep } = useFlow();
  const valid = profile.name.trim() && profile.city;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep('otp')} className="text-slate-400 hover:text-slate-700 transition-colors">←</button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-0.5">Basic Profile</h2>
          <p className="text-slate-500 text-sm">Tell us a bit about yourself</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-blue-600 focus:bg-white focus:outline-none font-semibold transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">City</label>
          <select
            value={profile.city}
            onChange={e => setProfile({ ...profile, city: e.target.value })}
            className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-blue-600 focus:bg-white focus:outline-none font-semibold transition-all appearance-none"
          >
            <option value="">Select your city</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={() => setStep('location')}
        disabled={!valid}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98]
          ${valid ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        Continue
      </button>
    </div>
  );
}