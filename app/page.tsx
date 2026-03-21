import Header from '@/components/Header'
import Link from 'next/link'
import { ArrowRight, ClipboardCheck, MessageCircle, Heart, Shield } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-oku-cream relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-oku-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-oku-purple/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
      
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-white/50 backdrop-blur-sm border border-oku-taupe/10 rounded-full mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple">Welcome to OKU Therapy</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-bold text-oku-dark mb-8 tracking-tighter leading-[0.9]">
            Therapy that <br />
            <span className="italic font-script text-oku-purple lowercase text-6xl md:text-8xl">feels</span> like home.
          </h1>
          <p className="text-xl md:text-2xl text-oku-taupe max-w-2xl mx-auto mb-12 font-display italic leading-relaxed">
            Discover a sanctuary for your mind. Start with a self-assessment or book a free 15-minute consultation with our specialized therapists.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/assessments" className="btn-primary py-6 px-10 text-lg flex items-center justify-center gap-2">
              Take Free Assessment <ArrowRight size={20} />
            </Link>
            <Link href="/therapists" className="bg-white text-oku-dark border border-oku-taupe/20 py-6 px-10 rounded-pill text-lg font-bold hover:bg-oku-cream-warm/50 transition-all flex items-center justify-center gap-2">
              Find Your Therapist
            </Link>
          </div>
        </div>
      </section>

      {/* Entry Points Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Assessment Card */}
            <div className="bg-white/80 backdrop-blur-md p-12 rounded-[3.5rem] border border-white shadow-2xl group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-oku-purple/10 rounded-2xl flex items-center justify-center text-oku-purple mb-8 group-hover:bg-oku-purple group-hover:text-white transition-colors">
                <ClipboardCheck size={32} />
              </div>
              <h2 className="text-4xl font-display font-bold text-oku-dark mb-4">Start with a Wellness Check-in</h2>
              <p className="text-lg text-oku-taupe mb-10 leading-relaxed">
                Not sure where to begin? Our clinically-validated assessments for ADHD, Anxiety, OCD, and Depression help you understand your current mental state.
              </p>
              <Link href="/assessments" className="flex items-center gap-2 text-oku-purple font-black uppercase tracking-widest text-xs">
                Explore Assessments <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Trial Call Card */}
            <div className="bg-oku-dark p-12 rounded-[3.5rem] shadow-2xl group hover:-translate-y-2 transition-all duration-500 text-white">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-oku-purple transition-colors">
                <MessageCircle size={32} />
              </div>
              <h2 className="text-4xl font-display font-bold mb-4">Free 15-Min Trial Call</h2>
              <p className="text-lg text-oku-cream/60 mb-10 leading-relaxed">
                Connect with a licensed professional for a brief, no-obligation conversation. Discuss your needs and see if the therapist's approach resonates with you.
              </p>
              <Link href="/therapists" className="flex items-center gap-2 text-oku-purple font-black uppercase tracking-widest text-xs">
                Book Trial Call <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="flex flex-col items-center">
              <Heart className="text-oku-purple mb-6" size={40} />
              <h3 className="text-2xl font-display font-bold text-oku-dark mb-4">Compassionate Care</h3>
              <p className="text-oku-taupe">Trauma-informed support that honors your unique lived experience.</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="text-oku-purple mb-6" size={40} />
              <h3 className="text-2xl font-display font-bold text-oku-dark mb-4">Safe & Secure</h3>
              <p className="text-oku-taupe">Your privacy is our priority. Fully encrypted and confidential sessions.</p>
            </div>
            <div className="flex flex-col items-center">
              <ClipboardCheck className="text-oku-purple mb-6" size={40} />
              <h3 className="text-2xl font-display font-bold text-oku-dark mb-4">Expert Match</h3>
              <p className="text-oku-taupe">We help you find the right therapist based on your assessment results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 px-6 border-t border-oku-taupe/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-4xl font-display font-bold text-oku-dark tracking-tighter">OKU<span className="text-oku-purple">.</span></div>
          <p className="text-oku-taupe text-sm">© 2026 OKU Therapy. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs uppercase tracking-widest font-black text-oku-taupe hover:text-oku-purple transition-colors">Privacy</Link>
            <Link href="/contact" className="text-xs uppercase tracking-widest font-black text-oku-taupe hover:text-oku-purple transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
