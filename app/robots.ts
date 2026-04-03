import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/assessments',
          '/assessments/',
          '/circles',
          '/circles/',
          '/therapists',
          '/therapists/',
          '/about-us',
          '/faq',
          '/blog',
          '/blog/',
          '/pricing',
          '/for-therapists',
          '/people',
          '/contact',
          '/match',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/practitioner/',
          '/api/',
          '/auth/',
          '/consent/',
          '/session/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
