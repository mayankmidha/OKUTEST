import { DashboardHeader } from '@/components/DashboardHeader'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-oku-cream py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader 
            title="Terms of Service" 
            description="Last updated: March 29, 2026"
        />
        
        <div className="prose prose-stone max-w-none space-y-12 mt-16 text-oku-taupe leading-relaxed">
            <section>
                <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 tracking-tight">1. Acceptance of Terms</h3>
                <p>By accessing and using the OKU Therapy Platform, you agree to be bound by these terms. If you do not agree, please do not use our services.</p>
            </section>

            <section>
                <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 tracking-tight">2. Clinical Disclaimer</h3>
                <p>OKU is a technology platform that facilitates therapy. We are not a medical provider. The therapists on our platform are independent contractors. OKU does not provide emergency psychiatric services.</p>
            </section>

            <section>
                <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 tracking-tight">3. Privacy & Data</h3>
                <p>Your data is handled in accordance with our Privacy Policy and applicable privacy obligations. We use AI to process transcripts for clinical summaries and drafting support, and we do not sell this data for marketing purposes.</p>
            </section>

            <section>
                <h3 className="text-2xl font-display font-bold text-oku-dark mb-4 tracking-tight">4. Cancellation Policy</h3>
                <p>Appointments must be cancelled at least 24 hours in advance to avoid a late-cancellation fee. No-shows will be charged the full session rate.</p>
            </section>
        </div>

        <div className="mt-20 border-t border-oku-taupe/10 pt-10 text-center">
            <Link href="/" className="text-oku-purple font-black uppercase tracking-widest text-[10px] hover:underline">Return Home</Link>
        </div>
      </div>
    </div>
  )
}
