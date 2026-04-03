'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

export default function Footer() {
  return (
    <footer className="bg-oku-page-bg border-t border-oku-taupe/10 py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <div>
            <motion.img 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              src="/uploads/2025/07/Logoo.png" 
              alt="OKU Therapy" 
              className="h-16 w-auto mb-10" 
            />
            <h2 className="text-5xl md:text-6xl font-display text-oku-dark leading-tight mb-8">
              A sanctuary for <br />
              <span className="text-oku-taupe italic">healing and growth.</span>
            </h2>
            <p className="text-oku-taupe text-lg max-w-md leading-relaxed">
              Inclusive, trauma-informed, and relational care with therapist matching, gentle assessments, and secure ongoing support.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              {['Free consults', 'Secure video', 'Assessments'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/70 border border-oku-taupe/10 text-[10px] uppercase tracking-[0.25em] font-black text-oku-dark"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-medium mb-8 uppercase tracking-[0.2em] text-[11px] text-oku-dark">Explore</h4>
              <ul className="space-y-4 text-[13px] tracking-wide text-oku-taupe">
                <li><Link href="/about-us" className="hover:text-oku-purple transition-colors">Our Story</Link></li>
                <li><Link href="/therapists" className="hover:text-oku-purple transition-colors">Our Collective</Link></li>
                <li><Link href="/blog" className="hover:text-oku-purple transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-8 uppercase tracking-[0.2em] text-[11px] text-oku-dark">Support</h4>
              <ul className="space-y-4 text-[13px] tracking-wide text-oku-taupe">
                <li><Link href="/contact" className="hover:text-oku-blue transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-oku-blue transition-colors">FAQs</Link></li>
                <li><Link href="/emergency" className="hover:text-oku-blue transition-colors">Emergency</Link></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-medium mb-8 uppercase tracking-[0.2em] text-[11px] text-oku-dark">Connect</h4>
              <ul className="space-y-4 text-[13px] tracking-wide text-oku-taupe">
                <li><a href="https://instagram.com/okutherapy" target="_blank" rel="noopener noreferrer" className="hover:text-oku-pink transition-colors">Instagram</a></li>
                <li><a href="https://linkedin.com/company/okutherapy" target="_blank" rel="noopener noreferrer" className="hover:text-oku-pink transition-colors">LinkedIn</a></li>
                <li><Link href="/contact" className="hover:text-oku-pink transition-colors">Care Team</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-oku-taupe/5"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-oku-page-bg px-6 text-[10vw] font-display font-bold text-oku-taupe/5 select-none uppercase tracking-tighter">
              OKU THERAPY
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-oku-taupe text-[10px] uppercase tracking-[0.3em] font-medium opacity-60">
            &copy; {new Date().getFullYear()} OKU Therapy Collective. All rights reserved.
          </p>
          <div className="flex gap-12">
             <Link href="/privacy" className="text-oku-taupe hover:text-oku-dark transition-colors text-[10px] uppercase tracking-[0.3em] font-medium opacity-60">Privacy Policy</Link>
             <Link href="/terms" className="text-oku-taupe hover:text-oku-dark transition-colors text-[10px] uppercase tracking-[0.3em] font-medium opacity-60">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
