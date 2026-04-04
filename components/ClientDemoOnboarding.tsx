'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Sparkles,
  Users,
  X,
} from 'lucide-react'

const DISMISS_KEY = 'oku_client_demo_onboarding_dismissed'
const COMPLETE_KEY = 'oku_client_demo_onboarding_complete'

type ClientDemoOnboardingProps = {
  hasIntake: boolean
  hasAssessment: boolean
  hasBooked: boolean
  autoOpen?: boolean
}

export function ClientDemoOnboarding({
  hasIntake,
  hasAssessment,
  hasBooked,
  autoOpen = false,
}: ClientDemoOnboardingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const steps = [
    {
      title: 'See how OKU works',
      description:
        'Your workspace is built around four things: starting care, tracking progress, joining circles, and staying connected to your practitioner.',
      href: '/dashboard/client',
      cta: 'Stay on dashboard',
      done: false,
      icon: Compass,
    },
    {
      title: 'Finish your intake',
      description:
        'Complete your intake once so booking, clinical records, and safety details are ready when care begins.',
      href: '/dashboard/client/intake',
      cta: hasIntake ? 'Intake complete' : 'Open intake',
      done: hasIntake,
      icon: ClipboardCheck,
    },
    {
      title: 'Take your first assessment',
      description:
        'Use a screener to capture a baseline. Your results become part of your clinical record and can be shared with your practitioner.',
      href: '/dashboard/client/clinical',
      cta: hasAssessment ? 'Assessment complete' : 'Open assessments',
      done: hasAssessment,
      icon: Sparkles,
    },
    {
      title: 'Book or join care',
      description:
        'Choose a practitioner, book a session, or join a circle if you want a lighter first step into the platform.',
      href: hasBooked ? '/dashboard/client/sessions' : '/dashboard/client/therapists',
      cta: hasBooked ? 'View sessions' : 'Find care',
      done: hasBooked,
      icon: hasBooked ? Calendar : Users,
    },
  ]

  const completedCount = steps.filter((step) => step.done).length
  const isComplete = completedCount >= 3

  useEffect(() => {
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === 'true'
    const completed = window.localStorage.getItem(COMPLETE_KEY) === 'true'
    setIsReady(true)

    if (autoOpen && !dismissed && !completed) {
      setIsOpen(true)
    }
  }, [autoOpen])

  useEffect(() => {
    if (!isReady) return
    if (isComplete) {
      window.localStorage.setItem(COMPLETE_KEY, 'true')
    }
  }, [isReady, isComplete])

  const closeForNow = () => {
    window.localStorage.setItem(DISMISS_KEY, 'true')
    setIsOpen(false)
  }

  const reopen = () => {
    window.localStorage.removeItem(DISMISS_KEY)
    setStepIndex(0)
    setIsOpen(true)
  }

  const activeStep = steps[stepIndex]
  const ActiveIcon = activeStep.icon

  return (
    <>
      <section className="rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-oku-lavender/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-oku-purple-dark">
              <Sparkles size={12} />
              Demo Onboarding
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-oku-darkgrey">
                Know where everything lives before you dive in.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-oku-darkgrey/60">
                This guided preview explains how OKU fits together for a client:
                start care, track progress, use circles, and unlock ADHD support if
                it becomes relevant.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-oku-darkgrey/5 px-4 py-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                Progress
              </p>
              <p className="mt-1 text-lg font-black text-oku-darkgrey">
                {completedCount}/{steps.length}
              </p>
            </div>
            <button
              type="button"
              onClick={reopen}
              className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-8 !py-4 text-[10px]"
            >
              {isComplete ? 'Review onboarding' : 'Start guided demo'}
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-oku-darkgrey/45 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/70 bg-[#fcfaf7] shadow-2xl"
            >
              <button
                type="button"
                onClick={closeForNow}
                className="absolute right-5 top-5 rounded-full bg-white/80 p-2 text-oku-darkgrey/45 transition-colors hover:text-oku-darkgrey"
                aria-label="Close onboarding"
              >
                <X size={18} />
              </button>

              <div className="border-b border-oku-darkgrey/5 bg-white/60 px-8 py-7">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-oku-purple-dark">
                  Step {stepIndex + 1} of {steps.length}
                </p>
                <h3 className="mt-3 text-3xl font-black tracking-tight text-oku-darkgrey">
                  {activeStep.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-oku-darkgrey/60">
                  {activeStep.description}
                </p>
              </div>

              <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.5rem] border border-oku-darkgrey/5 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-oku-lavender/25 text-oku-purple-dark">
                      <ActiveIcon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.26em] text-oku-darkgrey/35">
                        Guided action
                      </p>
                      <p className="mt-1 text-lg font-black text-oku-darkgrey">
                        {activeStep.cta}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.25rem] bg-oku-cream/60 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oku-darkgrey/35">
                      What this unlocks
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-oku-darkgrey/65">
                      {stepIndex === 0 &&
                        'A simpler mental model: start care, complete clinical tasks, use circles when helpful, and keep everything in one secure workspace.'}
                      {stepIndex === 1 &&
                        'Safer booking, better therapist context, and the right clinical forms already in place.'}
                      {stepIndex === 2 &&
                        'A baseline you can compare over time, plus richer context for OKU AI and your care team.'}
                      {stepIndex === 3 &&
                        'A real starting point with OKU: your first session, your first circle, or your first active care relationship.'}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={activeStep.href}
                      onClick={() => setIsOpen(false)}
                      className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-8 !py-4 text-[10px]"
                    >
                      {activeStep.cta}
                      <ArrowRight size={14} className="ml-2" />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setStepIndex((current) =>
                          current === steps.length - 1 ? current : current + 1
                        )
                      }
                      className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-8 !py-4 text-[10px]"
                    >
                      {stepIndex === steps.length - 1 ? 'You are done' : 'Next step'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon

                    return (
                      <button
                        key={step.title}
                        type="button"
                        onClick={() => setStepIndex(index)}
                        className={`w-full rounded-[1.4rem] border p-4 text-left transition-all ${
                          index === stepIndex
                            ? 'border-oku-purple-dark/25 bg-white shadow-sm'
                            : 'border-oku-darkgrey/5 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              step.done
                                ? 'bg-oku-mint/35 text-emerald-700'
                                : 'bg-oku-darkgrey/5 text-oku-darkgrey/45'
                            }`}
                          >
                            {step.done ? <CheckCircle2 size={18} /> : <StepIcon size={18} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-oku-darkgrey">
                              {step.title}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-oku-darkgrey/55">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
