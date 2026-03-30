import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Shield, Users, Sparkles, Award, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | OKU Therapy',
  description: 'Meet the OKU Therapy collective. A sanctuary for mental health care led by Dr. Suraj Singh and a team of compassionate, highly trained therapists.',
}

const values = [
  {
    icon: Heart,
    title: 'Compassion First',
    description: 'We believe healing begins with being truly seen and heard. Every interaction is grounded in empathy and non-judgment.'
  },
  {
    icon: Shield,
    title: 'Clinical Excellence',
    description: 'Our team combines evidence-based practices with deep expertise. We maintain the highest standards of professional care.'
  },
  {
    icon: Users,
    title: 'Inclusive Care',
    description: 'We celebrate diversity and provide affirmative therapy for all identities, backgrounds, and lived experiences.'
  },
  {
    icon: Sparkles,
    title: 'Holistic Approach',
    description: 'We honor the connection between mind, body, and spirit. Our care addresses the whole person, not just symptoms.'
  }
]

const team = [
  {
    name: 'Dr. Suraj Singh',
    role: 'Founder & Consultant Psychiatrist',
    image: '/wp-content/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg',
    bio: 'Dr. Suraj Singh leads our clinical team with over 15 years of experience in psychiatry and mental health care.',
    credentials: ['MD Psychiatry', 'RCI Certified', 'EMDR Trained']
  },
  {
    name: 'Tanisha Singh',
    role: 'Clinical Psychologist & Psychodynamic Psychotherapist',
    image: '/wp-content/uploads/2025/07/Tanisha_-821x1024.jpg',
    bio: 'Tanisha brings deep expertise in psychodynamic therapy and trauma-informed care.',
    credentials: ['M.Phil Clinical Psychology', 'Psychodynamic Training', 'Trauma Specialist']
  },
  {
    name: 'Rananjay Singh',
    role: 'Queer Affirmative & Family Therapist',
    image: '/wp-content/uploads/2025/07/Rananjay--869x1536.jpg',
    bio: 'Rananjay specializes in LGBTQ+ affirmative therapy and family systems work.',
    credentials: ['Masters in Psychology', 'Queer-Affirmative Certified', 'Family Systems']
  },
  {
    name: 'Amna Ansari',
    role: 'Clinical Psychologist (A.)',
    image: '/wp-content/uploads/2025/07/Amna-1006x1536.jpg',
    bio: 'Amna focuses on anxiety, OCD, and cognitive behavioral interventions.',
    credentials: ['M.Phil Clinical Psychology (A)', 'CBT Certified', 'Anxiety Specialist']
  },
  {
    name: 'Mohit Dudeja',
    role: 'Queer Affirmative Therapist',
    image: '/wp-content/uploads/2025/07/Mohit-911x1024.jpg',
    bio: 'Mohit provides compassionate care for LGBTQ+ individuals navigating identity and grief.',
    credentials: ['Masters in Psychology', 'Queer-Affirmative', 'Grief Counseling']
  },
  {
    name: 'Gursheel Kaur',
    role: 'Psychodynamic Psychotherapist',
    image: '/wp-content/uploads/2025/07/gursheel_pfp-1024x980.jpg',
    bio: 'Gursheel works with depth psychology approaches for self-esteem and relational issues.',
    credentials: ['Masters in Psychology', 'Psychodynamic Training', 'Relational Therapy']
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-oku-cream">
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <span className="chip bg-oku-lavender/30 border-oku-purple/20 mb-8 inline-block">Our Story</span>
            <h1 className="heading-display text-6xl md:text-8xl text-oku-darkgrey tracking-tighter mb-8">
              A Sanctuary for <span className="text-oku-purple-dark italic">Healing</span>
            </h1>
            <p className="text-xl md:text-2xl text-oku-darkgrey/60 font-display italic leading-relaxed">
              OKU Therapy was born from a simple belief: everyone deserves access to compassionate, 
              professional mental health care in a space that feels safe, warm, and truly human.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-oku-lavender/20 to-oku-blush/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Heart className="text-oku-purple-dark" size={40} />
                  </div>
                  <p className="text-2xl font-display italic text-oku-darkgrey leading-relaxed">
                    "We don't just treat symptoms—we walk alongside you in your journey toward wholeness."
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="heading-display text-4xl text-oku-darkgrey">Our Mission</h2>
              <p className="text-oku-darkgrey/70 text-lg leading-relaxed">
                At OKU Therapy, we are reimagining mental healthcare. We believe that healing happens 
                in relationships—between therapist and client, between mind and body, between who we 
                are and who we are becoming.
              </p>
              <p className="text-oku-darkgrey/70 text-lg leading-relaxed">
                Our collective brings together diverse expertise and shared values. We are psychiatrists, 
                psychologists, and therapists united by a commitment to evidence-based care delivered 
                with warmth, cultural sensitivity, and deep respect for each person's unique story.
              </p>
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-4xl font-display font-bold text-oku-purple-dark">500+</p>
                  <p className="text-sm text-oku-darkgrey/50 font-black uppercase tracking-widest mt-1">Lives Impacted</p>
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-oku-purple-dark">6</p>
                  <p className="text-sm text-oku-darkgrey/50 font-black uppercase tracking-widest mt-1">Expert Therapists</p>
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-oku-purple-dark">15+</p>
                  <p className="text-sm text-oku-darkgrey/50 font-black uppercase tracking-widest mt-1">Years Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-32">
            <h2 className="heading-display text-4xl text-oku-darkgrey text-center mb-16">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="card-glass-3d !p-8 !bg-white/40">
                  <div className="w-14 h-14 bg-oku-lavender/40 rounded-2xl flex items-center justify-center mb-6">
                    <value.icon className="text-oku-purple-dark" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-oku-darkgrey mb-3">{value.title}</h3>
                  <p className="text-sm text-oku-darkgrey/60 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-32">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="heading-display text-4xl md:text-5xl text-oku-darkgrey mb-6">Meet Our Collective</h2>
              <p className="text-oku-darkgrey/60 text-lg">
                A team of dedicated professionals committed to your mental health journey
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="card-glass-3d !p-0 overflow-hidden group">
                  <div className="h-64 bg-oku-lavender/20 relative overflow-hidden">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🧘</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-display font-bold text-oku-darkgrey mb-1">{member.name}</h3>
                    <p className="text-oku-purple-dark text-sm font-black uppercase tracking-widest mb-4">{member.role}</p>
                    <p className="text-oku-darkgrey/60 text-sm leading-relaxed mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.credentials.map((cred, idx) => (
                        <span key={idx} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-oku-lavender/30 text-oku-purple-dark rounded-full">
                          {cred}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="card-glass-3d !bg-oku-darkgrey text-white text-center py-20 px-10">
            <h2 className="heading-display text-4xl md:text-5xl mb-6">Begin Your Journey</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
              Take the first step toward healing. Browse our collective and find the therapist 
              who resonates with your story.
            </p>
            <Link href="/therapists" className="btn-pill-3d bg-white text-oku-darkgrey !px-12 !py-5 inline-block">
              Meet the Collective
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
