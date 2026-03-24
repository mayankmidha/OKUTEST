import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PractitionerShell } from '@/components/practitioner-shell/practitioner-shell'
import { BlogManager } from '@/components/BlogManager'
import { UserRole } from '@prisma/client'

export default async function PractitionerBlogsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    redirect('/auth/login')
  }

  const profile = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id }
  })

  if (!profile?.canPostBlogs) {
    redirect('/practitioner/dashboard')
  }

  // Therapists see all blogs (or we could limit to their own, 
  // but usually in a collective they might have editorial access to all)
  const allPosts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  return (
    <PractitionerShell
        title="Editorial Desk"
        badge="Editor Access"
        currentPath="/practitioner/blogs"
        description="Contribute to the Oku collective wisdom by publishing clinical insights."
        canPostBlogs={profile.canPostBlogs}
    >
        <div className="space-y-12">
            <BlogManager initialPosts={allPosts} />
        </div>
    </PractitionerShell>
  )
}
