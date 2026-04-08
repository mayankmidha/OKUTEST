import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'
import { createReferralCode, findReferralReferrer } from '@/lib/referrals'
import { detectCurrency } from '@/lib/currency'
import { generateAnonymousAlias } from '@/lib/aliases'
import { normalizeAuthEmail, sendVerificationEmailForUser } from '@/lib/auth-user'

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
      phone,
      licenseNumber,
      specialization,
      experienceYears,
      education,
      bio,
      consultationFee,
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

    const normalizedEmail = normalizeAuthEmail(email)

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
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
    const therapistSpecializations = Array.isArray(specialization)
      ? specialization.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      : typeof specialization === 'string' && specialization.trim().length > 0
        ? [specialization.trim()]
        : []
    const parsedConsultationFee = Number.parseFloat(String(consultationFee ?? ''))
    const parsedExperienceYears = Number.parseInt(String(experienceYears ?? '0'), 10) || 0

    if (
      userRole === UserRole.THERAPIST &&
      (!licenseNumber || therapistSpecializations.length === 0 || !education || !bio)
    ) {
      return NextResponse.json(
        { error: 'Missing required practitioner onboarding fields' },
        { status: 400 }
      )
    }

    const referredBy = await findReferralReferrer(referralCode)
    const generatedReferralCode = await createReferralCode(name)

    // Create User and Profile in a transaction
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        referralCode: generatedReferralCode,
        referredById: referredBy?.role === UserRole.CLIENT ? referredBy.id : null,
        password: hashedPassword,
        role: userRole,
        location: finalLocation,
        phone: typeof phone === 'string' ? phone : null,
        // Auto-create profile with smart defaults
        clientProfile: userRole === UserRole.CLIENT ? { 
            create: { 
                timezone,
                anonymousAlias: generateAnonymousAlias(),
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null
            } 
        } : undefined,
        practitionerProfile: userRole === UserRole.THERAPIST ? {
          create: {
            baseCurrency,
            timezone,
            isVerified: false,
            licenseNumber,
            specialization: therapistSpecializations,
            bio,
            education,
            experienceYears: parsedExperienceYears,
            indiaSessionRate: Number.isNaN(parsedConsultationFee) ? null : parsedConsultationFee,
            hourlyRate: Number.isNaN(parsedConsultationFee) ? null : parsedConsultationFee,
            internationalSessionRate: Number.isNaN(parsedConsultationFee) ? null : parsedConsultationFee,
            isOnboarded: false,
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
          emailVerified: !!user.emailVerified,
          location: user.location,
          timezone,
          baseCurrency,
          referredById: user.referredById,
          referralCode: user.referralCode,
          practitionerIntakeCaptured: userRole === UserRole.THERAPIST,
        }),
      }
    })

    sendVerificationEmailForUser(user.id).catch((error) => {
      console.error('[EMAIL_VERIFICATION_SEND_ERROR]', error)
    })

    return NextResponse.json(
      { message: 'User created successfully. Please verify your email before signing in.', userId: user.id },
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
