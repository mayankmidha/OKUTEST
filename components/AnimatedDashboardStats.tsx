'use client'

import { useEffect, useRef } from 'react'
import { useSpring, animated, config } from '@react-spring/web'
import { TrendingUp, Heart, Gift, Zap } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

function AnimatedNumber({ to, prefix = '', suffix = '', className = '' }: {
  to: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [{ val }, api] = useSpring(() => ({ val: 0, config: config.slow }))

  useEffect(() => {
    api.start({ val: to })
  }, [to, api])

  return (
    <animated.span className={className}>
      {val.to((v) => `${prefix}${Math.floor(v).toLocaleString('en-IN')}${suffix}`)}
    </animated.span>
  )
}

interface Props {
  assessmentCount: number
  referralCredit: number
  sessionCount: number
}

export function AnimatedDashboardStats({ assessmentCount, referralCredit, sessionCount }: Props) {
  const cards = [
    {
      icon: Zap,
      value: assessmentCount,
      label: 'Assessments Completed',
      bg: '!bg-oku-lavender/60',
      color: 'text-oku-purple-dark',
      delay: 0,
    },
    {
      icon: Heart,
      value: sessionCount,
      label: 'Sessions Attended',
      bg: '!bg-oku-mint/60',
      color: 'text-emerald-600',
      delay: 0.12,
    },
    {
      icon: Gift,
      value: referralCredit,
      label: 'Referral Credits (₹)',
      bg: '!bg-oku-butter/60',
      color: 'text-oku-darkgrey',
      isRupee: true,
      delay: 0.24,
    },
  ]

  return (
    <>
      {cards.map(({ icon: Icon, value, label, bg, color, isRupee, delay }, i) => (
        <div
          key={label}
          className={`card-glass-3d ${bg} !p-10 flex flex-col justify-between group animate-float-3d`}
          style={{ animationDelay: `${delay}s` }}
        >
          <div className="flex justify-between items-start mb-10">
            <div className={`w-16 h-16 rounded-[1.5rem] bg-white/60 flex items-center justify-center shadow-sm ${color}`}>
              <Icon size={30} strokeWidth={1.5} />
            </div>
            <TrendingUp size={18} className="text-oku-purple-dark/30" />
          </div>
          <div>
            <p className="text-6xl heading-display text-oku-darkgrey mb-2">
              {isRupee ? (
                <AnimatedNumber to={value} prefix="₹" />
              ) : (
                <AnimatedNumber to={value} />
              )}
            </p>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-oku-darkgrey/40">{label}</p>
          </div>
        </div>
      ))}
    </>
  )
}
