export default function SubmittedStep() {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-4xl">
        🎉
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Application Submitted!</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Your application is under review. We'll verify your documents and
          notify you within <span className="font-bold text-blue-600">24–48 hours</span>.
        </p>
      </div>
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-left space-y-2">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">What happens next?</p>
        {['Document verification (1–2 days)', 'Background check', 'Onboarding call from our team', 'Start accepting jobs'].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</span>
            {item}
          </div>
        ))}
      </div>
      <a href="/" className="inline-block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base transition-all text-center">
        Back to Home
      </a>
    </div>
  );
}
