import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const role = session.user.role

  if (role === 'CLIENT') {
    redirect('/dashboard/client')
  }

  if (role === 'THERAPIST') {
    redirect('/practitioner/dashboard')
  }

  if (role === 'ADMIN') {
    redirect('/admin/dashboard')
  }

  redirect('/auth/login')
}
