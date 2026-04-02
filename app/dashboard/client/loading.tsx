import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-oku-cream/20 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-r-2 border-oku-purple rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-oku-lavender rounded-2xl animate-pulse shadow-sm" />
            </div>
        </div>
        <div className="space-y-2">
            <h2 className="heading-display text-3xl text-oku-darkgrey">Entering your <span className="italic text-oku-purple-dark">Sanctuary.</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oku-darkgrey/30">Securing your clinical records...</p>
        </div>
    </div>
  )
}
