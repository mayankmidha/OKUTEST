import Link from 'next/link'
import { Mail, Phone, AlertTriangle, HelpCircle, MessageSquare, ChevronLeft, ShieldCheck } from 'lucide-react'
import { FAQAccordion, ContactForm } from './SupportClient'

export const dynamic = 'force-dynamic'

const crisisLines = [
  {
    org: 'iCall',
    number: '9152987821',
    desc: 'TISS-backed mental health helpline (Mon–Sat, 8am–10pm)',
    bg: 'bg-oku-peach/60',
  },
  {
    org: 'Vandrevala Foundation',
    number: '1860-2662-345',
    desc: '24/7 free mental health helpline across India',
    bg: 'bg-oku-mint/60',
  },
  {
    org: 'NIMHANS',
    number: '080-46110007',
    desc: 'National Institute of Mental Health and Neurosciences helpline',
    bg: 'bg-oku-lavender/60',
  },
  {
    org: 'iCall (WhatsApp)',
    number: '9152987821',
    desc: 'Also available on WhatsApp for text-based support',
    bg: 'bg-oku-babyblue/60',
  },
]

export default function ClientSupportPage() {
  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Help Desk</span>
            </div>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              We&rsquo;re <span className="text-oku-purple-dark italic">Here.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
              Support that holds you — practically and gently.
            </p>
          </div>
        </div>

        <div className="grid xl:grid-cols-12 gap-12">
          {/* Left column: FAQ + Contact */}
          <div className="xl:col-span-8 space-y-12">
            {/* FAQ Accordion */}
            <section className="card-glass-3d !p-12 !bg-white/40">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-[1rem] bg-oku-lavender flex items-center justify-center text-oku-purple-dark">
                  <HelpCircle size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="heading-display text-3xl text-oku-darkgrey tracking-tight">
                    Frequently Asked <span className="italic text-oku-purple-dark">Questions</span>
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30 mt-1">Common questions answered</p>
                </div>
              </div>
              <FAQAccordion />
            </section>

            {/* Contact Form */}
            <section className="card-glass-3d !p-12 !bg-oku-butter">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-[1rem] bg-white/60 flex items-center justify-center text-oku-purple-dark">
                  <MessageSquare size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="heading-display text-3xl text-oku-darkgrey tracking-tight">
                    Contact <span className="italic text-oku-purple-dark">Support</span>
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30 mt-1">We respond within 24 hours</p>
                </div>
              </div>
              <ContactForm />
            </section>
          </div>

          {/* Right column: Crisis resources + direct channels */}
          <div className="xl:col-span-4 space-y-10">
            {/* Crisis Resources */}
            <section className="card-glass-3d !p-10 !bg-oku-peach/30 border-2 border-oku-peach/40">
              <div className="flex items-center gap-3 mb-8">
                <AlertTriangle size={20} className="text-oku-darkgrey/60" />
                <div>
                  <h3 className="heading-display text-xl text-oku-darkgrey">Crisis Resources</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30 mt-0.5">India Mental Health Helplines</p>
                </div>
              </div>

              <div className="space-y-4">
                {crisisLines.map((line, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-[1.5rem] ${line.bg} border border-white/60`}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/50 mb-1">{line.org}</p>
                    <a
                      href={`tel:${line.number.replace(/[^0-9]/g, '')}`}
                      className="text-xl font-black text-oku-darkgrey tracking-tight hover:text-oku-purple-dark transition-colors block"
                    >
                      {line.number}
                    </a>
                    <p className="text-[10px] text-oku-darkgrey/40 mt-1 font-display italic">{line.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 rounded-[1.5rem] bg-white/40 border border-white/60">
                <p className="text-[11px] text-oku-darkgrey/50 font-display italic leading-relaxed">
                  If you are in immediate danger, please call <strong className="text-oku-darkgrey">112</strong> (emergency services) or go to your nearest hospital emergency department.
                </p>
              </div>
            </section>

            {/* Direct Channels */}
            <section className="card-glass-3d !p-10 !bg-white/40">
              <h3 className="heading-display text-xl text-oku-darkgrey mb-8">
                Direct <span className="italic text-oku-purple-dark">Channels</span>
              </h3>

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-[1rem] bg-oku-lavender flex items-center justify-center text-oku-purple-dark shadow-sm">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Email Support</p>
                    <a
                      href="mailto:support@okutherapy.com"
                      className="text-sm font-bold text-oku-darkgrey hover:text-oku-purple-dark transition-colors"
                    >
                      support@okutherapy.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-[1rem] bg-oku-mint flex items-center justify-center text-oku-darkgrey shadow-sm">
                    <Phone size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">Clinical Operations</p>
                    <a
                      href="mailto:care@okutherapy.com"
                      className="text-sm font-bold text-oku-darkgrey hover:text-oku-purple-dark transition-colors"
                    >
                      care@okutherapy.com
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Security note */}
            <div className="card-glass-3d !p-8 !bg-oku-darkgrey text-white relative overflow-hidden">
              <div className="relative z-10">
                <ShieldCheck size={20} className="text-oku-purple-dark/80 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">Security Note</p>
                <p className="text-xs opacity-50 font-display italic leading-relaxed">
                  All support messages are encrypted in transit. For medical emergencies, do not wait for a reply — contact emergency services immediately.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-oku-purple-dark/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
