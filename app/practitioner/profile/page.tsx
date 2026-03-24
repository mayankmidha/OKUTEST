import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  PractitionerPill,
  PractitionerSectionCard,
  PractitionerShell,
} from '@/components/practitioner-shell/practitioner-shell'
import { UserRole } from '@prisma/client'
import EditProfileForm from './EditProfileForm'
import { PasswordChangeForm } from '@/components/PasswordChangeForm'
import { formatCurrency, autoConvert } from '@/lib/currency'

export default async function PractitionerProfilePage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  })

  if (!practitioner) redirect('/practitioner/dashboard')

  return (
    <PractitionerShell
      badge="Profile"
      currentPath="/practitioner/profile"
      description="Manage your professional presence and practice details."
      heroActions={
        <>
          <Link
            className="inline-flex items-center rounded-full bg-oku-dark px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            href="/practitioner/dashboard"
          >
            Dashboard
          </Link>        </>
      }
      title="Your Profile"
    >
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <PractitionerSectionCard title="Professional Overview">
             <EditProfileForm initialData={practitioner} />
          </PractitionerSectionCard>

          <PractitionerSectionCard title="Credentials & Verification">
            <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-oku-taupe/5 shadow-sm">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe opacity-40 mb-1">License Number</p>
                  <p className="text-oku-dark font-mono text-sm">{practitioner.licenseNumber || 'Not provided'}</p>
               </div>
               <PractitionerPill tone={practitioner.isVerified ? "sage" : "pink"}>
                  {practitioner.isVerified ? 'Verified Account' : 'Awaiting Verification'}
               </PractitionerPill>
            </div>
          </PractitionerSectionCard>

          <PractitionerSectionCard title="Security & Credentials">
             <div className="bg-white p-10 rounded-[2.5rem] border border-oku-taupe/5 shadow-sm">
                <PasswordChangeForm />
             </div>
          </PractitionerSectionCard>
        </div>

        <div className="lg:col-span-1">
           <div className="bg-oku-dark text-white p-8 rounded-[2.5rem] shadow-xl sticky top-28">
              <div className="text-center mb-8">
                 <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4 overflow-hidden border-2 border-white/20">
                    {practitioner.user.avatar ? <img src={practitioner.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🧘</div>}
                 </div>
                 <h3 className="text-xl font-display font-bold">{practitioner.user.name}</h3>
                 <p className="text-oku-purple font-script text-lg">Public Preview</p>
              </div>
              
              <div className="space-y-4">
                 <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Hourly Rate</p>
                    <p className="text-xl font-bold">
                        {(() => {
                            const conv = autoConvert(practitioner.hourlyRate || 0);
                            return formatCurrency(conv.amount, conv.currency);
                        })()} / Session
                    </p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Specialties</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {practitioner.specialization.map(s => (
                          <span key={s} className="text-[9px] bg-white/10 px-2 py-1 rounded-md">{s}</span>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PractitionerShell>
  )
}
