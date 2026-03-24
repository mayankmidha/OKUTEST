'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, Mic, ShieldCheck, Video, Settings, Monitor, Loader2, Sparkles, CheckCircle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [micActive, setMicActive] = useState(true)
  const [camActive, setCamActive] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function setupMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error("Error accessing media devices:", err)
      } finally {
        setIsLoading(false)
      }
    }
    setupMedia()

    return () => {
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled
      setMicActive(audioTrack.enabled)
    }
  }

  const toggleCam = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      videoTrack.enabled = !videoTrack.enabled
      setCamActive(videoTrack.enabled)
    }
  }

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
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/40">
                   <Loader2 className="animate-spin" size={32} />
                   <p className="text-[10px] uppercase tracking-[0.3em] font-black">Connecting Secure Hardware...</p>
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
                 Take a breath. Your secure clinical space with {practitionerName} is prepared and encrypted.
              </p>
           </div>

           <div className="space-y-4">
              <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-white/10 transition-all cursor-default">
                 <div className="w-14 h-14 rounded-2xl bg-oku-purple/20 flex items-center justify-center text-oku-purple shadow-inner group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <p className="text-white font-bold text-sm">HIPAA Compliant Video</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mt-1">End-to-End Encrypted Tunnel</p>
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

           <div className="pt-8">
              <button 
                onClick={onJoin}
                className="w-full bg-white text-oku-dark py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-oku-purple transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] active:scale-95 group"
              >
                Join Secure Session <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
