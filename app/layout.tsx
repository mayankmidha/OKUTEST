import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/auth-provider'

export const metadata: Metadata = {
  title: 'OKU Therapy - Inclusive, Trauma-Informed Care',
  description: 'OKU is a psychotherapy collective offering inclusive, trauma-informed care for all parts of who you are. Book a free consultation to begin gently.',
  keywords: 'therapy, psychotherapy, mental health, trauma-informed, queer-affirmative, inclusive care',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
