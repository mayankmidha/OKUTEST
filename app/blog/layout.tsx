import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mental Health Blog — Therapy Insights & Guides | OKU Therapy',
  description:
    'Evidence-based mental health articles by OKU therapists. Explore ADHD, anxiety, depression, trauma, relationships, and mindfulness — written to help you understand your mind better.',
  keywords: [
    'mental health blog India', 'therapy insights', 'ADHD articles', 'anxiety guides',
    'depression support', 'trauma healing', 'mindfulness tips', 'OKU therapy blog',
    'therapist written articles', 'mental health India',
  ].join(', '),
  openGraph: {
    title: 'Mental Health Blog | OKU Therapy',
    description: 'Evidence-based articles on ADHD, anxiety, depression, trauma and more — written by OKU therapists.',
    url: 'https://okutherapy.com/blog',
    type: 'website',
  },
  alternates: { canonical: 'https://okutherapy.com/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
