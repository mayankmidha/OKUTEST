'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "How much does a session cost?",
    answer: "Session costs vary by therapist and service type. Individual therapy sessions typically range from ₹1,500 to ₹3,000 per 50-minute session. We offer sliding scale options and accept various insurance plans. Contact your chosen therapist directly for specific pricing information."
  },
  {
    question: "How do I book?",
    answer: "Booking is simple! Browse our therapists, select your preferred practitioner, choose an available time slot, and complete the booking form. You'll receive a confirmation email with session details and payment information. New clients can also schedule a free 10-minute consultation to ensure the right fit."
  },
  {
    question: "What happens in the first session?",
    answer: "Your first session is focused on getting to know you and establishing therapeutic goals. Your therapist will discuss your concerns, gather relevant history, explain their approach, and collaborate on a treatment plan. This is also your opportunity to ask questions and ensure you feel comfortable with the therapeutic relationship."
  },
  {
    question: "Is therapy confidential?",
    answer: "Yes, therapy is strictly confidential. Everything discussed in sessions is protected by professional ethics and legal requirements. We cannot share your information without your written consent, except in specific situations involving imminent harm to yourself or others, abuse of vulnerable populations, or court orders. Your privacy is our priority."
  },
  {
    question: "What is the cancellation policy?",
    answer: "We require 24-hour notice for session cancellations to avoid the full session fee. Late cancellations (less than 24 hours) will be charged the full session rate. Emergency situations and illness are considered on a case-by-case basis. Your therapist will provide specific cancellation policies during your first session."
  },
  {
    question: "Are sessions online or in-person?",
    answer: "We offer both online and in-person sessions to accommodate your preferences and needs. Online sessions use secure, HIPAA-compliant video platforms. In-person sessions are held at our comfortable, private office spaces. Discuss location options with your chosen therapist to determine what works best for you."
  },
  {
    question: "How do I choose the right therapist?",
    answer: "Choosing the right therapist is important for successful therapy. Consider their specialties, therapeutic approach, experience, and personal connection. Read therapist profiles, check their areas of expertise, and don't hesitate to schedule initial consultations with multiple therapists. The therapeutic relationship is key - trust your instincts about who feels like the best fit."
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="oku-page-public min-h-screen bg-oku-babyblue relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-oku-blush/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-oku-mint/20 rounded-full blur-[120px] animate-float-3d" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-24 text-center">
            <span className="chip bg-white/60 border-white/80" style={{ marginBottom: 28, display: "inline-block" }}>
              Clarification
            </span>
            <h1 className="heading-display text-oku-darkgrey text-5xl md:text-8xl leading-[0.85] tracking-tight mb-8">
              Frequently Asked <span className="text-oku-purple-dark italic">Questions.</span>
            </h1>
            <p className="text-xl md:text-2xl text-oku-darkgrey/60 font-display italic leading-relaxed max-w-2xl mx-auto border-l-4 border-oku-purple-dark/10 pl-8">
              Find answers to common questions about our therapy services and how we hold space for your journey.
            </p>
          </div>

          <div className="space-y-8">
            {faqData.map((item, index) => (
              <div 
                key={index}
                className="card-glass-3d !p-0 overflow-hidden !bg-white/40"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-10 py-10 text-left flex items-center justify-between hover:bg-white/40 transition-all group"
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 shadow-sm ${openItems.includes(index) ? 'bg-oku-purple-dark text-white rotate-12 scale-110 shadow-lg' : 'bg-white/60 text-oku-purple-dark'}`}>
                      <HelpCircle size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-oku-darkgrey tracking-tight group-hover:text-oku-purple-dark transition-colors">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-8 h-8 text-oku-purple-dark" />
                    ) : (
                      <ChevronDown className="w-8 h-8 text-oku-darkgrey/30" />
                    )}
                  </div>
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-10 pb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="pl-22">
                      <p className="text-xl text-oku-darkgrey/70 leading-relaxed font-display italic border-l-4 border-oku-purple-dark/10 pl-10">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <div className="card-glass-3d !p-16 md:!p-24 !bg-white/60 !rounded-[4rem]">
              <h3 className="heading-display text-4xl md:text-6xl text-oku-darkgrey mb-8 tracking-tighter">
                Still have questions?
              </h3>
              <p className="text-xl text-oku-darkgrey/60 mb-12 max-w-md mx-auto italic font-display opacity-70">
                Can't find what you're looking for? We're here to hold space for your inquiries.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
                <Link 
                  href="/therapists"
                  className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-12 !py-6 w-full sm:w-auto pulse-cta"
                >
                  Browse Collective
                </Link>
                <Link 
                  href="/contact"
                  className="btn-pill-3d bg-white border-white text-oku-darkgrey !px-12 !py-6 w-full sm:w-auto"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
