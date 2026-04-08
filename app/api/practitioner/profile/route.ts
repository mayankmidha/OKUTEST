import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { randomUUID } from "crypto"

export async function PATCH(req: Request) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { 
        name,
        bio,
        indiaSessionRate,
        internationalSessionRate,
        licenseNumber,
        specialization,
        education,
        experienceYears,
        linkedinUrl,
        websiteUrl,
        timezone,
        googleCalendarEmail,
        outlookCalendarEmail,
        appleCalendarEmail,
        appleAppSpecificPassword,
        calendlyLink,
        syncEnabled,
        isOnboarded,
    } = await req.json()

    const parsedIndiaSessionRate = Number.parseFloat(String(indiaSessionRate ?? ''))
    const parsedInternationalSessionRate = Number.parseFloat(String(internationalSessionRate ?? ''))

    const specializationList = Array.isArray(specialization)
      ? specialization.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      : []
    const normalizedCalendlyLink = typeof calendlyLink === 'string' ? calendlyLink.trim() : null
    const normalizedGoogleCalendarEmail =
      typeof googleCalendarEmail === 'string' ? googleCalendarEmail.trim() : null
    const normalizedOutlookCalendarEmail =
      typeof outlookCalendarEmail === 'string' ? outlookCalendarEmail.trim() : null
    const normalizedAppleCalendarEmail =
      typeof appleCalendarEmail === 'string' ? appleCalendarEmail.trim() : null
    const normalizedAppleAppSpecificPassword =
      typeof appleAppSpecificPassword === 'string' ? appleAppSpecificPassword.trim() : null
    const shouldEnableSync = Boolean(syncEnabled)
    const [hasAvailability, currentProfile] = await Promise.all([
      prisma.availability.findFirst({
        where: {
          practitionerProfile: {
            userId: session.user.id,
          },
        },
        select: { id: true },
      }),
      prisma.practitionerProfile.findUnique({
        where: { userId: session.user.id },
        select: { iCalSecret: true },
      }),
    ])
    const meetsOnboardingRequirements =
      Boolean(bio) &&
      specializationList.length > 0 &&
      Boolean(licenseNumber) &&
      Boolean(education) &&
      !Number.isNaN(parsedIndiaSessionRate)

    // Update User and PractitionerProfile in a transaction
    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name }
      }),
      prisma.practitionerProfile.update({
        where: { userId: session.user.id },
        data: {
          bio,
          hourlyRate: Number.isNaN(parsedInternationalSessionRate) ? null : parsedInternationalSessionRate,
          indiaSessionRate: Number.isNaN(parsedIndiaSessionRate) ? null : parsedIndiaSessionRate,
          internationalSessionRate: Number.isNaN(parsedInternationalSessionRate) ? null : parsedInternationalSessionRate,
          licenseNumber,
          specialization: specializationList,
          education,
          experienceYears: parseInt(experienceYears) || 0,
          linkedinUrl,
          websiteUrl,
          baseCurrency: 'INR',
          timezone: timezone || 'UTC',
          calendlyLink: normalizedCalendlyLink || null,
          googleCalendarEmail: normalizedGoogleCalendarEmail || null,
          outlookCalendarEmail: normalizedOutlookCalendarEmail || null,
          appleCalendarEmail: normalizedAppleCalendarEmail || null,
          appleAppSpecificPassword: normalizedAppleAppSpecificPassword || null,
          syncEnabled: shouldEnableSync,
          iCalSecret:
            shouldEnableSync && !currentProfile?.iCalSecret
              ? randomUUID()
              : undefined,
          isOnboarded: Boolean(isOnboarded) && meetsOnboardingRequirements && Boolean(hasAvailability),
        }
      })
    ])

    return NextResponse.json({ user: updatedUser, profile: updatedProfile })
  } catch (error) {
    console.error("Profile update error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
