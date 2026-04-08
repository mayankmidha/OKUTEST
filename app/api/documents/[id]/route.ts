import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { inferMimeType, readPrivateFile } from '@/lib/private-storage'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await params

  const document = await prisma.document.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      url: true,
      type: true,
      uploadedBy: true,
      isPrivate: true,
      clientId: true,
      practitionerId: true,
    },
  })

  if (!document) {
    return new NextResponse('Document not found', { status: 404 })
  }

  const isAdmin = session.user.role === UserRole.ADMIN
  let canAccess = false

  if (document.type === 'KYC_LICENSE') {
    canAccess = isAdmin || document.practitionerId === session.user.id
  } else if (session.user.role === UserRole.THERAPIST) {
    const relationship = await prisma.appointment.findFirst({
      where: {
        practitionerId: session.user.id,
        clientId: document.clientId,
      },
      select: { id: true },
    })

    canAccess =
      document.practitionerId === session.user.id &&
      Boolean(relationship) &&
      (document.uploadedBy === 'PRACTITIONER' || !document.isPrivate)
  } else {
    canAccess =
      document.clientId === session.user.id &&
      (document.uploadedBy === 'CLIENT' || !document.isPrivate)
  }

  if (!canAccess && !isAdmin) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (document.url.startsWith('http://') || document.url.startsWith('https://')) {
    return NextResponse.redirect(document.url, 302)
  }

  if (document.url.startsWith('/')) {
    return new NextResponse('Legacy placeholder document is unavailable.', { status: 410 })
  }

  try {
    const file = await readPrivateFile(document.url)

    return new NextResponse(file, {
      headers: {
        'Content-Type': inferMimeType(document.name),
        'Content-Disposition': `attachment; filename="${document.name.replace(/"/g, '')}"`,
      },
    })
  } catch (error) {
    console.error('[DOCUMENT_DOWNLOAD_ERROR]', error)
    return new NextResponse('Document file not found', { status: 404 })
  }
}
