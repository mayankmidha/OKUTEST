import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  ChevronLeft, User, Phone, MapPin, Shield, Calendar,
  Globe, Clock, Heart, CheckCircle2, AlertCircle
} from 'lucide-react'
import { SafetyPlanForm } from './SafetyPlanForm'
import { PrivacyControls } from '@/components/PrivacyControls'

export const dynamic = 'force-dynamic'

export default async function ClientProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  let user: any = null
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clientProfile: true,
        intakeForm: true,
        informedConsents: { orderBy: { signedAt: 'desc' }, take: 1 },
        safetyPlan: true,
      },
    })
  } catch (e) {
    console.error('Profile fetch error:', e)
  }

  if (!user) redirect('/auth/login')

  const profile = user.clientProfile
  const intake = user.intakeForm
  const safetyPlan = user.safetyPlan
  const hasConsent = user.informedConsents.length > 0

  const fields = [
    { label: 'Full Name', value: user.name, icon: <User size={14} /> },
    { label: 'Email', value: user.email, icon: <User size={14} /> },
    { label: 'Phone', value: user.phone || '—', icon: <Phone size={14} /> },
    { label: 'Location', value: user.location || '—', icon: <MapPin size={14} /> },
    { label: 'Date of Birth', value: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—', icon: <Calendar size={14} /> },
    { label: 'Gender', value: profile?.gender || '—', icon: <User size={14} /> },
    { label: 'Preferred Language', value: profile?.preferredLanguage || 'English', icon: <Globe size={14} /> },
    { label: 'Timezone', value: profile?.timezone || 'UTC', icon: <Clock size={14} /> },
  ]

  const emergencyFields = [
    { label: 'Emergency Contact', value: profile?.emergencyContactName || intake?.emergencyContact1 || '—' },
    { label: 'Contact Phone', value: profile?.emergencyContactPhone || '—' },
  ]

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Your Profile</span>
            </div>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              Your <span className="text-oku-purple-dark italic">Self.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
              The information that helps us care for you, well.
            </p>
          </div>

          {/* Avatar section */}
          <div className="card-glass-3d !p-8 !bg-white/60 flex items-center gap-6 self-start lg:self-auto">
            <div className="w-20 h-20 rounded-[1.5rem] bg-oku-lavender flex items-center justify-center text-4xl font-black text-oku-purple-dark shadow-inner border-4 border-white overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
              ) : (
                user.name?.substring(0, 1) || '?'
              )}
            </div>
            <div>
              <p className="text-xl font-black text-oku-darkgrey">{user.name}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-purple-dark/60 mt-1">Client</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30 mt-0.5">
                Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-12 gap-12">
          {/* Main profile info */}
          <div className="xl:col-span-8 space-y-10">
            {/* Personal Information */}
            <section className="card-glass-3d !p-12 !bg-white/40">
              <div className="flex items-center justify-between mb-10">
                <h2 className="heading-display text-3xl text-oku-darkgrey tracking-tight">
                  Personal <span className="italic text-oku-purple-dark">Details</span>
                </h2>
                <Link
                  href="/dashboard/client/intake"
                  className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline"
                >
                  Edit in Intake Form
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {fields.map((field, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-[1.5rem] bg-white/60 border border-white/80"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-oku-purple-dark/40">{field.icon}</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30">
                        {field.label}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-oku-darkgrey">{field.value || '—'}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Emergency Contact */}
            <section className="card-glass-3d !p-12 !bg-oku-peach/30">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-[1rem] bg-oku-peach flex items-center justify-center text-oku-darkgrey">
                  <Heart size={20} strokeWidth={1.5} />
                </div>
                <h2 className="heading-display text-3xl text-oku-darkgrey tracking-tight">
                  Emergency <span className="italic text-oku-purple-dark">Contact</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {emergencyFields.map((field, i) => (
                  <div key={i} className="p-6 rounded-[1.5rem] bg-white/60 border border-white/80">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/30 mb-2">{field.label}</p>
                    <p className="text-sm font-bold text-oku-darkgrey">{field.value}</p>
                  </div>
                ))}
              </div>

              {!profile?.emergencyContactName && (
                <div className="mt-6 flex items-center gap-3 p-5 rounded-[1.5rem] bg-white/40 border border-oku-peach/40">
                  <AlertCircle size={16} className="text-oku-darkgrey/40 flex-shrink-0" />
                  <p className="text-[11px] text-oku-darkgrey/50 font-display italic">
                    Emergency contact not set. Update your intake form to add one.
                  </p>
                  <Link href="/dashboard/client/intake" className="text-[10px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline ml-auto flex-shrink-0">
                    Update
                  </Link>
                </div>
              )}
            </section>

            {/* Safety Plan Form */}
            <SafetyPlanForm initialPlan={safetyPlan} />
          </div>

          {/* Right column: Status cards */}
          <div className="xl:col-span-4 space-y-10">
            {/* Onboarding status */}
            <div className="card-glass-3d !p-10 !bg-oku-lavender/60">
              <h3 className="heading-display text-xl text-oku-darkgrey mb-8">
                Account <span className="italic text-oku-purple-dark">Status</span>
              </h3>

              <div className="space-y-5">
                {[
                  {
                    label: 'Profile Created',
                    done: true,
                  },
                  {
                    label: 'Intake Form',
                    done: !!intake?.hasSignedConsent,
                    href: '/dashboard/client/intake',
                  },
                  {
                    label: 'Informed Consent',
                    done: hasConsent,
                    href: '/dashboard/client/intake',
                  },
                  {
                    label: 'First Session Booked',
                    done: false,
                    href: '/dashboard/client/book',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/60">
                    <div className="flex items-center gap-3">
                      {item.done ? (
                        <CheckCircle2 size={16} className="text-oku-purple-dark" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-oku-darkgrey/20" />
                      )}
                      <span className="text-[11px] font-black uppercase tracking-widest text-oku-darkgrey">
                        {item.label}
                      </span>
                    </div>
                    {!item.done && item.href && (
                      <Link
                        href={item.href}
                        className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark hover:underline"
                      >
                        Complete
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="card-glass-3d !p-10 !bg-white/40">
              <div className="flex items-center gap-3 mb-8">
                <Shield size={18} className="text-oku-purple-dark/60" />
                <h3 className="heading-display text-xl text-oku-darkgrey">Privacy & Security</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-oku-mint/40 border border-white/60">
                  <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">2FA</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${user.twoFactorEnabled ? 'text-oku-purple-dark' : 'text-oku-darkgrey/30'}`}>
                    {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-oku-mint/40 border border-white/60">
                  <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">Data Encryption</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-oku-mint/40 border border-white/60">
                  <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">HIPAA Compliance</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-oku-purple-dark">Certified</span>
                </div>
              </div>
              <PrivacyControls />
            </div>

            {/* Referral code */}
            {user.referralCode && (
              <div className="card-glass-3d !p-10 !bg-oku-butter">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 mb-4">Your Referral Code</p>
                <p className="text-3xl heading-display text-oku-darkgrey tracking-widest">{user.referralCode}</p>
                <p className="text-[10px] text-oku-darkgrey/40 font-display italic mt-3">
                  Share this code to earn credit when friends complete their first session.
                </p>
                <Link href="/dashboard/client/referrals" className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white w-full !py-4 mt-6">
                  View Referrals
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
