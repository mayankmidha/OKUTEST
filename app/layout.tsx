import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from '@/components/RootLayoutClient'

export const metadata: Metadata = {
  title: 'OKU Therapy - Inclusive, Trauma-Informed Care',
  description: 'OKU is a psychotherapy collective offering inclusive, trauma-informed care for all parts of who you are. Book a free consultation to begin gently.',
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white font-body text-oku-dark antialiased">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
