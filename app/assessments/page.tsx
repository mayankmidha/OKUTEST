'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ClipboardCheck, ArrowRight, Shield, Zap, Heart } from 'lucide-react'

const assessments = [
  {
    slug: 'adhd-screening',
    title: 'ADHD Screening (ASRS)',
    description: 'Understand your focus, organization, and executive function patterns.',
    time: '6 mins',
    questions: 18
  },
  {
    slug: 'depression-check',
    title: 'PHQ-9 Depression',
    description: 'A clinical standard for measuring your recent mood and energy levels.',
    time: '5 mins',
    questions: 9
  },
  {
    slug: 'anxiety-check',
    title: 'GAD-7 Anxiety',
    description: 'A gentle look at your recent feelings of worry and tension.',
    time: '5 mins',
    questions: 7
  },
  {
    slug: 'burnout-audit',
    title: 'Burnout Audit',
    description: 'Measure the impact of chronic stress on your work and creative life.',
    time: '8 mins',
    questions: 12
  },
  {
    slug: 'mood-landscape',
    title: 'Mood Landscape',
    description: 'Understanding the patterns of your emotional well-being.',
    time: '8 mins',
    questions: 10
  },
  {
    slug: 'trauma-screening',
    title: 'Trauma Screening',
    description: 'A safe, body-aware check-in for stored experiences.',
    time: '10 mins',
    questions: 12
  }
]

export default function AssessmentsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleBegin = (slug: string) => {
    // Enable anonymous flow: allow users to take the assessment first, 
    // then prompt for details at the end to "see results".
    const destination = `/dashboard/client/assessments/${slug}?mode=anonymous`
    router.push(destination)
  }

  return (
    <div className="oku-page-public min-h-screen bg-oku-mint relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-lavender/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-butter/20 rounded-full blur-[120px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-48 pb-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-24 text-center">
            <span className="chip bg-white/60 border-white/80" style={{ marginBottom: 28, display: "inline-block" }}>
              Clinical Screening
            </span>
            <h1 className="heading-display text-oku-darkgrey text-5xl md:text-8xl leading-[0.85] tracking-tight mb-8">
              Gentle <span className="text-oku-purple-dark italic">Self-Checks.</span>
            </h1>
            <p className="text-xl md:text-2xl text-oku-darkgrey/60 font-display italic leading-relaxed max-w-2xl mx-auto border-l-4 border-oku-purple-dark/10 pl-8">
              Use these clinically grounded assessments to better understand what you might be carrying right now.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-24">
            {assessments.map((assessment, index) => {
              const colors = ['bg-oku-lavender/40', 'bg-oku-blush/40', 'bg-oku-babyblue/40']
              return (
              <motion.div 
                key={assessment.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card-glass-3d tilt-card !p-10 ${colors[index % colors.length]}`}
              >
                <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center text-oku-purple-dark/60 mb-8 animate-float-3d shadow-sm">
                  <ClipboardCheck size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-oku-darkgrey mb-4 tracking-tight">{assessment.title}</h3>
                <p className="text-oku-darkgrey/60 italic font-display mb-10 opacity-80 leading-relaxed">
                  {assessment.description}
                </p>
                <div className="mt-auto pt-8 border-t border-white/40 flex items-center justify-between mb-10">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Duration</span>
                      <span className="text-sm font-bold text-oku-darkgrey">{assessment.time}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">Scale</span>
                      <span className="text-sm font-bold text-oku-darkgrey">{assessment.questions} Questions</span>
                   </div>
                </div>
                <button
                  onClick={() => handleBegin(assessment.slug)}
                  className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-5 pulse-cta"
                >
                  Begin <ArrowRight size={16} className="ml-2" />
                </button>
              </motion.div>
            )})}
          </div>

          <div className="card-glass-3d !p-16 md:!p-24 !bg-oku-darkgrey text-white relative overflow-hidden !rounded-[4rem] shadow-2xl">
             <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="heading-display text-5xl md:text-7xl tracking-tight mb-8 leading-[0.9]">Your data is <br /><span className="text-oku-lavender italic">sacred.</span></h2>
                  <p className="text-white/60 text-xl leading-relaxed italic font-display max-w-md border-l-2 border-oku-lavender/20 pl-8">
                    Assessments are strictly confidential. We use industry-standard encryption to ensure your results are only visible to you and your chosen therapist.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 animate-float-3d">
                      <Shield className="text-oku-lavender mb-6" size={40} strokeWidth={1} />
                      <p className="text-xs font-black uppercase tracking-widest opacity-80">HIPAA Secure</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 animate-float-3d" style={{ animationDelay: '0.5s' }}>
                      <Zap className="text-oku-lavender mb-6" size={40} strokeWidth={1} />
                      <p className="text-xs font-black uppercase tracking-widest opacity-80">Clinical Insight</p>
                   </div>
                </div>
             </div>
             {/* Abstract shape */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-oku-lavender/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
