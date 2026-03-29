'use client'

import { useEffect, useRef, useState } from 'react'
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  Call,
  User
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import { Loader2, Clock, RefreshCw, ShieldCheck, LogOut, AlertTriangle } from 'lucide-react'

const MAX_JOIN_RETRIES = 3
const RETRY_DELAYS_MS = [400, 1200]

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function safeJsonParse(text: string) {
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

function formatConnectionError(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Failed to connect to the secure video server.'
}

export function VideoRoom({
  sessionId,
  userId,
  userName,
  role,
  isTrial = false,
  onLeave,
}: {
  sessionId: string
  userId: string
  userName: string
  role: string
  isTrial?: boolean
  onLeave?: () => void
}) {
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joinStatus, setJoinStatus] = useState<'connecting' | 'ready' | 'error'>('connecting')
  const [retryNonce, setRetryNonce] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(isTrial ? 600 : null)

  const clientRef = useRef<StreamVideoClient | null>(null)
  const callRef = useRef<Call | null>(null)
  const mountedRef = useRef(true)

  const cleanupStream = async () => {
    try {
      await (callRef.current as any)?.leave?.()
    } catch (error) {
      console.debug('Stream call leave cleanup failed', error)
    }

    try {
      await (clientRef.current as any)?.disconnectUser?.()
    } catch (error) {
      console.debug('Stream client disconnect cleanup failed', error)
    }

    callRef.current = null
    clientRef.current = null

    if (mountedRef.current) {
      setClient(null)
      setCall(null)
    }
  }

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      void cleanupStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isTrial && timeLeft !== null) {
      if (timeLeft <= 0) {
        alert('Trial session has ended. Thank you for connecting.')
        void cleanupStream().finally(() => {
          onLeave?.()
        })
        return
      }

      const timer = setInterval(() => setTimeLeft((prev) => (prev !== null ? prev - 1 : null)), 1000)
      return () => clearInterval(timer)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTrial, timeLeft])

  useEffect(() => {
    const controller = new AbortController()

    const initStream = async () => {
      setJoinStatus('connecting')
      setJoinError(null)
      await cleanupStream()

      const user: User = {
        id: userId,
        name: userName,
      }

      let lastError: unknown = null

      for (let attempt = 0; attempt < MAX_JOIN_RETRIES; attempt += 1) {
        if (controller.signal.aborted) return

        if (attempt > 0) {
          await sleep(RETRY_DELAYS_MS[attempt - 1] || RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1])
        }

        if (controller.signal.aborted) return

        try {
          const response = await fetch('/api/video/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
          })

          const payload = safeJsonParse(await response.text()) as any

          if (!response.ok) {
            throw new Error(payload.error || payload.message || `Token request failed (${response.status})`)
          }

          if (!payload.token || !payload.apiKey) {
            throw new Error('Token service returned incomplete credentials.')
          }

          const newClient = new StreamVideoClient({
            apiKey: payload.apiKey,
            user,
            token: payload.token,
          })

          const cleanSessionId = sessionId.replace(/[^a-zA-Z0-9]/g, '')
          const newCall = newClient.call('default', cleanSessionId)

          clientRef.current = newClient
          callRef.current = newCall

          if (controller.signal.aborted) {
            await cleanupStream()
            return
          }

          setClient(newClient)
          await newCall.join({ create: true })

          if (controller.signal.aborted) {
            await cleanupStream()
            return
          }

          setCall(newCall)
          setJoinStatus('ready')
          return
        } catch (error) {
          lastError = error
          await cleanupStream()

          if (controller.signal.aborted) return
        }
      }

      setJoinStatus('error')
      setJoinError(formatConnectionError(lastError))
    }

    void initStream()

    return () => {
      controller.abort()
      void cleanupStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, userId, userName, retryNonce])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleRetry = () => {
    if (isLeaving) return
    setRetryNonce((value) => value + 1)
  }

  const handleEmergency = async () => {
    if (!confirm("TRIGGER EMERGENCY PROTOCOL? This will instantly alert the care team and emergency contacts.")) return;
    
    try {
        const res = await fetch('/api/clinical/emergency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appointmentId: sessionId })
        });
        if (res.ok) alert("EMERGENCY PROTOCOL ACTIVATED. Support is being notified.");
        else alert("Failed to trigger alert. Please follow manual emergency procedures.");
    } catch (e) {
        alert("Fatal error triggering alert. Follow manual procedures.");
    }
  }

  const handleLeave = async () => {
    if (isLeaving) return
    setIsLeaving(true)
    await cleanupStream()

    if (onLeave) {
      onLeave()
    } else {
      window.location.href = '/dashboard'
    }
  }

  if (joinStatus === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-8 text-center">
        <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-2xl max-w-lg space-y-6">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-300 flex items-center justify-center mx-auto border border-red-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-red-300 font-bold mb-2">Connection Error</p>
            <p className="text-sm opacity-80 leading-relaxed">
              {joinError || 'We could not establish a secure video connection.'}
            </p>
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
              Role: {role.toLowerCase()}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              disabled={isLeaving}
              className="w-full py-4 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-oku-purple transition-all disabled:opacity-60"
            >
              <RefreshCw size={14} /> Retry Connection
            </button>
            <button
              onClick={handleLeave}
              disabled={isLeaving}
              className="w-full py-4 rounded-full border border-white/15 text-white/80 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white/5 transition-all disabled:opacity-60"
            >
              {isLeaving ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />} Leave Session
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!client || !call) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1A1817] text-white px-8 text-center">
        <Loader2 className="animate-spin mb-4 text-oku-purple" size={32} />
        <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-50 animate-pulse">
          {joinStatus === 'connecting' ? 'Establishing Secure Connection...' : 'Reconnecting...'}
        </p>
        <p className="mt-3 text-sm text-white/40 max-w-md">
          We are negotiating the video session and validating your token.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 relative bg-[#0D0C0B] flex flex-col overflow-hidden stream-theme-overrides">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            <div className="flex-1 flex flex-col h-full w-full">
              <div className="flex-1 overflow-hidden p-4 relative">
                {isTrial && timeLeft !== null && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 bg-oku-danger/90 backdrop-blur-xl text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 shadow-2xl flex items-center gap-3">
                    <Clock size={14} className="animate-pulse" />
                    Trial Ends in: {formatTime(timeLeft)}
                  </div>
                )}
                <SpeakerLayout participantsBarPosition="bottom" />
              </div>

              <div className="px-4 pb-3 flex items-center justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                  {role.toLowerCase()} connected
                </div>
                <div className="flex items-center gap-3">
                  {role.toUpperCase() === 'PRACTITIONER' && (
                    <button
                        onClick={handleEmergency}
                        className="px-4 py-3 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-900/40"
                    >
                        <AlertTriangle size={14} /> Emergency Alert
                    </button>
                  )}
                  <button
                    onClick={handleRetry}
                    disabled={isLeaving}
                    className="px-4 py-3 rounded-full border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all disabled:opacity-60 flex items-center gap-2"
                  >
                    <RefreshCw size={12} /> Reconnect
                  </button>
                  <CallControls onLeave={() => { void handleLeave() }} />
                </div>
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>

      <style dangerouslySetInnerHTML={{ __html: `
        .str-video {
          --str-video-primary-color: #9D85B3;
          --str-video-bg-color: transparent;
        }
      ` }} />
    </div>
  )
}
