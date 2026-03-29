'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Mic, 
    MicOff, 
    Send, 
    Sparkles, 
    Volume2, 
    VolumeX, 
    Heart, 
    History,
    MessageCircle,
    ArrowLeft,
    Loader2,
    X
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CareRoomClient({ user, initialContext }: { user: any, initialContext: any }) {
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: `Hello ${user.name?.split(' ')[0]}. I am Oku. I'm here to listen. Whatever is on your mind, this is a safe space.` }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (content: string) => {
    if (!content.trim()) return
    
    const userMsg = { role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    try {
        const res = await fetch('/api/ai/care/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: content,
                context: initialContext
            })
        })
        const data = await res.json()
        setMessages(prev => [...prev, { role: 'ai', content: data.result }])
    } catch (e) {
        console.error(e)
    } finally {
        setIsTyping(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-oku-cream flex flex-col">
        {/* Immersive Header */}
        <header className="p-8 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-oku-taupe/5">
            <button onClick={() => router.back()} className="p-4 hover:bg-oku-lavender/30 rounded-full transition-all">
                <ArrowLeft size={24} className="text-oku-dark" />
            </button>
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-oku-purple animate-pulse" />
                    <h1 className="text-xl font-display font-bold text-oku-dark tracking-tight">OKU Care AI</h1>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-taupe/60 mt-1">24/7 Empathetic Listener</p>
            </div>
            <div className="flex gap-4">
                <button className="p-4 hover:bg-oku-lavender/30 rounded-full transition-all text-oku-dark"><History size={20} /></button>
                <button className="p-4 hover:bg-oku-lavender/30 rounded-full transition-all text-oku-dark"><Heart size={20} /></button>
            </div>
        </header>

        {/* Main Listening Space */}
        <main 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 md:p-20 space-y-12 max-w-5xl mx-auto w-full no-scrollbar scroll-smooth"
        >
            <AnimatePresence>
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-2xl p-10 rounded-[3rem] text-xl leading-relaxed shadow-premium ${
                            msg.role === 'user' 
                            ? 'bg-oku-dark text-white rounded-tr-none' 
                            : 'bg-white/80 backdrop-blur-xl text-oku-dark rounded-tl-none border border-white'
                        }`}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white/40 p-8 rounded-[3rem] rounded-tl-none border border-white flex gap-2">
                            <div className="w-2 h-2 bg-oku-purple rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-oku-purple rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-oku-purple rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>

        {/* Sensory Footer (Voice & Input) */}
        <footer className="p-8 md:p-12 bg-white/50 backdrop-blur-3xl border-t border-white shadow-[0_-20px_100px_rgba(0,0,0,0.02)]">
            <div className="max-w-4xl mx-auto relative">
                
                {/* Voice Visualizer Simulation */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12">
                    {[...Array(12)].map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={isListening ? { height: [4, Math.random() * 48 + 4, 4] } : { height: 4 }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                            className="w-1.5 bg-oku-purple rounded-full opacity-40"
                        />
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setIsListening(!isListening)}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl relative group ${
                            isListening ? 'bg-red-500 scale-110 shadow-red-500/20' : 'bg-oku-dark hover:bg-oku-purple-dark'
                        }`}
                    >
                        {isListening ? <MicOff size={28} className="text-white" /> : <Mic size={28} className="text-white" />}
                        <div className={`absolute inset-0 rounded-full border-4 border-white/20 scale-125 animate-ping ${isListening ? 'block' : 'hidden'}`} />
                    </button>

                    <div className="flex-1 relative">
                        <input 
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend(inputValue)}
                            placeholder={isListening ? "I'm listening..." : "Type how you feel..."}
                            className="w-full bg-oku-cream-warm/50 border border-oku-taupe/10 rounded-[2.5rem] p-8 pr-20 text-lg outline-none focus:bg-white focus:border-oku-purple transition-all shadow-inner"
                        />
                        <button 
                            onClick={() => handleSend(inputValue)}
                            className="absolute right-4 top-4 bottom-4 w-12 h-12 bg-oku-purple text-white rounded-full flex items-center justify-center hover:bg-oku-purple-dark transition-all shadow-lg active:scale-90"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 flex justify-center gap-12">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-40">
                        <Sparkles size={14} /> HIPAA Secure
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-40">
                        <MessageCircle size={14} /> Clinical Reflection
                    </div>
                </div>
            </div>
        </footer>
    </div>
  )
}
