import { ArrowRight, ShieldCheck, Lock } from 'lucide-react'

export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-oku-cream flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-oku-purple/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-oku-sage/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-10 w-32 bg-oku-taupe/10 mx-auto rounded-xl mb-10" />
          <div className="h-12 w-64 bg-oku-dark/5 mx-auto rounded-2xl mb-4" />
          <div className="h-6 w-48 bg-oku-taupe/5 mx-auto rounded-lg" />
        </div>

        <div className="bg-white/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/60 shadow-[0_32px_80px_rgba(0,0,0,0.03)] animate-pulse">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="h-3 w-16 bg-oku-taupe/10 ml-4 rounded" />
              <div className="h-16 w-full bg-white/60 border border-white rounded-[2rem]" />
            </div>

            <div className="space-y-3">
              <div className="h-3 w-16 bg-oku-taupe/10 ml-4 rounded" />
              <div className="h-16 w-full bg-white/60 border border-white rounded-[2rem]" />
            </div>

            <div className="h-16 w-full bg-oku-dark/10 rounded-full" />
          </div>

          <div className="mt-12 pt-10 border-t border-oku-taupe/5 text-center">
            <div className="h-4 w-48 bg-oku-taupe/5 mx-auto rounded" />
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-12 opacity-20">
            <div className="flex items-center gap-2">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">HIPAA Secure</span>
            </div>
            <div className="flex items-center gap-2">
                <Lock size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">AES-256</span>
            </div>
        </div>
      </div>
    </div>
  )
}
