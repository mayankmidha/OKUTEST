import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/DashboardHeader'
import { AssessmentRenderer } from './AssessmentRenderer'

export default async function DynamicAssessmentPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ mode?: string }>
}) {
  const session = await auth()
  const { slug } = await params
  const { mode } = await searchParams
  
  const isAnonymousMode = mode === 'anonymous'

  if (!session?.user?.id && !isAnonymousMode) {
    redirect('/auth/login')
  }

  // Fetch the assessment based on the slug
  const assessments = await prisma.assessment.findMany({ where: { isActive: true } })
  const assessment = assessments.find(a => 
    a.title.toLowerCase().replace(/\s+/g, '-') === slug || 
    a.id === slug
  )

  if (!assessment) {
    return (
        <div className="py-20 text-center">
            <h1 className="text-2xl font-bold">Assessment not found</h1>
            <p className="text-oku-taupe mt-2">The screening you are looking for does not exist or has been retired.</p>
        </div>
    )
  }

  return (
    <div className="py-12 px-10 max-w-5xl mx-auto">
      <DashboardHeader 
        title={assessment.title} 
        description={assessment.description || "Please complete this clinical screening."}
      />

      <div className="mt-12">
        <AssessmentRenderer assessment={assessment} isAuthenticated={!!session} />
      </div>
    </div>
  )
}
