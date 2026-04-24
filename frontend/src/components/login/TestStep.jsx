import { useFlow } from '../../store/useFlow';

export default function TestStep() {
  const { testIndex, testQuestions, selectAnswer, nextQuestion, setStep } = useFlow();
  const q = testQuestions[testIndex];
  const total = testQuestions.length;
  const answered = q.selected != null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('skills')} className="text-slate-400 hover:text-slate-700 transition-colors">←</button>
          <h2 className="text-xl font-extrabold text-slate-900">Skill Test</h2>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Q{testIndex + 1} / {total}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {testQuestions.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all
            ${i < testIndex ? 'bg-green-500' : i === testIndex ? 'bg-blue-600' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
        <p className="font-bold text-slate-800 text-sm leading-relaxed mb-4">{q.q}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <label key={i}
              className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all
                ${q.selected === i ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <input
                type="radio"
                name={`q${testIndex}`}
                value={i}
                checked={q.selected === i}
                onChange={() => selectAnswer(i)}
                className="w-4 h-4 accent-blue-600 flex-shrink-0"
              />
              <span className="text-sm font-medium text-slate-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={nextQuestion}
        disabled={!answered}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98]
          ${answered ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        {testIndex === total - 1 ? 'Finish Test' : 'Next Question'}
      </button>
    </div>
  );
}