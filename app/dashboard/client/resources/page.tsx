import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  ChevronLeft, BookOpen, Sparkles, 
  Target, Zap, Wind, Heart, 
  PlayCircle, FileText, CheckCircle2
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const [exercises, posts] = await Promise.all([
    prisma.exercise.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
    prisma.post.findMany({ where: { published: true, category: 'Resource' }, orderBy: { createdAt: 'desc' } })
  ])

  return (
    <div className="relative mx-auto min-h-screen max-w-[1600px] overflow-hidden bg-oku-lavender/5 px-4 py-8 text-oku-darkgrey sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-oku-blush/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-oku-mint/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-14 flex flex-col justify-between gap-8 lg:mb-20 lg:flex-row lg:items-end lg:gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/client"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oku-darkgrey/40 hover:text-oku-darkgrey transition-colors bg-white/40 px-5 py-2.5 rounded-full border border-white/60 shadow-sm"
              >
                <ChevronLeft size={13} /> Dashboard
              </Link>
              <span className="chip bg-white/60 border-white/80">Library</span>
            </div>
            <h1 className="heading-display text-4xl tracking-tighter text-oku-darkgrey sm:text-5xl lg:text-7xl xl:text-8xl">
              The <span className="text-oku-purple-dark italic">Collection.</span>
            </h1>
            <p className="border-l-4 border-oku-purple-dark/10 pl-5 font-display text-base italic text-oku-darkgrey/60 sm:pl-8 sm:text-lg lg:text-xl">
              Resources, exercises, and clinical summaries curated for your growth.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-12 xl:gap-12">
            {/* Exercises Column */}
            <div className="xl:col-span-8 space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="heading-display text-3xl tracking-tight flex items-center gap-4">
                            <Target className="text-oku-purple-dark" />
                            Mindful <span className="italic">Exercises</span>
                        </h2>
                    </div>
                    {exercises.length === 0 ? (
                        <div className="bg-white/40 border-2 border-dashed border-white/60 rounded-[3rem] p-20 text-center">
                            <Wind size={48} className="mx-auto text-oku-purple-dark/20 mb-6 animate-pulse" />
                            <p className="text-xl font-display italic text-oku-darkgrey/40">New exercises are being curated...</p>
                        </div>
                    ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {exercises.map(ex => (
                                <div key={ex.id} className="group card-glass-3d !bg-white/60 !p-6 transition-all duration-500 hover:shadow-2xl sm:!p-8">
                                    <div className="mb-8 flex items-start justify-between gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-oku-lavender/40 flex items-center justify-center text-oku-purple-dark shadow-inner">
                                            <PlayCircle size={24} />
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-white shadow-sm">{ex.category}</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-oku-darkgrey mb-2">{ex.title}</h3>
                                    <p className="text-sm text-oku-darkgrey/60 line-clamp-2 mb-6 italic">{ex.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/30">{ex.duration} Mins</span>
                                        <button className="btn-pill-3d !py-2 !px-6 bg-oku-darkgrey text-white text-[9px]">Start Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="heading-display text-3xl tracking-tight flex items-center gap-4">
                            <BookOpen className="text-oku-purple-dark" />
                            Guided <span className="italic">Summaries</span>
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {posts.map(post => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group block card-glass-3d !bg-white/40 !p-6 transition-all hover:bg-white sm:!p-8">
                                <div className="flex items-center justify-between gap-4 sm:gap-8">
                                    <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-oku-babyblue/20 flex items-center justify-center text-oku-babyblue-dark">
                                            <FileText size={24} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xl font-display font-bold text-oku-darkgrey">{post.title}</h3>
                                            <p className="text-xs text-oku-darkgrey/40 italic">{post.excerpt}</p>
                                        </div>
                                    </div>
                                    <CheckCircle2 size={20} className="text-oku-purple-dark/10 group-hover:text-oku-purple-dark transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* Sidecar: Retention & Goals */}
            <div className="xl:col-span-4 space-y-12">
                <section className="group relative overflow-hidden card-glass-3d !bg-oku-dark !p-6 text-white sm:!p-8 lg:!p-10">
                    <div className="relative z-10">
                        <Sparkles className="text-oku-lavender mb-6 animate-float-3d" />
                        <h3 className="heading-display text-3xl mb-4">Master your <span className="italic text-oku-lavender">Sanctuary.</span></h3>
                        <p className="text-sm text-white/60 leading-relaxed mb-8 italic">Complete 3 exercises this week to earn a dopamine win.</p>
                        <div className="space-y-4">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-oku-lavender w-[66%] shadow-[0_0_15px_rgba(157,133,179,0.5)]" />
                            </div>
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/40">
                                <span>Progress</span>
                                <span>2/3 Completed</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-oku-purple/10 rounded-full blur-3xl" />
                </section>

                <div className="card-glass-3d border-oku-mint/10 !bg-oku-mint/20 !p-6 sm:!p-8 lg:!p-10">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-6">Daily Affirmation</h3>
                    <p className="text-xl font-display italic text-oku-darkgrey leading-relaxed">
                        &ldquo;I am capable of change, even when it feels heavy. Tiny steps create the path.&rdquo;
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
