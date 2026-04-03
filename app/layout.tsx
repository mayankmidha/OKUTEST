import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from '@/components/RootLayoutClient'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Caveat,
  DM_Sans,
  Cormorant_Garamond,
  Nothing_You_Could_Do,
} from 'next/font/google'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-editorial',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-cursive',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const nothingYouCouldDo = Nothing_You_Could_Do({
  subsets: ['latin'],
  variable: '--font-handwriting',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'OKU Therapy — Online Therapy in India | Delhi, Mumbai, Bangalore',
    template: '%s | OKU Therapy',
  },
  description: 'OKU Therapy is India\'s inclusive online psychotherapy platform. Book a certified therapist in Delhi, Mumbai, Bangalore & across India. Trauma-informed, LGBTQ+ affirmative, ADHD-specialist care. First session from ₹1,500.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  keywords: 'online therapy India, online therapist Delhi, mental health counsellor India, psychotherapy Delhi, therapist Delhi, anxiety therapist India, depression therapy online India, ADHD therapist India, trauma therapy India, LGBTQ therapist India, queer affirmative therapy India, OKU Therapy, online counselling India, best therapist Delhi, affordable therapy India',
  openGraph: {
    title: 'OKU Therapy — Online Therapy in India',
    description: 'Book a certified therapist online in Delhi, Mumbai, Bangalore & across India. Trauma-informed, inclusive, ADHD-specialist care from ₹1,500.',
    url: 'https://okutherapy.com',
    siteName: 'OKU Therapy',
    images: [
      {
        url: 'https://okutherapy.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OKU Therapy — Online Therapy in India',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OKU Therapy — Online Therapy in India',
    description: 'Book a certified therapist online across India. Trauma-informed, inclusive care from ₹1,500.',
    images: ['https://okutherapy.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://okutherapy.com',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'OKU Therapy',
  url: 'https://okutherapy.com',
  logo: 'https://okutherapy.com/og-image.jpg',
  description: 'Inclusive online psychotherapy platform in India offering trauma-informed, LGBTQ+ affirmative, and ADHD-specialist care.',
  telephone: '',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Delhi',
    addressRegion: 'Delhi',
    addressCountry: 'IN',
  },
  areaServed: ['Delhi', 'Mumbai', 'Bangalore', 'India'],
  medicalSpecialty: ['Psychiatry', 'Psychology', 'Psychotherapy'],
  priceRange: '₹₹',
  openingHours: 'Mo-Su 08:00-22:00',
  sameAs: [
    'https://www.instagram.com/okutherapy',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${bricolage.variable} ${cormorant.variable} ${instrumentSerif.variable} ${caveat.variable} ${dmSans.variable} ${nothingYouCouldDo.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white font-sans text-oku-dark antialiased">
        <ErrorBoundary>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
