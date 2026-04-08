import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { savePrivateFile } from "@/lib/private-storage"

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_BYTES = 10 * 1024 * 1024

/**
 * Patient Portal 2.0 - Secure Document Vault
 * Finalizes the logic for clinical document uploads.
 * Required for institutional onboarding.
 */
export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const name = (formData.get('title') as string | null)?.trim() || file?.name
    const requestedType = (formData.get('type') as string | null)?.trim()
    const clientId = (formData.get('clientId') as string | null)?.trim()
    const isPrivateField = formData.get('isPrivate')
    
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new NextResponse('Unsupported file type', { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return new NextResponse('File must be under 10MB', { status: 400 })
    }

    const isTherapist = session.user.role === UserRole.THERAPIST
    let finalClientId = session.user.id
    let finalPractitionerId: string | null = null

    if (isTherapist) {
      if (!clientId) {
        return new NextResponse('Missing client ID', { status: 400 })
      }

      const relationship = await prisma.appointment.findFirst({
        where: {
          practitionerId: session.user.id,
          clientId,
        },
        select: { id: true },
      })

      if (!relationship) {
        return new NextResponse('You can only upload documents for clients in your caseload.', { status: 403 })
      }

      finalClientId = clientId
      finalPractitionerId = session.user.id
    } else {
      const lastAppt = await prisma.appointment.findFirst({
        where: { clientId: session.user.id },
        orderBy: { createdAt: 'desc' },
        select: { practitionerId: true },
      })

      if (!lastAppt?.practitionerId) {
        return new NextResponse('No assigned practitioner found for this upload.', { status: 400 })
      }

      finalPractitionerId = lastAppt.practitionerId
    }

    const isPrivate =
      typeof isPrivateField === 'string'
        ? isPrivateField === 'true'
        : isPrivateField instanceof File
          ? true
          : true

    const storedFile = await savePrivateFile({
      file,
      scope: `documents/${finalClientId}`,
      preferredName: name,
    })

    console.log(`[VAULT] Upload stored: ${name} from user ${session.user.id}`)

    const document = await prisma.document.create({
        data: {
            clientId: finalClientId,
            practitionerId: finalPractitionerId,
            name: name || file.name,
            url: storedFile.storageKey,
            type: requestedType || file.type,
            uploadedBy: isTherapist ? 'PRACTITIONER' : 'CLIENT',
            isPrivate,
        }
    })

    // Log the access/upload for HIPAA audit
    await prisma.userActivity.create({
        data: {
            userId: session.user.id,
            action: 'DOCUMENT_UPLOADED',
            category: 'CLINICAL_DOCUMENTATION',
            metadata: { documentId: document.id, fileName: name, size: file.size },
        }
    })

    return NextResponse.json(document)

  } catch (e) {
    console.error('[UPLOAD_ERROR]', e)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
