import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ASSESSMENTS } from '@/lib/assessments'
import { DashboardHeader } from '@/components/DashboardHeader'
import { AssessmentRenderer } from './AssessmentRenderer'

export default async function DynamicAssessmentPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ mode?: string; assignmentId?: string; fee?: string }>
}) {
  const session = await auth()
  const { slug } = await params
  const { mode } = await searchParams

  const isAnonymousMode = mode === 'anonymous'

  if (!session?.user?.id && !isAnonymousMode) {
    redirect('/auth/login')
  }

  // 1. Check static ASSESSMENTS lib first (public/self-serve tiers)
  const staticAssessment = ASSESSMENTS.find(a =>
    a.slug === slug ||
    a.id === slug ||
    a.title.toLowerCase().replace(/\s+/g, '-') === slug
  )

  if (staticAssessment) {
    return (
      <div className="py-12 px-10 max-w-5xl mx-auto">
        <DashboardHeader
          title={staticAssessment.title}
          description={staticAssessment.description}
        />
        <div className="mt-12">
          <AssessmentRenderer assessment={staticAssessment} isAuthenticated={!!session} />
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
        <p className="text-oku-taupe mt-2">The screening you're looking for does not exist or has been retired.</p>
      </div>
    )
  }

  return (
    <div className="py-12 px-10 max-w-5xl mx-auto">
      <DashboardHeader
        title={dbAssessment.title}
        description={dbAssessment.description || "Please complete this clinical screening."}
      />
      <div className="mt-12">
        <AssessmentRenderer assessment={dbAssessment} isAuthenticated={!!session} />
      </div>
    </div>
  )
}
