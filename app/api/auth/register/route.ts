import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'
import { createReferralCode, findReferralReferrer } from '@/lib/referrals'

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      phone,
      bio,
      licenseNumber,
      specialization,
      education,
      experienceYears,
      consultationFee,
      hourlyRate,
      referralCode,
    } = await req.json()

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
    const practitionerSpecializations = Array.isArray(specialization)
      ? specialization.filter(Boolean)
      : typeof specialization === 'string' && specialization.trim()
        ? [specialization.trim()]
        : []
    const parsedExperienceYears = Number.parseInt(String(experienceYears ?? ''), 10)
    const parsedHourlyRate = Number.parseFloat(String(consultationFee ?? hourlyRate ?? ''))
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
        location: location || null,
        phone: phone || null,
        // Auto-create profile based on role
        clientProfile: userRole === UserRole.CLIENT ? { create: {} } : undefined,
        practitionerProfile: userRole === UserRole.THERAPIST ? {
          create: {
            bio: bio?.trim() || '',
            licenseNumber: licenseNumber?.trim() || null,
            specialization: practitionerSpecializations,
            education: education?.trim() || null,
            experienceYears: Number.isNaN(parsedExperienceYears) ? 0 : parsedExperienceYears,
            hourlyRate: Number.isNaN(parsedHourlyRate) ? null : parsedHourlyRate,
            indiaSessionRate: Number.isNaN(parsedHourlyRate) ? null : parsedHourlyRate,
            internationalSessionRate: Number.isNaN(parsedHourlyRate) ? null : parsedHourlyRate,
            baseCurrency: 'INR',
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
          phone: user.phone,
          specialization: practitionerSpecializations,
          referredById: user.referredById,
          referralCode: user.referralCode,
        }),
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
