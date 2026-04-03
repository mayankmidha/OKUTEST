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
import { AvatarUpload } from '@/components/AvatarUpload'
import { KYCDocumentUpload } from '@/components/KYCDocumentUpload'
import { formatCurrency } from '@/lib/currency'
import { resolvePractitionerPricing } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

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
  const pricing = resolvePractitionerPricing(practitioner)

  return (
    <PractitionerShell
      badge="Profile"
      currentPath="/practitioner/profile"
      description="Manage your professional presence and practice details."
      canPostBlogs={practitioner.canPostBlogs}
      heroActions={
        <>
          <Link
            className="inline-flex items-center rounded-full bg-oku-darkgrey px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
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
            <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-oku-darkgrey/5 shadow-sm mb-6">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">License Number</p>
                  <p className="text-oku-darkgrey font-mono text-sm">{practitioner.licenseNumber || 'Not provided'}</p>
               </div>
               <PractitionerPill tone={practitioner.isVerified ? "sage" : "pink"}>
                  {practitioner.isVerified ? 'Verified Account' : 'Awaiting Verification'}
               </PractitionerPill>
            </div>
            <KYCDocumentUpload />
          </PractitionerSectionCard>

          <PractitionerSectionCard title="Security & Credentials">
             <div className="bg-white p-10 rounded-[2.5rem] border border-oku-taupe/5 shadow-sm">
                <PasswordChangeForm />
             </div>
          </PractitionerSectionCard>
        </div>

        <div className="lg:col-span-1">
           <div className="bg-oku-darkgrey text-white p-8 rounded-[2.5rem] shadow-xl sticky top-28">
              <div className="text-center mb-8">
                 <div className="flex justify-center mb-4">
                    <AvatarUpload currentAvatar={practitioner.user.avatar} name={practitioner.user.name || 'Practitioner'} />
                 </div>
                 <h3 className="text-xl font-display font-bold">{practitioner.user.name}</h3>
                 <p className="text-oku-purple-dark font-display italic text-sm mt-1">Public Preview</p>
              </div>
              
              <div className="space-y-4">
                 <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">India Session Price</p>
                    <p className="text-xl font-bold">{formatCurrency(pricing.indiaSessionRate, 'INR')}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">International Session Price</p>
                    <p className="text-xl font-bold">{formatCurrency(pricing.internationalSessionRate, 'INR')}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-widest text-white/40">Auto-converted for overseas clients</p>
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
