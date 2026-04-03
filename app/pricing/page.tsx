import Link from 'next/link'
import { CheckCircle2, ArrowRight, Shield, Clock, Heart, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { getWhatsAppCareLink } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Transparent Pricing | OKU Therapy',
  description: 'Honest, transparent therapy pricing. Sessions from ₹1,500/hr with verified, trauma-informed therapists. First consultation is always free.',
  keywords: 'therapy cost India, online therapy pricing, affordable therapy, OKU therapy rates',
  openGraph: {
    title: 'OKU Therapy Pricing — No Surprises',
    description: 'Sessions from ₹1,500/hr. Free first consultation. Cancel anytime.',
    url: 'https://okutherapy.com/pricing',
    type: 'website',
  },
}

const PLANS = [
  {
    name: 'Trial',
    price: 'Free',
    unit: '15 min',
    description: 'Begin gently. No commitment, no card required.',
    color: 'bg-oku-mint/20 border-oku-mint',
    highlight: false,
    features: [
      '15-minute introductory call',
      'Meet your matched therapist',
      'Ask anything, feel it out',
      'No payment needed',
      'Book in under 2 minutes',
    ],
    cta: 'Book Free Consult',
    href: '/therapists',
  },
  {
    name: 'Individual Session',
    price: '₹1,500',
    unit: 'per 50-min session',
    description: 'One-to-one therapy with your chosen practitioner.',
    color: 'bg-oku-lavender/20 border-oku-purple-dark/20',
    highlight: true,
    features: [
      'Verified, licensed therapist',
      '50-minute private session',
      'Encrypted video room',
      'Session notes & SOAP summary',
      'Mood & progress tracking',
      'Cancel up to 24 hrs before — free',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
  },
  {
    name: 'Monthly Care',
    price: '₹5,400',
    unit: '4 sessions / month',
    description: 'Consistent weekly support at a reduced rate.',
    color: 'bg-oku-peach/20 border-oku-peach',
    highlight: false,
    features: [
      'All Individual Session features',
      '10% saving vs per-session',
      'Priority scheduling',
      'Between-session messaging',
      'Treatment plan review',
      'Monthly progress report',
    ],
    cta: 'Book a Consult First',
    href: '/therapists',
  },
]

const FAQS = [
  {
    q: 'Is the first consultation really free?',
    a: 'Yes. Every therapist on OKU offers a free 15-minute introductory call. No card required, no obligation.',
  },
  {
    q: 'What currency can I pay in?',
    a: 'We accept INR via UPI, cards, and net banking (Razorpay). International clients can pay in USD.',
  },
  {
    q: 'Can I change or cancel my therapist?',
    a: 'Absolutely. You can switch therapists at any time — we want you to find the right fit, not stay stuck.',
  },
  {
    q: 'Is my data and session content confidential?',
    a: 'Yes. All sessions are end-to-end encrypted. Session notes are only visible to you and your therapist.',
  },
  {
    q: 'Do you offer sliding scale pricing?',
    a: 'Some of our practitioners offer sliding scale fees. Use the WhatsApp button to ask our care coordinator.',
  },
  {
    q: 'What if I need to reschedule?',
    a: 'Reschedule for free up to 24 hours before your session. Cancellations inside 24 hours may be charged.',
  },
]

export default function PricingPage() {
  const whatsappLink = getWhatsAppCareLink('THERAPIST_MATCH', { topic: 'pricing and sliding scale' })

  return (
    <div className="oku-page-public min-h-screen bg-oku-cream relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[700px] h-[700px] bg-oku-lavender/25 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-oku-mint/20 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-48 pb-32 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 space-y-6">
          <span className="px-5 py-2 bg-white/60 backdrop-blur-md border border-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-oku-purple-dark shadow-sm inline-block">
            Pricing
          </span>
          <h1 className="heading-display text-7xl md:text-9xl text-oku-darkgrey leading-[0.85] tracking-tighter">
            Honest <br />
            <span className="text-oku-purple-dark italic">Pricing.</span>
          </h1>
          <p className="text-xl md:text-2xl text-oku-darkgrey/50 font-display italic leading-relaxed max-w-2xl mx-auto">
            No hidden fees. No surprise charges. Healing should be accessible.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center gap-6 mb-24">
          {[
            { icon: Heart, text: 'Free first consultation' },
            { icon: Shield, text: 'Encrypted & confidential' },
            { icon: Clock, text: 'Cancel 24 hrs before — free' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/60 border border-white backdrop-blur-md px-6 py-3 rounded-full shadow-sm">
              <Icon size={14} className="text-oku-purple-dark" />
              <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">{text}</span>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[3rem] border-2 p-10 flex flex-col ${plan.color} ${plan.highlight ? 'shadow-2xl scale-[1.03]' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-oku-purple-dark text-white text-[9px] font-black uppercase tracking-[0.4em] px-6 py-2 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/40 mb-3">{plan.name}</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="heading-display text-5xl text-oku-darkgrey tracking-tighter">{plan.price}</span>
                  <span className="text-sm text-oku-darkgrey/40 font-display italic pb-1">/ {plan.unit}</span>
                </div>
                <p className="text-sm text-oku-darkgrey/60 font-display italic leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-oku-darkgrey/70">
                    <CheckCircle2 size={15} className="text-oku-purple-dark shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`btn-pill-3d text-[11px] text-center flex items-center justify-center gap-2 ${plan.highlight ? 'bg-oku-darkgrey border-oku-darkgrey text-white pulse-cta' : 'bg-white/60 border-white text-oku-darkgrey'}`}
              >
                {plan.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="heading-display text-5xl text-oku-darkgrey text-center mb-16 tracking-tighter">
            Common <span className="text-oku-purple-dark italic">Questions</span>
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="card-glass-3d !p-8 !rounded-[2rem] group open:bg-white/70 transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-oku-darkgrey select-none list-none gap-4">
                  <span>{faq.q}</span>
                  <span className="shrink-0 w-6 h-6 bg-oku-purple-dark/10 rounded-full flex items-center justify-center text-oku-purple-dark font-black text-xs group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-sm text-oku-darkgrey/60 leading-relaxed font-display italic">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-8">
          <p className="text-oku-darkgrey/50 font-display italic text-xl">Still have questions?</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-3d bg-[#25D366] border-[#25D366] text-white inline-flex items-center gap-3 !px-10 !py-5 hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={18} />
            Chat with our Care Coordinator
          </a>
          <div>
            <Link href="/therapists" className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors">
              Or browse therapists first →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
