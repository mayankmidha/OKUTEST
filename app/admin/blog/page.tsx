import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { BlogManager } from '@/components/BlogManager'
import { toggleTherapistBlogPower } from '../actions'
import { BookOpen, Users, PenLine, Eye } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) redirect('/auth/login')

  const [posts, therapists, stats] = await Promise.all([
    prisma.post.findMany({
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      where: { role: UserRole.THERAPIST },
      include: { practitionerProfile: { select: { id: true, canPostBlogs: true } } },
      orderBy: { name: 'asc' },
    }),
    Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
    ]),
  ])

  const [publishedCount, draftCount] = stats

  return (
    <div className="min-h-screen bg-oku-cream p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/30 hover:text-oku-darkgrey mb-2 inline-block">
              ← Admin
            </Link>
            <h1 className="heading-display text-5xl text-oku-darkgrey">Journal Management</h1>
            <p className="text-oku-darkgrey/50 font-display italic mt-1">Manage blog posts, grant editorial access, and publish to the OKU Journal.</p>
          </div>
          <Link href="/blog" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-oku-darkgrey/10 text-[10px] font-black uppercase tracking-widest text-oku-darkgrey hover:bg-oku-mint/30 transition-all">
            <Eye size={12} /> View Live Blog
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="card-glass-3d !bg-oku-darkgrey !p-8 relative overflow-hidden">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Total Posts</p>
            <p className="heading-display text-5xl text-white">{posts.length}</p>
          </div>
          <div className="card-glass-3d !bg-oku-mint/60 !p-8">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Published</p>
            <p className="heading-display text-5xl text-oku-darkgrey">{publishedCount}</p>
          </div>
          <div className="card-glass-3d !bg-oku-butter/60 !p-8">
            <p className="text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40 mb-2">Drafts</p>
            <p className="heading-display text-5xl text-oku-darkgrey">{draftCount}</p>
          </div>
        </div>

        {/* Blog Editor */}
        <div>
          <h2 className="text-xl font-display font-bold text-oku-darkgrey mb-6 flex items-center gap-2">
            <PenLine size={18} className="text-oku-purple-dark" /> Post Editor
          </h2>
          <BlogManager initialPosts={posts as any} />
        </div>

        {/* Practitioner Editorial Access */}
        <div>
          <h2 className="text-xl font-display font-bold text-oku-darkgrey mb-6 flex items-center gap-2">
            <Users size={18} className="text-oku-purple-dark" /> Editorial Access — Therapists
          </h2>
          <div className="card-glass-3d !bg-white/60 !p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Therapist</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Email</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Blog Access</th>
                  <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-oku-darkgrey/40">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {therapists.map(t => (
                  <tr key={t.id} className="hover:bg-white/30 transition-all">
                    <td className="px-8 py-4 font-bold text-oku-darkgrey text-sm">{t.name}</td>
                    <td className="px-8 py-4 text-xs text-oku-darkgrey/50">{t.email}</td>
                    <td className="px-8 py-4">
                      {t.practitionerProfile?.canPostBlogs ? (
                        <span className="px-3 py-1 bg-oku-mint text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full">Enabled</span>
                      ) : (
                        <span className="px-3 py-1 bg-white/40 text-oku-darkgrey/30 text-[9px] font-black uppercase tracking-widest rounded-full border border-oku-darkgrey/10">Off</span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-right">
                      {t.practitionerProfile && (
                        <form action={async () => {
                          'use server'
                          await toggleTherapistBlogPower(t.practitionerProfile!.id, !t.practitionerProfile!.canPostBlogs)
                        }}>
                          <button
                            type="submit"
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                              t.practitionerProfile.canPostBlogs
                                ? 'bg-oku-peach/40 hover:bg-oku-peach text-oku-darkgrey'
                                : 'bg-oku-lavender/40 hover:bg-oku-lavender text-oku-purple-dark'
                            }`}
                          >
                            {t.practitionerProfile.canPostBlogs ? 'Revoke Access' : 'Grant Access'}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {therapists.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-oku-darkgrey/30 italic font-display text-sm">
                      No therapists registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
