'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PeoplePage() {
  const team = [
    {
      name: 'Dr. Suraj Singh',
      title: 'Consultant Psychiatrist',
      specialization: 'Psychiatry & Medication Management',
      avatar: '/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg',
      color: 'bg-oku-purple/20'
    },
    {
      name: 'Tanisha Singh',
      title: 'Clinical Psychologist',
      specialization: 'Psychodynamic Psychotherapy & Trauma',
      avatar: '/uploads/2025/07/Tanisha_-821x1024.jpg',
      color: 'bg-oku-blue/20'
    },
    {
      name: 'Rananjay Singh',
      title: 'Family Therapist',
      specialization: 'Queer Affirmative & Family Therapy',
      avatar: '/uploads/2025/07/Rananjay--579x1024.jpg',
      color: 'bg-oku-green/20'
    },
    {
      name: 'Amna Ansari',
      title: 'Clinical Psychologist',
      specialization: 'Anxiety, OCD & Clinical Psychology',
      avatar: '/uploads/2025/07/Amna-670x1024.jpg',
      color: 'bg-oku-pink/20'
    },
    {
      name: 'Mohit Dudeja',
      title: 'Queer Affirmative Therapist',
      specialization: 'Grief & Individual Therapy',
      avatar: '/uploads/2025/07/Mohit-911x1024.jpg',
      color: 'bg-oku-sage/20'
    },
    {
      name: 'Gursheel Kaur',
      title: 'Psychodynamic Psychotherapist',
      specialization: 'Relational Therapy & Self-Esteem',
      avatar: '/uploads/2025/07/gursheel_pfp-1024x980.jpg',
      color: 'bg-oku-peach/20'
    }
  ];

  return (
    <div className="bg-oku-page-bg min-h-screen pt-48 pb-32">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mb-32"
        >
          <span className="inline-block px-6 py-2 mb-10 text-[11px] font-medium tracking-[0.4em] uppercase text-oku-taupe bg-white/50 backdrop-blur-md border border-oku-taupe/10 rounded-full">
            Our People
          </span>
          <h1 className="text-6xl md:text-8xl font-display text-oku-dark leading-[0.9] tracking-tight mb-12">
            Meet the <br />
            <span className="italic text-oku-taupe">collective.</span>
          </h1>
          <p className="text-xl md:text-3xl text-oku-taupe font-display italic leading-relaxed max-w-2xl">
            A diverse group of clinicians, thinkers, and healers committed to your growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 mb-48">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className={`aspect-[4/5] ${member.color} rounded-[3rem] mb-10 relative overflow-hidden shadow-2xl shadow-oku-taupe/5 group-hover:shadow-oku-taupe/10 transition-all duration-700`}>
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-oku-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <h3 className="text-3xl font-display text-oku-dark mb-2 tracking-tight">{member.name}</h3>
              <p className="text-oku-taupe font-medium text-[10px] tracking-[0.3em] uppercase mb-6">{member.title}</p>
              <p className="text-oku-taupe text-lg leading-relaxed font-light italic">
                {member.specialization}
              </p>
              <div className="mt-8 w-8 h-px bg-oku-taupe/20 group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-24 border-t border-oku-taupe/10"
        >
          <h2 className="text-4xl md:text-5xl font-display text-oku-dark mb-12 leading-tight">Want to join our collective?</h2>
          <button className="px-12 py-6 border border-oku-taupe/20 text-oku-dark rounded-full text-sm font-medium tracking-[0.2em] uppercase hover:bg-white transition-all duration-500 hover:border-oku-dark">
            Work with us
          </button>
        </motion.div>
      </div>
    </div>
  );
}
