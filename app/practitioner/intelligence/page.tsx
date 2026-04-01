import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { Brain, TrendingUp, Search, AlertTriangle, Languages, Sparkles } from 'lucide-react'
import { ClinicalAITranscriptViewer } from '@/components/ClinicalAITranscriptViewer'
import { UserRole } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function PractitionerIntelligencePage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const [transcripts, profile] = await Promise.all([
    prisma.transcript.findMany({
        where: { appointment: { practitionerId: session.user.id } },
        include: { 
            appointment: { 
                include: { 
                    service: true,
                    client: { select: { name: true } }
                } 
            } 
        },
        orderBy: { createdAt: 'desc' }
    }),
    prisma.practitionerProfile.findUnique({
        where: { userId: session.user.id },
        select: { canPostBlogs: true }
    })
  ])

  const elevatedTranscripts = transcripts.filter(
    (transcript) => transcript.riskLevel === 'HIGH' || transcript.riskLevel === 'CRITICAL'
  )
  const multilingualSessions = transcripts.filter((transcript) => {
    const language = transcript.detectedLanguage?.toLowerCase() || ''
    return language && !language.includes('english') && language !== 'unknown'
  })
  const averageHope = transcripts.length
    ? Math.round(
        transcripts.reduce((sum, transcript) => {
          const hope = Number((transcript.sentimentScores as any)?.hope || 0)
          return sum + (Number.isFinite(hope) ? hope : 0)
        }, 0) / transcripts.length
      )
    : 0

  return (
    <PractitionerShell
        title="Clinical Intelligence"
        badge="OCI Core"
        currentPath="/practitioner/intelligence"
        description="AI-driven analysis of your clinical sessions and patient progress trends."
        canPostBlogs={profile?.canPostBlogs}
    >
        <div className="space-y-12">
            {/* Intelligence Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="card-glass-3d !bg-oku-lavender/60 !p-8 animate-float-3d">
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Processed Sessions</p>
                    <p className="text-4xl heading-display text-oku-darkgrey">{transcripts.length}</p>
                    <div className="mt-4 flex items-center gap-2 text-emerald-600">
                        <TrendingUp size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">100% Coverage</span>
                    </div>
                </div>

                <div className="card-glass-3d !bg-oku-peach/60 !p-8 animate-float-3d" style={{ animationDelay: '0.2s' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Risk Watchlist</p>
                    <p className="text-4xl heading-display text-oku-darkgrey">{elevatedTranscripts.length}</p>
                    <div className="mt-4 flex items-center gap-2 text-red-500">
                        <AlertTriangle size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">High / Critical Flags</span>
                    </div>
                </div>

                <div className="card-glass-3d !bg-oku-mint/60 !p-8 animate-float-3d" style={{ animationDelay: '0.4s' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Multilingual Sessions</p>
                    <p className="text-4xl heading-display text-oku-darkgrey">{multilingualSessions.length}</p>
                    <div className="mt-4 flex items-center gap-2 text-oku-purple-dark">
                        <Languages size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Cross-language coverage</span>
                    </div>
                </div>

                <div className="card-glass-3d !bg-oku-darkgrey !p-8 overflow-hidden relative group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-lavender opacity-60 mb-2">AI Status</p>
                        <p className="text-xl font-bold text-white uppercase tracking-tighter">OKU CORE v3.5</p>
                        <p className="text-[10px] font-medium text-white/40 mt-2 italic">Hope signal avg {averageHope}% • Sentinel Active</p>
                    </div>
                    <Brain className="absolute bottom-[-10px] right-[-10px] text-white opacity-5 group-hover:scale-110 transition-transform duration-1000" size={100} />
                </div>
            </div>

            <section className="card-glass-3d !p-12 !bg-white/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">Intelligence <span className="italic text-oku-purple-dark">Ledger</span></h2>
                    <div className="flex items-center gap-4 bg-white/60 px-6 py-3 rounded-full border border-white">
                        <Search size={14} className="text-oku-darkgrey/40" />
                        <input type="text" placeholder="Filter transcripts..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-oku-darkgrey/20 w-64" />
                    </div>
                </div>

                <ClinicalAITranscriptViewer transcripts={transcripts as any} />
            </section>
        </div>
    </PractitionerShell>
  )
}
