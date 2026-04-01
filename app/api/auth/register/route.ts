import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'
import { createReferralCode, findReferralReferrer } from '@/lib/referrals'
import { detectCurrency } from '@/lib/currency'
import { sendWelcomeEmail } from '@/lib/notifications'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      password,
      role,
      location: manualLocation,
      referralCode,
      dateOfBirth,
    } = body

    // 1. SMART DETECTION: Get location/timezone from headers or client
    const headerList = await headers()
    const ipCountry = headerList.get('x-vercel-ip-country') || 'IN' // Default to India for safety
    const timezone = body.timezone || 'UTC'
    
    // Auto-resolve location if not provided
    const finalLocation = manualLocation || (ipCountry === 'IN' ? 'India' : 'International')
    const baseCurrency = detectCurrency(finalLocation)

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
    const referredBy = await findReferralReferrer(referralCode)
    const generatedReferralCode = await createReferralCode(name)

    // Create User and Profile in a transaction
    const user = await prisma.user.create({
      data: {
        name,
        email,
        referralCode: generatedReferralCode,
        referredById: referredBy?.role === UserRole.CLIENT ? referredBy.id : null,
        password: hashedPassword,
        role: userRole,
        location: finalLocation,
        // Auto-create profile with smart defaults
        clientProfile: userRole === UserRole.CLIENT ? { 
            create: { 
                timezone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null
            } 
        } : undefined,
        practitionerProfile: userRole === UserRole.THERAPIST ? {
          create: {
            baseCurrency,
            timezone,
            isVerified: false
          }
        } : undefined
      },
    })

    // Lead Nurturing: Log the registration event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        resourceType: 'USER',
        resourceId: user.id,
        changes: JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          timezone,
          baseCurrency,
          referredById: user.referredById,
          referralCode: user.referralCode,
        }),
      }
    })

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.id).catch((e) => console.error('[WELCOME_EMAIL_ERROR]', e))

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
