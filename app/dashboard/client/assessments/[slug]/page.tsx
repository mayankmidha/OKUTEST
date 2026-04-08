import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ASSESSMENTS } from '@/lib/assessments'
import { DashboardHeader } from '@/components/DashboardHeader'
import { AssessmentRenderer } from './AssessmentRenderer'
import { normalizeAssessmentForRender } from '@/lib/assessment-utils'

export default async function DynamicAssessmentPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ mode?: string; assignmentId?: string }>
}) {
  const session = await auth()
  const { slug } = await params
  const { mode, assignmentId } = await searchParams

  const isAnonymousMode = mode === 'anonymous'

  if (!session?.user?.id && !isAnonymousMode) {
    redirect('/auth/login')
  }

  if (assignmentId && session?.user?.id) {
    const assignment = await prisma.assignedAssessment.findFirst({
      where: {
        id: assignmentId,
        clientId: session.user.id,
      },
      include: {
        assessment: true,
      },
    })

    if (!assignment) {
      redirect('/dashboard/client/clinical')
    }

    if (assignment.chargeAmount > 0 && assignment.billingStatus !== 'COMPLETED') {
      redirect(`/dashboard/client/checkout?type=ASSESSMENT&id=${assignment.id}`)
    }

    const normalizedAssessment = normalizeAssessmentForRender(assignment.assessment)

    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <DashboardHeader
          title={normalizedAssessment.title}
          description={normalizedAssessment.description}
        />
        <div className="mt-12">
          <AssessmentRenderer
            assessment={normalizedAssessment}
            isAuthenticated={!!session}
            assignmentId={assignment.id}
          />
        </div>
      </div>
    )
  }

  // 1. Check static ASSESSMENTS lib first (public/self-serve tiers)
  const staticAssessment = ASSESSMENTS.find(a =>
    a.slug === slug ||
    a.id === slug ||
    a.title.toLowerCase().replace(/\s+/g, '-') === slug
  )

  if (staticAssessment) {
    const normalizedAssessment = normalizeAssessmentForRender(staticAssessment)

    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <DashboardHeader
          title={normalizedAssessment.title}
          description={normalizedAssessment.description}
        />
        <div className="mt-12">
          <AssessmentRenderer assessment={normalizedAssessment} isAuthenticated={!!session} />
        </div>
      </div>
    )
  }

  // 2. Fall back to DB (practitioner-assigned / paid formal assessments)
  const dbAssessments = await prisma.assessment.findMany({ where: { isActive: true } })
  const dbAssessment = dbAssessments.find(a =>
    a.id === slug ||
    a.title.toLowerCase().replace(/[\s/]+/g, '-') === slug
  )

  if (!dbAssessment) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Assessment not found</h1>
        <p className="text-oku-taupe mt-2">The screening you&apos;re looking for does not exist or has been retired.</p>
      </div>
    )
  }

  if ((dbAssessment.price || 0) > 0 && !isAnonymousMode) {
    redirect(`/dashboard/client/checkout?type=ASSESSMENT&id=${dbAssessment.id}`)
  }

  const normalizedAssessment = normalizeAssessmentForRender(dbAssessment)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <DashboardHeader
        title={normalizedAssessment.title}
        description={normalizedAssessment.description || "Please complete this clinical screening."}
      />
      <div className="mt-12">
        <AssessmentRenderer assessment={normalizedAssessment} isAuthenticated={!!session} />
      </div>
    </div>
  )
}
