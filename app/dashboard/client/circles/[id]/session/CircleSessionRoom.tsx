'use client'

import { useState, useEffect, useRef } from 'react'
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  StreamTheme,
  PaginatedGridLayout,
  CallControls,
  Call,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import { Loader2, ShieldCheck, Users, MessageSquare, Send, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'

interface CircleSessionRoomProps {
  callId: string
  userId: string
  userName: string
  circleId: string
}

function ParticipantCount() {
  const { useParticipants } = useCallStateHooks()
  const participants = useParticipants()
  return (
    <div className="flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest">
      <Users size={13} />
      {participants.length} in circle
    </div>
  )
}

export function CircleSessionRoom({
  callId,
  userId,
  userName,
  circleId,
}: CircleSessionRoomProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)
  const [joinStatus, setJoinStatus] = useState<'connecting' | 'ready' | 'error'>('connecting')
  const [joinError, setJoinError] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([
    { id: 1, user: 'Guide', text: 'Welcome to our sanctuary. Peace be with you.', time: 'now' }
  ])
  const router = useRouter()

  const clientRef = useRef<StreamVideoClient | null>(null)
  const callRef = useRef<Call | null>(null)

  const sendMessage = () => {
    if (!chatMessage.trim()) return
    setMessages([...messages, { id: Date.now(), user: userName, text: chatMessage, time: 'just now' }])
    setChatMessage('')
  }

  const cleanupStream = async () => {
    try {
      await (callRef.current as any)?.leave?.()
    } catch (e) {
      console.debug('Stream call leave cleanup failed', e)
    }
    try {
      await (clientRef.current as any)?.disconnectUser?.()
    } catch (e) {
      console.debug('Stream client disconnect cleanup failed', e)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    const setupMedia = async () => {
      try {
        const res = await fetch(`/api/circles/${circleId}/stream-token`, {
          method: 'POST',
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('Failed to fetch circle stream token')

        const payload = await res.json()
        if (!payload.token || !payload.apiKey || !payload.callId) {
          throw new Error('Invalid token payload')
        }

        const newClient = new StreamVideoClient({
          apiKey: payload.apiKey,
          user: {
            id: userId,
            name: userName, // first name only — anonymised by caller
          },
          token: payload.token,
        })

        // callId from server is `circle_${id}` — sanitise for Stream
        const safeCallId = payload.callId.replace(/[^a-zA-Z0-9_-]/g, '_')
        const newCall = newClient.call('default', safeCallId)

        clientRef.current = newClient
        callRef.current = newCall

        if (controller.signal.aborted) {
          await cleanupStream()
          return
        }

        await newCall.join({ create: true })

        if (controller.signal.aborted) {
          await cleanupStream()
          return
        }

        setClient(newClient)
        setCall(newCall)
        setJoinStatus('ready')
      } catch (error: any) {
        if (error.name === 'AbortError') return
        console.error('CircleSessionRoom setup error:', error)
        setJoinError(error.message || 'Could not connect to the circle.')
        setJoinStatus('error')
      }
    }

    setupMedia()

    return () => {
      controller.abort()
      cleanupStream()
    }
  }, [circleId, userId, userName])

  const handleLeave = async () => {
    await cleanupStream()
    router.push(`/dashboard/client/circles/${circleId}`)
  }

  if (joinStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-3xl border border-red-200 p-8 text-center">
        <p className="text-red-500 font-display text-lg mb-6">{joinError}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-pill-3d bg-oku-darkgrey text-white"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  if (joinStatus === 'connecting' || !client || !call) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] rounded-[3rem] bg-oku-lavender/10">
        <Loader2 className="animate-spin text-oku-purple-dark mb-6" size={40} />
        <p className="text-oku-darkgrey font-display text-xl animate-pulse">
          Connecting to Circle...
        </p>
        <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/50 mt-4 flex items-center gap-2">
          <ShieldCheck size={14} /> Not recorded · Anonymised
        </p>
      </div>
    )
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <div className="flex flex-col h-[calc(100vh-80px)] rounded-[2rem] overflow-hidden bg-oku-darkgrey relative shadow-2xl">
            {/* Header overlay */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-center pointer-events-none">
              <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 pointer-events-auto flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white font-display text-sm tracking-wide">Circle Session</span>
                <ParticipantCount />
              </div>

              <button 
                onClick={() => setShowChat(!showChat)}
                className="bg-oku-lavender text-oku-dark px-6 py-3 rounded-full border border-white/20 pointer-events-auto flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl"
              >
                <MessageSquare size={16} /> {showChat ? 'Hide Chat' : 'Discussion'}
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video grid */}
                <div className="flex-1 p-6 pt-24 pb-28">
                    <PaginatedGridLayout groupSize={6} />
                </div>

                {/* Chat Sidebar */}
                <AnimatePresence>
                    {showChat && (
                        <motion.div 
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            className="w-[350px] bg-black/40 backdrop-blur-3xl border-l border-white/10 flex flex-col pt-24"
                        >
                            <div className="p-6 border-b border-white/5">
                                <h3 className="text-white font-display font-bold text-lg">Community Thread</h3>
                                <p className="text-[9px] uppercase tracking-widest text-white/40">Collective Healing Space</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.map(msg => (
                                    <div key={msg.id} className="space-y-1 text-left">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-oku-lavender uppercase">{msg.user}</span>
                                            <span className="text-[8px] text-white/20 uppercase">{msg.time}</span>
                                        </div>
                                        <p className="text-sm text-white/80 leading-relaxed">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 mt-auto pb-24">
                                <div className="relative pointer-events-auto">
                                    <input 
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Share your resonance..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-oku-lavender/20"
                                    />
                                    <button 
                                        onClick={sendMessage}
                                        className="absolute right-2 top-2 p-2 bg-oku-lavender text-oku-dark rounded-xl"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-white/10">
              <CallControls onLeave={handleLeave} />
            </div>
          </div>
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  )
}
