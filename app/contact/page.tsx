import { Mail, Phone, MapPin } from 'lucide-react'
import { ContactForm } from './ContactForm'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-oku-cream pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-24">
           <h1 className="text-6xl md:text-8xl font-display font-bold text-oku-dark mb-8">Get in Touch</h1>
           <p className="font-script text-3xl text-oku-purple italic">We're here to hold space for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
           <div className="space-y-12">
              <div className="flex items-start gap-8 bg-white/50 p-8 rounded-[2.5rem] border border-oku-taupe/10">
                 <div className="bg-oku-purple/10 p-4 rounded-xl text-oku-purple"><Mail className="w-8 h-8" /></div>
                 <div>
                    <h3 className="text-xl font-bold text-oku-dark mb-2 uppercase tracking-widest">Email</h3>
                    <p className="text-lg text-oku-taupe">hello@okutherapy.com</p>
                 </div>
              </div>

              <div className="flex items-start gap-8 bg-white/50 p-8 rounded-[2.5rem] border border-oku-taupe/10">
                 <div className="bg-oku-ocean/10 p-4 rounded-xl text-oku-ocean"><Phone className="w-8 h-8" /></div>
                 <div>
                    <h3 className="text-xl font-bold text-oku-dark mb-2 uppercase tracking-widest">WhatsApp</h3>
                    <p className="text-lg text-oku-taupe">+91 99538 79928</p>
                 </div>
              </div>

              <div className="flex items-start gap-8 bg-white/50 p-8 rounded-[2.5rem] border border-oku-taupe/10">
                 <div className="bg-oku-purple/10 p-4 rounded-xl text-oku-purple"><MapPin className="w-8 h-8" /></div>
                 <div>
                    <h3 className="text-xl font-bold text-oku-dark mb-2 uppercase tracking-widest">Location</h3>
                    <p className="text-lg text-oku-taupe">New Delhi, India (Online & In-Person)</p>
                 </div>
              </div>
           </div>

           <div className="bg-oku-page-bg p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-oku-purple/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="text-3xl font-display font-bold text-oku-dark mb-8">Send us a message</h3>
              <ContactForm />
           </div>
        </div>
      </div>
    </div>
  )
}
