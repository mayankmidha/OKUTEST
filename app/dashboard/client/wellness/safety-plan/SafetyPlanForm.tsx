'use client'

import { useState } from 'react'
import { Edit2, CheckCircle2, ShieldCheck, Phone } from 'lucide-react'

interface Contact {
  name: string
  phone: string
}

interface SafetyPlanData {
  warningSigns: string[]
  copingStrategies: string[]
  safeContacts: Contact[]
}

const CRISIS_CONTACTS = [
  { name: 'iCall (TISS)', phone: '9152987821' },
  { name: 'Vandrevala Foundation', phone: '1860-2662-345' },
]

function arrToText(arr: string[]) {
  return arr.join('\n')
}

function textToArr(text: string) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

interface Props {
  existing: SafetyPlanData | null
}

export function SafetyPlanForm({ existing }: Props) {
  const [editing, setEditing] = useState(!existing)
  const [warningSigns, setWarningSigns] = useState(
    arrToText(existing?.warningSigns ?? [])
  )
  const [copingStrategies, setCopingStrategies] = useState(
    arrToText(existing?.copingStrategies ?? [])
  )
  const [contacts, setContacts] = useState<Contact[]>(
    existing?.safeContacts?.length
      ? existing.safeContacts
      : [{ name: '', phone: '' }]
  )
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function updateContact(idx: number, field: keyof Contact, val: string) {
    setContacts((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: val }
      return next
    })
  }

  function addContact() {
    if (contacts.length < 3) {
      setContacts((prev) => [...prev, { name: '', phone: '' }])
    }
  }

  function removeContact(idx: number) {
    setContacts((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      warningSigns: textToArr(warningSigns),
      copingStrategies: textToArr(copingStrategies),
      safeContacts: contacts.filter((c) => c.name.trim()),
    }

    try {
      const res = await fetch('/api/user/safety-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSuccess(true)
      setEditing(false)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Read-only view
  if (!editing) {
    return (
      <div className="space-y-8">
        {success && (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-oku-mint/20 border border-oku-mint/30">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <p className="text-sm text-oku-darkgrey/70 font-semibold">
              Safety plan saved successfully.
            </p>
          </div>
        )}

        {/* Warning Signs */}
        <div className="card-glass-3d !p-8">
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-4">
            Warning Signs
          </p>
          {existing?.warningSigns?.length ? (
            <ul className="space-y-2">
              {existing.warningSigns.map((sign, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-oku-darkgrey/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-oku-purple-dark mt-2 shrink-0" />
                  {sign}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-oku-darkgrey/30">Not filled in yet.</p>
          )}
        </div>

        {/* Coping Strategies */}
        <div className="card-glass-3d !p-8">
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-4">
            Coping Strategies
          </p>
          {existing?.copingStrategies?.length ? (
            <ul className="space-y-2">
              {existing.copingStrategies.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-oku-darkgrey/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-oku-mint mt-2 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-oku-darkgrey/30">Not filled in yet.</p>
          )}
        </div>

        {/* Support Contacts */}
        <div className="card-glass-3d !p-8">
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-4">
            Support Contacts
          </p>
          <div className="space-y-3">
            {existing?.safeContacts?.filter((c) => c.name).map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/40 border border-oku-darkgrey/5"
              >
                <div className="w-10 h-10 rounded-full bg-oku-lavender/40 flex items-center justify-center text-oku-purple-dark font-black text-sm">
                  {c.name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-oku-darkgrey text-sm">
                    {c.name}
                  </p>
                  <p className="text-xs text-oku-darkgrey/50">{c.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crisis Numbers */}
        <div className="card-glass-3d !p-8 !bg-oku-dark">
          <div className="flex items-center gap-3 mb-6">
            <Phone size={20} className="text-white/60" />
            <p className="text-xs font-black uppercase tracking-widest text-white/40">
              Crisis Helplines
            </p>
          </div>
          <div className="space-y-3">
            {CRISIS_CONTACTS.map((c) => (
              <div
                key={c.phone}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <p className="text-white font-semibold text-sm">{c.name}</p>
                <a
                  href={`tel:${c.phone}`}
                  className="text-oku-lavender font-bold text-sm hover:underline"
                >
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setEditing(true)}
          className="btn-pill-3d bg-white border-oku-darkgrey/10 text-oku-darkgrey w-full flex items-center justify-center gap-2"
        >
          <Edit2 size={16} /> Edit Safety Plan
        </button>
      </div>
    )
  }

  // Edit Form
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Warning Signs */}
      <div className="card-glass-3d !p-8 space-y-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
            Warning Signs
          </p>
          <p className="text-sm text-oku-darkgrey/50">
            What thoughts, feelings, or behaviours tell you that a crisis might
            be building? (One per line)
          </p>
        </div>
        <textarea
          value={warningSigns}
          onChange={(e) => setWarningSigns(e.target.value)}
          rows={5}
          placeholder={'e.g. I start isolating myself\nI feel hopeless about the future\nI can\'t sleep for more than 2 hours'}
          className="w-full rounded-xl border border-oku-darkgrey/10 bg-white/50 px-4 py-3 text-sm text-oku-darkgrey placeholder:text-oku-darkgrey/30 focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/30 resize-none"
        />
      </div>

      {/* Coping Strategies */}
      <div className="card-glass-3d !p-8 space-y-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
            Coping Strategies
          </p>
          <p className="text-sm text-oku-darkgrey/50">
            Things that help you feel calmer or safer. (One per line)
          </p>
        </div>
        <textarea
          value={copingStrategies}
          onChange={(e) => setCopingStrategies(e.target.value)}
          rows={5}
          placeholder={'e.g. Deep breathing for 5 minutes\nCall my sister\nGo for a walk outside\nListen to calming music'}
          className="w-full rounded-xl border border-oku-darkgrey/10 bg-white/50 px-4 py-3 text-sm text-oku-darkgrey placeholder:text-oku-darkgrey/30 focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/30 resize-none"
        />
      </div>

      {/* Support Contacts */}
      <div className="card-glass-3d !p-8 space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
            Support Contacts
          </p>
          <p className="text-sm text-oku-darkgrey/50">
            Up to 3 people you trust and can reach out to.
          </p>
        </div>

        {contacts.map((contact, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-oku-lavender/40 flex items-center justify-center text-oku-purple-dark font-black text-xs shrink-0 mt-3">
              {idx + 1}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                type="text"
                value={contact.name}
                onChange={(e) => updateContact(idx, 'name', e.target.value)}
                placeholder="Name"
                maxLength={50}
                className="rounded-xl border border-oku-darkgrey/10 bg-white/50 px-4 py-3 text-sm text-oku-darkgrey placeholder:text-oku-darkgrey/30 focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/30"
              />
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact(idx, 'phone', e.target.value)}
                placeholder="Phone number"
                maxLength={20}
                className="rounded-xl border border-oku-darkgrey/10 bg-white/50 px-4 py-3 text-sm text-oku-darkgrey placeholder:text-oku-darkgrey/30 focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/30"
              />
            </div>
            {contacts.length > 1 && (
              <button
                type="button"
                onClick={() => removeContact(idx)}
                className="mt-3 text-oku-darkgrey/30 hover:text-red-400 transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {contacts.length < 3 && (
          <button
            type="button"
            onClick={addContact}
            className="text-sm text-oku-purple-dark font-semibold hover:underline flex items-center gap-1"
          >
            + Add another contact
          </button>
        )}
      </div>

      {/* Crisis Numbers (read-only) */}
      <div className="card-glass-3d !p-8 !bg-oku-dark space-y-4">
        <div className="flex items-center gap-3">
          <Phone size={20} className="text-white/60" />
          <p className="text-xs font-black uppercase tracking-widest text-white/40">
            Auto-Saved Crisis Helplines
          </p>
        </div>
        {CRISIS_CONTACTS.map((c) => (
          <div
            key={c.phone}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <p className="text-white font-semibold text-sm">{c.name}</p>
            <span className="text-oku-lavender font-bold text-sm">
              {c.phone}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <div className="flex gap-4">
        {existing && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="btn-pill-3d bg-white border-oku-darkgrey/10 text-oku-darkgrey flex-1"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white flex-1 !py-5 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <ShieldCheck size={18} />
          {submitting ? 'Saving…' : 'Save Safety Plan'}
        </button>
      </div>
    </form>
  )
}
