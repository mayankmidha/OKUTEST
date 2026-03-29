import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new NextResponse('User ID required', { status: 400 })
    }

    const preferences = await prisma.notificationPreference.findMany({
      where: { userId },
      orderBy: { type: 'asc' }
    })

    return NextResponse.json(preferences)

  } catch (error) {
    console.error('[NOTIFICATION_PREFERENCES_GET_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { id, enabled } = await req.json()

    const updatedPreference = await prisma.notificationPreference.update({
      where: { 
        id,
        userId: session.user.id 
      },
      data: { 
        enabled,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedPreference)

  } catch (error) {
    console.error('[NOTIFICATION_PREFERENCE_UPDATE_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const preferences = await req.json()

    const createdPreferences = await prisma.notificationPreference.createMany({
      data: preferences.map((pref: any) => ({
        ...pref,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    })

    return NextResponse.json(createdPreferences)

  } catch (error) {
    console.error('[NOTIFICATION_PREFERENCES_CREATE_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
