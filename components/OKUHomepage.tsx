"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface Service {
  number: string;
  title: string;
  description: string;
  features: { icon: string; label: string; desc: string }[];
}

interface PhilosophyBlock {
  title: string;
  body: string[];
  image: string;
  imageAlt: string;
}

interface ForYouCard {
  icon: string;
  heading: string;
  subtext: string;
}

interface HowItWorksStep {
  title: string;
  desc: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CYCLING_WORDS = ["grief", "anxiety", "loneliness", "confusion", "grief, loss, all of it"];

const FEATURES = [
  { icon: "/uploads/2025/06/Frame-23-2.png", label: "Slow Healing", desc: "We move at the pace your story asks for—never rushed." },
  { icon: "/uploads/2025/06/Frame-23.png", label: "Depth Work", desc: "We meet what's beneath, not just what's visible." },
  { icon: "/uploads/2025/06/Frame-23-3.png", label: "Whole Self", desc: "Your culture, identity, body—all of you is held here." },
  { icon: "/uploads/2025/06/Frame-23-1.png", label: "Welcoming Space", desc: "A calm, non-clinical space designed for ease and safety." },
];

const TEAM: TeamMember[] = [
  { name: "Dr. Suraj Singh", role: "Consultant Psychiatrist", image: "/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-600x600.jpg" },
  { name: "Tanisha Singh", role: "Clinical Psychologist (A.) & Psychodynamic Psychotherapist", image: "/uploads/2025/07/Tanisha_-768x958.jpg" },
  { name: "Rananjay Singh", role: "Queer Affirmative & Family Therapist", image: "/uploads/2025/07/Rananjay--579x1024.jpg" },
  { name: "Amna Ansari", role: "Clinical Psychologist (A.)", image: "/uploads/2025/07/Amna-670x1024.jpg" },
  { name: "Mohit Dudeja", role: "Queer Affirmative Therapist", image: "/uploads/2025/07/Mohit-911x1024.jpg" },
  { name: "Gursheel Kaur", role: "Psychodynamic Psychotherapist", image: "/uploads/2025/07/gursheel_pfp-1024x980.jpg" },
];

const SERVICES: Service[] = [
  {
    number: "1",
    title: "Individual Therapy",
    description: "One-on-one sessions to explore your thoughts, patterns, and inner world—held with compassion, curiosity, and care.",
    features: [
      { icon: "🌿", label: "Depth-Oriented", desc: "Explore your emotions beyond surface symptoms." },
      { icon: "🌱", label: "Trauma-Informed", desc: "Your pace and safety come first—always." },
      { icon: "🏳️‍🌈", label: "Queer-Affirmative", desc: "Therapy that welcomes your identity without explanation." },
      { icon: "🧩", label: "Culturally Sensitive", desc: "Your context, language, and story matter." },
    ],
  },
  {
    number: "2",
    title: "Trauma & EMDR",
    description: "Support for processing trauma—using EMDR and safe practices to help your body and mind rest.",
    features: [
      { icon: "👁", label: "EMDR Therapy", desc: "Evidence-based processing for traumatic memory." },
      { icon: "🫁", label: "Somatic Awareness", desc: "Connecting body signals to healing work." },
      { icon: "🛡", label: "Paced & Safe", desc: "No pressure to move faster than you're ready." },
      { icon: "🧠", label: "Nervous System-Led", desc: "Working with your body's natural rhythms." },
    ],
  },
  {
    number: "3",
    title: "Movement Therapy",
    description: "When words feel distant, movement speaks. This practice uses breath and flow to reconnect with you.",
    features: [
      { icon: "🌬", label: "Breath & Body-Led", desc: "Follow your body's pace and rhythm—nothing is forced." },
      { icon: "🌀", label: "Somatic Integration", desc: "Gently process stored emotions through movement." },
      { icon: "🌊", label: "Expressive & Safe", desc: "Move without judgment. No performance, no right way." },
      { icon: "🤝", label: "Accessible to All", desc: "No experience needed—just curiosity and presence." },
    ],
  },
];

const PHILOSOPHY: PhilosophyBlock[] = [
  {
    title: "From Fixing to Listening",
    body: [
      "In many traditional spaces, therapy begins with a problem to solve and a diagnosis to name. You're often seen as something to treat.",
      "At Oku, we start by listening—not labeling. We sit beside your story, not above it.",
    ],
    image: "/uploads/2025/06/Group.png",
    imageAlt: "Illustration representing listening",
  },
  {
    title: "From Clinical to Relational",
    body: [
      "You won't find harsh lighting or stiff furniture here. Our space is designed to feel like somewhere you can exhale.",
      "We believe healing happens in relationship, not in procedure. The room matters as much as the therapist.",
    ],
    image: "/uploads/2025/06/x31_.png",
    imageAlt: "Warm relational space",
  },
  {
    title: "From Plans to Process",
    body: [
      "Therapy isn't a checklist or 5-step solution. Real change doesn't fit into fixed frameworks.",
      "We allow things to unfold—slowly, organically. At Oku, therapy adapts as you do.",
    ],
    image: "/uploads/2025/06/Vector.png",
    imageAlt: "Process over plan",
  },
  {
    title: "From Inclusive to Affirming",
    body: [
      "You shouldn't have to educate your therapist about your identity. Safety isn't created by neutrality—it's created by awareness.",
      "We're queer-affirmative, caste-aware, body-literate. Not just inclusive in words, but in every layer of our work.",
    ],
    image: "/uploads/2025/06/Frame-108.png",
    imageAlt: "Affirming and inclusive",
  },
];

const FOR_YOU: ForYouCard[] = [
  { icon: "/uploads/2025/06/Frame-142.png", heading: "If you've felt like too much", subtext: "Or maybe not enough. This space holds both." },
  { icon: "/uploads/2025/06/heart.png", heading: "If your body remembers pain", subtext: "You can't quite name. This space speaks that language." },
  { icon: "/uploads/2025/06/Frame-135.png", heading: "If you've never seen yourself reflected", subtext: "In therapy rooms before. This space makes room for you." },
  { icon: "/uploads/2025/06/Frame-138.png", heading: "If you carry generational weight", subtext: "In blood, silence, or tradition. This space lets them breathe." },
  { icon: "/uploads/2025/06/Frame-137.png", heading: "If your queerness has been questioned", subtext: "Or erased in 'neutral' spaces. This space sees all of you." },
  { icon: "/uploads/2025/06/Frame-136.png", heading: "If you've lived between cultures", subtext: "And belonged to all, and none. This space honors the in-between." },
  { icon: "/uploads/2025/06/Frame-139.png", heading: "If your healing doesn't feel linear", subtext: "Or easy to explain. This space meets you where you are." },
  { icon: "/uploads/2025/06/leaf.png", heading: "If you're new to therapy", subtext: "And unsure what to expect. This space starts with ease." },
  { icon: "/uploads/2025/06/Frame-141.png", heading: "If you want more than coping tools", subtext: "More than surface advice. This space invites depth." },
];

const HOW_IT_WORKS: HowItWorksStep[] = [
  { title: "Reach Out", desc: "You can start with a free consult or send us a note—whatever feels most comfortable." },
  { title: "We Listen First", desc: "We'll understand what you're carrying and what kind of support might feel right, before deciding anything." },
  { title: "Begin Together", desc: "You'll meet your therapist and begin at a pace that works for you. No pressure, no fixed path." },
  { title: "Keep Unfolding", desc: "Healing isn't linear—we'll adjust, stay present, and move with you as things evolve." },
];

const COMMUNITY_IMAGES = [
  "/uploads/2025/06/Group-27.png",
  "/uploads/2025/06/Group-28.png",
  "/uploads/2025/06/img.png",
  "/uploads/2025/06/Group-29.png",
  "/uploads/2025/06/img-1.png",
  "/uploads/2025/07/WApp.png",
  "/uploads/2025/06/img-2.png",
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function DynamicButton({ href, children, dark = true, isInternal = false }: { href: string; children: React.ReactNode; dark?: boolean; isInternal?: boolean }) {
  if (isInternal) {
    return (
      <Link
        href={href}
        className={`dynamic-btn ${dark ? "dark" : "light"}`}
      >
        <span className="dynamic-btn-text">{children}</span>
        <span className="dynamic-btn-chevron">›</span>
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`dynamic-btn ${dark ? "dark" : "light"}`}
    >
      <span className="dynamic-btn-text">{children}</span>
      <span className="dynamic-btn-chevron">›</span>
    </a>
  );
}

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OkuHomepage() {
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % CYCLING_WORDS.length);
        setWordVisible(true);
      }, 400);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        :root {
          --ink: #2D2D2D;
          --cream: #F7F4EF;
          --warm: #EDE8E0;
          --accent: #8B7355;
          --sage: #7C8C74;
          --blush: #C4A882;
          --text-sm: 0.875rem;
          --text-base: 1rem;
          --text-lg: 1.125rem;
          --text-xl: 1.25rem;
        }

        .oku-page-public {
          background: var(--cream);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── Typography ── */
        .heading-display {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .heading-display b, .heading-display strong {
          font-weight: 500;
          font-style: italic;
        }
        .cursive-word {
          font-family: 'Nothing You Could Do', cursive;
          font-weight: 400;
          font-size: 1em;
          display: inline-block;
          transition: opacity 0.4s ease, transform 0.4s ease;
          color: var(--accent);
        }
        .cursive-word.hidden { opacity: 0; transform: translateY(8px); }
        .cursive-word.visible { opacity: 1; transform: translateY(0); }

        /* ── Dynamic Button ── */
        .dynamic-btn {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 10px 36px;
          border-radius: 1000px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: padding 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .dynamic-btn.dark {
          background: var(--ink);
          color: #fff;
          border: 1px solid var(--ink);
        }
        .dynamic-btn.light {
          background: transparent;
          color: var(--ink);
          border: 1px solid var(--ink);
        }
        .dynamic-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--ink);
          border-radius: 1000px;
          transform: scale(1);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }
        .dynamic-btn.light::before { background: var(--ink); transform: scale(0); }
        .dynamic-btn-text { position: relative; z-index: 1; }
        .dynamic-btn-chevron {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%) scale(0);
          opacity: 0;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }
        .dynamic-btn:hover { padding-right: 56px; }
        .dynamic-btn.dark:hover { color: #fff; }
        .dynamic-btn.light:hover { color: #fff; }
        .dynamic-btn.light:hover::before { transform: scale(1); }
        .dynamic-btn:hover .dynamic-btn-chevron { transform: translateY(-50%) scale(1); opacity: 1; }

        /* ── Divider ── */
        .wave-divider {
          width: 100%;
          max-width: 820px;
          opacity: 0.5;
        }

        /* ── Section Spacing ── */
        .section { padding: 80px 24px; }
        .section-lg { padding: 100px 24px; }
        @media (min-width: 768px) { .section { padding: 100px 48px; } .section-lg { padding: 140px 48px; } }
        @media (min-width: 1024px) { .section { padding: 120px 80px; } .section-lg { padding: 160px 80px; } }

        .max-w { max-width: 1200px; margin: 0 auto; }
        .max-w-text { max-width: 680px; }

        /* ── Horizontal scroll for features ── */
        .scroll-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 8px;
        }
        .scroll-track::-webkit-scrollbar { display: none; }
        .scroll-track > * { flex-shrink: 0; }

        /* ── Tag chip ── */
        .chip {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 1000px;
          border: 1px solid var(--blush);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Team card ── */
        .team-card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          background: var(--warm);
        }
        .team-card img {
          width: 100%; aspect-ratio: 3/4; object-fit: cover;
          object-position: top center;
          transition: transform 0.6s ease;
          display: block;
        }
        .team-card:hover img { transform: scale(1.04); }
        .team-card-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 32px 20px 20px;
          background: linear-gradient(to top, rgba(45,45,45,0.9) 0%, transparent 100%);
          color: white;
        }
        .team-card-overlay h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 400;
          margin-bottom: 4px;
        }
        .team-card-overlay p { font-size: 0.78rem; opacity: 0.8; line-height: 1.4; }

        /* ── Service card ── */
        .service-block {
          border-top: 1px solid rgba(45,45,45,0.12);
          padding: 48px 0;
        }
        .service-feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }
        @media (min-width: 640px) {
          .service-feature-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }
        .service-feature {
          padding: 20px 16px;
          background: var(--warm);
          border-radius: 12px;
        }

        /* ── Philosophy row ── */
        .philosophy-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
          padding: 48px 0;
          border-top: 1px solid rgba(45,45,45,0.1);
        }
        @media (min-width: 768px) {
          .philosophy-row { grid-template-columns: 1fr 1fr; gap: 64px; }
          .philosophy-row.reverse { direction: rtl; }
          .philosophy-row.reverse > * { direction: ltr; }
        }
        .philosophy-img { border-radius: 16px; background: var(--warm); padding: 24px; display: flex; align-items: center; justify-content: center; }
        .philosophy-img img { max-width: 100%; height: auto; max-height: 280px; object-fit: contain; }

        /* ── For you grid ── */
        .for-you-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) { .for-you-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .for-you-grid { grid-template-columns: 1fr 1fr 1fr; } }
        .for-you-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          border-radius: 12px;
          background: var(--warm);
          transition: background 0.3s ease;
        }
        .for-you-card:hover { background: #e8e2d8; }
        .for-you-card img { width: 44px; height: 44px; flex-shrink: 0; object-fit: contain; }

        /* ── Community grid ── */
        .community-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px) { .community-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .community-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
        .community-img-wrap {
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 4/5;
          background: var(--warm);
        }
        .community-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .community-img-wrap:hover img { transform: scale(1.05); }

        /* ── How it works steps ── */
        .steps-list { display: flex; flex-direction: column; gap: 0; }
        .step-row {
          display: flex;
          gap: 24px;
          padding: 32px 0;
          border-bottom: 1px solid rgba(45,45,45,0.1);
          align-items: flex-start;
        }
        .step-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-weight: 300;
          color: var(--blush);
          line-height: 1;
          flex-shrink: 0;
          width: 44px;
          text-align: right;
          padding-top: 4px;
        }

        /* ── Hero ── */
        .hero-word-wrap {
          min-width: 260px;
          display: inline-block;
        }
        @media (max-width: 768px) { .hero-word-wrap { min-width: 180px; } }

        /* ── Assessment CTA bar ── */
        .assessment-bar {
          background: var(--ink);
          color: var(--cream);
          border-radius: 20px;
          padding: 48px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: flex-start;
        }
        @media (min-width: 768px) {
          .assessment-bar {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 56px 64px;
          }
        }
        .assessment-bar .dynamic-btn.light {
          border-color: rgba(247,244,239,0.5);
          color: var(--cream);
        }
        .assessment-bar .dynamic-btn.light::before { background: rgba(247,244,239,0.15); transform: scale(0); }
        .assessment-bar .dynamic-btn.light:hover::before { transform: scale(1); }
        .assessment-bar .dynamic-btn.light:hover { color: var(--cream); }
      `}</style>

      <div className="oku-page-public">

        {/* ── Hero ── */}
        <section className="section-lg" style={{ background: "var(--cream)" }}>
          <div className="max-w">
            <SectionReveal>
              <span className="chip" style={{ marginBottom: 28, display: "inline-block" }}>Psychotherapy Collective · New Delhi</span>
              <h1 className="heading-display" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", marginBottom: 0 }}>
                Come as you are.
              </h1>
              <h1 className="heading-display" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", marginBottom: 0 }}>
                We hold space for your
              </h1>
              <h1 className="heading-display" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", marginBottom: 48 }}>
                <span className="hero-word-wrap">
                  <span className={`cursive-word ${wordVisible ? "visible" : "hidden"}`}>
                    {CYCLING_WORDS[wordIdx]}
                  </span>
                </span>
              </h1>
              <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", maxWidth: 560, lineHeight: 1.7, marginBottom: 40, color: "rgba(45,45,45,0.75)" }}>
                Oku is a psychotherapy collective offering <strong>inclusive, trauma-informed care</strong> for all parts of who you are. Book a free consultation to begin gently.
              </p>
              <DynamicButton href="/auth/signup" isInternal={true}>Book a free 1:1 consultation</DynamicButton>
            </SectionReveal>
          </div>
        </section>

        {/* ── Features ticker ── */}
        <section style={{ background: "var(--warm)", padding: "60px 0" }}>
          <div style={{ padding: "0 24px 0 24px" }} className="max-w">
            <SectionReveal>
              <div style={{ marginBottom: 32 }}>
                <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                  A place to <em>explore,</em>
                </h2>
                <h3 className="heading-display" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "var(--accent)", fontStyle: "italic" }}>
                  not perform.
                </h3>
              </div>
              <p style={{ maxWidth: 560, color: "rgba(45,45,45,0.7)", marginBottom: 40, lineHeight: 1.7 }}>
                Oku was created as a gentle refuge for those <strong>who feel unseen</strong> in traditional therapy spaces. Whether you're unpacking generational pain, navigating identity, or simply seeking to <strong>reconnect with yourself</strong>, we invite you to explore—<strong>without pressure or performance.</strong>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {FEATURES.map((f) => (
                  <div key={f.label} style={{ padding: "24px 20px", background: "var(--cream)", borderRadius: 14 }}>
                    <img src={f.icon} alt={f.label} style={{ width: 48, height: 48, marginBottom: 12, objectFit: "contain" }} />
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 400, marginBottom: 6 }}>{f.label}</h4>
                    <p style={{ fontSize: "0.85rem", color: "rgba(45,45,45,0.65)", lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* ── Qualified & Ethical ── */}
        <section className="section" style={{ background: "var(--cream)" }}>
          <div className="max-w">
            <SectionReveal>
              <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>Our Practice</span>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", marginBottom: 8 }}>
                We provide care that's<br /><strong>qualified and</strong>
              </h2>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--accent)", fontStyle: "italic", marginBottom: 32 }}>
                ethical
              </h2>
              <img
                src="/uploads/2025/06/Vector-1.png"
                alt=""
                className="wave-divider"
                style={{ marginBottom: 32 }}
              />
              <p style={{ maxWidth: 640, lineHeight: 1.8, color: "rgba(45,45,45,0.75)", fontSize: "1.05rem" }}>
                Every therapist at Oku is professionally trained and qualified including RCI Licensed Clinical Psychologists, psychodynamic therapists, queer affirmative therapists.
              </p>
              <p style={{ maxWidth: 640, lineHeight: 1.8, color: "rgba(45,45,45,0.75)", fontSize: "1.05rem", marginTop: 16 }}>
                We combine clinical precision with cultural humility, ensuring your mental health is in grounded, ethical hands.
              </p>
            </SectionReveal>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="section" id="team" style={{ background: "var(--warm)" }}>
          <div className="max-w">
            <SectionReveal>
              <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>The Team</span>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Not just <strong>therapists,</strong></h2>
              <h3 className="heading-display" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", color: "var(--accent)", fontStyle: "italic", marginBottom: 16 }}>people first</h3>
              <p style={{ maxWidth: 520, color: "rgba(45,45,45,0.65)", marginBottom: 56, lineHeight: 1.7 }}>
                Meet our team of <strong>licensed therapists, facilitators, psychologists and listeners</strong>—bringing care, context, and presence into every session.
              </p>
            </SectionReveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {TEAM.map((member, i) => (
                <SectionReveal key={member.name}>
                  <div className="team-card" style={{ animationDelay: `${i * 80}ms` }}>
                    <img src={member.image} alt={member.name} loading="lazy" />
                    <div className="team-card-overlay">
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
                <DynamicButton href="/people" isInternal={true} dark={false}>View Detailed Profiles</DynamicButton>
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section className="section" id="services" style={{ background: "var(--cream)" }}>
          <div className="max-w">
            <SectionReveal>
              <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>What We Offer</span>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}><strong>Different ways</strong> to begin</h2>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--accent)", fontStyle: "italic", marginBottom: 16 }}>healing</h2>
              <p style={{ maxWidth: 520, color: "rgba(45,45,45,0.65)", marginBottom: 56, lineHeight: 1.7 }}>
                Because healing <strong>isn't one-size-fits-all</strong>—and it doesn't have to start with words.
              </p>
            </SectionReveal>
            {SERVICES.map((svc) => (
              <SectionReveal key={svc.title}>
                <div className="service-block">
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.5rem", fontWeight: 300, color: "var(--blush)", lineHeight: 1 }}>{svc.number}</span>
                    <h3 className="heading-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>{svc.title}</h3>
                  </div>
                  <p style={{ maxWidth: 560, color: "rgba(45,45,45,0.7)", marginBottom: 8, lineHeight: 1.7 }}>{svc.description}</p>
                  <div className="service-feature-grid">
                    {svc.features.map((f) => (
                      <div key={f.label} className="service-feature">
                        <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{f.icon}</div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: 4 }}>{f.label}</h4>
                        <p style={{ fontSize: "0.8rem", color: "rgba(45,45,45,0.6)", lineHeight: 1.5 }}>{f.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <DynamicButton href="/auth/signup" isInternal={true}>Book a free 1:1 consultation</DynamicButton>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </section>

        {/* ── Philosophy ── */}
        <section className="section" id="about" style={{ background: "var(--warm)" }}>
          <div className="max-w">
            <SectionReveal>
              <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>Our Philosophy</span>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Oku is<br /><strong>not your usual</strong></h2>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--accent)", fontStyle: "italic", marginBottom: 16 }}>therapy.</h2>
              <p style={{ maxWidth: 600, color: "rgba(45,45,45,0.7)", lineHeight: 1.8, marginBottom: 16 }}>
                <strong>We don't wear lab coats or hand you a fixed plan.</strong> Instead, we offer a slower, more spacious kind of care—relational, body-aware, and rooted in who you are.
              </p>
              <p style={{ maxWidth: 600, color: "rgba(45,45,45,0.7)", lineHeight: 1.8, marginBottom: 60 }}>
                Our sessions <strong>feel less like a prescription</strong> and more like a <strong>conversation that unfolds.</strong>
              </p>
            </SectionReveal>
            {PHILOSOPHY.map((block, i) => (
              <SectionReveal key={block.title}>
                <div className={`philosophy-row ${i % 2 !== 0 ? "reverse" : ""}`}>
                  <div>
                    <h3 className="heading-display" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", marginBottom: 20 }}>{block.title}</h3>
                    {block.body.map((p, j) => (
                      <p key={j} style={{ color: "rgba(45,45,45,0.7)", lineHeight: 1.8, marginBottom: 12 }}>{p}</p>
                    ))}
                  </div>
                  <div className="philosophy-img">
                    <img src={block.image} alt={block.imageAlt} loading="lazy" />
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </section>

        {/* ── For You ── */}
        <section className="section-lg" style={{ background: "var(--cream)" }}>
          <div className="max-w">
            <SectionReveal>
              <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>This Space</span>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}><strong>This space</strong> is </h2>
              <h3 className="heading-display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "var(--accent)", fontStyle: "italic", marginBottom: 56 }}>for you</h3>
            </SectionReveal>
            <div className="for-you-grid">
              {FOR_YOU.map((card) => (
                <SectionReveal key={card.heading}>
                  <div className="for-you-card">
                    <img src={card.icon} alt="" loading="lazy" />
                    <div>
                      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 400, marginBottom: 4 }}>{card.heading}</h4>
                      <p style={{ fontSize: "0.83rem", color: "rgba(45,45,45,0.6)", lineHeight: 1.5 }}>{card.subtext}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Community ── */}
        <section className="section" id="community" style={{ background: "var(--warm)" }}>
          <div className="max-w">
            <SectionReveal>
              <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>Community</span>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Join our<br /><strong>slow and soft</strong></h2>
              <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--accent)", fontStyle: "italic", marginBottom: 16 }}>community.</h2>
              <p style={{ maxWidth: 560, color: "rgba(45,45,45,0.65)", marginBottom: 40, lineHeight: 1.7 }}>
                <strong>We don't wear lab coats or hand you a fixed plan.</strong> Instead, we offer a slower, more spacious kind of care—relational, body-aware, and rooted in who you are.
              </p>
              <div style={{ marginBottom: 48 }}>
                <a
                  href="https://www.youtube.com/watch?v=ZbT0NsovMRU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.9rem", opacity: 1, color: "var(--accent)", fontWeight: 500 }}
                >
                  <span style={{ fontSize: "1.2rem" }}>▶</span> Watch our story on YouTube
                </a>
              </div>
            </SectionReveal>
            <div className="community-grid">
              {COMMUNITY_IMAGES.map((src, i) => (
                <SectionReveal key={i}>
                  <div className="community-img-wrap">
                    <img src={src} alt={`Oku community moment ${i + 1}`} loading="lazy" />
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="section" style={{ background: "var(--cream)" }}>
          <div className="max-w">
            <SectionReveal>
              <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>How It Works</span>
              <h2 className="heading-display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontStyle: "italic", marginBottom: 8 }}>
                "It's okay to take your time."
              </h2>
              <p style={{ maxWidth: 600, color: "rgba(45,45,45,0.7)", marginBottom: 16, lineHeight: 1.8 }}>
                Every journey with us begins with listening—before advice, before direction. Whether you're reaching out with clarity or just a quiet "maybe," we meet you where you are.
              </p>
              <p style={{ maxWidth: 600, color: "rgba(45,45,45,0.7)", marginBottom: 60, lineHeight: 1.8 }}>
                There's no pressure to know exactly what you need. We move slowly, together, so safety and trust can unfold at your pace.
              </p>
            </SectionReveal>
            <div className="steps-list">
              {HOW_IT_WORKS.map((step, i) => (
                <SectionReveal key={step.title}>
                  <div className="step-row">
                    <div className="step-number">{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, marginBottom: 6 }}>{step.title}</h3>
                      <p style={{ color: "rgba(45,45,45,0.65)", lineHeight: 1.7, maxWidth: 540 }}>{step.desc}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Assessment CTA ── */}
        <section className="section" style={{ background: "var(--warm)" }}>
          <div className="max-w">
            <SectionReveal>
              <div className="assessment-bar">
                <div>
                  <h2 className="heading-display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "var(--cream)", marginBottom: 8 }}>
                    How have<br /><strong>you been feeling</strong> lately?
                  </h2>
                  <p style={{ color: "rgba(247,244,239,0.65)", maxWidth: 440, lineHeight: 1.7, marginTop: 12 }}>
                    Just a few gentle questions to help us understand what you're carrying now. No pressure, no labels—just a first step toward care.
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <DynamicButton href="/assessments" isInternal={true} dark={false}>Begin gently →</DynamicButton>
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

      </div>
    </>
  );
}
