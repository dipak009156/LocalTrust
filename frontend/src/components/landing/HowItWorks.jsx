

const steps = [
  { num: '01', title: 'Pick a Service', desc: 'Choose what you need at a fixed price.' },
  { num: '02', title: 'Get Matched', desc: 'A verified local expert is dispatched immediately.' },
  { num: '03', title: 'Confirm Arrival', desc: 'Verify their ID and job starts.' },
  { num: '04', title: 'Pay After Work', desc: 'Money releases only when you say so.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-blue-900 text-white py-12 md:py-24 px-6 lg:px-12 rounded-2xl sm:rounded-3xl md:rounded-[3rem] mx-4 lg:mx-auto max-w-[calc(100%-2rem)] lg:max-w-7xl mb-12 md:mb-24">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 md:mb-16 px-2">From booking to done in under 60 minutes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative px-4">
              <div className="text-3xl sm:text-4xl font-bold text-blue-300 mb-2 sm:mb-4">{step.num}</div>
              <h4 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">{step.title}</h4>
              <p className="text-blue-100 text-sm">{step.desc}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-6 w-12 h-0.5 bg-blue-700"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}