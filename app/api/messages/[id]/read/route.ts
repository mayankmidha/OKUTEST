import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { id } = await params
    
    await prisma.message.update({
      where: { 
        id,
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      data: { 
        isRead: true,
        readAt: new Date()
      }
    })

    return NextResponse.json({ message: 'Message marked as read' })

  } catch (error) {
    console.error('[MESSAGE_READ_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
