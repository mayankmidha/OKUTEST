import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PractitionerShell, PractitionerSectionCard } from '@/components/practitioner-shell/practitioner-shell'
import { Building2, Users } from 'lucide-react'

export default async function OrganizationsHub() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const organizations = await prisma.organization.findMany({
    include: {
        _count: {
            select: { users: true }
        }
    },
    take: 10
  })

  return (
    <PractitionerShell
      title="B2B Partners"
      description="Corporate wellness and school counseling cohorts."
      badge="Enterprise"
      currentPath="/practitioner/organizations"
    >
      <PractitionerSectionCard title="Active Organizations" description="Institutional partners currently utilizing OKU Clinic services.">
         <div className="grid md:grid-cols-2 gap-6">
            {organizations.length === 0 ? (
               <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-oku-taupe/10 rounded-3xl">
                   <Building2 className="mx-auto text-oku-taupe/20 mb-4" size={48} />
                   <p className="text-oku-taupe italic font-display text-lg">No institutional partners onboarded yet.</p>
               </div>
            ) : (
               organizations.map(org => (
                 <div key={org.id} className="p-8 bg-oku-dark text-white rounded-[2rem] relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                           <Building2 size={24} />
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-1">{org.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-8">{org.type}</p>
                        
                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 w-max">
                           <Users size={16} className="text-oku-purple" />
                           <span className="text-sm font-bold">{org._count.users} Active Members</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-oku-purple/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000" />
                 </div>
               ))
            )}
         </div>
      </PractitionerSectionCard>
    </PractitionerShell>
  )
}