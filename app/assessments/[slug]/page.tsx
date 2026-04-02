import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ASSESSMENTS } from '@/lib/assessments'
import { PublicAssessmentShell } from './PublicAssessmentShell'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

export async function generateStaticParams() {
  return ASSESSMENTS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const assessment = ASSESSMENTS.find((a) => a.slug === slug)
  if (!assessment) return {}

  const title = `${assessment.title} — Free Online Screening | OKU Therapy`
  const description = `${assessment.description} Takes ${assessment.timeEstimate}. Clinically validated, free, anonymous. Get your score instantly with a personalised interpretation.`

  return {
    title,
    description,
    keywords: `${assessment.title}, ${assessment.category} screening India, mental health test free, online assessment`,
    openGraph: {
      title,
      description,
      url: `${BASE}/assessments/${slug}`,
      type: 'website',
    },
    alternates: { canonical: `${BASE}/assessments/${slug}` },
  }
}

export default async function PublicAssessmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const assessment = ASSESSMENTS.find((a) => a.slug === slug)
  if (!assessment) notFound()

  // JSON-LD structured data — helps Google show rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: assessment.title,
    description: assessment.description,
    url: `${BASE}/assessments/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'OKU Therapy',
      url: BASE,
    },
    about: {
      '@type': 'MedicalCondition',
      name: assessment.category,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicAssessmentShell assessment={assessment} />
    </>
  )
}
