import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Clock, ShieldCheck, AlertTriangle, LogOut } from "lucide-react"
import Link from 'next/link'
import NoShowButton from "./NoShowButton"
import { VideoRoom } from "./VideoRoom"

export default async function TelehealthSessionPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  const sessionDetails = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: { 
        client: true,
        practitioner: true
    }
  })

  if (!sessionDetails) return <div className="min-h-screen bg-oku-cream flex items-center justify-center font-display text-xl text-oku-taupe">Session not found or has been removed.</div>

  // Access Control
  const isClient = sessionDetails.clientId === session.user.id
  const isTherapist = sessionDetails.practitionerId === session.user.id

  if (!isClient && !isTherapist) {
      return <div className="min-h-screen bg-oku-cream flex items-center justify-center font-display text-xl text-oku-taupe">Unauthorized access to this secure clinical space.</div>
  }

  // Time Check (Allow joining anytime for testing/confirmed sessions)
  const isTooEarly = false 

  if (isTooEarly && isClient) {
      return (
          <div className="min-h-screen bg-oku-page-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-oku-purple/10 rounded-full blur-[100px]" />
              <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl p-12 rounded-[3rem] border border-oku-taupe/5 shadow-2xl text-center relative z-10">
                  <div className="w-20 h-20 bg-oku-purple/10 text-oku-purple rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Clock size={32} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl font-display font-bold text-oku-dark mb-4 tracking-tight">The Waiting Room</h1>
                  <p className="text-oku-taupe text-sm mb-10 leading-relaxed">Your secure space is being prepared. You can enter 10 minutes before the scheduled start time.</p>
                  
                  <div className="bg-oku-cream-warm/30 p-6 rounded-[2rem] mb-10 border border-oku-taupe/5">
                      <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/60 mb-2">Scheduled Time</p>
                      <p className="text-3xl font-display font-bold text-oku-dark tracking-tighter">
                        {new Date(sessionDetails.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                  </div>

                  <Link href="/dashboard" className="inline-block w-full py-4 rounded-full bg-oku-dark text-white text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple-dark transition-all shadow-xl active:scale-95">
                    Return to Dashboard
                  </Link>
              </div>
          </div>
      )
  }

  return (
    <div className="h-screen bg-[#1A1817] flex flex-col overflow-hidden font-sans">
        {/* Premium Header for Session Mode */}
        <header className="h-20 bg-[#141312]/80 backdrop-blur-xl border-b border-white/5 px-8 flex justify-between items-center z-10">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-white/5 pl-2 pr-4 py-2 rounded-full border border-white/5">
                  <div className="w-2.5 h-2.5 bg-oku-danger rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/80">Live Session</span>
                </div>
                <h1 className="text-white/90 font-display font-bold text-lg tracking-wide hidden sm:block">
                    {isClient ? `With ${sessionDetails.practitioner.name}` : `Patient: ${sessionDetails.client.name}`}
                </h1>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 text-oku-green text-[10px] uppercase tracking-widest font-bold">
                    <ShieldCheck size={14} />
                    E2E Encrypted
                </div>
                <div className="w-px h-6 bg-white/10 hidden sm:block" />
                <Link 
                  href="/dashboard"
                  className="flex items-center gap-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <LogOut size={14} /> Leave
                </Link>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            {/* Stream Video React Integration */}
            <VideoRoom 
              sessionId={sessionDetails.id}
              userId={session.user.id}
              userName={session.user.name || 'User'}
              role={session.user.role as string}
            />

            {/* Therapist Sidebar Controls */}
            {isTherapist && (
                <div className="w-80 bg-[#141312] border-l border-white/5 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar relative z-10">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-4">Clinical Context</h4>
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                            <p className="text-white font-display font-bold text-xl mb-1">{sessionDetails.client.name}</p>
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
                              <NoShowButton sessionId={sessionDetails.id} startTime={sessionDetails.startTime.toISOString()} />
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
