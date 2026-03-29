import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { id } = await params
    
    // Get document and verify access
    const document = await prisma.document.findUnique({
      where: { id }
    })

    if (!document) {
      return new NextResponse('Document not found', { status: 404 })
    }

    // Check access permissions
    const hasAccess = 
      document.clientId === session.user.id || // Client can delete their own docs
      (document.practitionerId === session.user.id && session.user.role === UserRole.THERAPIST) // Practitioner can delete docs they uploaded

    if (!hasAccess) {
      return new NextResponse('Access denied', { status: 403 })
    }

    // Delete document
    await prisma.document.delete({
      where: { id }
    })

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DOCUMENT_DELETED',
        resourceType: 'DOCUMENT',
        resourceId: id,
        changes: JSON.stringify({
          filename: document.name,
          type: document.type
        })
      }
    })

    return NextResponse.json({ message: 'Document deleted successfully' })

  } catch (error) {
    console.error('[DOCUMENT_DELETE_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
