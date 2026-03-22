import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Plus, ClipboardCheck, ArrowLeft, 
  ChevronRight, Activity, Clock, UserPlus
} from 'lucide-react'
import { UserRole } from '@prisma/client'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { AssignAssessmentModal } from '@/components/AssignAssessmentModal'

export default async function PractitionerAssessmentsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const [assessments, appointments] = await Promise.all([
    prisma.assessment.findMany({
        orderBy: { createdAt: 'desc' }
    }),
    prisma.appointment.findMany({
        where: { practitionerId: session.user.id },
        include: { client: { select: { id: true, name: true } } },
        distinct: ['clientId']
    })
  ])

  const clients = appointments.map(a => a.client)

  return (
    <PractitionerShell
      title="Clinical Assessments"
      description="Manage your custom screenings and assign them to your patient roster."
      badge="Clinical"
      currentPath="/practitioner/assessments"
      heroActions={
        <Link href="/practitioner/assessments/new" className="btn-primary py-4 px-10 flex items-center gap-3 shadow-xl">
          <Plus size={18} /> Create New Tool
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assessments.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-oku-taupe/10">
            <p className="text-oku-taupe font-display italic text-xl mb-6">No custom clinical tools deployed yet.</p>
            <Link href="/practitioner/assessments/new" className="text-oku-purple font-black uppercase tracking-widest text-[10px] hover:underline">Start Building →</Link>
          </div>
        ) : (
          assessments.map((a) => (
            <div key={a.id} className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-oku-green/10 text-oku-green flex items-center justify-center">
                  <ClipboardCheck size={24} />
                </div>
                {a.isActive ? (
                  <span className="bg-oku-success/10 text-oku-success text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Active</span>
                ) : (
                  <span className="bg-oku-taupe/10 text-oku-taupe text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Draft</span>
                )}
              </div>
              <h3 className="text-xl font-display font-bold text-oku-dark mb-2 group-hover:text-oku-purple transition-colors">{a.title}</h3>
              <p className="text-sm text-oku-taupe line-clamp-2 mb-8 italic flex-grow">{a.description || 'No description provided.'}</p>
              
              <div className="space-y-4 pt-6 border-t border-oku-taupe/5">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                    <Activity size={14} className="text-oku-taupe" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">{(a.questions as any[]).length} Qs</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <Clock size={14} className="text-oku-taupe" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <AssignAssessmentModal assessment={a} clients={clients} />
              </div>
            </div>
          ))
        )}
      </div>
    </PractitionerShell>
  )
}
