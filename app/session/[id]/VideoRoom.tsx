'use client'

import { useEffect, useState } from 'react'
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
import { Loader2 } from 'lucide-react'

export function VideoRoom({ 
    sessionId, 
    userId, 
    userName,
    role
}: { 
    sessionId: string, 
    userId: string, 
    userName: string,
    role: string 
}) {
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let activeClient: StreamVideoClient | null = null;

    const initStream = async () => {
      try {
        const response = await fetch('/api/video/token', { method: 'POST' })
        
        if (!response.ok) {
            throw new Error("Failed to fetch token")
        }
        
        const { token, apiKey } = await response.json()

        if (apiKey === 'placeholder_key') {
            setError("Stream API keys are not configured. Please add NEXT_PUBLIC_STREAM_API_KEY and STREAM_SECRET_KEY to your .env file.")
            return;
        }

        const user: User = {
          id: userId,
          name: userName,
        }

        const newClient = new StreamVideoClient({ apiKey, user, token })
        activeClient = newClient
        setClient(newClient)

        // The call ID should be deterministic based on the session ID
        // Note: Stream call IDs have character restrictions (no special chars like '-')
        const cleanSessionId = sessionId.replace(/[^a-zA-Z0-9]/g, '')
        const myCall = newClient.call('default', cleanSessionId)
        
        await myCall.join({ create: true })
        setCall(myCall)

      } catch (err) {
        console.error("Stream connection failed:", err)
        setError("Failed to connect to the secure video server.")
      }
    }

    initStream()

    return () => {
      if (activeClient) {
        activeClient.disconnectUser()
      }
    }
  }, [sessionId, userId, userName, role])

  if (error) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-8 text-center">
            <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-md">
               <p className="text-red-400 font-bold mb-2">Connection Error</p>
               <p className="text-sm opacity-80">{error}</p>
            </div>
        </div>
    )
  }

  if (!client || !call) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1A1817] text-white">
         <Loader2 className="animate-spin mb-4 text-oku-purple" size={32} />
         <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-50 animate-pulse">Establishing Secure Connection...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 relative bg-[#0D0C0B] flex flex-col overflow-hidden stream-theme-overrides">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
             <div className="flex-1 flex flex-col h-full w-full">
                <div className="flex-1 overflow-hidden p-4">
                  <SpeakerLayout participantsBarPosition="bottom" />
                </div>
                <div className="p-4 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
                  <CallControls onLeave={() => window.location.href = '/dashboard'} />
                </div>
             </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
      
      {/* Custom styles to make Stream SDK fit our premium theme */}
      <style dangerouslySetInnerHTML={{__html:`
        .str-video {
           --str-video-primary-color: #9D85B3;
           --str-video-bg-color: transparent;
        }
      `}} />
    </div>
  )
}
