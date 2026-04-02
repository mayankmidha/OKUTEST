import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Mental Health Screenings — PHQ-9, GAD-7, ADHD & More | OKU Therapy',
  description:
    'Take clinically validated mental health screenings — PHQ-9 depression, GAD-7 anxiety, ADHD ASRS, DASS-21, PCL-5 trauma — free, anonymous, instant results. Based in India.',
  keywords: [
    'PHQ-9 test online India', 'GAD-7 anxiety screening', 'ADHD test online free',
    'depression screening India', 'mental health assessment free', 'DASS-21 online',
    'trauma screening PCL-5', 'online mental health test India',
  ].join(', '),
  openGraph: {
    title: 'Free Mental Health Screenings | OKU Therapy',
    description: 'PHQ-9, GAD-7, ADHD ASRS, DASS-21 — clinically validated, free, and anonymous. Instant results with a personalised interpretation.',
    url: 'https://okutherapy.com/assessments',
    type: 'website',
  },
  alternates: { canonical: 'https://okutherapy.com/assessments' },
}

export default function AssessmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
