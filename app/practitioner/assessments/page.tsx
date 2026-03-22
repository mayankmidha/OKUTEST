import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Plus, ClipboardCheck, ArrowLeft, 
  ChevronRight, Activity, Clock
} from 'lucide-react'
import { UserRole } from '@prisma/client'

export default async function PractitionerAssessmentsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const assessments = await prisma.assessment.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="py-12 px-10">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <Link href="/practitioner/dashboard" className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe hover:text-oku-dark flex items-center gap-2 mb-4">
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <h1 className="text-5xl font-display font-bold text-oku-dark tracking-tighter">
            Clinical Assessments
          </h1>
          <p className="text-oku-taupe mt-2 font-display italic">Manage your custom screenings and clinical tools.</p>
        </div>
        <Link href="/practitioner/assessments/new" className="btn-primary py-4 px-10 flex items-center gap-3 shadow-xl">
          <Plus size={18} /> Create New Tool
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assessments.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-oku-taupe/10">
            <p className="text-oku-taupe font-display italic text-xl mb-6">No custom clinical tools deployed yet.</p>
            <Link href="/practitioner/assessments/new" className="text-oku-purple font-black uppercase tracking-widest text-[10px] hover:underline">Start Building →</Link>
          </div>
        ) : (
          assessments.map((a) => (
            <div key={a.id} className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-oku-green/10 text-oku-green flex items-center justify-center">
                  <ClipboardCheck size={24} />
                </div>
                {a.isActive ? (
                  <span className="bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Active</span>
                ) : (
                  <span className="bg-oku-taupe/10 text-oku-taupe text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Draft</span>
                )}
              </div>
              <h3 className="text-xl font-display font-bold text-oku-dark mb-2 group-hover:text-oku-purple transition-colors">{a.title}</h3>
              <p className="text-sm text-oku-taupe line-clamp-2 mb-8 italic">{a.description || 'No description provided.'}</p>
              
              <div className="flex items-center gap-6 pt-6 border-t border-oku-taupe/5">
                <div className="flex items-center gap-2">
                   <Activity size={14} className="text-oku-taupe" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">{(a.questions as any[]).length} Qs</span>
                </div>
                <div className="flex items-center gap-2">
                   <Clock size={14} className="text-oku-taupe" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
