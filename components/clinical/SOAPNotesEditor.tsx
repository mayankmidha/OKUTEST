'use client'

import { useState, useEffect } from 'react'
import { Save, Clock, User, FileText, AlertCircle } from 'lucide-react'
import { DashboardCard } from '@/components/DashboardCard'

interface SOAPNote {
  id?: string
  appointmentId: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  createdAt?: Date
  updatedAt?: Date
  status: 'DRAFT' | 'COMPLETED' | 'REVIEWED'
}

interface SOAPNoteProps {
  appointmentId: string
  patientName: string
  sessionDate: string
  serviceType: string
  onSave?: (note: SOAPNote) => void
  initialData?: Partial<SOAPNote>
}

export function SOAPNotesEditor({ 
  appointmentId, 
  patientName, 
  sessionDate, 
  serviceType,
  onSave,
  initialData 
}: SOAPNoteProps) {
  const [note, setNote] = useState<SOAPNote>({
    appointmentId,
    subjective: initialData?.subjective || '',
    objective: initialData?.objective || '',
    assessment: initialData?.assessment || '',
    plan: initialData?.plan || '',
    status: initialData?.status || 'DRAFT'
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [autoSave, setAutoSave] = useState(false)

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (note.subjective || note.objective || note.assessment || note.plan) {
        handleAutoSave()
      }
    }, 30000) // Auto-save after 30 seconds

    return () => clearTimeout(timer)
  }, [note])

  const handleAutoSave = async () => {
    setAutoSave(true)
    // API call to auto-save draft
    try {
      await fetch('/api/clinical/soap-notes/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...note, status: 'DRAFT' })
      })
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
    setAutoSave(false)
  }

  const handleSave = async (status: SOAPNote['status'] = 'COMPLETED') => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/clinical/soap-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...note, status })
      })
      
      if (response.ok) {
        const savedNote = await response.json()
        setNote(prev => ({ ...prev, ...savedNote, status }))
        onSave?.(savedNote)
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
    setIsSaving(false)
  }

  const soapTemplates = {
    initial: {
      subjective: "Patient reports feeling overwhelmed and anxious about work responsibilities. Describes difficulty sleeping and loss of appetite.",
      objective: "Patient appears anxious with psychomotor agitation. Speech is rapid but coherent. Mood appears dysphoric.",
      assessment: "Moderate anxiety disorder with depressive features. Patient demonstrates good insight but limited coping mechanisms.",
      plan: "Initiate CBT for anxiety. Consider SSRI medication if symptoms persist. Schedule follow-up in 2 weeks."
    },
    followUp: {
      subjective: "Patient reports improvement in anxiety symptoms after starting CBT techniques. Sleeping has improved slightly.",
      objective: "Patient appears less anxious than previous session. Speech rate has normalized. Mood appears improved.",
      assessment: "Positive response to CBT interventions. Anxiety symptoms reduced by approximately 30%. Patient demonstrates good engagement with homework.",
      plan: "Continue CBT focusing on cognitive restructuring. Introduce mindfulness techniques. Reassess medication need in 4 weeks."
    },
    crisis: {
      subjective: "Patient reports suicidal ideation with plan. Feels hopeless about future. Denies access to means.",
      objective: "Patient appears acutely distressed. Psychomotor agitation present. Affect is constricted and dysphoric.",
      assessment: "Acute suicide risk - moderate to high. Requires immediate intervention. Patient has some protective factors (family support).",
      plan: "IMPLEMENT CRISIS PROTOCOL: 1) Ensure patient safety, 2) Contact emergency services if needed, 3) Inform family/support system, 4) Schedule intensive follow-up within 24 hours, 5) Consider hospitalization if risk escalates."
    }
  }

  const applyTemplate = (template: keyof typeof soapTemplates) => {
    setNote(prev => ({ ...prev, ...soapTemplates[template] }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-premium border border-oku-taupe/10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-oku-purple/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-oku-purple" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-oku-dark">Clinical Documentation</h2>
              <p className="text-oku-taupe text-sm">{patientName} • {sessionDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {autoSave && (
              <div className="flex items-center gap-2 text-oku-taupe/60 text-sm">
                <Clock className="w-4 h-4 animate-pulse" />
                Auto-saving...
              </div>
            )}
            <select 
              className="px-4 py-2 border border-oku-taupe/20 rounded-xl text-sm"
              onChange={(e) => applyTemplate(e.target.value as keyof typeof soapTemplates)}
              value=""
            >
              <option value="">Load Template</option>
              <option value="initial">Initial Assessment</option>
              <option value="followUp">Follow-up Session</option>
              <option value="crisis">Crisis Intervention</option>
            </select>
          </div>
        </div>

        {/* SOAP Sections */}
        <div className="space-y-8">
          {/* Subjective */}
          <DashboardCard variant="lavender" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-oku-lavender-dark/20 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-oku-lavender-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-oku-dark">Subjective (S)</h3>
                <p className="text-sm text-oku-taupe">Patient's reported experience and symptoms</p>
              </div>
            </div>
            <textarea
              value={note.subjective}
              onChange={(e) => setNote(prev => ({ ...prev, subjective: e.target.value }))}
              className="w-full h-32 p-4 border border-oku-taupe/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-oku-lavender/30"
              placeholder="Patient's chief complaint, history of present illness, symptoms, medications..."
            />
          </DashboardCard>

          {/* Objective */}
          <DashboardCard variant="glacier" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-oku-glacier-dark/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-oku-glacier-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-oku-dark">Objective (O)</h3>
                <p className="text-sm text-oku-taupe">Observable findings and clinical measurements</p>
              </div>
            </div>
            <textarea
              value={note.objective}
              onChange={(e) => setNote(prev => ({ ...prev, objective: e.target.value }))}
              className="w-full h-32 p-4 border border-oku-taupe/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-oku-glacier/30"
              placeholder="Mental status exam, vital signs, observable behaviors, test results..."
            />
          </DashboardCard>

          {/* Assessment */}
          <DashboardCard variant="matcha" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-oku-matcha-dark/20 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-oku-matcha-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-oku-dark">Assessment (A)</h3>
                <p className="text-sm text-oku-taupe">Clinical diagnosis and impression</p>
              </div>
            </div>
            <textarea
              value={note.assessment}
              onChange={(e) => setNote(prev => ({ ...prev, assessment: e.target.value }))}
              className="w-full h-32 p-4 border border-oku-taupe/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-oku-matcha/30"
              placeholder="Working diagnosis, differential diagnoses, risk assessment, prognosis..."
            />
          </DashboardCard>

          {/* Plan */}
          <DashboardCard variant="rose" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-oku-rose-dark/20 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-oku-rose-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-oku-dark">Plan (P)</h3>
                <p className="text-sm text-oku-taupe">Treatment plan and next steps</p>
              </div>
            </div>
            <textarea
              value={note.plan}
              onChange={(e) => setNote(prev => ({ ...prev, plan: e.target.value }))}
              className="w-full h-32 p-4 border border-oku-taupe/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-oku-rose/30"
              placeholder="Medications, therapy interventions, follow-up plans, referrals..."
            />
          </DashboardCard>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-oku-taupe/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave('DRAFT')}
              disabled={isSaving}
              className="px-6 py-3 border border-oku-taupe/20 rounded-xl text-sm font-medium hover:bg-oku-taupe/5 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('COMPLETED')}
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Complete & Sign'}
            </button>
          </div>
          
          <div className="text-sm text-oku-taupe">
            Status: <span className={`font-medium ${
              note.status === 'COMPLETED' ? 'text-oku-success' : 
              note.status === 'REVIEWED' ? 'text-oku-purple' : 'text-oku-pending'
            }`}>{note.status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
