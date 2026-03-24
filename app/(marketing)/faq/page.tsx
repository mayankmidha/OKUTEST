'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    question: "How do I book a session with an Oku therapist?",
    answer: "Booking is a gentle process. You can browse our Collective page to find a therapist whose approach resonates with you. Once you've chosen, click 'Establish Care' to select a time that fits your rhythm. If you're a new member, you might be eligible for a 10-minute free introductory meet to see if the connection feels right."
  },
  {
    question: "What therapeutic approaches do you use?",
    answer: "Our collective is grounded in depth-oriented and relational work. We use a variety of trauma-informed modalities, including Psychodynamic Psychotherapy, Queer-Affirmative Therapy, Somatic Awareness, and EMDR. We don't believe in one-size-fits-all 'fixes'; we move at the pace your story asks for."
  },
  {
    question: "Are sessions online or in-person?",
    answer: "Currently, Oku Therapy operates primarily as a telehealth collective. This allows you to join sessions from the safety and comfort of your own space, wherever you are. Our video platform is end-to-end encrypted and designed to be as seamless and warm as an in-person room."
  },
  {
    question: "What are your pricing and session durations?",
    answer: "Standard therapy sessions typically last 50 minutes, with a 10-minute buffer for clinical integration. Pricing varies by practitioner based on their experience and specialization, starting from ₹2,000 (or $29) per session. We offer dynamic currency options (INR/USD) based on your location."
  },
  {
    question: "Is my information confidential?",
    answer: "Absolutely. Confidentiality is the foundation of the therapeutic relationship. Everything discussed in your sessions and all data stored on the platform is protected by HIPAA-compliant security standards. We only break confidentiality if there is a serious risk of harm to yourself or others, as required by clinical ethics and law."
  },
  {
    question: "What should I expect in my first session?",
    answer: "The first session is a space for us to begin knowing each other. There's no pressure to perform or have all the answers. Your therapist will listen to what's bringing you here now, explore your history gently, and discuss how you might work together. It's a consultation, not a commitment."
  },
  {
    question: "Is Oku truly queer-affirmative?",
    answer: "Yes. For us, queer-affirmative care means you don't have to explain or defend your identity. We understand the impact of minority stress and systemic erasure. Our therapists are either part of the community or deeply trained in affirmative practices, ensuring your whole self is welcomed without explanation."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We value the time set aside for your healing. We require at least 24 hours' notice for cancellations. Sessions cancelled with less than 24 hours' notice may be subject to a full session fee. This helps us maintain a sustainable practice for our clinicians and keep the space open for those who need it."
  }
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-oku-taupe/10 last:border-0 py-8">
      <button 
        onClick={onClick}
        className="w-full flex justify-between items-center text-left group"
      >
        <h3 className={`text-xl md:text-2xl font-display font-bold transition-colors ${isOpen ? 'text-oku-purple-dark' : 'text-oku-dark group-hover:text-oku-navy'}`}>
          {question}
        </h3>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-oku-navy text-white rotate-180' : 'bg-oku-cream text-oku-taupe'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pt-6 text-oku-taupe leading-relaxed italic font-display text-lg max-w-3xl">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="oku-page-public min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@400;500;700&display=swap');
        .oku-page-public {
          background: #F7F4EF;
          color: #2D2D2D;
          font-family: 'DM Sans', sans-serif;
        }
        .heading-display {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-8 md:px-16 pt-48 pb-32">
        <div className="max-w-3xl mb-24">
          <span className="inline-block px-6 py-2 mb-10 text-[11px] font-black tracking-[0.4em] uppercase text-oku-taupe bg-white/50 backdrop-blur-md border border-oku-taupe/10 rounded-full">
            Common Inquiries
          </span>
          <h1 className="heading-display text-7xl md:text-9xl text-oku-dark leading-[0.85] tracking-tight mb-12">
            Gentle <br />
            <span className="italic text-oku-taupe">clarity.</span>
          </h1>
          <p className="text-xl md:text-2xl text-oku-taupe font-display italic leading-relaxed border-l-2 border-oku-purple/20 pl-8">
            Answers to help you navigate your first steps toward care. If your question isn't here, please reach out to us directly.
          </p>
        </div>

        <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-sm border border-oku-taupe/5">
          {FAQS.map((faq, i) => (
            <FAQItem 
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-24 text-center p-16 bg-oku-navy rounded-[4rem] text-white relative overflow-hidden">
           <div className="relative z-10">
              <MessageCircle className="mx-auto mb-8 text-oku-purple animate-float" size={48} />
              <h2 className="heading-display text-4xl md:text-6xl mb-8">Still have questions?</h2>
              <p className="text-white/60 mb-12 max-w-xl mx-auto italic font-display text-xl">
                We're here to listen. Send our support team a note and we'll get back to you within 24 hours.
              </p>
              <Link href="/contact" className="inline-flex px-12 py-5 bg-white text-oku-navy rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-purple transition-all shadow-2xl">
                Contact Collective
              </Link>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-oku-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
