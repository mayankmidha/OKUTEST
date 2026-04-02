'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, Shield, FileText, CreditCard } from 'lucide-react'
import { DocumentVault } from '@/components/DocumentVault'
import { PaymentHistory } from './PaymentHistory'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClientVaultPage() {
  const [activeTab, setActiveTab] = useState<'clinical' | 'financials'>('clinical')

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">The Vault</span>
            </div>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              Secure <span className="text-oku-purple-dark italic">Ledger.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
              Your clinical and financial history, held in confidence.
            </p>
          </div>

          <div className="card-glass-3d !p-6 !bg-oku-mint/40 self-start lg:self-auto flex items-center gap-4">
            <Shield size={20} className="text-oku-purple-dark" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40">Security</p>
              <p className="text-sm font-bold text-oku-darkgrey">HIPAA Encrypted Storage</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-12">
            {[
                { id: 'clinical', label: 'Clinical Records', icon: <FileText size={16} /> },
                { id: 'financials', label: 'Invoices & Payments', icon: <CreditCard size={16} /> }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-oku-dark text-white shadow-xl scale-105' : 'bg-white/60 text-oku-darkgrey/40 hover:bg-white border border-white'}`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>

        <AnimatePresence mode="wait">
            <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
            >
                {activeTab === 'clinical' ? <DocumentVault /> : <PaymentHistory />}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
