export default function PractitionerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-oku-cream">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
