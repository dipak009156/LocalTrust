import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../components/landing/Hero'
import Stats from '../components/landing/Stats'
import Services from '../components/landing/Services'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Testimonials from '../components/landing/Testimonials'
import WorkersCTA from '../components/landing/WorkersCTA'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Features />
        <HowItWorks />
        <Testimonials />
        <WorkersCTA />
      </main>
      <Footer />
    </div>
  )
}

