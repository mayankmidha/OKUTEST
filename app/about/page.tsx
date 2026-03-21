import Hero from '@/components/Hero'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-oku-cream pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
             <h1 className="text-6xl md:text-8xl font-display font-bold text-oku-dark mb-8">Our Story</h1>
             <p className="font-script text-3xl text-oku-purple mb-8">Inclusive. Trauma-informed. Human.</p>
             <div className="space-y-6 text-lg text-oku-taupe leading-relaxed">
               <p>
                 OKU Therapy was founded on a simple belief: mental health care should be accessible, 
                 intersectional, and deeply human. We are a collective of practitioners dedicated to 
                 holding space for the complexities of your journey.
               </p>
               <p>
                 Our name, "OKU", represents the inner sanctuary—the quiet place of being where 
                 healing begins. We don't just treat symptoms; we walk alongside you as you 
                 unfold and rediscover your resilience.
               </p>
             </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-oku-purple/20 rounded-card rotate-3"></div>
            <img 
              src="/images/about.png" 
              alt="OKU Therapy Space" 
              className="rounded-card shadow-2xl relative z-10 w-full grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
