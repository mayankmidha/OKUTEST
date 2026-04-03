'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, X, Send, ShieldAlert, Wind, LifeBuoy, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CrisisChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Peace. I am OKU's 24/7 support presence. How are you carrying yourself in this moment?" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chat, isTyping])

  const handleSend = async () => {
    if (!message.trim()) return
    
    const userMsg = message
    setChat(prev => [...prev, { role: 'user', text: userMsg }])
    setMessage('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/ai/crisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      setChat(prev => [...prev, { role: 'ai', text: data.response }])
    } catch (e) {
      setChat(prev => [...prev, { role: 'ai', text: "I'm here. Let's focus on your breathing for a moment." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="card-glass-3d !p-0 !bg-white/80 w-[380px] h-[550px] mb-6 flex flex-col overflow-hidden shadow-2xl border-2 border-white"
          >
            {/* Header */}
            <div className="bg-oku-darkgrey p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-oku-lavender flex items-center justify-center text-oku-darkgrey animate-float-3d">
                  <LifeBuoy size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">24/7 Presence</p>
                  <p className="text-sm font-bold">OKU Support AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-oku-darkgrey text-white rounded-tr-none' 
                      : 'bg-oku-lavender text-oku-darkgrey rounded-tl-none border border-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-oku-lavender/40 p-4 rounded-2xl rounded-tl-none animate-pulse">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-oku-purple-dark rounded-full" />
                      <div className="w-1.5 h-1.5 bg-oku-purple-dark rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-oku-purple-dark rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Input */}
            <div className="p-6 bg-white/40 border-t border-white/60">
              <div className="flex gap-3">
                <input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your feelings..."
                  className="flex-1 bg-white/60 border border-white rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-oku-lavender transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="w-10 h-10 rounded-xl bg-oku-darkgrey text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-oku-darkgrey/30">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={10} />
                  <span>AI Monitor Active</span>
                </div>
                <Link href="/emergency" className="text-oku-purple-dark hover:underline">Emergency Contacts</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-2xl bg-oku-darkgrey text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-oku-purple-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={28} /> : <MessageCircle size={28} className="animate-float-3d" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  )
}
