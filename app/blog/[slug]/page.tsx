import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In a real app, you'd fetch the post by slug
  const post = {
    title: 'Finding Your Inner Sanctuary',
    author: 'Dr. Suraj Singh',
    date: 'March 15, 2024',
    content: `
      <p>The concept of "OKU" in Japanese traditional architecture refers to the innermost, private space of a home or temple. In the context of therapy, we view OKU as the internal sanctuary where healing begins.</p>
      <p>Trauma often disrupts our access to this inner space. Our work as therapists is to walk alongside you as you clear the debris of past experiences and rediscover your center.</p>
      <p>Inclusive, trauma-informed care means recognizing that everyone's OKU looks different. It is shaped by identity, culture, and personal history. We hold space for all of it.</p>
    `,
    category: 'Philosophy',
    image: '/images/hero-bg.png'
  }

  return (
    <article className="min-h-screen bg-oku-cream py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe hover:text-oku-purple transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Journal
        </Link>

        <div className="relative h-[50vh] rounded-card overflow-hidden mb-16 border border-oku-taupe/10 shadow-2xl">
           <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale opacity-20" />
           <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-oku-dark/5 text-[15vw] font-display font-bold select-none">OKU</span>
           </div>
        </div>

        <header className="mb-16">
           <div className="flex items-center gap-4 mb-8">
              <span className="bg-oku-purple/20 text-oku-purple px-4 py-1 rounded-pill text-[10px] font-black uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe">
                {post.date}
              </span>
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-bold text-oku-dark mb-8 leading-tight">
             {post.title}
           </h1>
           <p className="font-script text-3xl text-oku-purple italic">By {post.author}</p>
        </header>

        <div 
          className="prose prose-xl prose-stone max-w-none text-oku-taupe leading-relaxed space-y-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-24 pt-12 border-t border-oku-taupe/20">
           <h3 className="text-2xl font-display font-bold text-oku-dark mb-8">Continue your journey</h3>
           <Link href="/therapists" className="inline-block bg-oku-purple text-oku-dark px-10 py-4 rounded-pill font-black text-[10px] uppercase tracking-[0.4em] hover:bg-opacity-80 transition-all shadow-xl">
             Find a therapist
           </Link>
        </div>
      </div>
    </article>
  )
}
