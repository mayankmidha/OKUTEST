import Link from 'next/link'

const posts = [
  {
    title: 'Finding Your Inner Sanctuary',
    excerpt: 'Exploring the meaning of OKU and how it relates to modern psychotherapy.',
    author: 'Dr. Suraj Singh',
    date: 'March 15, 2024',
    category: 'Philosophy',
    image: '/images/hero-bg.png'
  },
  {
    title: 'Trauma-Informed Care: A Gentle Approach',
    excerpt: 'Understanding why intersectionality matters in mental health treatment.',
    author: 'Tanisha Singh',
    date: 'March 10, 2024',
    category: 'Therapy',
    image: '/images/about.png'
  },
  {
    title: 'The Power of Vulnerability',
    excerpt: 'How being honest with yourself can lead to deep, lasting change.',
    author: 'Amna Kaur',
    date: 'March 5, 2024',
    category: 'Growth',
    image: '/images/hero-bg.png'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-oku-cream py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-24 text-center">
           <h1 className="text-7xl md:text-8xl font-display font-bold text-oku-dark mb-8">Journal</h1>
           <p className="font-script text-3xl text-oku-purple italic">Reflections on being, becoming, and unfolding.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
           {posts.map((post, idx) => (
             <div key={idx} className="group cursor-pointer">
                <div className="relative h-64 overflow-hidden rounded-card mb-8 border border-oku-taupe/10">
                   <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                   />
                   <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-4 py-1 rounded-pill text-[10px] font-black uppercase tracking-widest text-oku-dark">
                      {post.category}
                   </div>
                </div>
                <div className="space-y-4">
                   <p className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe">{post.date}</p>
                   <h3 className="text-3xl font-display font-bold text-oku-dark leading-tight group-hover:text-oku-purple transition-colors">
                      {post.title}
                   </h3>
                   <p className="text-oku-taupe text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                   </p>
                   <div className="pt-4 flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-dark">Read Article</span>
                      <span className="text-oku-purple transition-transform group-hover:translate-x-1">→</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
