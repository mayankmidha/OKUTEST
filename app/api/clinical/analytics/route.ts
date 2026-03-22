import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId') || session.user.id
  
  // Security check: If a practitioner is fetching, they must have had an appointment with this client
  if (session.user.role === UserRole.THERAPIST) {
      const hasAccess = await prisma.appointment.findFirst({
          where: { practitionerId: session.user.id, clientId }
      })
      if (!hasAccess) return new NextResponse("Forbidden", { status: 403 })
  }

  try {
    const answers = await prisma.assessmentAnswer.findMany({
      where: { userId: clientId },
      include: { assessment: { select: { title: true } } },
      orderBy: { completedAt: 'asc' }
    })

    // Group by assessment type for charting
    const groups: Record<string, any[]> = {}
    answers.forEach(ans => {
        if (!groups[ans.assessment.title]) groups[ans.assessment.title] = []
        groups[ans.assessment.title].push({
            date: ans.completedAt,
            score: ans.score,
            result: ans.result
        })
    })

    return NextResponse.json(groups)
  } catch (error) {
    return new NextResponse("Error fetching analytics", { status: 500 })
  }
}
