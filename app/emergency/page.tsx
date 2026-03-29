import { DashboardHeader } from '@/components/DashboardHeader'
import Link from 'next/link'
import { Phone, MapPin, ShieldAlert, Heart, Siren } from 'lucide-react'

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-oku-cream py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-100 p-10 rounded-[3.5rem] mb-12 flex items-start gap-8">
            <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <Siren size={32} />
            </div>
            <div>
                <h1 className="text-4xl font-display font-bold text-red-900 tracking-tighter mb-4">Immediate Assistance</h1>
                <p className="text-red-800/70 text-lg leading-relaxed">
                    If you are in immediate danger, experiencing a medical emergency, or considering self-harm, please contact emergency services immediately. OKU is not an emergency response service.
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="card-pebble bg-white border-red-100">
                <h3 className="text-xl font-bold text-oku-dark mb-4">India (24/7)</h3>
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-1">Police / Medical</p>
                        <p className="text-3xl font-display font-bold text-oku-dark">112</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-1">Vandrevala Foundation</p>
                        <p className="text-3xl font-display font-bold text-oku-dark">9999 666 555</p>
                    </div>
                </div>
            </div>
            <div className="card-pebble bg-white">
                <h3 className="text-xl font-bold text-oku-dark mb-4">International</h3>
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-1">USA / Canada</p>
                        <p className="text-3xl font-display font-bold text-oku-dark">988</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-1">UK (NHS)</p>
                        <p className="text-3xl font-display font-bold text-oku-dark">111</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center space-y-8">
            <p className="text-oku-taupe italic">Establish a safety plan with your therapist during your next scheduled session.</p>
            <Link href="/" className="btn-pebble bg-oku-dark text-white inline-flex">Back to Sanctuary</Link>
        </div>
      </div>
    </div>
  )
}
