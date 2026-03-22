import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DocumentVault } from '@/components/DocumentVault'

export default async function ClientVaultPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return (
    <div className="py-12 px-10">
      <DocumentVault />
    </div>
  )
}
