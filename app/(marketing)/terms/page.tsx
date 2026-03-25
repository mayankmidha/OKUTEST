import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] py-48 px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl font-display font-bold text-oku-dark mb-12 tracking-tight">Terms of Service</h1>
        <div className="prose prose-oku text-oku-taupe space-y-8 italic text-lg leading-relaxed">
          <p>
            Welcome to Oku Therapy Collective. By using our platform and services, you agree to the following terms.
          </p>
          <p>
            Our services are provided by licensed practitioners. Therapy is a collaborative process, and results depend on your engagement and the relational fit between you and your therapist.
          </p>
          <p>
            Cancellations must be made at least 24 hours in advance to avoid a no-show fee. Payments are processed securely via our integrated partners.
          </p>
          <p>
            Oku is a sanctuary for healing. We expect all members of our collective and our clients to interact with respect, dignity, and cultural humility.
          </p>
        </div>
      </div>
    </div>
  );
}
