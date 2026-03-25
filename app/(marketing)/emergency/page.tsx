'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, AlertTriangle, ShieldCheck, Heart, Wind } from 'lucide-react';
import Link from 'next/link';

const CRISIS_RESOURCES = [
  {
    name: "iCall Helpline (TISS)",
    phone: "9152987821",
    description: "Free, confidential telephonic and email-based counseling service.",
    hours: "Mon-Sat, 8:00 AM - 10:00 PM"
  },
  {
    name: "Vandrevala Foundation",
    phone: "1860-2662-345",
    description: "Mental health support and crisis intervention with trained counselors.",
    hours: "24/7, 365 Days"
  },
  {
    name: "AASRA",
    phone: "9820466627",
    description: "A 24-hour helpline for those in distress, lonely, or suicidal.",
    hours: "24/7, 365 Days"
  }
];

export default function EmergencyPage() {
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
          <span className="inline-block px-6 py-2 mb-10 text-[11px] font-black tracking-[0.4em] uppercase text-red-600 bg-red-50 border border-red-100 rounded-full">
            Immediate Support
          </span>
          <h1 className="heading-display text-7xl md:text-9xl text-oku-dark leading-[0.85] tracking-tight mb-12">
            You are <br />
            <span className="italic text-oku-tau-dark">not alone.</span>
          </h1>
          <div className="bg-white/50 backdrop-blur-md border-l-4 border-oku-purple p-8 rounded-r-[2rem] mt-12 shadow-sm">
            <p className="text-xl md:text-2xl text-oku-dark font-display italic leading-relaxed">
              If you are in immediate danger or experiencing a clinical emergency, please use the resources below. Oku Therapy is a collective for ongoing psychological care and is <strong>not equipped for real-time crisis intervention.</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {CRISIS_RESOURCES.map((resource, i) => (
            <div key={i} className="bg-white rounded-[3rem] p-10 border border-oku-taupe/10 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-oku-cream flex items-center justify-center text-oku-navy shadow-inner group-hover:bg-oku-navy group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe bg-oku-cream-warm/30 px-4 py-2 rounded-full">
                  {resource.hours}
                </span>
              </div>
              <h3 className="text-3xl font-display font-bold text-oku-dark mb-4">{resource.name}</h3>
              <p className="text-oku-taupe italic font-display text-lg mb-8 leading-relaxed">
                {resource.description}
              </p>
              <a 
                href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center gap-3 text-2xl font-display font-bold text-oku-navy hover:text-oku-purple-dark transition-colors"
              >
                {resource.phone} <ArrowRight size={20} className="text-oku-purple" />
              </a>
            </div>
          ))}

          <div className="bg-oku-dark text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                    <Mail size={24} className="text-oku-purple" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">iCall Email Support</h3>
                <p className="text-white/60 italic font-display text-lg mb-8 leading-relaxed">
                    If you prefer writing, iCall provides professional email-based counseling.
                </p>
                <a href="mailto:icall@tiss.edu" className="text-xl font-bold text-oku-purple hover:text-white transition-colors underline decoration-oku-purple/30 underline-offset-8">
                    icall@tiss.edu
                </a>
            </div>
            <Wind size={200} className="absolute right-[-40px] bottom-[-40px] text-white opacity-5" />
          </div>
        </div>

        <div className="bg-oku-cream-warm/30 rounded-[4rem] p-12 md:p-20 border border-oku-taupe/10 text-center relative overflow-hidden">
            <Heart className="mx-auto mb-8 text-oku-purple/40" size={48} />
            <h2 className="heading-display text-4xl md:text-6xl text-oku-dark mb-8">Take a breath.</h2>
            <p className="text-oku-taupe max-w-2xl mx-auto italic font-display text-xl leading-relaxed mb-12">
                "Healing is not a linear path, and it's okay to ask for help when the waves feel too high. These services are here to hold space for you in this moment."
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
                <Link href="/dashboard" className="px-12 py-5 bg-oku-dark text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-navy transition-all shadow-xl">
                    Return to Safety
                </Link>
                <Link href="/therapists" className="px-12 py-5 bg-white text-oku-dark border border-oku-taupe/10 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-oku-cream transition-all shadow-sm">
                    Browse Collective
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowRight } from 'lucide-react';
