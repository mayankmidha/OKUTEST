import Link from 'next/link'
import { ArrowRight, ShieldCheck, Users, Brain, Calendar, DollarSign, Globe, CheckCircle2, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { getWhatsAppCareLink } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Join OKU as a Therapist | Grow Your Practice Online',
  description: 'Build a thriving online therapy practice with OKU. Verified collective. Flexible scheduling. Clinical AI tools. Sessions start at ₹1,500. Apply in minutes.',
  keywords: 'join online therapy platform India, therapist jobs India, online counselling jobs, psychologist practice India',
  openGraph: {
    title: 'Join OKU Therapy — Grow Your Clinical Practice',
    description: 'Flexible hours, clinical AI support, verified community. Join our collective of trauma-informed practitioners.',
    url: 'https://okutherapy.com/for-therapists',
    type: 'website',
  },
}

const BENEFITS = [
  {
    icon: Calendar,
    title: 'Full Scheduling Autonomy',
    body: 'Set your own hours, block time off, and manage availability from a single dashboard. No one dictates your calendar.',
    color: 'bg-oku-lavender/30',
  },
  {
    icon: Brain,
    title: 'AI Clinical Intelligence',
    body: 'Automated session summaries, SOAP note drafting, risk level detection, and client behaviour pattern analysis — so you can focus on presence, not paperwork.',
    color: 'bg-oku-mint/30',
  },
  {
    icon: DollarSign,
    title: 'Transparent, Timely Payouts',
    body: 'Set your own rates in INR. Earnings are tracked in real-time and paid directly via Razorpay with detailed invoices.',
    color: 'bg-oku-peach/30',
  },
  {
    icon: Users,
    title: 'Client Matching & Referrals',
    body: 'Our matching algorithm connects you with clients whose needs align with your specializations. Your profile does the outreach.',
    color: 'bg-oku-butter/30',
  },
  {
    icon: Globe,
    title: 'Encrypted Telehealth Rooms',
    body: 'Private, encrypted video rooms — no Zoom links, no external apps. Your clients join directly from their browser.',
    color: 'bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Collective',
    body: 'Join a curated collective of licensed, trauma-informed therapists. Your verification badge builds client trust before the first session.',
    color: 'bg-purple-50',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Create Your Profile',
    body: 'Add your credentials, specializations, bio, and session rate. Takes under 10 minutes.',
  },
  {
    number: '02',
    title: 'Admin Verification',
    body: 'Our team reviews your license and profile within 1–2 business days. We\'ll email you when live.',
  },
  {
    number: '03',
    title: 'Clients Book You',
    body: 'Your profile goes public. Clients browse, match with you, and book — you get notified instantly.',
  },
  {
    number: '04',
    title: 'Heal & Earn',
    body: 'Conduct sessions, write notes with AI assistance, track outcomes. Payouts happen automatically.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'The AI session summary feature alone saved me two hours of admin work every week. I have more energy for my clients now.',
    name: 'Dr. Priya S.',
    role: 'Clinical Psychologist',
  },
  {
    quote: 'I was hesitant about another platform, but OKU\'s client matching is genuinely better. My caseload doubled in 3 months.',
    name: 'Rahul M.',
    role: 'CBT Therapist',
  },
]

export default function ForTherapistsPage() {
  const whatsappLink = getWhatsAppCareLink('ONBOARDING_COMPLETE', { name: 'a practitioner', id: 'apply' })

  return (
    <div className="oku-page-public min-h-screen bg-oku-cream relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[700px] h-[700px] bg-oku-lavender/25 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-oku-mint/20 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-48 pb-32 relative z-10">

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-8">
            <span className="px-5 py-2 bg-white/60 backdrop-blur-md border border-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-oku-purple-dark shadow-sm inline-block">
              For Practitioners
            </span>
            <h1 className="heading-display text-6xl md:text-8xl text-oku-darkgrey leading-[0.85] tracking-tighter">
              Build your <br />
              <span className="text-oku-purple-dark italic">practice,</span> <br />
              your way.
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic leading-relaxed max-w-xl border-l-4 border-oku-purple-dark/10 pl-8">
              OKU is a curated collective of trauma-informed therapists. We give you the tools, the clients, and the freedom to practice on your own terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/auth/practitioner-signup"
                className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-10 !py-5 text-[11px] inline-flex items-center gap-3 pulse-cta"
              >
                Apply to Join the Collective <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-3d bg-white/60 border-white text-oku-darkgrey !px-10 !py-5 text-[11px] inline-flex items-center gap-3"
              >
                <MessageCircle size={16} /> Ask Us Anything
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: '₹1,500+', label: 'Session rate you set' },
              { value: '24h', label: 'Avg. verification time' },
              { value: '100%', label: 'Scheduling autonomy' },
              { value: '0%', label: 'Client acquisition cost' },
            ].map((stat) => (
              <div key={stat.label} className="card-glass-3d !p-8 !rounded-[2.5rem] text-center">
                <p className="heading-display text-4xl text-oku-darkgrey tracking-tighter mb-2">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-32">
          <h2 className="heading-display text-5xl md:text-6xl text-oku-darkgrey text-center mb-16 tracking-tighter">
            What you <span className="text-oku-purple-dark italic">get.</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className={`rounded-[2.5rem] ${benefit.color} border border-white/60 p-10 space-y-5 backdrop-blur-sm`}>
                <div className="w-12 h-12 bg-white/70 rounded-2xl flex items-center justify-center shadow-sm">
                  <benefit.icon size={20} className="text-oku-purple-dark" />
                </div>
                <h3 className="font-bold text-oku-darkgrey text-lg leading-snug">{benefit.title}</h3>
                <p className="text-sm text-oku-darkgrey/60 leading-relaxed font-display italic">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-32">
          <h2 className="heading-display text-5xl md:text-6xl text-oku-darkgrey text-center mb-16 tracking-tighter">
            Four steps to <span className="text-oku-purple-dark italic">practice.</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="card-glass-3d !p-8 !rounded-[2.5rem] space-y-4 relative">
                <span className="heading-display text-6xl text-oku-purple-dark/10 absolute top-6 right-8 leading-none">{step.number}</span>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-oku-purple-dark">{step.number}</p>
                <h3 className="font-bold text-oku-darkgrey text-base leading-snug">{step.title}</h3>
                <p className="text-sm text-oku-darkgrey/60 leading-relaxed font-display italic">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-32">
          <h2 className="heading-display text-5xl text-oku-darkgrey text-center mb-16 tracking-tighter">
            Practitioners <span className="text-oku-purple-dark italic">love it.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-glass-3d !p-10 !rounded-[2.5rem] space-y-6">
                <p className="text-lg font-display italic text-oku-darkgrey/70 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-oku-darkgrey text-sm">{t.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-32 max-w-2xl mx-auto">
          <h2 className="heading-display text-5xl text-oku-darkgrey text-center mb-12 tracking-tighter">
            Who we <span className="text-oku-purple-dark italic">accept.</span>
          </h2>
          <div className="card-glass-3d !p-10 !rounded-[3rem] space-y-5">
            {[
              'Licensed clinical psychologist, counsellor, or psychiatrist',
              'Minimum 2 years of post-qualification experience',
              'Trauma-informed practice approach',
              'Commitment to ethical, inclusive care',
              'Ability to conduct online video sessions',
            ].map((req) => (
              <div key={req} className="flex items-start gap-4">
                <CheckCircle2 size={16} className="text-oku-purple-dark shrink-0 mt-0.5" />
                <p className="text-sm text-oku-darkgrey/70">{req}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center space-y-6">
          <h2 className="heading-display text-5xl md:text-7xl text-oku-darkgrey tracking-tighter">
            Ready to <span className="text-oku-purple-dark italic">join?</span>
          </h2>
          <p className="text-lg text-oku-darkgrey/50 font-display italic">Application takes under 10 minutes.</p>
          <Link
            href="/auth/practitioner-signup"
            className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-14 !py-6 text-[11px] inline-flex items-center gap-3 pulse-cta"
          >
            Apply Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
