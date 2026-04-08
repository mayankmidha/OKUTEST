import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { savePrivateFile } from '@/lib/private-storage'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  const start = Date.now()
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  console.log(JSON.stringify({ level: 'info', msg: 'kyc-upload start', userId: session.user.id }))

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF, JPEG, PNG, or WebP allowed' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
    }

    const storedFile = await savePrivateFile({
      file,
      scope: `kyc/${session.user.id}`,
      preferredName: file.name,
    })

    const document = await prisma.document.create({
      data: {
        clientId: session.user.id,
        practitionerId: session.user.id,
        name: file.name,
        url: storedFile.storageKey,
        type: 'KYC_LICENSE',
        uploadedBy: 'PRACTITIONER',
        isPrivate: true,
      },
    })

    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        action: 'KYC_DOCUMENT_UPLOADED',
        category: 'VERIFICATION',
        metadata: { documentId: document.id, fileName: file.name },
      },
    })

    console.log(JSON.stringify({ level: 'info', msg: 'kyc-upload done', documentId: document.id, ms: Date.now() - start }))
    return NextResponse.json({ document })
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'kyc-upload failed', error: String(err), ms: Date.now() - start }))
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const docs = await prisma.document.findMany({
    where: { practitionerId: session.user.id, type: 'KYC_LICENSE' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  })

  return NextResponse.json(docs)
}
