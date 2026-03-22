'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, Upload, Trash2, Shield, 
  ExternalLink, EyeOff, Loader2, Plus, 
  File, Lock, CheckCircle2, Download
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Document {
  id: string
  name: string
  url: string
  type: string
  uploadedBy: string
  isPrivate: boolean
  createdAt: string
}

export function DocumentVault({ clientId }: { clientId?: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  // Form State
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('WORKSHEET')
  const [isPrivate, setIsPrivate] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [clientId])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const url = clientId ? `/api/documents?clientId=${clientId}` : '/api/documents'
      const res = await fetch(url)
      if (res.ok) setDocuments(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  const handleSimulatedUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    
    // In a real production app, we'd upload to S3/Cloudinary first
    // For now, we simulate the DB entry with a placeholder URL
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          type: newType,
          url: 'https://okutherapy.com/sample-clinical-doc.pdf', // Placeholder
          clientId: clientId,
          isPrivate
        })
      })

      if (res.ok) {
        setNewName('')
        setShowUploadModal(false)
        fetchDocuments()
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Clinical Vault</h2>
          <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/60 mt-1">Secure Document Management</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary py-3 px-6 rounded-full text-[10px] flex items-center gap-2 shadow-xl"
        >
          <Plus size={14} /> Upload File
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-oku-purple" /></div>
      ) : documents.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-oku-taupe/20">
           <FileText size={40} className="mx-auto text-oku-taupe/20 mb-4" strokeWidth={1} />
           <p className="text-oku-taupe font-display italic">No documents in this vault.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-oku-purple/10 text-oku-purple flex items-center justify-center shadow-inner">
                  <File size={24} />
                </div>
                <div className="flex items-center gap-2">
                   {doc.isPrivate && <EyeOff size={14} className="text-oku-taupe/40" />}
                   <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe/60 bg-oku-cream-warm/30 px-3 py-1 rounded-full">{doc.type}</span>
                </div>
              </div>

              <h3 className="font-bold text-oku-dark truncate mb-1 pr-8">{doc.name}</h3>
              <p className="text-[9px] text-oku-taupe uppercase tracking-widest font-black opacity-40">
                Uploaded {new Date(doc.createdAt).toLocaleDateString()}
              </p>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-oku-taupe/5">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-oku-success" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-oku-taupe">Secure</span>
                 </div>
                 <a 
                   href={doc.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-3 bg-oku-cream-warm rounded-full text-oku-dark hover:bg-oku-dark hover:text-white transition-all shadow-sm"
                 >
                   <Download size={14} />
                 </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-oku-dark/40 backdrop-blur-sm"
            />
            <motion.form 
              onSubmit={handleSimulatedUpload}
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-display font-bold text-oku-dark">Upload Secure File</h3>
                <button type="button" onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-oku-cream rounded-full transition-colors text-oku-taupe"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Document Name</label>
                  <input required value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="e.g. CBT Worksheet Week 1" className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-purple" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-oku-taupe ml-2">Category</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm appearance-none focus:outline-none focus:border-oku-purple">
                    <option value="WORKSHEET">Worksheet / Homework</option>
                    <option value="MEDICAL">Medical Record</option>
                    <option value="ID">Identification</option>
                    <option value="RESOURCE">Psychoeducation</option>
                  </select>
                </div>

                <div className="p-6 bg-oku-purple/5 rounded-3xl border border-oku-purple/10">
                   <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} className="w-5 h-5 accent-oku-purple" />
                      <div>
                         <p className="text-sm font-bold text-oku-dark">Mark as Private</p>
                         <p className="text-[10px] text-oku-taupe opacity-60">If checked, only you can access this file.</p>
                      </div>
                   </label>
                </div>

                <button 
                  disabled={isUploading || !newName}
                  className="w-full py-5 bg-oku-dark text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-oku-purple transition-all disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                  Encrypt & Upload
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function X({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
}
