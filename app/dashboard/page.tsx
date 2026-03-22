import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardRedirectPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const role = session.user.role

  try {
    if (role === 'THERAPIST') {
      redirect('/practitioner/dashboard')
    }

    if (role === 'ADMIN') {
      redirect('/admin/dashboard')
    }

    // Default for CLIENT or others
    redirect('/dashboard/client')
  } catch (e) {
    // If it's a redirect error, let it throw (Next.js handles it)
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') {
        throw e
    }
    // Otherwise fallback to client dashboard
    redirect('/dashboard/client')
  }
}
