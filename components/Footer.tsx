'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-oku-dark text-oku-cream py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center mb-24">
           <h2 className="text-[12vw] md:text-[8vw] font-display font-bold leading-none tracking-tighter opacity-5 select-none">
            OKU THERAPY
          </h2>
          <div className="mt-[-4vw] flex flex-col items-center text-center">
             <img 
                src="https://okutherapy.com/wp-content/uploads/2025/07/Logoo.png" 
                alt="OKU Therapy" 
                className="h-16 w-auto mb-6 brightness-0 invert" 
             />
             <p className="text-oku-taupe font-display italic text-xl max-w-md">Inclusive, trauma-informed, and relational care.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-[10px] text-oku-purple">Explore</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link href="/about-us" className="text-oku-taupe hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/therapists" className="text-oku-taupe hover:text-white transition-colors">Our People</Link></li>
              <li><Link href="/services" className="text-oku-taupe hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/blog" className="text-oku-taupe hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-[10px] text-oku-purple">Support</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link href="/contact" className="text-oku-taupe hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-oku-taupe hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/emergency" className="text-oku-taupe hover:text-white transition-colors">Emergency</Link></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-[10px] text-oku-purple">Legal</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link href="/privacy" className="text-oku-taupe hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-oku-taupe hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-oku-taupe hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-[10px] text-oku-purple">Connect</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><a href="https://instagram.com/okutherapy" target="_blank" rel="noopener noreferrer" className="text-oku-taupe hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://linkedin.com/company/okutherapy" target="_blank" rel="noopener noreferrer" className="text-oku-taupe hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://wa.me/919953879928" target="_blank" rel="noopener noreferrer" className="text-oku-taupe hover:text-white transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-oku-taupe text-[8px] uppercase tracking-[0.4em] font-black opacity-40">
            &copy; {new Date().getFullYear()} OKU Therapy Collective. All rights reserved.
          </p>
          <div className="flex gap-8">
             <Link href="/privacy" className="text-oku-taupe hover:text-white transition-colors text-[8px] uppercase tracking-[0.4em] font-black opacity-40">Privacy</Link>
             <Link href="/terms" className="text-oku-taupe hover:text-white transition-colors text-[8px] uppercase tracking-[0.4em] font-black opacity-40">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
