// ADHD section wrapper — auth + role guard only.
// Individual sub-pages (tasks, log, body-doubling) each enforce
// adhdDiagnosed === true. The root /adhd/page.tsx renders
// ADHDUnlockGate for undiagnosed users instead of redirecting.
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ADHDLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')
  return <>{children}</>
}
