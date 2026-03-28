import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@prisma/client'
import { applyReferralCreditToAppointment } from '@/lib/referrals'
import { getPlatformSettings, getSessionRevenueSplit } from '@/lib/provider-finance'

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const formData = await req.formData()
  const sessionId = formData.get('sessionId') as string // This is actually appointmentId based on frontend usage
  const method = formData.get('method') as string

  if (!sessionId) {
    return new NextResponse('Missing session ID', { status: 400 })
  }

  try {
      // Find the appointment to get the base price
      const appointment = await prisma.appointment.findUnique({
        where: { id: sessionId },
        include: {
          service: true,
          practitioner: {
            include: {
              practitionerProfile: true,
            },
          },
        }
      })

      if (!appointment) {
        return new NextResponse('Appointment not found', { status: 404 })
      }

      const checkoutSummary = await applyReferralCreditToAppointment(appointment.id)
      const netAmount = checkoutSummary?.netAmount ?? appointment.service.price
      const processor = netAmount === 0 ? 'referral-credit' : method
      const settings = await getPlatformSettings()
      const revenueSplit = getSessionRevenueSplit({
        grossAmount: netAmount,
        practitionerProfile: appointment.practitioner.practitionerProfile,
        settings,
      })

      if (!processor) {
        return new NextResponse('Missing payment method', { status: 400 })
      }

      // Create a Payment record
      await prisma.payment.create({
        data: {
            userId: session.user.id,
            appointmentId: appointment.id,
            amount: netAmount,
            platformFeePercent: revenueSplit.platformFeePercent,
            platformFeeAmount: revenueSplit.platformFeeAmount,
            practitionerPayoutAmount: revenueSplit.practitionerPayoutAmount,
            processor,
            status: PaymentStatus.PENDING
        }
      })
      
      // Redirect to success page
      return NextResponse.redirect(new URL(`/checkout/${sessionId}/success?method=${processor}`, req.url), 303)
  } catch (e) {
      console.error('Error initiating payment:', e)
      return new NextResponse('Error initiating payment', { status: 500 })
  }
}
