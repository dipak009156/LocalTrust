import { useFlow } from '../../store/useFlow';

export default function LocationStep() {
  const { radius, setRadius, setStep } = useFlow();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep('profile')} className="text-slate-400 hover:text-slate-700 transition-colors">←</button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-0.5">Service Area</h2>
          <p className="text-slate-500 text-sm">Where will you work from?</p>
        </div>
      </div>

      <div className="w-full h-44 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 gap-2">
        <span className="text-3xl">📍</span>
        <span className="text-sm font-semibold">Map will load here</span>
        <span className="text-xs text-slate-400">Drop a pin on your location</span>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-700">Service Radius</span>
          <span className="text-sm font-extrabold text-blue-600">{radius} km</span>
        </div>
        <input
          type="range" min="5" max="30"
          value={radius}
          onChange={e => setRadius(Number(e.target.value))}
          className="w-full h-2 accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
          <span>5 km</span><span>30 km</span>
        </div>
      </div>

      <button
        onClick={() => setStep('skills')}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-blue-100"
      >
        Continue
      </button>
    </div>
  );
}