'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Clock, ShieldCheck, AlertTriangle, LogOut, Loader2 } from "lucide-react"
import Link from 'next/link'
import NoShowButton from "./NoShowButton"
import { VideoRoom } from "./VideoRoom"
import { WaitingRoom } from "./WaitingRoom"

export default function TelehealthSessionPage() {
  const params = useParams()
  const router = useRouter()
  const [sessionData, setSessionData] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initSession() {
      try {
        const [sessionRes, userRes] = await Promise.all([
          fetch(`/api/sessions/${params.id}`),
          fetch('/api/user/profile')
        ])

        if (!sessionRes.ok || !userRes.ok) {
           setError("Unable to establish a clinical link. Please verify your connection.")
           return
        }

        const sessionJson = await sessionRes.json()
        const userJson = await userRes.json()

        setSessionData(sessionJson)
        setCurrentUser(userJson)
      } catch (err) {
        setError("Network disruption. Re-establishing secure tunnel...")
      } finally {
        setIsLoading(false)
      }
    }
    initSession()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0C0B] flex flex-col items-center justify-center">
         <Loader2 className="animate-spin text-oku-purple mb-4" size={32} />
         <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Synchronizing Session Data...</p>
      </div>
    )
  }

  if (error || !sessionData || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0D0C0B] flex flex-col items-center justify-center p-6 text-center">
         <div className="max-w-md bg-white/5 border border-white/10 p-12 rounded-[3rem] backdrop-blur-xl">
            <AlertTriangle className="text-oku-danger mx-auto mb-6" size={40} />
            <h2 className="text-2xl font-display font-bold text-white mb-4">Connection Failed</h2>
            <p className="text-white/40 text-sm mb-10 italic">{error || "This session window is no longer active."}</p>
            <Link href="/dashboard" className="btn-navy w-full py-4 block">Return to Safety</Link>
         </div>
      </div>
    )
  }

  const isClient = sessionData.clientId === currentUser.id
  const isTherapist = sessionData.practitionerId === currentUser.id

  if (!isClient && !isTherapist) {
      return <div className="min-h-screen bg-oku-cream flex items-center justify-center font-display text-xl text-oku-taupe">Unauthorized access to this secure clinical space.</div>
  }

  if (!hasJoined) {
    return (
      <WaitingRoom 
        onJoin={() => setHasJoined(true)}
        userName={currentUser.name}
        practitionerName={sessionData.practitioner.name}
        isClient={isClient}
      />
    )
  }

  return (
    <div className="h-screen bg-[#1A1817] flex flex-col overflow-hidden font-sans">
        {/* Premium Header for Session Mode */}
        <header className="h-20 bg-[#141312]/80 backdrop-blur-xl border-b border-white/5 px-8 flex justify-between items-center z-10">
            <div className="flex items-center gap-6">
                <div className={`flex items-center gap-3 bg-white/5 pl-2 pr-4 py-2 rounded-full border border-white/5 ${sessionData.isTrial ? 'border-oku-purple/30' : ''}`}>
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)] ${sessionData.isTrial ? 'bg-oku-purple' : 'bg-oku-danger'}`}></div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/80">
                    {sessionData.isTrial ? '10-Min Trial Session' : 'Live Session'}
                  </span>
                </div>
                <h1 className="text-white/90 font-display font-bold text-lg tracking-wide hidden sm:block">
                    {isClient ? `With ${sessionData.practitioner.name}` : `Patient: ${sessionData.client.name}`}
                </h1>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 text-oku-green text-[10px] uppercase tracking-widest font-bold">
                    <ShieldCheck size={14} />
                    E2E Encrypted
                </div>
                <div className="w-px h-6 bg-white/10 hidden sm:block" />
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <LogOut size={14} /> Leave
                </button>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            {/* Stream Video React Integration */}
            <VideoRoom 
              sessionId={sessionData.id}
              userId={currentUser.id}
              userName={currentUser.name || 'User'}
              role={currentUser.role as string}
              isTrial={sessionData.isTrial}
            />

            {/* Therapist Sidebar Controls */}
            {isTherapist && (
                <div className="w-80 bg-[#141312] border-l border-white/5 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar relative z-10">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-4">Clinical Context</h4>
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                            <p className="text-white font-display font-bold text-xl mb-1">{sessionData.client.name}</p>
                            <p className="text-oku-purple text-[10px] uppercase tracking-widest font-black">Standard Session</p>
                        </div>
                    </div>

                    <div className="flex-grow">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-4">Attendance Protocol</h4>
                        <div className="bg-oku-purple/5 p-6 rounded-[2rem] border border-oku-purple/10 relative overflow-hidden group">
                            <div className="relative z-10">
                              <AlertTriangle className="text-oku-purple mb-4" size={20} strokeWidth={1.5} />
                              <p className="text-white/60 text-sm leading-relaxed mb-8">
                                  If the patient has not arrived within 15 minutes of the start time, you may officially mark this session as a No-Show.
                              </p>
                              <NoShowButton sessionId={sessionData.id} startTime={sessionData.startTime} />
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}
