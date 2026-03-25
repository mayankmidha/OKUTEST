'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught clinical error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-oku-cream flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-oku-taupe/5 relative overflow-hidden">
            <div className="relative z-10">
                <div className="w-20 h-20 bg-oku-pink/10 text-oku-pink-dark rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertTriangle size={32} strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-display font-bold text-oku-dark mb-4 tracking-tight">System Interruption</h1>
                <p className="text-oku-taupe text-sm mb-10 leading-relaxed italic">
                    "Even in the pause, there is a path back to center." <br/> We've encountered a temporary clinical disruption.
                </p>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-oku-dark text-white rounded-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-oku-purple transition-all shadow-xl"
                    >
                        <RefreshCcw size={14} /> Synchronize System
                    </button>
                    <Link 
                        href="/dashboard"
                        className="w-full py-4 bg-oku-cream text-oku-dark rounded-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-oku-taupe/10 transition-all border border-oku-taupe/5 block"
                    >
                        <Home size={14} /> Return to Sanctuary
                    </Link>
                </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-oku-pink/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      )
    }

    return this.children
  }
}

export default ErrorBoundary
