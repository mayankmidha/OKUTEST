import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PractitionerShell, PractitionerStatCard, PractitionerSectionCard } from '@/components/practitioner-shell/practitioner-shell'
import { Receipt, FileText, CheckCircle, Clock } from 'lucide-react'

export default async function BillingHub() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const appointmentsWithClaims = await prisma.appointment.findMany({
    where: { 
      practitionerId: session.user.id,
      claim: { isNot: null } 
    },
    include: { claim: { include: { policy: true } }, client: true, service: true },
    orderBy: { startTime: 'desc' }
  })

  return (
    <PractitionerShell
      title="Billing & Claims"
      description="Automated insurance filing and revenue lifecycle."
      badge="Financial Ops"
      currentPath="/practitioner/billing"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         <PractitionerStatCard label="Pending Claims" value="$0.00" detail="Awaiting Payer Response" accent="bg-oku-pink" />
         <PractitionerStatCard label="Settled This Month" value="$0.00" detail="Insurance + Copays" accent="bg-oku-green" />
         <PractitionerStatCard label="Rejected Claims" value="0" detail="Action Required" accent="bg-oku-danger" />
      </div>

      <PractitionerSectionCard title="Claim History" description="Recent insurance submissions via Stedi/Change Healthcare.">
         <div className="space-y-4">
            {appointmentsWithClaims.length === 0 ? (
               <div className="py-20 text-center border-2 border-dashed border-oku-taupe/10 rounded-3xl">
                   <Receipt className="mx-auto text-oku-taupe/20 mb-4" size={48} />
                   <p className="text-oku-taupe italic font-display text-lg">No insurance claims filed yet.</p>
               </div>
            ) : (
               appointmentsWithClaims.map(appt => (
                 <div key={appt.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-oku-taupe/10 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-xl bg-oku-navy/5 text-oku-navy flex items-center justify-center">
                          <FileText size={20} />
                       </div>
                       <div>
                          <p className="font-bold text-lg text-oku-dark leading-tight">{appt.client?.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">DOS: {new Date(appt.startTime).toLocaleDateString()} • {appt.claim?.policy?.providerName}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <p className="text-xl font-display font-bold">${appt.claim?.claimAmount}</p>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          appt.claim?.status === 'SUBMITTED' ? 'bg-oku-purple/10 text-oku-purple' : 'bg-oku-green/10 text-oku-green'
                       }`}>
                          {appt.claim?.status}
                       </span>
                    </div>
                 </div>
               ))
            )}
         </div>
      </PractitionerSectionCard>
    </PractitionerShell>
  )
}