import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAppointmentBillingAmount } from "@/lib/pricing";
import { AppointmentStatus, UserRole } from "@prisma/client";

async function canAccessClientInsurance({
  userId,
  role,
  clientId,
  appointmentId,
}: {
  userId: string
  role: string
  clientId: string
  appointmentId?: string | null
}) {
  if (role === UserRole.ADMIN) return true
  if (role === UserRole.CLIENT) return userId === clientId
  if (role !== UserRole.THERAPIST) return false

  const relationship = await prisma.appointment.findFirst({
    where: {
      practitionerId: userId,
      clientId,
      ...(appointmentId ? { id: appointmentId } : {}),
    },
    select: { id: true },
  })

  return Boolean(relationship)
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { action, policyId, appointmentId } = await req.json();

    if (action === 'VERIFY_ELIGIBILITY') {
      if (!policyId) return new NextResponse("Missing policy ID", { status: 400 });

      const policy = await prisma.insurancePolicy.findUnique({
        where: { id: policyId }
      });

      if (!policy) return new NextResponse("Policy not found", { status: 404 });

      const allowed = await canAccessClientInsurance({
        userId: session.user.id,
        role: session.user.role,
        clientId: policy.userId,
        appointmentId,
      })
      if (!allowed) {
        return new NextResponse("Forbidden", { status: 403 })
      }

      const hasRequiredDetails =
        Boolean(policy.providerName?.trim()) && Boolean(policy.policyNumber?.trim())
      const nextStatus = hasRequiredDetails
        ? 'MANUAL_REVIEW_REQUIRED'
        : 'INCOMPLETE_INFORMATION'
      
      await prisma.insurancePolicy.update({
        where: { id: policyId },
        data: { status: nextStatus }
      });

      return NextResponse.json({ 
        status: nextStatus,
        coverageDetails: hasRequiredDetails
          ? "Automatic payer eligibility checks are not connected in this environment yet. This policy has enough information to move into manual insurance review."
          : "This policy is missing required details. Add the provider name and policy number before requesting verification.",
        verifiedAutomatically: false,
      });
    }

    if (action === 'SUBMIT_CLAIM') {
      if (!appointmentId) return new NextResponse("Missing appointment ID", { status: 400 });

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { service: true, client: { include: { insurancePolicies: { where: { isPrimary: true } } } } }
      });

      if (!appointment || !appointment.client || !appointment.client.insurancePolicies[0]) {
        return new NextResponse("Incomplete claim data", { status: 400 });
      }
      const allowed = await canAccessClientInsurance({
        userId: session.user.id,
        role: session.user.role,
        clientId: appointment.clientId || '',
        appointmentId: appointment.id,
      })
      if (!allowed) {
        return new NextResponse("Forbidden", { status: 403 })
      }
      if (appointment.status !== AppointmentStatus.COMPLETED) {
        return new NextResponse("Claims can only be queued after the appointment is completed.", { status: 409 })
      }

      const primaryPolicy = appointment.client.insurancePolicies[0]
      if (!primaryPolicy.providerName?.trim() || !primaryPolicy.policyNumber?.trim()) {
        return new NextResponse("Primary policy is missing required details.", { status: 409 })
      }

      const appointmentAmount = getAppointmentBillingAmount(appointment)

      const claim = await prisma.claim.upsert({
        where: { appointmentId: appointment.id },
        create: {
          policyId: primaryPolicy.id,
          appointmentId: appointment.id,
          status: 'PENDING_REVIEW',
          claimAmount: appointmentAmount,
          filedAt: new Date()
        },
        update: {
          policyId: primaryPolicy.id,
          status: 'PENDING_REVIEW',
          claimAmount: appointmentAmount,
          filedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        claimId: claim.id,
        status: claim.status,
        submittedAutomatically: false,
        message: 'Claim packet created and queued for manual insurance review. Direct payer submission is not active in this environment.',
      });
    }

    return new NextResponse("Invalid Action", { status: 400 });

  } catch (error) {
    console.error("[INSURANCE_ENGINE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
