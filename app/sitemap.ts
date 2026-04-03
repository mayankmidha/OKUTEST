import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { ASSESSMENTS } from '@/lib/assessments'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                         priority: 1.0,  changeFrequency: 'weekly' },
    { url: `${BASE}/assessments`,        priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/circles`,            priority: 0.9,  changeFrequency: 'daily' },
    { url: `${BASE}/therapists`,         priority: 0.9,  changeFrequency: 'daily' },
    { url: `${BASE}/blog`,              priority: 0.8,  changeFrequency: 'weekly' },
    { url: `${BASE}/pricing`,           priority: 0.85, changeFrequency: 'monthly' },
    { url: `${BASE}/for-therapists`,    priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/match`,             priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/about-us`,           priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/faq`,               priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${BASE}/people`,            priority: 0.6,  changeFrequency: 'monthly' },
    { url: `${BASE}/contact`,           priority: 0.6,  changeFrequency: 'yearly' },
    { url: `${BASE}/privacy`,           priority: 0.3,  changeFrequency: 'yearly' },
    { url: `${BASE}/terms`,             priority: 0.3,  changeFrequency: 'yearly' },
  ]

  // Assessment pages (static lib — always available)
  const assessmentPages: MetadataRoute.Sitemap = ASSESSMENTS.map((a) => ({
    url: `${BASE}/assessments/${a.slug}`,
    priority: 0.85,
    changeFrequency: 'monthly' as const,
  }))

  // Public assessment redirect pages (dashboard/client/assessments/[slug] with mode=anonymous)
  // These are gated but the public /assessments page is the entry point — no need to index
  // individual dashboard routes.

  // Practitioner profiles
  let practitionerPages: MetadataRoute.Sitemap = []
  try {
    const practitioners = await prisma.practitionerProfile.findMany({
      where: { isVerified: true },
      select: { id: true, updatedAt: true },
    })
    practitionerPages = practitioners
      .map((p) => ({
        url: `${BASE}/therapists/${p.id}`,
        lastModified: p.updatedAt,
        priority: 0.8,
        changeFrequency: 'monthly' as const,
      }))
  } catch {}

  // Blog posts
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })
    blogPages = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.6,
      changeFrequency: 'weekly' as const,
    }))
  } catch {}

  return [...staticPages, ...assessmentPages, ...practitionerPages, ...blogPages]
}
