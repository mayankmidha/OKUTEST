import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] py-48 px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl font-display font-bold text-oku-dark mb-12 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-oku text-oku-taupe space-y-8 italic text-lg leading-relaxed">
          <p>
            At Oku Therapy, your privacy is foundational to the therapeutic process. We are committed to protecting your personal information and clinical data with the highest standards of care.
          </p>
          <p>
            We collect information only necessary to provide you with inclusive, trauma-informed care. This includes your contact details, clinical intake forms, and session records. All data is encrypted and stored in HIPAA-ready infrastructure.
          </p>
          <p>
            We do not share your data with third parties for marketing or any other non-clinical purposes. Your record is accessible only by you and your designated practitioner.
          </p>
          <p>
            For any questions regarding your data, please contact us at support@okutherapy.com.
          </p>
        </div>
      </div>
    </div>
  );
}
