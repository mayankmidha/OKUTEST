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

interface CommunityPanel {
  image: string;
  sticker: string;
  alt: string;
  kicker: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}

interface VisualArchiveItem {
  image: string;
  alt: string;
  label: string;
  fit?: "contain" | "cover";
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CYCLING_WORDS = ["grief", "longing", "quiet", "becoming", "anger", "story"];

const FEATURES = [
  { icon: "/uploads/2025/06/Frame-23-2.png", label: "Slow Healing", desc: "We move at the pace your story asks for—never rushed." },
  { icon: "/uploads/2025/06/Frame-23.png", label: "Depth Work", desc: "We meet what's beneath, not just what's visible." },
  { icon: "/uploads/2025/06/Frame-23-3.png", label: "Whole Self", desc: "Your culture, identity, body—all of you is held here." },
  { icon: "/uploads/2025/06/Frame-23-1.png", label: "Welcoming Space", desc: "A calm, non-clinical space designed for ease and safety." },
];

const TEAM: TeamMember[] = [
  { name: "Dr. Suraj Singh", role: "Consultant Psychiatrist", image: "/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg" },
  { name: "Tanisha Singh", role: "Clinical Psychologist (A.) & Psychodynamic Psychotherapist", image: "/uploads/2025/07/Tanisha_-821x1024.jpg" },
  { name: "Rananjay Singh", role: "Queer Affirmative & Family Therapist", image: "/uploads/2025/07/Rananjay--869x1536.jpg" },
  { name: "Amna Ansari", role: "Clinical Psychologist (A.)", image: "/uploads/2025/07/Amna-1006x1536.jpg" },
  { name: "Mohit Dudeja", role: "Queer Affirmative Therapist", image: "/uploads/2025/07/Mohit-911x1024.jpg" },
  { name: "Gursheel Kaur", role: "Psychodynamic Psychotherapist", image: "/uploads/2025/07/gursheel_pfp-1024x980.jpg" },
];

const HERO_VISUALS = {
  primary: {
    image: "/uploads/2025/07/Tanisha_-821x1024.jpg",
    alt: "Tanisha Singh portrait",
  },
  secondary: {
    image: "/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg",
    alt: "Dr. Suraj Singh portrait",
  },
  stickerOne: "/uploads/2025/06/Group-28.png",
  stickerTwo: "/uploads/2025/06/Group-29.png",
  stickerThree: "/uploads/2025/06/Frame-137.png",
};

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

const COMMUNITY_PANELS: CommunityPanel[] = [
  {
    image: "/uploads/2025/06/img.png",
    sticker: "/uploads/2025/06/Group-28.png",
    alt: "Illustrated Oku community card",
    kicker: "Our Story",
    title: "A slower, softer way into therapy",
    body: "See how Oku's values shape the tone, care style, and emotional safety of the space.",
    href: "/about-us",
    cta: "Read our story",
  },
  {
    image: "/uploads/2025/06/img-1.png",
    sticker: "/uploads/2025/06/Group-29.png",
    alt: "Illustrated Oku journal card",
    kicker: "The Journal",
    title: "Keep exploring at your own pace",
    body: "Browse reflections, clinical writing, and gentle language for what you might be carrying.",
    href: "/blog",
    cta: "Visit the journal",
  },
  {
    image: "/uploads/2025/06/img-2.png",
    sticker: "/uploads/2025/07/WApp.png",
    alt: "Illustrated therapist discovery card",
    kicker: "The Collective",
    title: "Find the therapist who feels right",
    body: "Meet verified practitioners and move toward the kind of support that matches your story.",
    href: "/therapists",
    cta: "Meet the collective",
  },
];

const SOURCE_ARCHIVE_FEATURED: VisualArchiveItem[] = [
  {
    image: "/uploads/2025/07/Aboutt.png",
    alt: "Pinned note inviting people to come as they are",
    label: "Invitation",
  },
  {
    image: "/uploads/2025/07/Frame-200.png",
    alt: "Blue note about being understood in the room",
    label: "Being understood",
  },
  {
    image: "/uploads/2025/07/Frame-243.png",
    alt: "Pinned note about healing together instead of in isolation",
    label: "Healing together",
  },
  {
    image: "/uploads/2025/07/b3.png",
    alt: "Blurred portrait with note about the body holding unspoken stories",
    label: "Embodied care",
  },
  {
    image: "/uploads/2025/07/b32.png",
    alt: "Portrait with note about being seen without conditions",
    label: "Affirmation",
  },
  {
    image: "/uploads/2025/06/Frame-57.png",
    alt: "Portrait and note about wanting to be heard",
    label: "Being heard",
  },
  {
    image: "/uploads/2025/06/Frame-57-1.png",
    alt: "Portrait and note about the body remembering trauma",
    label: "Body memory",
  },
  {
    image: "/uploads/2025/06/Frame-57-3.png",
    alt: "Journal scene with note about understanding what is going on",
    label: "Clarity",
  },
];

const SOURCE_ARCHIVE_SUPPORTING: VisualArchiveItem[] = [
  {
    image: "/uploads/2025/06/compassion.gif",
    alt: "Compassion symbol animation",
    label: "Compassion",
  },
  {
    image: "/uploads/2025/06/inclusion.gif",
    alt: "Inclusion symbol animation",
    label: "Inclusion",
  },
  {
    image: "/uploads/2025/06/soul.gif",
    alt: "Soul symbol animation",
    label: "Soul",
  },
  {
    image: "/uploads/2025/07/Group-21.png",
    alt: "Meditative sea illustration in a wave shape",
    label: "Stillness",
  },
  {
    image: "/uploads/2025/07/Group-33.png",
    alt: "Illustration of two therapy chairs and a cup",
    label: "Therapy room",
  },
  {
    image: "/uploads/2025/06/Group-31.png",
    alt: "Line illustration of a mind full of questions",
    label: "Questioning",
  },
  {
    image: "/uploads/2025/06/Frame-247.png",
    alt: "Line illustration of a person sitting in reflection",
    label: "Reflection",
  },
  {
    image: "/uploads/2025/06/Frame-247-1.png",
    alt: "Line illustration of a person resting in calm",
    label: "Grounding",
  },
  {
    image: "/uploads/2025/07/Group-18-2.png",
    alt: "Lavender pinned note shape",
    label: "Note pin",
  },
  {
    image: "/uploads/2025/07/Group-19.png",
    alt: "Blue pinned note shape",
    label: "Paper texture",
  },
];

const SOURCE_ARCHIVE_STUDIO: VisualArchiveItem[] = [
  {
    image: "/uploads/2025/06/BG.png",
    alt: "Soft abstract OKU background texture",
    label: "Backdrop",
  },
  {
    image: "/uploads/2025/06/267202932_78107c9f-66b6-4fe1-9985-b9e858e1bdf9-1.png",
    alt: "Illustrative OKU artwork from the original archive",
    label: "Archive sketch",
  },
  {
    image: "/uploads/2025/06/concept-mental-health-selfcare-self-development-vector-illustration-1.png",
    alt: "Illustration about self-care and mental health",
    label: "Self-care",
  },
  {
    image: "/uploads/2025/06/video_call_using_the_doctor_s_laptop-1.png",
    alt: "Illustration of a care session happening over video",
    label: "Digital care",
  },
  {
    image: "/uploads/2025/06/ChatGPT-Image-May-25-2025-01_59_55-PM-1.png",
    alt: "Warm atmospheric OKU concept image",
    label: "Warmth",
  },
  {
    image: "/uploads/2025/06/ChatGPT-Image-May-25-2025-02_30_11-PM-1.png",
    alt: "Soft pastel OKU concept image",
    label: "Softness",
  },
  {
    image: "/uploads/2025/06/ChatGPT-Image-May-25-2025-02_31_14-PM-1.png",
    alt: "Calming OKU concept image",
    label: "Calm",
  },
  {
    image: "/uploads/2025/07/ChatGPT-Image-May-22-2025-05_28_30-PM-1.png",
    alt: "Gentle OKU concept image",
    label: "Gentleness",
  },
  {
    image: "/uploads/2025/06/Frame-235-scaled-e1751135861258.png",
    alt: "Pastel OKU composition from the original archive",
    label: "Moodboard",
  },
  {
    image: "/uploads/2025/06/Frame-244.png",
    alt: "Illustrative OKU design asset",
    label: "Studio detail",
  },
  {
    image: "/uploads/2025/06/Frame-57-4.png",
    alt: "Reflective note card from the original OKU archive",
    label: "Inner voice",
  },
];

const ASSESSMENT_SIGNALS = [
  "No pressure, no labels",
  "A gentle first step into support",
  "Designed to guide you toward the right kind of care",
];

const TRUST_PILLARS = [
  {
    eyebrow: "Begin with care",
    title: "Free consultation",
    description: "Start with a low-pressure 15-minute conversation to see whether the fit feels right.",
  },
  {
    eyebrow: "Find your fit",
    title: "Therapist matching",
    description: "Explore specializations, identities, and therapeutic styles before you commit to a session.",
  },
  {
    eyebrow: "Stay supported",
    title: "Assessments and secure care",
    description: "Move from self-checks to secure sessions, notes, and ongoing support in one place.",
  },
];

const STARTING_POINTS = [
  {
    kicker: "Start with people",
    title: "Meet the collective",
    description: "Browse verified therapists, understand their focus areas, and choose the kind of support that feels right.",
    href: "/therapists",
  },
  {
    kicker: "Start with clarity",
    title: "Take a gentle self-check",
    description: "Use clinically grounded assessments to better understand what you might be carrying right now.",
    href: "/assessments",
  },
  {
    kicker: "Start with options",
    title: "See the care paths",
    description: "Compare therapy, EMDR, movement work, and psychometric support before taking the next step.",
    href: "/services",
  },
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
          position: absolute; bottom: 12px; left: 12px; right: 12px;
          padding: 16px;
          background: rgba(247,244,239,0.95);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          color: var(--ink);
          border: 1px solid rgba(45,45,45,0.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .team-card-overlay h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 2px;
          letter-spacing: -0.01em;
        }
        .team-card-overlay p { 
          font-size: 0.7rem; 
          opacity: 0.6; 
          line-height: 1.2; 
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

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

        .hero-grid {
          display: grid;
          gap: 40px;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: minmax(0, 1.02fr) minmax(340px, 0.98fr);
            gap: 64px;
          }
        }
        .hero-copy {
          max-width: 700px;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }
        .hero-secondary-links {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 18px;
        }
        .hero-support-link {
          color: rgba(45,45,45,0.7);
          font-size: 0.92rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .hero-support-link:hover {
          color: var(--ink);
        }
        .hero-note {
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(45,45,45,0.5);
        }
        .hero-visual {
          position: relative;
          min-height: 520px;
          padding: 16px 0 28px 32px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }
        .hero-portrait-primary,
        .hero-portrait-secondary {
          overflow: hidden;
          background: var(--warm);
          box-shadow: 0 28px 60px rgba(0,0,0,0.08);
        }
        .hero-portrait-primary {
          width: min(100%, 430px);
          aspect-ratio: 5/6;
          border-radius: 34px;
          position: relative;
          z-index: 2;
        }
        .hero-portrait-secondary {
          position: absolute;
          left: 0;
          bottom: 18px;
          width: 220px;
          aspect-ratio: 4/5;
          border-radius: 28px;
          border: 8px solid var(--cream);
          z-index: 3;
        }
        .hero-portrait-primary img,
        .hero-portrait-secondary img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }
        .hero-floating-note {
          position: absolute;
          top: 30px;
          right: 26px;
          max-width: 220px;
          padding: 18px 18px 20px;
          border-radius: 20px;
          background: rgba(247,244,239,0.94);
          border: 1px solid rgba(139,115,85,0.12);
          box-shadow: 0 18px 42px rgba(0,0,0,0.08);
          z-index: 4;
        }
        .hero-floating-note span,
        .hero-trust-card span,
        .community-panel-kicker {
          display: inline-block;
          margin-bottom: 6px;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .hero-floating-note h3,
        .hero-trust-card h3,
        .feature-card h4,
        .community-panel h3 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .hero-floating-note h3 {
          font-size: 1.45rem;
          margin-bottom: 6px;
          line-height: 1;
        }
        .hero-sticker {
          position: absolute;
          height: auto;
          object-fit: contain;
          pointer-events: none;
          z-index: 5;
        }
        .hero-sticker.one {
          width: 110px;
          left: 32px;
          top: -14px;
        }
        .hero-sticker.two {
          width: 120px;
          right: -14px;
          bottom: 140px;
        }
        .hero-sticker.three {
          width: 78px;
          left: 124px;
          bottom: -10px;
        }
        @media (max-width: 768px) {
          .hero-visual {
            min-height: 430px;
            padding: 8px 0 24px;
          }
          .hero-portrait-secondary {
            width: 170px;
            bottom: 0;
          }
          .hero-floating-note {
            top: 10px;
            right: 4px;
            max-width: 188px;
          }
          .hero-sticker.one {
            width: 88px;
            left: 8px;
            top: -10px;
          }
          .hero-sticker.two {
            width: 96px;
            right: -6px;
            bottom: 104px;
          }
          .hero-sticker.three {
            left: 78px;
            width: 64px;
          }
        }
        .hero-bottom-band {
          display: grid;
          gap: 18px;
          margin-top: 38px;
        }
        @media (min-width: 1024px) {
          .hero-bottom-band {
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
            align-items: start;
          }
        }
        .entry-grid {
          display: grid;
          gap: 14px;
        }
        @media (min-width: 768px) {
          .entry-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .entry-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          padding: 22px;
          border-radius: 22px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(139,115,85,0.12);
          text-decoration: none;
          color: inherit;
          transition: transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease;
        }
        .entry-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 22px 48px rgba(0,0,0,0.07);
        }
        .entry-kicker {
          display: inline-block;
          margin-bottom: 10px;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .entry-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          line-height: 1.02;
          margin-bottom: 10px;
        }
        .entry-arrow {
          font-size: 1rem;
          color: var(--accent);
        }
        .hero-trust-grid {
          display: grid;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .hero-trust-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .hero-trust-grid {
            grid-template-columns: 1fr;
          }
        }
        .hero-trust-card {
          padding: 20px;
          border-radius: 20px;
          background: rgba(237,232,224,0.65);
          border: 1px solid rgba(139,115,85,0.1);
        }
        .hero-trust-card h3 {
          font-size: 1.28rem;
          margin-bottom: 6px;
          line-height: 1.05;
        }

        .feature-layout {
          display: grid;
          gap: 32px;
          align-items: start;
        }
        @media (min-width: 960px) {
          .feature-layout {
            grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
            gap: 48px;
          }
        }
        .feature-grid {
          display: grid;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .feature-card {
          min-height: 210px;
          padding: 28px 24px;
          border-radius: 24px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(139,115,85,0.1);
          box-shadow: 0 18px 38px rgba(0,0,0,0.04);
        }
        .feature-card img {
          width: 56px;
          height: 56px;
          margin-bottom: 16px;
          object-fit: contain;
        }
        .feature-card h4 {
          font-size: 1.4rem;
          margin-bottom: 8px;
          line-height: 1;
        }

        .team-grid {
          display: grid;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .team-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1100px) {
          .team-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .team-grid > *:nth-child(2n) .team-card-frame {
            padding-top: 30px;
          }
        }
        @media (max-width: 1099px) {
          .team-grid > * .team-card-frame {
            padding-top: 0;
          }
        }
        .team-card {
          position: relative;
          overflow: visible;
          background: transparent;
        }
        .team-card-frame {
          position: relative;
          padding-bottom: 14px;
        }
        .team-card img {
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.6s ease;
          display: block;
          border-radius: 30px;
          box-shadow: 0 26px 52px rgba(0,0,0,0.08);
        }
        .team-card:hover img {
          transform: scale(1.03);
        }
        .team-card-overlay {
          position: relative;
          margin: -58px 18px 0;
          padding: 18px 18px 20px;
          background: rgba(247,244,239,0.95);
          backdrop-filter: blur(8px);
          border-radius: 18px;
          color: var(--ink);
          border: 1px solid rgba(45,45,45,0.05);
          box-shadow: 0 14px 30px rgba(0,0,0,0.08);
        }
        .team-card-overlay h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem;
          font-weight: 500;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .team-card-overlay p {
          font-size: 0.72rem;
          opacity: 0.66;
          line-height: 1.35;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .for-you-intro {
          display: grid;
          gap: 20px;
          margin-bottom: 48px;
        }
        @media (min-width: 1024px) {
          .for-you-intro {
            grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
            align-items: end;
          }
        }
        .for-you-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .for-you-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .for-you-grid {
            grid-template-columns: repeat(6, minmax(0, 1fr));
          }
          .for-you-span {
            grid-column: span 2;
          }
        }
        .for-you-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 40px;
          min-height: 250px;
          padding: 28px 24px;
          border-radius: 24px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(139,115,85,0.1);
          box-shadow: 0 18px 40px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .for-you-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.92);
        }
        .for-you-card img {
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          object-fit: contain;
        }

        .community-layout {
          display: grid;
          gap: 36px;
          align-items: center;
          margin-bottom: 44px;
        }
        @media (min-width: 1024px) {
          .community-layout {
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
            gap: 52px;
          }
        }
        .community-collage {
          position: relative;
          min-height: 470px;
        }
        .community-collage-card {
          position: absolute;
          padding: 12px;
          background: rgba(247,244,239,0.88);
          border-radius: 28px;
          box-shadow: 0 24px 54px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .community-collage-card img {
          width: 100%;
          height: 100%;
          border-radius: 22px;
          object-fit: cover;
          display: block;
        }
        .community-collage-card.primary {
          right: 0;
          top: 18px;
          width: min(100%, 360px);
          aspect-ratio: 1/1;
          z-index: 2;
        }
        .community-collage-card.secondary {
          left: 12px;
          top: 0;
          width: 210px;
          aspect-ratio: 4/5;
          z-index: 3;
        }
        .community-collage-card.tertiary {
          left: 74px;
          bottom: 0;
          width: 240px;
          aspect-ratio: 1/1;
          z-index: 1;
        }
        .community-sticker {
          position: absolute;
          height: auto;
          object-fit: contain;
          pointer-events: none;
        }
        .community-sticker.one {
          width: 120px;
          left: -8px;
          bottom: 34px;
          z-index: 4;
        }
        .community-sticker.two {
          width: 110px;
          right: 26px;
          top: -12px;
          z-index: 4;
        }
        .community-sticker.three {
          width: 112px;
          right: -14px;
          bottom: 92px;
          z-index: 4;
        }
        .community-sticker.four {
          width: 82px;
          left: 238px;
          top: 214px;
          z-index: 4;
        }
        @media (max-width: 768px) {
          .community-collage {
            min-height: 380px;
          }
          .community-collage-card.primary {
            width: 260px;
          }
          .community-collage-card.secondary {
            width: 160px;
            left: 0;
          }
          .community-collage-card.tertiary {
            width: 180px;
            left: 52px;
          }
          .community-sticker.one {
            width: 94px;
            left: -6px;
          }
          .community-sticker.two {
            width: 86px;
          }
          .community-sticker.three {
            width: 90px;
            right: -8px;
          }
          .community-sticker.four {
            width: 62px;
            left: 176px;
            top: 182px;
          }
        }
        .community-panel-grid {
          display: grid;
          gap: 18px;
        }
        @media (min-width: 900px) {
          .community-panel-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .community-panel {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          min-height: 100%;
          padding: 22px;
          border-radius: 28px;
          text-decoration: none;
          color: inherit;
          background: rgba(247,244,239,0.88);
          border: 1px solid rgba(139,115,85,0.12);
          transition: transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease;
        }
        .community-panel:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 18px 40px rgba(0,0,0,0.06);
        }
        .community-panel-figure {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
          border-radius: 22px;
          background: rgba(237,232,224,0.8);
          margin-bottom: 18px;
        }
        .community-panel-figure img:first-child {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .community-panel-sticker {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 88px;
          height: auto;
          object-fit: contain;
        }
        .community-panel h3 {
          font-size: 1.8rem;
          line-height: 1;
          margin-bottom: 10px;
        }
        .community-panel-link {
          color: var(--accent);
          font-size: 0.9rem;
        }

        .visual-archive-shell {
          position: relative;
          padding: 32px 20px;
          border-radius: 36px;
          overflow: hidden;
          background:
            linear-gradient(135deg, rgba(247,244,239,0.92), rgba(237,232,224,0.82)),
            url('/uploads/2025/06/BG.png');
          background-size: cover;
          border: 1px solid rgba(139,115,85,0.12);
          box-shadow: 0 24px 52px rgba(0,0,0,0.05);
        }
        @media (min-width: 768px) {
          .visual-archive-shell {
            padding: 42px 34px;
          }
        }
        .visual-archive-intro {
          display: grid;
          gap: 20px;
          align-items: end;
          margin-bottom: 28px;
        }
        @media (min-width: 980px) {
          .visual-archive-intro {
            grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
            gap: 40px;
          }
        }
        .visual-archive-feature-grid {
          display: grid;
          gap: 18px;
          margin-bottom: 22px;
        }
        @media (min-width: 700px) {
          .visual-archive-feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1200px) {
          .visual-archive-feature-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .visual-archive-card {
          position: relative;
          min-height: 240px;
          border-radius: 28px;
          overflow: hidden;
          background: rgba(255,255,255,0.62);
          border: 1px solid rgba(139,115,85,0.12);
          box-shadow: 0 18px 34px rgba(0,0,0,0.04);
        }
        .visual-archive-card img {
          width: 100%;
          height: 100%;
          display: block;
        }
        .visual-archive-card.featured img {
          padding: 14px;
          object-fit: contain;
          background: linear-gradient(180deg, rgba(255,255,255,0.35), rgba(247,244,239,0.75));
        }
        .visual-archive-card.strip {
          min-height: 170px;
        }
        .visual-archive-card.strip img {
          padding: 12px;
          object-fit: contain;
        }
        .visual-archive-label {
          position: absolute;
          left: 14px;
          bottom: 14px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(45,45,45,0.78);
          color: white;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }
        .visual-archive-strip {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(180px, 1fr);
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }
        .visual-archive-strip::-webkit-scrollbar {
          display: none;
        }

        .assessment-shell {
          padding: 34px 28px;
          border-radius: 32px;
          background: rgba(247,244,239,0.8);
          border: 1px solid rgba(139,115,85,0.12);
          box-shadow: 0 22px 48px rgba(0,0,0,0.05);
        }
        @media (min-width: 768px) {
          .assessment-shell {
            padding: 46px 44px;
          }
        }
        .assessment-layout {
          display: grid;
          gap: 28px;
          align-items: end;
        }
        @media (min-width: 900px) {
          .assessment-layout {
            grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
            gap: 44px;
          }
        }
        .assessment-signals {
          display: grid;
          gap: 12px;
          margin: 8px 0 28px;
        }
        .assessment-signal {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(45,45,45,0.1);
        }
        .assessment-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--accent);
          flex-shrink: 0;
        }
      `}</style>

      <div className="oku-page-public">

        {/* ── Hero ── */}
        <section className="section-lg" style={{ background: "var(--cream)" }}>
          <div className="max-w">
            <SectionReveal>
              <div className="hero-grid">
                <div className="hero-copy">
                  <span className="chip" style={{ marginBottom: 28, display: "inline-block" }}>Psychotherapy Collective · New Delhi</span>
                  <h1 className="heading-display" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", marginBottom: 0 }}>
                    Come as you are.
                  </h1>
                  <h1 className="heading-display" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", marginBottom: 0 }}>
                    We hold space for your
                  </h1>
                  <h1 className="heading-display" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", marginBottom: 40 }}>
                    <span className="hero-word-wrap">
                      <span className={`cursive-word ${wordVisible ? "visible" : "hidden"}`}>
                        {CYCLING_WORDS[wordIdx]}
                      </span>
                    </span>
                  </h1>
                  <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", maxWidth: 560, lineHeight: 1.7, marginBottom: 32, color: "rgba(45,45,45,0.75)" }}>
                    Oku is a psychotherapy collective offering <strong>inclusive, trauma-informed care</strong> for all parts of who you are. Start with a free consultation, a gentle self-check, or a closer look at our collective.
                  </p>
                  <div className="hero-actions">
                    <DynamicButton href="/therapists" isInternal={true}>Book a free 1:1 consultation</DynamicButton>
                  </div>
                  <div className="hero-secondary-links">
                    <Link href="/assessments" className="hero-support-link">
                      Take a gentle self-check
                    </Link>
                    <Link href="/auth/login" className="hero-support-link">
                      Already with us? Sign in
                    </Link>
                  </div>
                  <p className="hero-note">Free consultations · Secure video sessions · Inclusive, affirming care</p>
                </div>

                <div className="hero-visual">
                  <div className="hero-portrait-primary">
                    <img src={HERO_VISUALS.primary.image} alt={HERO_VISUALS.primary.alt} />
                  </div>
                  <div className="hero-portrait-secondary">
                    <img src={HERO_VISUALS.secondary.image} alt={HERO_VISUALS.secondary.alt} />
                  </div>
                  <div className="hero-floating-note">
                    <span>Held with care</span>
                    <h3>Therapy that begins with listening</h3>
                    <p style={{ color: "rgba(45,45,45,0.7)", lineHeight: 1.6 }}>
                      Start with questions, silence, or uncertainty. We make room for all of it.
                    </p>
                  </div>
                  <img className="hero-sticker one" src={HERO_VISUALS.stickerOne} alt="" aria-hidden="true" />
                  <img className="hero-sticker two" src={HERO_VISUALS.stickerTwo} alt="" aria-hidden="true" />
                  <img className="hero-sticker three" src={HERO_VISUALS.stickerThree} alt="" aria-hidden="true" />
                </div>
              </div>
            </SectionReveal>

            <SectionReveal className="hero-bottom-band">
              <div className="entry-grid">
                {STARTING_POINTS.map((path) => (
                  <Link key={path.title} href={path.href} className="entry-card">
                    <div>
                      <span className="entry-kicker">{path.kicker}</span>
                      <h3>{path.title}</h3>
                      <p style={{ color: "rgba(45,45,45,0.68)", lineHeight: 1.7 }}>{path.description}</p>
                    </div>
                    <span className="entry-arrow">Explore →</span>
                  </Link>
                ))}
              </div>
              <div className="hero-trust-grid">
                {TRUST_PILLARS.map((pillar) => (
                  <div key={pillar.title} className="hero-trust-card">
                    <span>{pillar.eyebrow}</span>
                    <h3>{pillar.title}</h3>
                    <p style={{ color: "rgba(45,45,45,0.68)", lineHeight: 1.6 }}>{pillar.description}</p>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* ── Features ticker ── */}
        <section style={{ background: "var(--warm)", padding: "60px 0" }}>
          <div style={{ padding: "0 24px 0 24px" }} className="max-w">
            <SectionReveal>
              <div className="feature-layout">
                <div>
                  <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>A Gentler Way In</span>
                  <div style={{ marginBottom: 20 }}>
                    <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                      A place to <em>explore,</em>
                    </h2>
                    <h3 className="heading-display" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "var(--accent)", fontStyle: "italic" }}>
                      not perform.
                    </h3>
                  </div>
                  <p style={{ maxWidth: 520, color: "rgba(45,45,45,0.7)", lineHeight: 1.75 }}>
                    Oku was created as a gentle refuge for those <strong>who feel unseen</strong> in traditional therapy spaces. Whether you're unpacking generational pain, navigating identity, or simply seeking to <strong>reconnect with yourself</strong>, we invite you to explore without pressure or performance.
                  </p>
                </div>
                <div className="feature-grid">
                  {FEATURES.map((f) => (
                    <div key={f.label} className="feature-card">
                      <img src={f.icon} alt={f.label} />
                      <h4>{f.label}</h4>
                      <p style={{ fontSize: "0.92rem", color: "rgba(45,45,45,0.65)", lineHeight: 1.7 }}>{f.desc}</p>
                    </div>
                  ))}
                </div>
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
              <img
                src="/uploads/2025/06/Vector-1.png"
                alt=""
                className="wave-divider"
                style={{ marginBottom: 40 }}
              />
            </SectionReveal>
            <div className="team-grid">
              {TEAM.map((member, i) => (
                <SectionReveal key={member.name}>
                  <div className="team-card" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="team-card-frame">
                      <img src={member.image} alt={member.name} loading="lazy" />
                      <div className="team-card-overlay">
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
                <DynamicButton href="/therapists" isInternal={true} dark={false}>View Detailed Profiles</DynamicButton>
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
                    <DynamicButton href="/therapists" isInternal={true}>Book a free 1:1 consultation</DynamicButton>
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
              <div className="for-you-intro">
                <div>
                  <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>This Space</span>
                  <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}><strong>This space</strong> is </h2>
                  <h3 className="heading-display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "var(--accent)", fontStyle: "italic" }}>for you</h3>
                </div>
                <p style={{ maxWidth: 620, color: "rgba(45,45,45,0.68)", lineHeight: 1.8 }}>
                  Whether you feel like too much, not enough, between worlds, or entirely new to therapy, this space is designed to feel more human than clinical. You do not have to edit yourself to be here.
                </p>
              </div>
            </SectionReveal>
            <div className="for-you-grid">
              {FOR_YOU.map((card, i) => (
                <SectionReveal key={card.heading} className={i === 0 || i === 4 || i === 8 ? "for-you-span" : ""}>
                  <div className="for-you-card">
                    <img src={card.icon} alt="" loading="lazy" />
                    <div>
                      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.55rem", fontWeight: 400, marginBottom: 10, lineHeight: 1.05 }}>{card.heading}</h4>
                      <p style={{ fontSize: "0.92rem", color: "rgba(45,45,45,0.62)", lineHeight: 1.7 }}>{card.subtext}</p>
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
              <div className="community-layout">
                <div>
                  <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>Community</span>
                  <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>A softer way to<br /><strong>keep exploring</strong></h2>
                  <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--accent)", fontStyle: "italic", marginBottom: 16 }}>beyond the first session.</h2>
                  <p style={{ maxWidth: 540, color: "rgba(45,45,45,0.68)", lineHeight: 1.8 }}>
                    The homepage should not feel like a dead end. Whether you want to understand our philosophy, read something reflective, or move straight into therapist discovery, these are gentle next steps that stay inside the product experience.
                  </p>
                </div>
                <div className="community-collage">
                  <div className="community-collage-card primary">
                    <img src="/uploads/2025/06/img.png" alt="Oku illustrated community moment" loading="lazy" />
                  </div>
                  <div className="community-collage-card secondary">
                    <img src="/uploads/2025/06/img-1.png" alt="Oku illustrated journal moment" loading="lazy" />
                  </div>
                  <div className="community-collage-card tertiary">
                    <img src="/uploads/2025/06/img-2.png" alt="Oku illustrated therapist discovery moment" loading="lazy" />
                  </div>
                  <img className="community-sticker one" src="/uploads/2025/06/Group-27.png" alt="" aria-hidden="true" />
                  <img className="community-sticker two" src="/uploads/2025/06/Group-28.png" alt="" aria-hidden="true" />
                  <img className="community-sticker three" src="/uploads/2025/06/Group-29.png" alt="" aria-hidden="true" />
                  <img className="community-sticker four" src="/uploads/2025/07/WApp.png" alt="" aria-hidden="true" />
                </div>
              </div>
            </SectionReveal>
            <div className="community-panel-grid">
              {COMMUNITY_PANELS.map((panel) => (
                <SectionReveal key={panel.title}>
                  <Link href={panel.href} className="community-panel">
                    <div>
                      <div className="community-panel-figure">
                        <img src={panel.image} alt={panel.alt} loading="lazy" />
                        <img src={panel.sticker} alt="" aria-hidden="true" className="community-panel-sticker" />
                      </div>
                      <span className="community-panel-kicker">{panel.kicker}</span>
                      <h3>{panel.title}</h3>
                      <p style={{ color: "rgba(45,45,45,0.66)", lineHeight: 1.7 }}>{panel.body}</p>
                    </div>
                    <span className="community-panel-link">{panel.cta} →</span>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Visual Archive ── */}
        <section className="section-lg" style={{ background: "linear-gradient(180deg, var(--warm) 0%, var(--cream) 100%)" }}>
          <div className="max-w">
            <SectionReveal>
              <div className="visual-archive-shell">
                <div className="visual-archive-intro">
                  <div>
                    <span className="chip" style={{ marginBottom: 24, display: "inline-block" }}>Source Archive</span>
                    <h2 className="heading-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", marginBottom: 16 }}>
                      The original <strong>OKU visual world</strong>, restored into the homepage.
                    </h2>
                  </div>
                  <p style={{ color: "rgba(45,45,45,0.68)", lineHeight: 1.85, maxWidth: 560 }}>
                    We pulled the editorial imagery, note cards, care symbols, and illustrated therapy motifs from the source OKU project into this product homepage so the software carries the same emotional language as the brand itself.
                  </p>
                </div>

                <div className="visual-archive-feature-grid">
                  {SOURCE_ARCHIVE_FEATURED.map((item) => (
                    <div key={item.image} className="visual-archive-card featured">
                      <img src={item.image} alt={item.alt} loading="lazy" style={{ objectFit: item.fit || "contain" }} />
                      <span className="visual-archive-label">{item.label}</span>
                    </div>
                  ))}
                </div>

                <SectionReveal>
                  <div className="visual-archive-strip" style={{ marginBottom: 18 }}>
                    {SOURCE_ARCHIVE_SUPPORTING.map((item) => (
                      <div key={item.image} className="visual-archive-card strip">
                        <img src={item.image} alt={item.alt} loading="lazy" style={{ objectFit: item.fit || "contain" }} />
                        <span className="visual-archive-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </SectionReveal>

                <SectionReveal>
                  <div className="visual-archive-strip">
                    {SOURCE_ARCHIVE_STUDIO.map((item) => (
                      <div key={item.image} className="visual-archive-card strip">
                        <img src={item.image} alt={item.alt} loading="lazy" style={{ objectFit: item.fit || "contain" }} />
                        <span className="visual-archive-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </SectionReveal>
              </div>
            </SectionReveal>
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
              <div className="assessment-shell">
                <span className="chip" style={{ marginBottom: 18, display: "inline-block" }}>Gentle Self-Check</span>
                <img
                  src="/uploads/2025/06/Vector-1.png"
                  alt=""
                  className="wave-divider"
                  style={{ marginBottom: 28 }}
                />
                <div className="assessment-layout">
                  <div>
                    <h2 className="heading-display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", marginBottom: 10 }}>
                      How have <strong>you been feeling</strong> lately?
                    </h2>
                    <p style={{ color: "rgba(45,45,45,0.7)", maxWidth: 520, lineHeight: 1.8 }}>
                      Just a few gentle questions to help us understand what you're carrying now. No pressure, no labels, and no need to know exactly what kind of support you need before you begin.
                    </p>
                  </div>
                  <div>
                    <div className="assessment-signals">
                      {ASSESSMENT_SIGNALS.map((signal) => (
                        <div key={signal} className="assessment-signal">
                          <span className="assessment-dot" />
                          <p style={{ color: "rgba(45,45,45,0.72)" }}>{signal}</p>
                        </div>
                      ))}
                    </div>
                    <DynamicButton href="/assessments" isInternal={true}>Begin the self-check</DynamicButton>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

      </div>
    </>
  );
}
