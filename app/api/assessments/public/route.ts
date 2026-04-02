import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        isActive: true,
        isPublic: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        createdAt: true,
      }
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error('[PUBLIC_ASSESSMENTS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
