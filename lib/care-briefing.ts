import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { scrubPII } from './oku-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateCareBriefing(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: {
        include: {
          clientProfile: true,
          moodEntries: { orderBy: { createdAt: 'desc' }, take: 10 },
          assessmentAnswers: { 
            orderBy: { completedAt: 'desc' }, 
            take: 3,
            include: { assessment: true }
          },
          tasks: { 
            where: { isCompleted: false },
            take: 5
          }
        }
      }
    }
  })

  if (!appointment || !appointment.client) return null

  const patient = appointment.client
  const profile = patient.clientProfile
  const moods = patient.moodEntries
  const assessments = patient.assessmentAnswers
  const tasks = patient.tasks

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

  const prompt = `
    You are OKU AI, providing a "Pre-Session Care Briefing" for a therapist.
    Patient: ${scrubPII(patient.name || 'Seeker', patient.name)}
    
    RECENT DATA (Last 7-14 days):
    - Mood Logs: ${JSON.stringify(moods.map(m => ({ mood: m.mood, notes: m.notes })))}
    - Recent Assessments: ${JSON.stringify(assessments.map(a => ({ title: a.assessment.title, result: a.result, score: a.score })))}
    - Pending Tasks/Goals: ${JSON.stringify(tasks.map(t => t.title))}
    - ADHD Diagnosed: ${profile?.adhdDiagnosed ? 'Yes' : 'No'}

    TASK:
    Summarize this data into a concise "Therapist Briefing" (max 150 words). 
    Focus on:
    1. Overall emotional trajectory (Is the patient stable, declining, or improving?)
    2. High-risk signals or significant assessment changes.
    3. Suggested talking points for today's session based on their mood notes or pending tasks.

    FORMAT:
    Return a clean string of text.
  `

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('[CARE_BRIEFING_ERROR]', error)
    return "Unable to generate briefing. Please review recent mood logs and assessments manually."
  }
}
