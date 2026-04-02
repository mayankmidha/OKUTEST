import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Group Therapy Circles — ADHD, Anxiety, Grief & More | OKU Therapy',
  description:
    'Join facilitated group therapy circles in India — ADHD peer support, anxiety management, depression processing, grief, burnout recovery and more. Small groups, safe spaces.',
  keywords: [
    'group therapy India', 'online group therapy', 'ADHD support group India',
    'anxiety group therapy', 'grief support group', 'mental health community India',
    'peer support mental health', 'online therapy circles',
  ].join(', '),
  openGraph: {
    title: 'Group Therapy Circles | OKU Therapy',
    description: 'Facilitated group spaces for ADHD, anxiety, grief, burnout, and more. Small groups, anonymised, safe.',
    url: 'https://okutherapy.com/circles',
    type: 'website',
  },
  alternates: { canonical: 'https://okutherapy.com/circles' },
}

export default function CirclesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
