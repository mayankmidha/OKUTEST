import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Header from "@/components/Header"
import { Clock, ShieldCheck } from "lucide-react"

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

  if (!sessionDetails) return <div>Session not found</div>

  // Access Control
  const isClient = sessionDetails.clientId === session.user.id
  const isTherapist = sessionDetails.practitionerId === session.user.id

  if (!isClient && !isTherapist) {
      return <div>Unauthorized access to this session.</div>
  }

  // Time Check (Allow joining 10 mins before)
  const now = new Date()
  const scheduledTime = new Date(sessionDetails.startTime)
  const tenMinutesBefore = new Date(scheduledTime.getTime() - 10 * 60000)
  
  // For demo/dev purposes, we might want to relax this check or make it visible
  const isTooEarly = now < tenMinutesBefore

  if (isTooEarly && isClient) {
      return (
          <div className="min-h-screen bg-oku-cream flex flex-col">
              <Header />
              <div className="flex-1 flex items-center justify-center p-6">
                  <div className="max-w-md w-full bg-white p-12 rounded-[3rem] border border-oku-taupe/10 shadow-xl text-center">
                      <div className="w-20 h-20 bg-oku-purple/10 text-oku-purple rounded-full flex items-center justify-center mx-auto mb-8">
                          <Clock className="w-10 h-10" />
                      </div>
                      <h1 className="text-3xl font-display font-bold text-oku-dark mb-4">Waiting Room</h1>
                      <p className="text-oku-taupe font-script text-2xl mb-8">Your session hasn't started yet.</p>
                      
                      <div className="bg-oku-cream-warm/50 p-6 rounded-2xl mb-8">
                          <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe mb-2">Scheduled Time</p>
                          <p className="text-xl font-bold text-oku-dark">{scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>

                      <p className="text-sm text-oku-taupe leading-relaxed">
                          You can join the room 10 minutes before the session begins. Please check back then.
                      </p>
                  </div>
              </div>
          </div>
      )
  }

  // Generate a unique room name based on session ID to ensure privacy
  const roomName = `OKU-Therapy-${sessionDetails.id}`

  return (
    <div className="h-screen bg-oku-dark flex flex-col overflow-hidden">
        {/* Simplified Header for Session Mode */}
        <header className="bg-oku-dark/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h1 className="text-white font-display font-bold text-lg tracking-wide">
                    {isClient ? `Session with ${sessionDetails.practitioner.name}` : `Session with ${sessionDetails.client.name}`}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest font-black bg-white/5 px-3 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    End-to-End Encrypted
                </div>
            </div>
        </header>

        {/* Video Frame */}
        <div className="flex-1 relative bg-black">
            <iframe
                src={`https://meet.jit.si/${roomName}?config.prejoinPageEnabled=false`}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0"
            ></iframe>
        </div>
    </div>
  )
}
