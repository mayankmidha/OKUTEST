'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageSquare, Shield, Send, Users, Sparkles, Loader2 } from 'lucide-react'

interface Message {
  id: string
  alias: string
  text: string
  timestamp: string
  isMe: boolean
}

export function AnonymousPreChat({ circleId, userAlias }: { circleId: string, userAlias: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', alias: 'Quiet Willow 402', text: 'Hello everyone, looking forward to our session.', timestamp: '10:00 AM', isMe: false },
    { id: '2', alias: 'Calm Fern 120', text: 'Me too. Feeling a bit nervous but ready.', timestamp: '10:05 AM', isMe: false }
  ])
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim()) return
    setIsSending(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newMessage: Message = {
      id: Date.now().toString(),
      alias: userAlias,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }
    
    setMessages([...messages, newMessage])
    setInputText('')
    setIsSending(false)
  }

  return (
    <div className="card-glass-3d !p-0 !bg-white/80 border-2 border-white shadow-2xl flex flex-col h-[600px] overflow-hidden">
      {/* ── CHAT HEADER ── */}
      <div className="p-6 bg-oku-dark text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-oku-lavender">
                  <MessageSquare size={20} />
              </div>
              <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Anonymous Pre-Chat</h3>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-black flex items-center gap-2 mt-1">
                      <Shield size={10} className="text-oku-mint" /> Private Circle Space
                  </p>
              </div>
          </div>
          <div className="relative z-10 text-right">
              <div className="flex -space-x-2 mb-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-oku-purple/40 border-2 border-oku-dark flex items-center justify-center text-[8px] font-black">
                        {i}
                    </div>
                  ))}
              </div>
              <p className="text-[8px] font-black text-white/30 uppercase">3 Online</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-full bg-oku-purple/10 rounded-full blur-3xl" />
      </div>

      {/* ── CHAT MESSAGES ── */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-oku-cream/20">
          <div className="bg-oku-lavender/30 p-4 rounded-2xl text-center mb-8 border border-oku-lavender/50">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-oku-purple-dark flex items-center justify-center gap-2">
                  <Sparkles size={12} /> You are participating as <strong>{userAlias}</strong>
              </p>
          </div>

          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
                <div className="flex items-center gap-2 mb-2 px-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30">{msg.alias}</span>
                    <span className="text-[8px] font-bold text-oku-darkgrey/10">{msg.timestamp}</span>
                </div>
                <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm border ${
                    msg.isMe 
                    ? 'bg-oku-darkgrey text-white border-oku-darkgrey !rounded-tr-none' 
                    : 'bg-white text-oku-darkgrey border-white !rounded-tl-none'
                }`}>
                    {msg.text}
                </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
      </div>

      {/* ── INPUT AREA ── */}
      <div className="p-6 bg-white border-t border-oku-darkgrey/5">
          <div className="flex items-center gap-3 bg-oku-cream/50 p-2 rounded-full border border-oku-darkgrey/5 focus-within:border-oku-purple/30 transition-all">
              <input 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none px-4 text-sm font-medium focus:ring-0 placeholder:text-oku-darkgrey/20"
                placeholder="Share a gentle thought..."
              />
              <button 
                onClick={handleSend}
                disabled={isSending || !inputText.trim()}
                className="w-10 h-10 rounded-full bg-oku-darkgrey text-white flex items-center justify-center hover:bg-oku-purple-dark transition-all disabled:opacity-20"
              >
                  {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
          </div>
      </div>
    </div>
  )
}
