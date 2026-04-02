import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  FileText,
  ClipboardList,
  Receipt,
  Download,
  FolderOpen,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ClientDocumentsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const userId = session.user.id

  // 1. Session summaries — finalized SOAP notes for completed appointments
  const soapNotes = await prisma.soapNote.findMany({
    where: {
      status: 'FINALIZED',
      appointment: {
        clientId: userId,
        status: 'COMPLETED',
      },
    },
    include: {
      appointment: {
        include: {
          practitioner: { select: { name: true } },
          service: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // 2. Assessment answers — completed assessments
  const assessmentAnswers = await prisma.assessmentAnswer.findMany({
    where: { userId },
    include: {
      assessment: { select: { title: true, description: true } },
    },
    orderBy: { completedAt: 'desc' },
  })

  // 3. Invoices — completed payments
  const payments = await prisma.payment.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    include: {
      appointment: {
        include: {
          service: { select: { name: true } },
          practitioner: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalDocs = soapNotes.length + assessmentAnswers.length + payments.length
  const isEmpty = totalDocs === 0

  return (
    <div className="py-12 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen bg-oku-lavender/10 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-oku-lavender/30 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-oku-mint/20 rounded-full blur-[100px] animate-float-3d pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <Link
              href="/dashboard/client"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
            >
              <ChevronLeft size={13} /> Dashboard
            </Link>
            <h1 className="heading-display text-6xl lg:text-8xl text-oku-darkgrey tracking-tighter">
              Your <span className="text-oku-purple-dark italic">Documents.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic border-l-4 border-oku-purple-dark/10 pl-8">
              Session notes, assessments, and invoices — all in one place.
            </p>
          </div>
        </div>

        {isEmpty ? (
          /* Empty state */
          <div className="py-32 text-center card-glass-3d !bg-white/40">
            <FolderOpen className="mx-auto text-oku-purple-dark/20 mb-8 animate-float-3d" size={64} />
            <h3 className="heading-display text-3xl text-oku-darkgrey">
              Nothing here yet
            </h3>
            <p className="text-oku-darkgrey/40 italic font-display mt-4 text-xl max-w-md mx-auto">
              Your documents will appear here after sessions and assessments are completed.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Section 1: Session Summaries */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark">
                  <FileText size={20} />
                </div>
                <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">
                  Session <span className="text-oku-purple-dark italic">Summaries</span>
                </h2>
                {soapNotes.length > 0 && (
                  <span className="chip bg-white/60 border-white/80">{soapNotes.length}</span>
                )}
              </div>

              {soapNotes.length === 0 ? (
                <div className="card-glass-3d !p-10 !bg-white/40 text-center">
                  <p className="text-oku-darkgrey/40 italic font-display">
                    Session summaries will appear here after completed sessions.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {soapNotes.map((note) => (
                    <DocumentRow
                      key={note.id}
                      icon={<FileText size={18} className="text-oku-purple-dark" />}
                      title={`Session with ${note.appointment.practitioner?.name || 'Your Practitioner'}`}
                      subtitle={note.appointment.service?.name}
                      date={note.appointment.startTime}
                      downloadUrl={null}
                      downloadLabel="View Summary"
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: Assessment Reports */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-oku-mint/40 flex items-center justify-center text-oku-darkgrey">
                  <ClipboardList size={20} />
                </div>
                <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">
                  Assessment <span className="text-oku-purple-dark italic">Reports</span>
                </h2>
                {assessmentAnswers.length > 0 && (
                  <span className="chip bg-white/60 border-white/80">{assessmentAnswers.length}</span>
                )}
              </div>

              {assessmentAnswers.length === 0 ? (
                <div className="card-glass-3d !p-10 !bg-white/40 text-center">
                  <p className="text-oku-darkgrey/40 italic font-display">
                    Assessment reports will appear here once you complete an assessment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assessmentAnswers.map((answer) => (
                    <DocumentRow
                      key={answer.id}
                      icon={<ClipboardList size={18} className="text-oku-darkgrey" />}
                      title={answer.assessment.title}
                      subtitle={answer.assessment.description ?? undefined}
                      date={answer.completedAt}
                      downloadUrl={`/api/assessments/${answer.id}/pdf`}
                      downloadLabel="View Report"
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 3: Invoices */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-oku-lavender/60 flex items-center justify-center text-oku-purple-dark">
                  <Receipt size={20} />
                </div>
                <h2 className="heading-display text-4xl text-oku-darkgrey tracking-tight">
                  <span className="text-oku-purple-dark italic">Invoices</span>
                </h2>
                {payments.length > 0 && (
                  <span className="chip bg-white/60 border-white/80">{payments.length}</span>
                )}
              </div>

              {payments.length === 0 ? (
                <div className="card-glass-3d !p-10 !bg-white/40 text-center">
                  <p className="text-oku-darkgrey/40 italic font-display">
                    Payment invoices will appear here after completed sessions.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <DocumentRow
                      key={payment.id}
                      icon={<Receipt size={18} className="text-oku-purple-dark" />}
                      title={`Invoice — ${payment.appointment?.service?.name || 'Session'}`}
                      subtitle={payment.appointment?.practitioner?.name
                        ? `With ${payment.appointment.practitioner.name}`
                        : undefined}
                      date={payment.createdAt}
                      downloadUrl={`/api/payments/${payment.id}/invoice`}
                      downloadLabel="Download Invoice"
                      amount={payment.amount}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Internal document row component ─────────────────────────────────────────
interface DocumentRowProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  date: Date
  downloadUrl: string | null
  downloadLabel?: string
  amount?: number
}

function DocumentRow({
  icon,
  title,
  subtitle,
  date,
  downloadUrl,
  downloadLabel = 'Download',
  amount,
}: DocumentRowProps) {
  const dateLabel = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="card-glass-3d !p-6 !bg-white/60 flex items-center justify-between gap-6 group hover:shadow-xl transition-all duration-500">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-oku-lavender/30 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-bold text-oku-darkgrey text-sm leading-tight">{title}</p>
          {subtitle && (
            <p className="text-[10px] text-oku-darkgrey/50 uppercase tracking-widest font-black mt-0.5">
              {subtitle}
            </p>
          )}
          <div className="flex items-center gap-4 mt-1.5">
            <p className="text-[10px] text-oku-darkgrey/40 uppercase tracking-widest font-black">
              {dateLabel}
            </p>
            {amount !== undefined && (
              <p className="text-[10px] font-bold text-oku-purple-dark">
                ₹{amount.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>
      </div>

      {downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-7 !py-3 flex items-center gap-2 text-xs flex-shrink-0"
        >
          <Download size={14} /> {downloadLabel}
        </a>
      ) : (
        <div
          className="btn-pill-3d bg-white border-oku-darkgrey/10 text-oku-darkgrey/30 !px-7 !py-3 flex items-center gap-2 text-xs flex-shrink-0 pointer-events-none"
          title="Download not yet available"
        >
          <Download size={14} /> {downloadLabel}
        </div>
      )}
    </div>
  )
}
