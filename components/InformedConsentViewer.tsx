'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Info } from 'lucide-react'

export function InformedConsentViewer() {
  return (
    <div className="bg-white/50 border border-oku-taupe/10 rounded-[2.5rem] overflow-hidden">
      <div className="bg-oku-dark text-white p-6 flex items-center gap-3">
        <ShieldCheck size={20} className="text-oku-purple" />
        <span className="text-[10px] font-black uppercase tracking-widest">Official Informed Consent Document</span>
      </div>
      
      <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar text-sm leading-relaxed text-oku-taupe space-y-6">
        <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-oku-dark tracking-tight">Oku Therapy</h2>
            <p className="text-[10px] uppercase tracking-widest font-black text-oku-purple mt-1">(Psychotherapeutic & Psychiatric Clinic)</p>
            <h3 className="text-xl font-display font-bold text-oku-dark mt-4">Informed Consent Form</h3>
        </div>

        <p className="font-medium text-oku-dark italic">
            Oku Therapy is honoured to take this journey of mental health support with you (“Client”). Our
            team of Psychologists will work collaboratively with the client to help set and achieve the
            client’s goals if set, while facilitating personal growth/exploration/support through the
            therapeutic process.
        </p>

        <section className="space-y-3">
            <h4 className="font-bold text-oku-dark uppercase tracking-widest text-[11px]">Benefits and Risks</h4>
            <p>
                Counselling/psychotherapy presents both benefits and risks. The benefits include, and are not
                limited to, better communication and relationships, solutions to specific problems, increased
                sense of well-being, and an increase of positive thoughts and feelings. Counselling can
                sometimes bring up uncomfortable feelings and difficult memories. Sometimes people feel worse
                before they begin to feel better, which may show up as resistance.
            </p>
        </section>

        <section className="space-y-3">
            <h4 className="font-bold text-oku-dark uppercase tracking-widest text-[11px]">Confidentiality</h4>
            <p>
                Any information about the client or sessions is held with utmost confidentiality and can only be
                released by either the client’s written and signed consent or by court order. Should it be needed,
                the Psychologist may also share information about the client (with permission), audio recordings
                of session and clinical file with a consulting Supervisor who is qualified and experienced.
            </p>
            <div className="bg-oku-purple/5 p-4 rounded-2xl border border-oku-purple/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-oku-purple mb-2">Confidentiality Limitations</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>When the client may be a danger to self or others.</li>
                    <li>When there is suspicion or disclosure of child abuse or neglect.</li>
                    <li>When records are subpoenaed by court order.</li>
                    <li>When the client gives permission to consult with other individuals.</li>
                </ol>
            </div>
        </section>

        <section className="space-y-3">
            <h4 className="font-bold text-oku-dark uppercase tracking-widest text-[11px]">No Secrets Policy (Relationship Therapy)</h4>
            <p>
                As a Clinical or Counselling Psychologist who is entrusted with information from all members in
                a relationship when seeing them together or separately, the Psychologist has a Policy of “No
                Secrets”, which means that the Psychologist cannot promise to protect secrets of either member,
                especially if the secret is harmful or destructive to the process of the therapy itself.
            </p>
        </section>

        <section className="space-y-3">
            <h4 className="font-bold text-oku-dark uppercase tracking-widest text-[11px]">Social Media & Communication</h4>
            <p>
                The Client is discouraged from personally contacting the Psychologist on any social media
                channels. All communications via the internet should be limited to scheduling appointments.
                Regardless of the Client’s location, the client understands that the Psychologist is domiciled in
                India and that the counselling service provided falls under the laws and jurisdiction of India.
            </p>
        </section>

        <section className="space-y-3">
            <h4 className="font-bold text-oku-dark uppercase tracking-widest text-[11px]">Cancellation Policy</h4>
            <p>
                If the client is unable to attend a session, it is the client’s responsibility to inform the Psychologist 
                atleast 24 hours in advance. A cancellation fee up to the amount due for the session may be charged in 
                case of a no show or late cancellation (less than 24 hours). For offline sessions, 100% of the fee is charged 
                for a no show.
            </p>
        </section>

        <div className="pt-6 border-t border-oku-taupe/10">
            <p className="text-xs italic text-oku-taupe">
                By completing the digital signature below, you certify that you have read, understood, and agreed to the terms 
                outlined in this Oku Therapy Informed Consent Form.
            </p>
        </div>
      </div>
    </div>
  )
}
