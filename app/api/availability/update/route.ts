import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function POST(req: Request) {
  const session = await auth()
  
  // Check for THERAPIST role
  if (!session?.user?.email || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Find practitioner profile
  const practitionerProfile = await prisma.practitionerProfile.findUnique({
    where: { userId: session.user.id }
  })

  if (!practitionerProfile) {
    return new NextResponse('Practitioner profile not found', { status: 404 })
  }

  try {
    const formData = await req.formData()
    const updates = []
    
    // Process form data for days 0-6
    for(let i=0; i<7; i++) {
      // Check if day is active (checkbox)
      // Note: checkbox value is often 'on' if checked, or key is missing if unchecked
      const isActive = formData.get(`active_${i}`) === 'on'
      
      if (isActive) {
          const startTime = formData.get(`start_${i}`) as string
          const endTime = formData.get(`end_${i}`) as string
          
          if (startTime && endTime) {
            updates.push({
                dayOfWeek: i,
                startTime,
                endTime,
                practitionerProfileId: practitionerProfile.id
            })
          }
      }
    }

    // Transaction: Clear old availability and insert new
    await prisma.$transaction([
        prisma.availability.deleteMany({
            where: { practitionerProfileId: practitionerProfile.id }
        }),
        prisma.availability.createMany({
            data: updates
        })
    ])
      
    // Redirect back to dashboard or availability page
    // Using 303 for See Other is good practice after POST
    return NextResponse.redirect(new URL('/practitioner/dashboard', req.url), 303)

  } catch (e) {
      console.error('Error updating availability:', e)
      return new NextResponse('Error updating schedule', { status: 500 })
  }
}
