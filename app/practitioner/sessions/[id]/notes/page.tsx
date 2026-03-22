import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Save, AlertCircle } from "lucide-react"

export default async function SessionNotesPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'THERAPIST') {
    redirect("/dashboard")
  }

  const therapistSession = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: { 
        client: true,
        soapNote: true
    }
  })

  if (!therapistSession || therapistSession.practitionerId !== session.user.id) {
    redirect("/practitioner/dashboard")
  }

  return (
    <div className="min-h-screen bg-oku-cream">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <Link href="/practitioner/dashboard" className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe hover:text-oku-dark transition-colors">← Schedule</Link>
          <h1 className="text-4xl font-display font-bold text-oku-dark mt-4 tracking-tighter">Clinical Note</h1>
          <p className="text-lg text-oku-taupe font-script mt-2">Session with {therapistSession.client.name}</p>
          <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/60 mt-2">
            {new Date(therapistSession.startTime).toLocaleString()}
          </p>
        </div>

        <form action="/api/notes/create" method="POST" className="space-y-8">
          <input type="hidden" name="sessionId" value={therapistSession.id} />
          
          <div className="grid gap-8">
            <div className="bg-white p-8 rounded-card border border-oku-taupe/10 shadow-sm">
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe mb-4">Subjective (S)</label>
                <textarea 
                    name="subjective" 
                    rows={4}
                    defaultValue={therapistSession.soapNote?.subjective || ''}
                    placeholder="Client's self-report, emotions, and presentation..."
                    className="w-full bg-oku-cream-warm/30 border border-oku-taupe/10 rounded-2xl p-6 focus:outline-none focus:border-oku-purple transition-all text-sm leading-relaxed"
                ></textarea>
            </div>

            <div className="bg-white p-8 rounded-card border border-oku-taupe/10 shadow-sm">
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe mb-4">Objective (O)</label>
                <textarea 
                    name="objective" 
                    rows={4}
                    defaultValue={therapistSession.soapNote?.objective || ''}
                    placeholder="Clinical observations, mental status exam, behavior..."
                    className="w-full bg-oku-cream-warm/30 border border-oku-taupe/10 rounded-2xl p-6 focus:outline-none focus:border-oku-purple transition-all text-sm leading-relaxed"
                ></textarea>
            </div>

            <div className="bg-white p-8 rounded-card border border-oku-taupe/10 shadow-sm">
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe mb-4">Assessment (A)</label>
                <textarea 
                    name="assessment" 
                    rows={4}
                    defaultValue={therapistSession.soapNote?.assessment || ''}
                    placeholder="Clinical impression, progress toward goals, diagnostic interpretation..."
                    className="w-full bg-oku-cream-warm/30 border border-oku-taupe/10 rounded-2xl p-6 focus:outline-none focus:border-oku-purple transition-all text-sm leading-relaxed"
                ></textarea>
            </div>

            <div className="bg-white p-8 rounded-card border border-oku-taupe/10 shadow-sm">
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-oku-taupe mb-4">Plan (P)</label>
                <textarea 
                    name="plan" 
                    rows={4}
                    defaultValue={therapistSession.soapNote?.plan || ''}
                    placeholder="Next steps, homework, upcoming interventions, next session date..."
                    className="w-full bg-oku-cream-warm/30 border border-oku-taupe/10 rounded-2xl p-6 focus:outline-none focus:border-oku-purple transition-all text-sm leading-relaxed"
                ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-between bg-oku-dark text-oku-cream p-8 rounded-card shadow-xl">
             <div className="flex items-center gap-3 text-oku-cream/60">
                <AlertCircle className="w-5 h-5" />
                <p className="text-[10px] uppercase tracking-widest font-black">HIPAA Compliant • Encrypted • Private</p>
             </div>
             <button 
                type="submit"
                className="flex items-center gap-2 bg-oku-purple text-oku-dark px-10 py-4 rounded-pill text-[10px] uppercase tracking-[0.3em] font-black hover:bg-opacity-90 transition-all active:scale-95"
             >
                <Save className="w-4 h-4" />
                Save Note
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
