'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Camera, Mic, ShieldCheck, Video, Settings, Monitor, Loader2, Sparkles, CheckCircle, ArrowRight, RefreshCcw, TriangleAlert, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

type DeviceStatus = 'checking' | 'ready' | 'degraded' | 'needs-permission' | 'unsupported' | 'error'

export function WaitingRoom({ 
  onJoin, 
  userName, 
  practitionerName,
  isClient
}: { 
  onJoin: () => void, 
  userName: string,
  practitionerName: string,
  isClient: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [micActive, setMicActive] = useState(true)
  const [camActive, setCamActive] = useState(true)
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>('checking')
  const [statusMessage, setStatusMessage] = useState('Checking camera and microphone access...')
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [permissionPrompted, setPermissionPrompted] = useState(false)

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)
  }, [])

  const checkPermissions = useCallback(async () => {
    if (typeof navigator === 'undefined') return

    const mediaDevices = navigator.mediaDevices
    if (!mediaDevices?.getUserMedia) {
      setDeviceStatus('unsupported')
      setStatusMessage('This browser cannot access secure camera or microphone devices.')
      return
    }

    try {
      const permissionPromises: Promise<PermissionStatus>[] = []

      if (navigator.permissions?.query) {
        permissionPromises.push(navigator.permissions.query({ name: 'camera' as PermissionName }))
        permissionPromises.push(navigator.permissions.query({ name: 'microphone' as PermissionName }))
      }

      if (permissionPromises.length === 0) return

      const [cameraPermission, microphonePermission] = await Promise.allSettled(permissionPromises)

      const cameraState = cameraPermission.status === 'fulfilled' && cameraPermission.value ? cameraPermission.value.state : 'prompt'
      const microphoneState = microphonePermission.status === 'fulfilled' && microphonePermission.value ? microphonePermission.value.state : 'prompt'

      if (cameraState === 'denied' || microphoneState === 'denied') {
        setDeviceStatus('needs-permission')
        setStatusMessage('Camera or microphone access is blocked. Please allow both permissions in your browser.')
        return
      }
    } catch {
      // Permissions API is optional. We fall back to the real device request below.
    }
  }, [])

  const setupMedia = useCallback(async () => {
    setDeviceStatus('checking')
    setStatusMessage('Checking camera and microphone access...')
    setLastCheckedAt(new Date())
    cleanupStream()

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setDeviceStatus('unsupported')
      setStatusMessage('This browser does not support secure camera and microphone access.')
      return
    }

    await checkPermissions()

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      streamRef.current = mediaStream
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      const hasAudio = mediaStream.getAudioTracks().length > 0
      const hasVideo = mediaStream.getVideoTracks().length > 0

      setMicActive(hasAudio)
      setCamActive(hasVideo)
      setDeviceStatus(hasAudio && hasVideo ? 'ready' : 'degraded')
      setStatusMessage(
        hasAudio && hasVideo
          ? 'Camera and microphone are ready.'
          : 'We could access your room, but one device is missing. You can still join with a warning.'
      )
    } catch (err) {
      const errorName = err instanceof DOMException ? err.name : 'UnknownError'

      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        setDeviceStatus('needs-permission')
        setStatusMessage('Permission was denied. Please allow camera and microphone access, then try again.')
      } else if (errorName === 'NotFoundError' || errorName === 'OverconstrainedError') {
        setDeviceStatus('degraded')
        setStatusMessage('No matching camera or microphone was found. Check your device connections and retry.')
      } else if (errorName === 'NotReadableError' || errorName === 'AbortError') {
        setDeviceStatus('error')
        setStatusMessage('Your camera or microphone is busy in another app. Close other apps and retry.')
      } else {
        setDeviceStatus('error')
        setStatusMessage('We could not initialize your devices. Please retry the check.')
      }
    }
  }, [checkPermissions, cleanupStream])

  useEffect(() => {
    setupMedia()

    return () => {
      cleanupStream()
    }
  }, [cleanupStream, setupMedia, retryCount])

  const toggleMic = () => {
    const currentStream = streamRef.current
    if (currentStream) {
      const audioTrack = currentStream.getAudioTracks()[0]
      if (!audioTrack) return
      audioTrack.enabled = !audioTrack.enabled
      setMicActive(audioTrack.enabled)
    }
  }

  const toggleCam = () => {
    const currentStream = streamRef.current
    if (currentStream) {
      const videoTrack = currentStream.getVideoTracks()[0]
      if (!videoTrack) return
      videoTrack.enabled = !videoTrack.enabled
      setCamActive(videoTrack.enabled)
    }
  }

  const retrySetup = () => {
    setPermissionPrompted(true)
    setRetryCount((count) => count + 1)
  }

  const canJoin = deviceStatus === 'ready' || deviceStatus === 'degraded'
  const readinessTone =
    deviceStatus === 'ready' ? 'text-oku-success' :
    deviceStatus === 'degraded' ? 'text-oku-purple' :
    deviceStatus === 'needs-permission' ? 'text-amber-300' :
    deviceStatus === 'unsupported' ? 'text-oku-danger' : 'text-white/70'
  const readinessIcon =
    deviceStatus === 'ready' ? <CheckCircle size={14} /> :
    deviceStatus === 'degraded' ? <TriangleAlert size={14} /> :
    deviceStatus === 'needs-permission' ? <ShieldCheck size={14} /> :
    deviceStatus === 'unsupported' ? <WifiOff size={14} /> :
    <Loader2 size={14} className="animate-spin" />

  return (
    <div className="min-h-screen bg-[#0D0C0B] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-oku-purple/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-oku-ocean/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10"
      >
        {/* Video Preview Side */}
        <div className="space-y-8">
           <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] group">
              {deviceStatus === 'checking' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/40">
                   <Loader2 className="animate-spin" size={32} />
                   <p className="text-[10px] uppercase tracking-[0.3em] font-black">Checking devices and permissions...</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className={`w-full h-full object-cover mirror transition-opacity duration-1000 ${camActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {!camActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#141312]">
                       <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                          <Video size={40} />
                       </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Overlay Controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-black/40 backdrop-blur-2xl rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <button 
                   onClick={toggleMic}
                   className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-oku-danger text-white'}`}
                 >
                    <Mic size={18} />
                 </button>
                 <button 
                   onClick={toggleCam}
                   className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${camActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-oku-danger text-white'}`}
                 >
                    <Video size={18} />
                 </button>
              </div>
           </div>

           <div className="flex items-center justify-center gap-8 text-white/40">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${micActive ? 'bg-oku-success animate-pulse' : 'bg-white/20'}`} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Mic {micActive ? 'Active' : 'Muted'}</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${camActive ? 'bg-oku-success animate-pulse' : 'bg-white/20'}`} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Camera {camActive ? 'Active' : 'Off'}</span>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white/70">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${readinessTone}`}>
                    {readinessIcon}
                    Device readiness
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-white/70">{statusMessage}</p>
                  {lastCheckedAt && (
                    <p className="text-[9px] uppercase tracking-widest font-black text-white/30">
                      Last checked {lastCheckedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={retrySetup}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  <RefreshCcw size={14} className={permissionPrompted ? 'animate-spin' : ''} />
                  Recheck
                </button>
              </div>
              {deviceStatus === 'needs-permission' && (
                <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-100 text-xs leading-relaxed">
                  Browser permission is blocking the preview. Allow camera and microphone in your browser, then click Recheck.
                </div>
              )}
              {deviceStatus === 'unsupported' && (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-100 text-xs leading-relaxed">
                  This browser cannot run secure video. Please switch to a modern desktop browser like Chrome, Edge, or Safari.
                </div>
              )}
              {deviceStatus === 'error' && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/60 text-xs leading-relaxed">
                  A device or browser issue prevented a clean preview. Close other apps using the camera or mic, then recheck.
                </div>
              )}
           </div>
        </div>

        {/* Info & Join Side */}
        <div className="space-y-10 lg:pl-10">
           <div>
              <div className="inline-flex items-center gap-3 bg-oku-purple/10 text-oku-purple border border-oku-purple/20 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-8">
                 <Sparkles size={12} className="animate-pulse" /> Secure Waiting Room
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tighter leading-[0.9] mb-6">
                 Ready to <br /> <span className="italic text-oku-purple">gentle</span> begin?
              </h1>
              <p className="text-white/60 text-lg font-display italic leading-relaxed max-w-md">
                 {isClient
                   ? `Take a breath. Your secure clinical space with ${practitionerName} is prepared.`
                   : `Your secure clinical space with ${practitionerName} is prepared.`}
              </p>
           </div>

           <div className="space-y-4">
              <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-white/10 transition-all cursor-default">
                 <div className="w-14 h-14 rounded-2xl bg-oku-purple/20 flex items-center justify-center text-oku-purple shadow-inner group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <p className="text-white font-bold text-sm">Secure Video Session</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mt-1">Browser-based access protected in transit</p>
                 </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-white/10 transition-all cursor-default">
                 <div className="w-14 h-14 rounded-2xl bg-oku-ocean/20 flex items-center justify-center text-oku-ocean shadow-inner group-hover:scale-110 transition-transform">
                    <CheckCircle size={24} />
                 </div>
                 <div>
                    <p className="text-white font-bold text-sm">Identity Verified</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mt-1">Logged in as {userName}</p>
                 </div>
              </div>
           </div>

           <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Readiness Check</p>
              <p className="text-sm text-white/70 leading-relaxed">
                {canJoin
                  ? 'Your devices are ready. You can join now and the call will open with the best available preview.'
                  : 'You can still retry the check until camera and microphone access are ready. Joining is blocked until the preview is healthy.'}
              </p>
           </div>

           <div className="pt-8">
              <button 
                onClick={onJoin}
                disabled={!canJoin}
                className="w-full bg-white text-oku-dark py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-oku-purple transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                {canJoin ? 'Join Secure Session' : 'Complete Device Check'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center mt-6 text-[9px] font-black uppercase tracking-widest text-white/20">
                 By joining, you agree to Oku Clinic's Telehealth Consent Protocol.
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
