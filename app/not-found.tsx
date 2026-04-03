import Link from 'next/link'
import { ArrowLeft, Wind } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-oku-lavender flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-oku-blush/20 rounded-full -translate-y-1/2 -translate-x-1/2 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-oku-mint/20 rounded-full translate-y-1/3 translate-x-1/4 blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="inline-block">
            <img
              src="/wp-content/wp-content/uploads/2025/07/Logoo.png"
              alt="OKU Therapy"
              className="h-10 w-auto opacity-60 mx-auto"
            />
          </Link>
        </div>

        <div className="mb-8">
          <Wind
            size={64}
            strokeWidth={1}
            className="mx-auto text-oku-purple-dark/30 animate-float-3d mb-8"
          />
          <p className="text-[180px] md:text-[220px] heading-display text-oku-darkgrey/10 leading-none tracking-tighter select-none">
            404
          </p>
        </div>

        <div className="card-glass-3d !bg-white/50 !rounded-[3rem] !p-12 md:!p-16 shadow-2xl -mt-12 relative z-10">
          <h1 className="heading-display text-4xl md:text-6xl text-oku-darkgrey mb-6 tracking-tight">
            This path <span className="text-oku-purple-dark italic">doesn&rsquo;t exist.</span>
          </h1>
          <p className="text-lg text-oku-darkgrey/50 italic font-display leading-relaxed mb-12">
            The page you&rsquo;re looking for has moved, been removed, or never existed. Let&rsquo;s guide you back to your sanctuary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !py-5 !px-10 flex items-center justify-center gap-3"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Link
              href="/dashboard/client"
              className="btn-pill-3d bg-white border-white text-oku-darkgrey !py-5 !px-10"
            >
              My Sanctuary
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
