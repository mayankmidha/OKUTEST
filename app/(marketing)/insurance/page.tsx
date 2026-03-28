import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Shield, BarChart3, Users, Zap, CheckCircle2, Globe, HeartPulse, Building2 } from "lucide-react"

export default async function InsuranceEcosystemPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* ── Aesthetic Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Breathing Cloud Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/40 rounded-full blur-[100px] animate-pulse delay-700" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8">
              <Globe size={12} /> The Future of Indian Mental Healthcare
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight text-slate-900 mb-8 leading-[1.05]">
              The Mental Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Infrastructure</span> for Modern Insurance.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl">
              OKU Therapy provides the clinical intelligence, secure telehealth, and outcome-tracking required to integrate mental health into mainstream Indian insurance policies.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10">
                Partner with OKU
              </button>
              <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-sm hover:bg-slate-50 transition-all">
                View Clinical Standards
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem/Solution Matrix ── */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-4xl font-display font-bold mb-6">Bridging the Gap in Indian Healthcare</h2>
                <p className="text-lg text-slate-600 mb-8">
                    Despite the rising demand, mental health remains an "out-of-pocket" expense in India. Carriers lack the data-verified clinical networks to underwrite these risks. 
                </p>
                <div className="space-y-6">
                    {[
                        { title: "Standardized Clinical Coding", desc: "ICD-10 compliant transcriptions and SOAP notes for transparent claims." },
                        { title: "Real-time Risk Analytics", desc: "AI-driven sentiment and risk detection to prevent acute escalations." },
                        { title: "Direct Claim Integration", desc: "Automated superbills and digital claim filing for policyholders." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <CheckCircle2 size={14} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative">
                <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-blue-100 to-indigo-100 border border-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 p-12 flex flex-col justify-end">
                        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white">
                            <HeartPulse className="text-blue-600 mb-4" size={32} />
                            <h3 className="text-2xl font-bold mb-2">Outcome-Based Reimbursement</h3>
                            <p className="text-sm text-slate-600">Our platform tracks clinical improvement markers, enabling carriers to pay for results, not just hours.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ecosystem Features ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Enterprise-Grade Infrastructure</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Scalable technology built for the largest insurance networks and corporate health plans.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield />, title: "HIPAA & GDPR Ready", desc: "End-to-end encryption for all patient-practitioner communication and clinical data storage." },
              { icon: <BarChart3 />, title: "Actuarial Data Feed", desc: "Anonymized, high-level wellness trends to help carriers adjust policy terms and pricing." },
              { icon: <Building2 />, title: "B2B Admin Dashboard", desc: "Manage thousands of employee/policyholder seats with one centralized interface." },
              { icon: <Users />, title: "Vetted Provider Network", desc: "Access to India's top RCI-licensed and queer-affirmative clinical psychologists." },
              { icon: <Zap />, title: "API-First Integration", desc: "Seamlessly plug OKU's booking and telehealth into your existing mobile app or portal." },
              { icon: <CheckCircle2 />, title: "Fraud Prevention", desc: "Verified session logs and digital signatures to eliminate ghost-claims and over-billing." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[4rem] bg-slate-900 p-16 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to pioneer the<br />Mental Health Ecosystem?</h2>
                <p className="text-slate-400 mb-10 text-lg">Join us in building the infrastructure for a healthier India.</p>
                <div className="flex justify-center gap-4">
                    <button className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold shadow-2xl shadow-blue-600/40 hover:scale-105 transition-transform">
                        Schedule an Integration Demo
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-xl font-display font-bold">OKU<span className="text-blue-600">.</span></div>
            <div className="flex gap-8 text-sm text-slate-500">
                <Link href="/terms" className="hover:text-slate-900">Terms</Link>
                <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
                <Link href="/contact" className="hover:text-slate-900">Contact</Link>
            </div>
            <p className="text-xs text-slate-400">© 2026 OKU Therapy Integrated Ecosystem. Clinical Standards Certified.</p>
        </div>
      </footer>
    </div>
  )
}
