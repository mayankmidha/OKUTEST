import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const { name, email, password, role, location } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Determine initial role
    const userRole = role === 'THERAPIST' ? UserRole.THERAPIST : UserRole.CLIENT

    // Create User and Profile in a transaction
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        location: location || null,
        // Auto-create profile based on role
        clientProfile: userRole === UserRole.CLIENT ? { create: {} } : undefined,
        practitionerProfile: userRole === UserRole.THERAPIST ? { create: { bio: '', specialization: [] } } : undefined
      },
    })

    // Lead Nurturing: Log the registration event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        resourceType: 'USER',
        resourceId: user.id,
        changes: JSON.stringify({ name: user.name, email: user.email, role: user.role, location: user.location }),
      }
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
