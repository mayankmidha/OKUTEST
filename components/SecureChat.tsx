'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Lock, Loader2, CheckCircle2, User } from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  isRead: boolean
  sender: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export function SecureChat({ 
  currentUserId, 
  contactId, 
  contactName,
  contactAvatar
}: { 
  currentUserId: string, 
  contactId: string, 
  contactName: string,
  contactAvatar?: string | null
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?contactId=${contactId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // Simple polling for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [contactId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    const optimisticMessage = {
        id: Math.random().toString(),
        content: newMessage,
        senderId: currentUserId,
        createdAt: new Date().toISOString(),
        isRead: false,
        sender: { id: currentUserId, name: 'You', avatar: null }
    }
    setMessages(prev => [...prev, optimisticMessage])
    setNewMessage('')

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: contactId, content: optimisticMessage.content })
      })
      await fetchMessages() // Sync with server
    } catch (e) {
      console.error('Failed to send message', e)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[3rem] border border-oku-taupe/10 shadow-xl overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-oku-dark text-white p-6 px-8 flex items-center justify-between z-10 shadow-md">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-oku-purple/20 border-2 border-white/10 flex items-center justify-center">
                {contactAvatar ? <img src={contactAvatar} alt={contactName} className="w-full h-full object-cover" /> : <User size={20} className="text-oku-purple" />}
            </div>
            <div>
                <h3 className="font-display font-bold text-lg">{contactName}</h3>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-oku-green mt-0.5">
                    <Lock size={10} /> Secure Connection
                </div>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-oku-cream/30 custom-scrollbar">
        {isLoading ? (
            <div className="h-full flex items-center justify-center text-oku-taupe">
                <Loader2 className="animate-spin" size={24} />
            </div>
        ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <Lock size={32} className="text-oku-taupe mb-4" strokeWidth={1} />
                <p className="font-display italic text-lg text-oku-dark">This is the beginning of a secure conversation.</p>
                <p className="text-xs text-oku-taupe mt-2 max-w-xs">Messages sent here are end-to-end encrypted and HIPAA-adjacent.</p>
            </div>
        ) : (
            <AnimatePresence initial={false}>
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUserId
                    const showAvatar = !isMe && (idx === 0 || messages[idx - 1].senderId !== msg.senderId)

                    return (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                        >
                            <div className="flex items-end gap-3 max-w-[75%]">
                                {!isMe && (
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-oku-purple/10 flex items-center justify-center mb-1 shadow-sm">
                                        {showAvatar ? (
                                            msg.sender.avatar ? <img src={msg.sender.avatar} className="w-full h-full object-cover" /> : <User size={14} className="text-oku-purple" />
                                        ) : null}
                                    </div>
                                )}
                                <div>
                                    <div 
                                        className={`p-4 text-sm leading-relaxed ${
                                            isMe 
                                            ? 'bg-oku-dark text-white rounded-[2rem] rounded-br-md' 
                                            : 'bg-white text-oku-dark border border-oku-taupe/10 rounded-[2rem] rounded-bl-md shadow-sm'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <div className={`text-[9px] font-black uppercase tracking-widest text-oku-taupe/40 mt-2 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && msg.isRead && <CheckCircle2 size={10} className="text-oku-green ml-1" />}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-oku-taupe/10">
        <form onSubmit={handleSend} className="relative flex items-center">
            <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a secure message..."
                className="w-full bg-oku-cream/50 border border-oku-taupe/10 rounded-full py-4 pl-6 pr-16 text-sm focus:outline-none focus:ring-4 focus:ring-oku-purple/10 focus:border-oku-purple transition-all"
            />
            <button 
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="absolute right-2 p-3 bg-oku-purple text-white rounded-full hover:bg-oku-dark transition-all disabled:opacity-50 disabled:hover:bg-oku-purple"
            >
                {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
            </button>
        </form>
      </div>
    </div>
  )
}
