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
  SpeakerLayout,
  useCallStateHooks
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import { Loader2, ShieldCheck, Users, MessageSquare, Send, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'

import { generateAnonymousAlias } from '@/lib/aliases'

interface CircleRoomProps {
  circleId: string
  user: { id: string, name: string, image?: string, role?: string }
  circleName: string
}

export function CircleRoom({ circleId, user, circleName }: CircleRoomProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joinStatus, setJoinStatus] = useState<'connecting' | 'ready' | 'error'>('connecting')
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([
    { id: 1, user: 'Guide', text: 'Welcome to our sanctuary. Take a deep breath.', time: 'now' }
  ])
  const [isAnonymized, setIsAnonymized] = useState(true)
  const [anonymousName] = useState(() => generateAnonymousAlias())
  const router = useRouter()

  const clientRef = useRef<StreamVideoClient | null>(null)
  const callRef = useRef<Call | null>(null)

  const sendMessage = () => {
    if (!chatMessage.trim()) return
    const displayName = user.role === 'THERAPIST' ? `Guide (${user.name.split(' ')[0]})` : anonymousName
    setMessages([...messages, { id: Date.now(), user: displayName, text: chatMessage, time: 'just now' }])
    setChatMessage('')
  }

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
  }

  useEffect(() => {
    const controller = new AbortController()

    const setupMedia = async () => {
      try {
        const res = await fetch('/api/video/token', { signal: controller.signal })
        if (!res.ok) throw new Error('Failed to fetch video token')
        
        const payload = await res.json()
        if (!payload.token || !payload.apiKey) throw new Error('Invalid token payload')

        // Use Randomized Name for Privacy in Circles
        const sessionName = user.role === 'THERAPIST' ? `Guide (${user.name.split(' ')[0]})` : anonymousName

        const streamUser = {
          id: user.id,
          name: sessionName,
          image: user.role === 'THERAPIST' ? user.image : undefined
        }

        const newClient = new StreamVideoClient({
          apiKey: payload.apiKey,
          user: streamUser,
          token: payload.token,
        })

        const cleanCircleId = circleId.replace(/[^a-zA-Z0-9]/g, '')
        const newCall = newClient.call('default', cleanCircleId)

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
        console.error('Media setup error:', error)
        setJoinError(error.message)
        setJoinStatus('error')
      }
    }

    setupMedia()

    return () => {
      controller.abort()
      cleanupStream()
    }
  }, [circleId, user, anonymousName])

  const handleLeave = async () => {
    await cleanupStream()
    router.push('/dashboard/client/circles')
  }

  if (joinStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-oku-red/10 rounded-3xl border border-oku-red/20 p-8 text-center">
        <p className="text-oku-red font-display text-lg mb-4">{joinError}</p>
        <button onClick={() => window.location.reload()} className="btn-pill-3d bg-oku-darkgrey text-white">Retry Connection</button>
      </div>
    )
  }

  if (joinStatus === 'connecting' || !client || !call) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-oku-background rounded-[3rem]">
        <Loader2 className="animate-spin text-oku-purple mb-6" size={40} />
        <p className="text-oku-dark font-display text-xl animate-pulse">Connecting to Circle...</p>
        <p className="text-[10px] uppercase tracking-widest text-oku-darkgrey/50 mt-4 flex items-center gap-2">
            <ShieldCheck size={14} /> Secure hosted video
        </p>
      </div>
    )
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <div className="flex flex-col h-[calc(100vh-100px)] rounded-[2rem] overflow-hidden bg-oku-dark relative shadow-2xl">
            {/* Header overlay */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-center pointer-events-none">
              <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 pointer-events-auto flex items-center gap-3">
                 <Users className="text-oku-lavender" size={18} />
                 <span className="text-white font-display text-sm tracking-wide">{circleName}</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-oku-green animate-pulse ml-2"></div>
              </div>

              <button 
                onClick={() => setShowChat(!showChat)}
                className="bg-oku-lavender text-oku-dark px-6 py-3 rounded-full border border-white/20 pointer-events-auto flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl"
              >
                <MessageSquare size={16} /> {showChat ? 'Close' : 'Discussion'}
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Grid */}
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
                                <h3 className="text-white font-display font-bold text-lg">Circle Thread</h3>
                                <p className="text-[9px] uppercase tracking-widest text-white/40">Shared sanctuary space</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.map(msg => (
                                    <div key={msg.id} className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-oku-lavender uppercase">{msg.user}</span>
                                            <span className="text-[8px] text-white/20 uppercase">{msg.time}</span>
                                        </div>
                                        <p className="text-sm text-white/80 leading-relaxed">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 mt-auto pb-24">
                                <div className="relative">
                                    <input 
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Share a thought..."
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
