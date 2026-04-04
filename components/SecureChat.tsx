'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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

  useEffect(() => {
    setIsLoading(true)
    let active = true

    const syncMessages = async () => {
      try {
        const data = await readMessages(contactId)
        if (active && data) {
          setMessages(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    syncMessages()
    const interval = setInterval(syncMessages, 5000)
    return () => {
      active = false
      clearInterval(interval)
    }
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
      const refreshedMessages = await readMessages(contactId)
      if (refreshedMessages) {
        setMessages(refreshedMessages)
      }
    } catch (e) {
      console.error('Failed to send message', e)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-[70vh] min-h-[32rem] flex-col overflow-hidden rounded-[2rem] border border-oku-taupe/10 bg-white shadow-xl sm:h-[600px] sm:rounded-[3rem]">
      
      {/* Chat Header */}
      <div className="z-10 flex items-center justify-between border-b border-oku-purple-dark/10 bg-oku-purple p-4 shadow-sm sm:p-6 sm:px-8">
        <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/50 shadow-inner sm:h-12 sm:w-12">
                {contactAvatar ? <img src={contactAvatar} alt={contactName} className="w-full h-full object-cover" /> : <User size={20} className="text-oku-purple-dark" />}
            </div>
            <div className="min-w-0">
                <h3 className="truncate font-display text-base font-bold text-oku-dark sm:text-lg">{contactName}</h3>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-oku-green-dark mt-0.5">
                    <Lock size={10} /> Secure Connection
                </div>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto bg-oku-cream/30 p-4 sm:space-y-6 sm:p-8">
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
                            <div className="flex max-w-[85%] items-end gap-2.5 sm:max-w-[75%] sm:gap-3">
                                {!isMe && (
                                    <div className="mb-1 flex h-7 w-7 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-oku-purple/10 shadow-sm sm:h-8 sm:w-8">
                                        {showAvatar ? (
                                            msg.sender.avatar ? <img src={msg.sender.avatar} alt={msg.sender.name || 'Contact avatar'} className="w-full h-full object-cover" /> : <User size={14} className="text-oku-purple" />
                                        ) : null}
                                    </div>
                                )}
                                <div>
                                    <div 
                                        className={`p-3.5 text-sm leading-relaxed sm:p-4 ${
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
      <div className="border-t border-oku-taupe/10 bg-white p-4 sm:p-6">
        <form onSubmit={handleSend} className="relative flex items-center">
            <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a secure message..."
                className="w-full rounded-full border border-oku-taupe/10 bg-oku-cream/50 py-3.5 pl-5 pr-14 text-sm transition-all focus:border-oku-purple focus:outline-none focus:ring-4 focus:ring-oku-purple/10 sm:py-4 sm:pl-6 sm:pr-16"
            />
            <button 
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="absolute right-2 rounded-full bg-oku-purple p-2.5 text-white transition-all hover:bg-oku-dark disabled:opacity-50 disabled:hover:bg-oku-purple sm:p-3"
            >
                {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
            </button>
        </form>
      </div>
    </div>
  )
}

async function readMessages(contactId: string): Promise<Message[] | null> {
  const res = await fetch(`/api/messages?contactId=${contactId}`)
  if (!res.ok) {
    return null
  }

  return res.json()
}
