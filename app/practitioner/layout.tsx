'use client'

export default function PractitionerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-oku-mint/5">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
