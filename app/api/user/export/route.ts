import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const userId = session.user.id

    const [user, clientProfile, practitionerProfile, moods, assessments, messages, documents, appointments] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          createdAt: true,
          location: true,
          phone: true,
          role: true,
          hasSignedConsent: true,
          emailVerified: true,
          deletionRequestedAt: true,
        }
      }),
      prisma.clientProfile.findUnique({
        where: { userId },
        select: {
          isOnboarded: true,
          dateOfBirth: true,
          gender: true,
          medicalHistory: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
          preferredLanguage: true,
          timezone: true,
          anonymousAlias: true,
        },
      }),
      prisma.practitionerProfile.findUnique({
        where: { userId },
        select: {
          isOnboarded: true,
          isVerified: true,
          licenseNumber: true,
          specialization: true,
          bio: true,
          education: true,
          experienceYears: true,
          indiaSessionRate: true,
          internationalSessionRate: true,
          timezone: true,
        },
      }),
      prisma.moodEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      prisma.assessmentAnswer.findMany({ 
        where: { userId }, 
        include: { assessment: { select: { title: true } } },
        orderBy: { completedAt: 'desc' }
      }),
      prisma.message.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.document.findMany({
        where: { clientId: userId },
        select: {
          id: true,
          name: true,
          type: true,
          uploadedBy: true,
          isPrivate: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appointment.findMany({
        where: {
          OR: [
            { clientId: userId },
            { practitionerId: userId },
          ],
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          isTrial: true,
          isGroupSession: true,
          notes: true,
        },
        orderBy: { startTime: 'desc' },
      }),
    ])

    const exportData = {
      exportInfo: {
        generatedAt: new Date().toISOString(),
        platform: "Oku Therapy Integrated",
        format: "JSON export"
      },
      personalInfo: user,
      profile: {
        client: clientProfile,
        practitioner: practitionerProfile,
      },
      clinicalData: {
        moodHistory: moods,
        assessments,
        appointments,
        documents,
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
