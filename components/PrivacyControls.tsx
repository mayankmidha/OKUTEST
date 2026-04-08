'use client'

import { useState } from 'react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Download, Trash2, ShieldAlert, Loader2, CheckCircle2, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function PrivacyControls({ twoFactorEnabled = false }: { twoFactorEnabled?: boolean }) {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [isLoading2fa, setIsLoading2fa] = useState(false)
  const [show2faSetup, setShow2faSetup] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [manualSecret, setManualSecret] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null)

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
        await signOut({ callbackUrl: '/auth/login?deleted=true' })
      }
    } catch (error) {
      console.error("Deletion failed", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSetup2fa = async () => {
    setIsLoading2fa(true)
    setTwoFactorError(null)

    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Could not start 2FA setup')
      }

      setQrCodeUrl(data.qrCodeUrl)
      setManualSecret(data.secret)
      setShow2faSetup(true)
    } catch (error: any) {
      setTwoFactorError(error.message || 'Could not start 2FA setup')
    } finally {
      setIsLoading2fa(false)
    }
  }

  const handleVerify2fa = async () => {
    setIsLoading2fa(true)
    setTwoFactorError(null)

    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationCode }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Could not verify code')
      }

      setShow2faSetup(false)
      setQrCodeUrl(null)
      setManualSecret(null)
      setVerificationCode('')
      router.refresh()
    } catch (error: any) {
      setTwoFactorError(error.message || 'Could not verify code')
    } finally {
      setIsLoading2fa(false)
    }
  }

  const handleDisable2fa = async () => {
    setIsLoading2fa(true)
    setTwoFactorError(null)

    try {
      const res = await fetch('/api/auth/2fa/disable', { method: 'DELETE' })

      if (!res.ok) {
        throw new Error('Could not disable 2FA')
      }

      setShow2faSetup(false)
      setQrCodeUrl(null)
      setManualSecret(null)
      setVerificationCode('')
      router.refresh()
    } catch (error: any) {
      setTwoFactorError(error.message || 'Could not disable 2FA')
    } finally {
      setIsLoading2fa(false)
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

        <div className="rounded-2xl border border-oku-darkgrey/5 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-oku-lavender/40 flex items-center justify-center text-oku-purple-dark">
                <Shield size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">Two-Factor Authentication</p>
                <p className="text-[10px] text-oku-darkgrey/50">
                  {twoFactorEnabled ? 'Authenticator app protection is active.' : 'Add an authenticator app before enabling 2FA.'}
                </p>
              </div>
            </div>
            {twoFactorEnabled ? (
              <button
                onClick={handleDisable2fa}
                disabled={isLoading2fa}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-600"
              >
                {isLoading2fa ? 'Working...' : 'Disable'}
              </button>
            ) : (
              <button
                onClick={handleSetup2fa}
                disabled={isLoading2fa}
                className="rounded-full border border-oku-lavender bg-oku-lavender/30 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-oku-purple-dark"
              >
                {isLoading2fa ? 'Working...' : 'Set Up'}
              </button>
            )}
          </div>

          {show2faSetup && qrCodeUrl && (
            <div className="mt-4 space-y-4 rounded-2xl border border-oku-darkgrey/5 bg-oku-cream/40 p-4">
              <Image
                src={qrCodeUrl}
                alt="2FA QR code"
                width={180}
                height={180}
                className="mx-auto rounded-2xl border border-white bg-white p-3"
              />
              {manualSecret && (
                <p className="break-all text-center text-[10px] font-mono text-oku-darkgrey/60">{manualSecret}</p>
              )}
              <input
                type="text"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full rounded-2xl border border-oku-darkgrey/10 bg-white px-4 py-3 text-sm outline-none focus:border-oku-purple"
              />
              <button
                onClick={handleVerify2fa}
                disabled={isLoading2fa || verificationCode.trim().length < 6}
                className="w-full rounded-full bg-oku-dark px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-60"
              >
                {isLoading2fa ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          )}

          {twoFactorError && (
            <p className="mt-3 text-xs font-bold text-red-500">{twoFactorError}</p>
          )}
        </div>

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
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Account Closure</h4>
                </div>
                <p className="text-xs font-display italic mb-6 leading-relaxed">
                    This removes your login access and anonymizes your personal profile. Clinical records may be retained under healthcare retention rules.
                </p>
                <div className="flex gap-3">
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="flex-1 py-3 bg-white text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
                    >
                        {isDeleting ? "Closing Account..." : "Yes, Close My Account"}
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
