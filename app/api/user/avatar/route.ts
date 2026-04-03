import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 2 * 1024 * 1024 // 2MB

export async function POST(req: Request) {
  const start = Date.now()
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

  console.log(JSON.stringify({ level: 'info', msg: 'avatar upload start', userId: session.user.id }))

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: dataUrl },
    })

    console.log(JSON.stringify({ level: 'info', msg: 'avatar upload done', userId: session.user.id, ms: Date.now() - start }))
    return NextResponse.json({ avatar: dataUrl })
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'avatar upload failed', error: String(err), ms: Date.now() - start }))
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
