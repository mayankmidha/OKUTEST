import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://okutherapy.com'

const CATEGORY_COLORS: Record<string, string> = {
  'ADHD':           'bg-oku-lavender/60 text-oku-purple-dark',
  'Anxiety':        'bg-oku-mint/60 text-green-800',
  'Depression':     'bg-oku-butter/60 text-amber-800',
  'Trauma':         'bg-oku-peach/60 text-red-800',
  'Relationships':  'bg-blue-50 text-blue-800',
  'Mindfulness':    'bg-purple-50 text-purple-800',
  'Mental Health':  'bg-oku-lavender/40 text-oku-purple-dark',
  'Clinical Depth': 'bg-gray-100 text-gray-700',
  'default':        'bg-white/60 text-oku-darkgrey',
}

function categoryColor(cat: string | null) {
  if (!cat) return CATEGORY_COLORS['default']
  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return CATEGORY_COLORS[key]
  }
  return CATEGORY_COLORS['default']
}

export const revalidate = 3600

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(category ? { category: { contains: category, mode: 'insensitive' } } : {}),
    },
    select: { id: true, slug: true, title: true, excerpt: true, category: true, updatedAt: true, author: { select: { name: true } } },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  })

  const allCategories = await prisma.post.groupBy({
    by: ['category'],
    where: { published: true, category: { not: null } },
    _count: true,
    orderBy: { _count: { category: 'desc' } },
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'OKU Therapy Mental Health Blog',
    description: 'Evidence-based mental health articles by OKU therapists.',
    url: `${BASE}/blog`,
    publisher: { '@type': 'Organization', name: 'OKU Therapy', url: BASE },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="oku-page-public min-h-screen bg-oku-mint relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-oku-lavender/30 rounded-full blur-[140px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-oku-butter/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 relative z-10">
          {/* Header */}
          <div className="mb-16">
            <span className="chip bg-white/60 border-white/80 mb-6 inline-block">OKU Journal</span>
            <h1 className="heading-display text-oku-darkgrey text-6xl md:text-8xl leading-[0.88] tracking-tight mb-6">
              Mental Health,<br />
              <span className="italic text-oku-purple-dark/80">Understood.</span>
            </h1>
            <p className="text-xl text-oku-darkgrey/60 font-display italic max-w-xl">
              Evidence-based guides written by OKU therapists — on ADHD, anxiety, trauma, relationships, and the everyday work of healing.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link
              href="/blog"
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                !category
                  ? 'bg-oku-darkgrey text-white border-oku-darkgrey'
                  : 'bg-white/50 text-oku-darkgrey/60 border-white/80 hover:bg-white/80'
              }`}
            >
              All
            </Link>
            {allCategories.map((c) =>
              c.category ? (
                <Link
                  key={c.category}
                  href={`/blog?category=${encodeURIComponent(c.category)}`}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    category === c.category
                      ? 'bg-oku-darkgrey text-white border-oku-darkgrey'
                      : 'bg-white/50 text-oku-darkgrey/60 border-white/80 hover:bg-white/80'
                  }`}
                >
                  {c.category} ({c._count})
                </Link>
              ) : null
            )}
          </div>

          {/* Posts grid */}
          {posts.length === 0 ? (
            <div className="text-center py-32">
              <BookOpen size={48} className="text-oku-darkgrey/20 mx-auto mb-6" />
              <p className="text-oku-darkgrey/40 font-display italic text-xl">No posts yet in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group card-glass-3d !bg-white/60 !p-0 overflow-hidden hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Color band by category */}
                  <div className={`h-1.5 w-full ${categoryColor(post.category).split(' ')[0]}`} />
                  <div className="p-8">
                    {post.category && (
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 ${categoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-xl font-display font-bold text-oku-darkgrey leading-tight mb-3 group-hover:text-oku-purple-dark transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-oku-darkgrey/60 font-display italic leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-white/60">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40">
                          {post.author?.name ?? 'OKU Therapist'}
                        </p>
                        <p className="text-[10px] text-oku-darkgrey/30 mt-0.5">
                          {new Date(post.updatedAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-oku-purple-dark/40 group-hover:text-oku-purple-dark group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
