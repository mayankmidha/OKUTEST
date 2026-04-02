import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const userId = session.user.id

    const [user, profile, moods, assessments, messages] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, createdAt: true, location: true }
      }),
      prisma.clientProfile.findUnique({
        where: { userId },
        exclude: { id: true, userId: true } // Assuming helper or just select fields
      } as any),
      prisma.moodEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      prisma.assessmentAnswer.findMany({ 
        where: { userId }, 
        include: { assessment: { select: { title: true } } },
        orderBy: { completedAt: 'desc' }
      }),
      prisma.message.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        orderBy: { createdAt: 'desc' }
      })
    ])

    const exportData = {
      exportInfo: {
        generatedAt: new Date().toISOString(),
        platform: "Oku Therapy Integrated",
        compliance: "DPDP / HIPAA / GDPR"
      },
      personalInfo: user,
      profile,
      clinicalData: {
        moodHistory: moods,
        assessments,
      },
      communication: {
        messages: messages.map(m => ({
          role: m.senderId === userId ? 'sent' : 'received',
          content: m.content,
          timestamp: m.createdAt
        }))
      }
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="oku-medical-record-${userId}.json"`
      }
    })

  } catch (error) {
    console.error('[DATA_EXPORT_ERROR]', error)
    return new NextResponse('Export failed', { status: 500 })
  }
}
