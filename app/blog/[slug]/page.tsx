import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { marked } from 'marked'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, category: true, updatedAt: true },
  })
  if (!post) return {}

  const title = `${post.title} | OKU Therapy Blog`
  const description = post.excerpt ?? `${post.title} — a mental health guide by OKU Therapy.`

  return {
    title,
    description,
    keywords: `${post.category ?? 'mental health'}, therapy India, ${post.title.toLowerCase()}, OKU therapy`,
    openGraph: {
      title,
      description,
      url: `${BASE}/blog/${slug}`,
      type: 'article',
      publishedTime: post.updatedAt.toISOString(),
    },
    alternates: { canonical: `${BASE}/blog/${slug}` },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  })
  if (!post) notFound()

  // Related posts (same category, exclude current)
  const related = await prisma.post.findMany({
    where: {
      published: true,
      category: post.category ?? undefined,
      slug: { not: slug },
    },
    select: { slug: true, title: true, excerpt: true, category: true },
    take: 3,
    orderBy: { updatedAt: 'desc' },
  })

  const htmlContent = await marked(post.content, { gfm: true, breaks: true })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? post.title,
    url: `${BASE}/blog/${slug}`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author?.name ?? 'OKU Therapist',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OKU Therapy',
      url: BASE,
    },
    articleSection: post.category ?? 'Mental Health',
    inLanguage: 'en-IN',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="oku-page-public min-h-screen bg-oku-mint relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-oku-lavender/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 pt-48 pb-32 relative z-10">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey bg-white/40 px-5 py-2.5 rounded-full border border-white/60 mb-12"
          >
            <ChevronLeft size={13} /> All Articles
          </Link>

          {/* Header */}
          <div className="mb-12">
            {post.category && (
              <span className="chip bg-white/60 border-white/80 mb-6 inline-block">{post.category}</span>
            )}
            <h1 className="heading-display text-oku-darkgrey text-5xl md:text-6xl leading-[0.9] tracking-tight mb-8">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-oku-darkgrey/60 font-display italic leading-relaxed border-l-4 border-oku-purple-dark/10 pl-8">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/60">
              <div className="w-10 h-10 rounded-2xl bg-oku-lavender flex items-center justify-center text-oku-purple-dark font-bold text-sm">
                {post.author?.name?.charAt(0) ?? 'O'}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey">
                  {post.author?.name ?? 'OKU Therapist'}
                </p>
                <p className="text-[10px] text-oku-darkgrey/40 mt-0.5">
                  {new Date(post.updatedAt).toLocaleDateString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Article body */}
          <article
            className="prose prose-lg prose-slate max-w-none
              prose-headings:font-display prose-headings:text-oku-darkgrey prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-oku-darkgrey/80 prose-p:leading-relaxed prose-p:font-display
              prose-li:text-oku-darkgrey/80 prose-li:font-display
              prose-strong:text-oku-darkgrey prose-strong:font-bold
              prose-blockquote:border-oku-purple-dark/20 prose-blockquote:italic prose-blockquote:text-oku-darkgrey/60
              prose-a:text-oku-purple-dark prose-a:no-underline hover:prose-a:underline
              bg-white/60 rounded-3xl p-10 border border-white/80 shadow-sm"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Safety note */}
          <div className="mt-10 p-6 bg-white/40 rounded-2xl border border-white/60">
            <p className="text-xs text-oku-darkgrey/50 font-display italic leading-relaxed">
              This article is for informational purposes and does not constitute clinical advice.
              If you are in crisis, please call <strong>iCall: 9152987821</strong> or{' '}
              <strong>Vandrevala Foundation: 1860-2662-345</strong> (24/7).
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 card-glass-3d !bg-oku-darkgrey !p-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Ready to talk?</p>
            <h2 className="heading-display text-white text-4xl mb-6">Find your therapist.</h2>
            <Link
              href="/therapists"
              className="btn-pill-3d bg-white text-oku-darkgrey !py-4 !px-10 text-sm font-black uppercase tracking-widest inline-flex items-center gap-2"
            >
              Browse Therapists <ArrowRight size={14} />
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 mb-8">More in {post.category ?? 'Mental Health'}</p>
              <div className="space-y-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-white/70 hover:bg-white/80 transition-all"
                  >
                    <div>
                      <p className="font-display font-bold text-oku-darkgrey group-hover:text-oku-purple-dark transition-colors">{r.title}</p>
                      {r.excerpt && <p className="text-xs text-oku-darkgrey/50 mt-1 italic line-clamp-1">{r.excerpt}</p>}
                    </div>
                    <ArrowRight size={14} className="text-oku-darkgrey/30 group-hover:text-oku-purple-dark group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
