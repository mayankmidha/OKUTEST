import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-oku-cream py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-24 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-oku-purple/10 rounded-full mb-8">
              <Sparkles size={14} className="text-oku-purple" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-oku-purple">Therapeutic Journal</span>
           </div>
           <h1 className="text-7xl md:text-8xl font-display font-bold text-oku-dark mb-8 tracking-tighter">Reflections</h1>
           <p className="font-script text-3xl text-oku-purple italic opacity-80 max-w-2xl mx-auto">
             Explorations of being, becoming, and the gentle art of unfolding.
           </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-40 text-center">
             <p className="text-oku-taupe font-display italic text-2xl">The journal is currently quiet. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-16">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="relative h-[450px] overflow-hidden rounded-[3rem] mb-10 border border-oku-taupe/10 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                   <img 
                    src={post.image || '/images/hero-bg.png'} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-oku-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-oku-dark shadow-xl">
                      {post.category}
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-black text-oku-taupe">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <div className="w-1 h-1 rounded-full bg-oku-purple/40" />
                      <span>{post.author.name}</span>
                   </div>
                   <h3 className="text-4xl font-display font-bold text-oku-dark leading-tight group-hover:text-oku-purple transition-colors tracking-tight">
                      {post.title}
                   </h3>
                   <p className="text-oku-taupe text-lg leading-relaxed line-clamp-2 italic font-display opacity-80">
                      {post.excerpt}
                   </p>
                   <div className="pt-4 flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-dark">Deep Read</span>
                      <div className="w-8 h-px bg-oku-taupe/20 group-hover:w-16 transition-all duration-700" />
                      <ArrowRight size={14} className="text-oku-purple transition-transform group-hover:translate-x-1" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
