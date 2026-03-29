import { DashboardHeader } from '@/components/DashboardHeader'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-oku-cream py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader 
            title="Privacy Guard" 
            description="Our commitment to your digital and clinical sanctuary."
        />
        
        <div className="prose prose-stone max-w-none space-y-12 mt-16 text-oku-taupe leading-relaxed">
            <section className="bg-oku-lavender/20 p-8 rounded-[2.5rem] border border-oku-lavender/30">
                <h3 className="text-xl font-bold text-oku-dark mb-4">DPDP Act Compliance (India)</h3>
                <p>In accordance with the Digital Personal Data Protection Act (2023), OKU Therapy acts as a 'Data Fiduciary'. We only process your clinical and personal data with your explicit consent for the sole purpose of providing therapy and AI-driven clinical insights.</p>
            </section>

            <section>
                <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 tracking-tight">1. Clinical AI Processing</h3>
                <p>We use the OCI (Oku Core Intelligence) engine to summarize sessions. <strong>We do not use your private clinical data to train foundation models.</strong> Your data is used exclusively to generate your personalized SOAP notes and treatment plans.</p>
            </section>

            <section>
                <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 tracking-tight">2. Data Sovereignty</h3>
                <p>You have the 'Right to Erasure'. You may request the deletion of your account and all associated transcripts at any time through our Support portal.</p>
            </section>

            <section>
                <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 tracking-tight">3. Security Standards</h3>
                <p>All data is encrypted using AES-256 at rest. Communication is secured via TLS 1.3. We perform regular third-party security audits to maintain clinical-grade integrity.</p>
            </section>
        </div>

        <div className="mt-20 border-t border-oku-taupe/10 pt-10 text-center">
            <Link href="/" className="text-oku-purple font-black uppercase tracking-widest text-[10px] hover:underline">Return Home</Link>
        </div>
      </div>
    </div>
  )
}
