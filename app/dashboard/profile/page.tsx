import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import ClientProfileForm from './ClientProfileForm'

export default async function ClientProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { clientProfile: true }
  })

  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-oku-cream py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-oku-dark tracking-tighter">Your Profile</h1>
          <p className="text-oku-taupe mt-2 font-display italic">"Manage your personal space and preferences."</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-oku-taupe/10 shadow-xl">
          <ClientProfileForm initialData={user} />
        </div>
      </div>
    </div>
  )
}
