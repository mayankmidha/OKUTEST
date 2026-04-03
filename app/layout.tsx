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
  title: 'OKU Therapy - Inclusive, Trauma-Informed Care',
  description: 'OKU is a psychotherapy collective offering inclusive, trauma-informed care for all parts of who you are. Book a free consultation to begin gently.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  keywords: 'therapy, psychotherapy, mental health, trauma-informed, queer-affirmative, inclusive care',
  openGraph: {
    title: 'OKU Therapy',
    description: 'Inclusive, trauma-informed mental health care.',
    url: 'https://okutherapy.com',
    siteName: 'OKU Therapy',
    images: [
      {
        url: 'https://okutherapy.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OKU Therapy',
    description: 'Inclusive, trauma-informed mental health care.',
    images: ['https://okutherapy.com/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${bricolage.variable} ${cormorant.variable} ${instrumentSerif.variable} ${caveat.variable} ${dmSans.variable} ${nothingYouCouldDo.variable}`}>
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
