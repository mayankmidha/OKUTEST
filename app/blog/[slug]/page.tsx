import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react'

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })
  return posts.map(p => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true, bio: true, avatar: true } } }
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-oku-cream">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
         <img 
            src={post.image || '/images/hero-bg.png'} 
            className="w-full h-full object-cover" 
            alt={post.title} 
         />
         <div className="absolute inset-0 bg-oku-dark/40 backdrop-blur-[2px]" />
         
         <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div className="max-w-4xl">
                <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-white mb-12 transition-colors">
                    <ArrowLeft size={14} /> Back to Journal
                </Link>
                <div className="inline-block px-4 py-1.5 bg-oku-purple text-white rounded-full text-[9px] font-black uppercase tracking-widest mb-8">
                    {post.category}
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter leading-none mb-8">
                    {post.title}
                </h1>
                <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/80">
                    <span className="flex items-center gap-2"><Clock size={12}/> 6 Min Read</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-oku-purple" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
         </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-6 py-24">
         <div className="prose prose-oku max-w-none">
            <div className="text-xl md:text-2xl text-oku-dark font-display italic leading-relaxed mb-16 border-l-4 border-oku-purple pl-8">
                {post.excerpt}
            </div>
            
            <div className="text-oku-taupe text-lg leading-[2] whitespace-pre-wrap font-medium">
                {post.content}
            </div>
         </div>

         {/* Author Card */}
         <div className="mt-32 pt-16 border-t border-oku-taupe/10">
            <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-12 rounded-[3rem] shadow-sm border border-oku-taupe/5">
                <div className="w-24 h-24 rounded-full bg-oku-purple/10 overflow-hidden border-4 border-oku-cream shadow-inner">
                    {post.author.avatar ? <img src={post.author.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-display font-bold">🧘</div>}
                </div>
                <div className="text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-oku-taupe mb-2">Written by</p>
                    <h4 className="text-2xl font-display font-bold text-oku-dark mb-4">{post.author.name}</h4>
                    <p className="text-sm text-oku-taupe italic leading-relaxed opacity-80">
                        {post.author.bio || "Clinical practitioner at Oku Therapy dedicated to trauma-informed and inclusive mental health support."}
                    </p>
                </div>
            </div>
         </div>

         <div className="mt-16 text-center">
            <Link href="/therapists" className="btn-primary py-5 px-12 shadow-2xl inline-block">
                Begin Your Journey
            </Link>
         </div>
      </div>
    </div>
  )
}
