import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { Brain, TrendingUp, Search } from 'lucide-react'
import { ClinicalAITranscriptViewer } from '@/components/ClinicalAITranscriptViewer'
import { UserRole } from '@prisma/client'

export default async function PractitionerIntelligencePage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const transcripts = await prisma.transcript.findMany({
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
  })

  return (
    <PractitionerShell
        title="Clinical Intelligence"
        badge="OCI Core"
        currentPath="/practitioner/intelligence"
        description="AI-driven analysis of your clinical sessions and patient progress trends."
    >
        <div className="space-y-12">
            {/* Intelligence Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-glass p-8 group">
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Processed Sessions</p>
                    <p className="text-4xl font-display font-bold text-oku-dark">{transcripts.length}</p>
                    <div className="mt-4 flex items-center gap-2 text-oku-success">
                        <TrendingUp size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">100% Coverage</span>
                    </div>
                </div>

                <div className="card-glass p-8 group">
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60 mb-2">Overall Sentiment</p>
                    <p className="text-4xl font-display font-bold text-oku-dark">Stable</p>
                    <div className="mt-4 flex items-center gap-2 text-oku-purple">
                        <Brain size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Aggregate Pulse</span>
                    </div>
                </div>

                <div className="card-navy p-8 overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple opacity-60 mb-2">AI Status</p>
                        <p className="text-xl font-bold text-white">OKU CORE v2.5</p>
                        <p className="text-[10px] font-medium text-white/40 mt-2">Active Background Monitoring</p>
                    </div>
                    <Brain className="absolute bottom-[-10px] right-[-10px] text-oku-purple opacity-10" size={100} />
                </div>
            </div>

            <section>
                <div className="flex items-center justify-between mb-8 px-4">
                    <h2 className="text-2xl font-display font-bold text-oku-dark">Intelligence Ledger</h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oku-taupe/40" size={14} />
                        <input type="text" placeholder="Filter transcripts..." className="pl-10 pr-4 py-2 bg-white border border-oku-taupe/10 rounded-full text-xs focus:outline-none focus:border-oku-navy w-64 shadow-sm" />
                    </div>
                </div>

                <ClinicalAITranscriptViewer transcripts={transcripts as any} />
            </section>
        </div>
    </PractitionerShell>
  )
}
