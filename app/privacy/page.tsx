export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-oku-cream py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
         <div className="mb-24 text-center">
            <h1 className="text-6xl md:text-8xl font-display font-bold text-oku-dark mb-8">Privacy Policy</h1>
            <p className="font-script text-3xl text-oku-purple italic">Your safety and confidentiality are our highest priorities.</p>
         </div>

         <div className="prose prose-lg max-w-none text-oku-taupe space-y-12">
            <section className="bg-oku-page-bg p-12 rounded-card border border-oku-taupe/10">
               <h2 className="text-3xl font-display font-bold text-oku-dark mb-6 tracking-tight">1. Confidentiality</h2>
               <p className="leading-relaxed">
                  Everything shared within OKU Therapy is protected by professional confidentiality standards. 
                  We utilize HIPAA-compliant technology to ensure your data and sessions are secure.
               </p>
            </section>

            <section className="p-12">
               <h2 className="text-3xl font-display font-bold text-oku-dark mb-6 tracking-tight">2. Data Protection</h2>
               <p className="leading-relaxed">
                  We use industry-standard encryption for all data storage. Your personal information, medical history, 
                  and session notes are stored on secured servers with limited access.
               </p>
            </section>

            <section className="bg-oku-purple/5 p-12 rounded-card border border-oku-purple/10">
               <h2 className="text-3xl font-display font-bold text-oku-dark mb-6 tracking-tight">3. Third-Party Integrations</h2>
               <p className="leading-relaxed">
                  We integrate with Stripe and Razorpay for secure payment processing. We do not store your 
                  full credit card information on our servers; it is handled securely by our payment processors.
               </p>
            </section>

            <section className="p-12">
               <h2 className="text-3xl font-display font-bold text-oku-dark mb-6 tracking-tight">4. Your Rights</h2>
               <p className="leading-relaxed">
                  You have the right to request access to your data, correction of any inaccuracies, and in certain 
                  circumstances, the deletion of your personal information from our active systems.
               </p>
            </section>
         </div>
         
         <div className="mt-24 pt-12 border-t border-oku-taupe/20 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe">Last updated: March 21, 2026</p>
         </div>
      </div>
    </div>
  )
}
