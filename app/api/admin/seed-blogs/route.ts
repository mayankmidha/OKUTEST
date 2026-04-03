import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { posts } from '@/prisma/seed-blogs-30'

export async function POST() {
  const start = Date.now()
  const session = await auth()
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log(JSON.stringify({ level: 'info', msg: 'seed-blogs start', adminId: session.user.id }))

  try {
    const admin = await prisma.user.findFirst({ where: { role: UserRole.ADMIN } })
    if (!admin) {
      return NextResponse.json({ error: 'No admin user found' }, { status: 500 })
    }

    let seeded = 0
    let skipped = 0

    for (const post of posts) {
      const existing = await prisma.post.findUnique({ where: { slug: post.slug }, select: { id: true } })
      if (existing) { skipped++; continue }
      await prisma.post.create({
        data: {
          slug: post.slug,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          published: true,
          authorId: admin.id,
        },
      })
      seeded++
    }

    console.log(JSON.stringify({ level: 'info', msg: 'seed-blogs done', seeded, skipped, ms: Date.now() - start }))
    return NextResponse.json({ seeded, skipped })
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'seed-blogs failed', error: String(err), ms: Date.now() - start }))
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
