import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateAnonymousAlias } from '@/lib/aliases'

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const userId = session.user.id

    // Fetch all clinical records for the client
    const [clientProfile, assessmentAnswers, treatmentPlans, assignedTasks] = await Promise.all([
      prisma.clientProfile.findUnique({
        where: { userId },
        select: { 
            id: true, 
            isOnboarded: true, 
            adhdDiagnosed: true,
            anonymousAlias: true 
        }
      }),
      prisma.assessmentAnswer.findMany({
        where: { userId },
        include: { assessment: { select: { title: true } } },
        orderBy: { completedAt: 'desc' }
      }),
      prisma.treatmentPlan.findMany({
        where: { clientId: userId },
        include: { practitioner: { select: { name: true } } },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.assignedAssessment.findMany({
        where: { 
            clientId: userId,
            status: 'PENDING'
        },
        include: { 
            assessment: { select: { title: true, price: true } },
            practitioner: { select: { name: true } }
        }
      })
    ])

    // Ensure the client has an anonymous alias (Migration Fallback)
    let finalAlias = clientProfile?.anonymousAlias
    if (clientProfile && !finalAlias) {
        finalAlias = generateAnonymousAlias()
        await prisma.clientProfile.update({
            where: { userId },
            data: { anonymousAlias: finalAlias }
        })
    }

    return NextResponse.json({
      profile: { ...clientProfile, anonymousAlias: finalAlias },
      assessmentAnswers,
      treatmentPlans,
      assignedTasks,
    })
  } catch (error) {
    console.error('[CLINICAL_DATA_GET_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
