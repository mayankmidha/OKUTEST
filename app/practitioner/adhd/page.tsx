import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/DashboardHeader'
import { ADHDWorkspace } from '@/app/dashboard/client/adhd/ADHDWorkspace'
import { Brain, Zap, Timer, Focus, Coffee } from 'lucide-react'

export default async function PractitionerADHDPage() {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== 'THERAPIST') {
    redirect('/auth/login')
  }

  const tasks = await prisma.task.findMany({
    where: { 
        userId: session.user.id,
        parentId: null 
    },
    include: { subTasks: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-10">
      <DashboardHeader 
        title="Practitioner Focus Workspace" 
        description="Optimize your flow between clinical windows."
      />

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-oku-darkgrey text-white p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
           <div className="relative z-10">
              <Brain className="text-oku-lavender mb-4" />
              <h3 className="font-bold text-lg">Work OS</h3>
              <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Manage clinical chaos</p>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-oku-darkgrey/10 group hover:border-oku-purple-dark/30 transition-all">
           <Timer className="text-oku-purple-dark mb-4" />
           <h3 className="font-bold text-lg text-oku-darkgrey">Focus Mode</h3>
           <p className="text-[10px] text-oku-darkgrey/40 uppercase tracking-widest mt-1">Deep documentation flow</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-oku-darkgrey/10 group hover:border-oku-purple-dark/30 transition-all">
           <Focus className="text-oku-babyblue mb-4" />
           <h3 className="font-bold text-lg text-oku-darkgrey">Body Doubling</h3>
           <p className="text-[10px] text-oku-darkgrey/40 uppercase tracking-widest mt-1">Join fellow practitioners</p>
        </div>
        <div className="bg-oku-butter p-8 rounded-[2.5rem] border border-oku-darkgrey/10 group hover:bg-oku-mint transition-all">
           <Coffee className="text-oku-darkgrey mb-4" />
           <h3 className="font-bold text-lg text-oku-darkgrey">Pause</h3>
           <p className="text-[10px] text-oku-darkgrey/40 uppercase tracking-widest mt-1">Rest between sessions</p>
        </div>
      </div>

      <ADHDWorkspace initialTasks={tasks} />
    </div>
  )
}
