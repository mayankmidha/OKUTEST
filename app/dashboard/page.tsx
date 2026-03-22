import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardRedirectPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const role = session.user.role

  if (role === 'THERAPIST') {
    redirect('/practitioner/dashboard')
  }

  if (role === 'ADMIN') {
    redirect('/admin/dashboard')
  }

  // Default for CLIENT or others
  redirect('/dashboard/client')
}
