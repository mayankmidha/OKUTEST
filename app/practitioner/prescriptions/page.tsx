import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PractitionerShell, PractitionerSectionCard } from '@/components/practitioner-shell/practitioner-shell'
import { Pill, Plus, Search, CheckCircle } from 'lucide-react'

export default async function PrescriptionsHub() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const prescriptions = await prisma.prescription.findMany({
    where: { practitionerId: session.user.id },
    include: { client: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <PractitionerShell
      title="Rx Engine"
      description="Secure digital prescribing and medication management."
      badge="Clinical Tools"
      currentPath="/practitioner/prescriptions"
      heroActions={
        <button className="btn-navy flex items-center gap-2">
          <Plus size={18} /> New Prescription
        </button>
      }
    >
      <div className="space-y-10">
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-oku-taupe/5 shadow-sm">
           <Search size={20} className="text-oku-taupe/40" />
           <input type="text" placeholder="Search by patient or medication..." className="flex-1 border-none outline-none bg-transparent" />
        </div>

        <PractitionerSectionCard title="Active Prescriptions" description="Currently tracked medications for your caseload.">
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-oku-taupe/10 rounded-3xl">
                   <Pill className="mx-auto text-oku-taupe/20 mb-4" size={48} />
                   <p className="text-oku-taupe italic font-display text-lg">No active prescriptions written yet.</p>
                </div>
              ) : (
                prescriptions.map(rx => (
                  <div key={rx.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-oku-cream-warm/30 rounded-2xl border border-oku-taupe/5 hover:border-oku-navy/20 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-xl bg-oku-purple/10 text-oku-purple flex items-center justify-center">
                          <Pill size={20} />
                       </div>
                       <div>
                          <p className="font-bold text-lg text-oku-dark leading-tight">{rx.medicationName} <span className="text-sm font-normal text-oku-taupe">{rx.dosage}</span></p>
                          <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Patient: {rx.client.name}</p>
                       </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-8 pl-16 md:pl-0">
                       <div>
                          <p className="text-sm font-medium">{rx.frequency}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-60">Refills: {rx.refills}</p>
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oku-green">
                          <CheckCircle size={14} /> {rx.status}
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
        </PractitionerSectionCard>
      </div>
    </PractitionerShell>
  )
}