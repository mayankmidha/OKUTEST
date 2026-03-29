import { DashboardHeader } from '@/components/DashboardHeader'
import Link from 'next/link'
import { Plus, ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: "How does OKU AI support my therapy?",
    a: "OKU AI (OCI) acts as a clinical scribe and executive assistant. It helps therapists automate SOAP notes and helps patients atomize daunting daily tasks. It does not replace the human clinician but enhances the continuity of care between sessions."
  },
  {
    q: "Is my data secure and private?",
    a: "Yes. We use AES-256 encryption for all data at rest and TLS 1.3 for data in transit. We are designed with HIPAA and India's DPDP Act standards in mind, ensuring your clinical records are only accessible to you and your assigned therapist."
  },
  {
    q: "How do I book a session?",
    a: "Navigate to 'Our Collective' to find a therapist that matches your needs. You can book a consultation directly through their profile using our integrated payment gateway (Stripe or Razorpay)."
  },
  {
    q: "What is the ADHD Executive Workspace?",
    a: "It's a specialized tool for neurodivergent users. It features an AI Atomizer to break down tasks, a visual Pomodoro timer, and a 'Spoon Tracker' to manage daily energy levels."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-oku-cream py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader 
            title="Clarification" 
            description="Frequently asked questions about the OKU ecosystem."
        />
        
        <div className="space-y-6 mt-16">
            {faqs.map((f, i) => (
                <div key={i} className="card-pebble bg-white hover:border-oku-purple/30 group">
                    <h3 className="text-xl font-bold text-oku-dark mb-4 flex justify-between items-center">
                        {f.q}
                        <ChevronDown className="text-oku-taupe/30 group-hover:text-oku-purple transition-all" />
                    </h3>
                    <p className="text-oku-taupe leading-relaxed">{f.a}</p>
                </div>
            ))}
        </div>

        <div className="mt-20 text-center">
            <p className="text-oku-taupe mb-8">Can't find what you're looking for?</p>
            <Link href="/contact" className="btn-pebble bg-oku-dark text-white inline-flex">Contact Support</Link>
        </div>
      </div>
    </div>
  )
}
