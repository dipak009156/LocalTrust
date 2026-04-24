import { useFlow } from '../../store/useFlow';
import { SKILLS_LIST } from '../../data/constants';

export default function SkillsStep() {
  const { selectedSkills, toggleSkill, startTest, setStep } = useFlow();
  const valid = selectedSkills.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep('location')} className="text-slate-400 hover:text-slate-700 transition-colors">←</button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-0.5">Your Skills</h2>
          <p className="text-slate-500 text-sm">Select all services you offer</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SKILLS_LIST.map(skill => (
          <button
            key={skill.id}
            onClick={() => toggleSkill(skill.id)}
            className={`p-4 border-2 rounded-2xl font-semibold text-sm text-left transition-all hover:scale-[1.02]
              ${selectedSkills.includes(skill.id)
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-slate-50 text-slate-600'}`}
          >
            <span className="block text-2xl mb-1">{skill.icon}</span>
            <span>{skill.label}</span>
          </button>
        ))}
      </div>

      {!valid && <p className="text-xs text-slate-400 text-center">Select at least one skill to continue</p>}

      <button
        onClick={startTest}
        disabled={!valid}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98]
          ${valid ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        Continue
      </button>
    </div>
  );
}