export default function FastHomepage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          OKU Therapy
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Come as you are. We hold space for your healing.
        </p>
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Individual Therapy</h2>
            <p className="text-gray-600">One-on-one sessions for personal growth and healing.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Trauma & EMDR</h2>
            <p className="text-gray-600">Specialized trauma processing with EMDR techniques.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Couples Therapy</h2>
            <p className="text-gray-600">Healing together in relationships.</p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <a 
            href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium"
          >
            Book Free Consultation
          </a>
        </div>
      </div>
    </div>
  )
}
