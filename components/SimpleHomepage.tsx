import Link from 'next/link'

export default function SimpleHomepage() {
  return (
    <div className="min-h-screen bg-oku-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-oku-dark mb-6 leading-tight">
            Come as you are.
          </h1>
          <h2 className="text-3xl md:text-4xl font-display text-oku-taupe mb-8">
            We hold space for your healing
          </h2>
          <p className="text-xl text-oku-taupe max-w-2xl mx-auto mb-12 leading-relaxed">
            OKU is a psychotherapy collective offering <strong>inclusive, trauma-informed care</strong> for all parts of who you are.
          </p>
          <Link 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-oku-dark text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-oku-taupe transition-all"
          >
            Book a free 1:1 consultation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-oku-dark mb-6">
              Our Services
            </h2>
            <p className="text-xl text-oku-taupe max-w-3xl mx-auto">
              We offer a range of therapeutic approaches designed to meet you where you are.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Individual Therapy",
                description: "One-on-one sessions to explore your thoughts, patterns, and inner world.",
                tags: ["Depth-Oriented", "Trauma-Informed", "Queer-Affirmative"]
              },
              {
                title: "Trauma & EMDR",
                description: "Support for processing trauma—using EMDR and safe practices.",
                tags: ["EMDR Certified", "Somatic-Aware", "Gentle Pace"]
              },
              {
                title: "Movement Therapy", 
                description: "When words feel distant, movement speaks. This practice uses breath and flow.",
                tags: ["Breath & Body-Led", "Somatic Integration", "Expressive & Safe"]
              },
              {
                title: "Psychometric Assessments",
                description: "When seeking clarity on patterns or challenges, assessments are done gently.",
                tags: ["RCI Certified", "Insight-Led", "Evidence-Based"]
              },
              {
                title: "Couples Therapy & Group Work",
                description: "Healing together in relationships can be transformative.",
                tags: ["Relational Healing", "Facilitated Dialogue", "Safer Spaces"]
              },
              {
                title: "Queer-Affirmative Care",
                description: "Therapy that doesn't require you to explain yourself.",
                tags: ["Affirming & Aware", "No Explaining", "Lived Understanding"]
              }
            ].map((service, index) => (
              <div key={index} className="bg-oku-cream rounded-3xl p-8 shadow-sm">
                <h3 className="text-2xl font-display font-semibold text-oku-dark mb-3">
                  {service.title}
                </h3>
                <p className="text-oku-taupe mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs bg-oku-purple/10 text-oku-dark px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%20session%20for%20{service.title.replace(' ', '%20')}"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-oku-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-oku-taupe transition-colors"
                >
                  Book Consultation
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-oku-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h3 className="text-3xl font-display font-bold text-oku-dark mb-4">
            Ready to begin gently?
          </h3>
          <p className="text-xl text-oku-taupe mb-8 max-w-2xl mx-auto">
            Take the first step with a free 20-minute consultation.
          </p>
          <Link 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%20free%20consultation%20to%20discuss%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-oku-dark text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-oku-taupe transition-all"
          >
            Book Free Consultation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
