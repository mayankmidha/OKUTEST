'use client'

import { useState } from 'react'
import { Download, Trash2, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function PrivacyControls() {
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await fetch('/api/user/export')
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `oku-medical-record-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        a.remove()
        setExportComplete(true)
        setTimeout(() => setExportComplete(false), 5000)
      }
    } catch (error) {
      console.error("Export failed", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch('/api/user/delete-account', { method: 'DELETE' })
      if (res.ok) {
        window.location.href = '/auth/login?deleted=true'
      }
    } catch (error) {
      console.error("Deletion failed", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 pt-6 border-t border-oku-darkgrey/5">
      <div className="flex flex-col gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-oku-darkgrey/5 hover:border-oku-purple/30 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-oku-lavender/40 flex items-center justify-center text-oku-purple-dark group-hover:scale-110 transition-transform">
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : exportComplete ? <CheckCircle2 size={16} /> : <Download size={16} />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">Download Medical Record</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark/40 group-hover:text-oku-purple-dark">Export JSON</span>
        </button>

        <button
          onClick={() => setShowConfirmDelete(true)}
          className="flex items-center justify-between p-4 rounded-2xl bg-red-50/30 border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
              <Trash2 size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Delete My Sanctuary</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-red-400 group-hover:text-red-600 italic">Right to be Forgotten</span>
        </button>
      </div>

      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-[2rem] bg-red-600 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-red-100">
                    <ShieldAlert size={20} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Permanent Deletion</h4>
                </div>
                <p className="text-xs font-display italic mb-6 leading-relaxed">
                    This will permanently wipe your profile, assessments, and clinical data. Clinical session notes may be retained for 7 years as required by law.
                </p>
                <div className="flex gap-3">
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="flex-1 py-3 bg-white text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
                    >
                        {isDeleting ? "Wiping Data..." : "Yes, Delete Everything"}
                    </button>
                    <button 
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-6 py-3 bg-black/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black/30 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
