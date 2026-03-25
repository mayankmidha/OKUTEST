import { ASSESSMENTS } from '@/lib/assessments'
import { AssessmentModule } from './AssessmentModule'
import { Suspense } from 'react'
import { Metadata } from 'next'

export async function generateStaticParams() {
  return ASSESSMENTS.map((a) => ({
    slug: a.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const assessment = ASSESSMENTS.find(a => a.slug === slug)
  
  if (!assessment) return { title: 'Assessment Not Found' }

  return {
    title: `${assessment.title} | Oku Clinical Discovery`,
    description: assessment.description,
  }
}

export default function SingleAssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-oku-cream flex items-center justify-center italic text-oku-taupe font-display">Loading Clinical Discovery Module...</div>}>
      <AssessmentModule params={params} />
    </Suspense>
  )
}
