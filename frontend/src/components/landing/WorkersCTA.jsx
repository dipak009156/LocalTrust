import Button from '../ui/Button'

export default function WorkersCTA() {
  return (
    <section id="workers" className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-100">
      <div className="bg-orange-50 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-10 border border-orange-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Are you a professional helper?</h2>
          <p className="text-gray-600 text-lg">Join the TrustWork family. Get jobs, get paid instantly, and build a real name.</p>
        </div>
        <Button variant="secondary" className="px-10 py-5 rounded-2xl">
          Join as a Partner
        </Button>
      </div>
    </section>
  )
}