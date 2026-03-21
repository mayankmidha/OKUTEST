'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-oku-dark text-oku-cream py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center mb-24">
           <h2 className="text-[12vw] md:text-[8vw] font-display font-bold leading-none tracking-tighter opacity-10 select-none">
            OKU THERAPY
          </h2>
          <div className="mt-[-4vw] flex flex-col items-center text-center">
             <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">OKU THERAPY.</h3>
             <p className="text-oku-taupe font-script text-2xl max-w-md">Inclusive, trauma-informed, and relational care.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <div className="rotate-4 bg-white/5 p-8 rounded-card backdrop-blur-sm">
            <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-xs text-oku-purple">Explore</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="text-oku-taupe hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/therapists" className="text-oku-taupe hover:text-white transition-colors">Our People</Link></li>
              <li><Link href="/services" className="text-oku-taupe hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/blog" className="text-oku-taupe hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="rotate-[-4deg] bg-white/5 p-8 rounded-card backdrop-blur-sm">
            <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-xs text-oku-purple">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/contact" className="text-oku-taupe hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-oku-taupe hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/emergency" className="text-oku-taupe hover:text-white transition-colors">Emergency</Link></li>
            </ul>
          </div>

          <div className="rotate-4 bg-white/5 p-8 rounded-card backdrop-blur-sm">
            <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-xs text-oku-purple">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/privacy" className="text-oku-taupe hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-oku-taupe hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-oku-taupe hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="rotate-[-4deg] bg-white/5 p-8 rounded-card backdrop-blur-sm">
            <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-xs text-oku-purple">Connect</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="https://instagram.com/okutherapy" target="_blank" rel="noopener noreferrer" className="text-oku-taupe hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://linkedin.com/company/okutherapy" target="_blank" rel="noopener noreferrer" className="text-oku-taupe hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-oku-taupe hover:text-white transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-oku-taupe text-[10px] uppercase tracking-[0.4em] font-black">
            &copy; {new Date().getFullYear()} OKU Therapy. All rights reserved.
          </p>
          <div className="flex gap-8">
             <Link href="/privacy" className="text-oku-taupe hover:text-white transition-colors text-[10px] uppercase tracking-[0.4em] font-black">Privacy</Link>
             <Link href="/terms" className="text-oku-taupe hover:text-white transition-colors text-[10px] uppercase tracking-[0.4em] font-black">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
