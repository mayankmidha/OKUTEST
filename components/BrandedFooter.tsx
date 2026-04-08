'use client'

import Link from 'next/link'
import { Instagram, Linkedin, Mail, ArrowUpRight } from 'lucide-react'

export default function BrandedFooter() {
  return (
    <footer className="bg-white pt-32 pb-12 border-t border-oku-taupe/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24 mb-32">
          
          {/* Brand Block */}
          <div className="md:col-span-1 space-y-10">
            <img src="/wp-content/uploads/2025/07/Logoo.png" alt="OKU" className="h-8 opacity-80" />
            <p className="text-sm text-oku-taupe leading-relaxed">
              Holding space for what's beneath the surface. An inclusive, trauma-informed clinical collective.
            </p>
            <div className="flex gap-6 grayscale opacity-40">
                <Instagram size={18} />
                <Linkedin size={18} />
                <Mail size={18} />
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-dark">Navigation</h4>
            <div className="flex flex-col gap-4 text-sm text-oku-taupe font-medium">
                <FooterLink href="/therapists">Our Collective</FooterLink>
                <FooterLink href="/services">Offerings</FooterLink>
                <FooterLink href="/assessments">Screening</FooterLink>
                <FooterLink href="/blog">Journal</FooterLink>
            </div>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-dark">Sanctuary</h4>
            <div className="flex flex-col gap-4 text-sm text-oku-taupe font-medium">
                <FooterLink href="/emergency">Crisis Support</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink href="/privacy">Privacy Guard</FooterLink>
                <FooterLink href="/faq">Clarification</FooterLink>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-dark">Connection</h4>
            <p className="text-sm text-oku-taupe">hello@okutherapy.com</p>
            <p className="text-sm text-oku-taupe">+91 99538 79928</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-purple group">
                Begin Onboarding <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="pt-12 border-t border-oku-taupe/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/40">© 2026 OKU Therapy Collective. All rights reserved.</p>
            <div className="flex gap-12">
                <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/40">Private Client Access</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/40">Security Controls Evolving</span>
            </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-oku-purple transition-colors">{children}</Link>
  )
}
