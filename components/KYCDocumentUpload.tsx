'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Loader2, Upload, CheckCircle2, Clock } from 'lucide-react'

type KYCDoc = { id: string; name: string; createdAt: string }

export function KYCDocumentUpload() {
  const [docs, setDocs] = useState<KYCDoc[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/practitioner/kyc-upload')
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setDocs(d))
      .catch(() => {})
  }, [])

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/practitioner/kyc-upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDocs((prev) => [data.document, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-oku-darkgrey/60 font-display italic">
            Upload your license or credential document for admin review. Accepted: PDF, JPEG, PNG, WebP — max 5MB.
          </p>
          {docs.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-oku-darkgrey/50 text-[10px] font-black uppercase tracking-widest">
              <Clock size={11} /> Pending admin verification
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-oku-lavender/60 border border-oku-lavender text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:bg-oku-lavender transition-all disabled:opacity-60 shrink-0"
        >
          {uploading ? (
            <><Loader2 size={12} className="animate-spin" /> Uploading…</>
          ) : (
            <><Upload size={12} /> Upload Document</>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>

      {error && (
        <p className="text-[10px] text-red-500 font-bold">{error}</p>
      )}

      {docs.length > 0 && (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-4 rounded-2xl bg-oku-mint/20 border border-oku-mint/40">
              <FileText size={14} className="text-oku-purple-dark shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-oku-darkgrey truncate">{doc.name}</p>
                <p className="text-[9px] text-oku-darkgrey/40 uppercase tracking-widest font-black">
                  {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
              <CheckCircle2 size={14} className="text-oku-darkgrey/30 shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
