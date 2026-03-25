import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { action, policyId, appointmentId } = await req.json();

    if (action === 'VERIFY_ELIGIBILITY') {
      const policy = await prisma.insurancePolicy.findUnique({
        where: { id: policyId }
      });

      if (!policy) return new NextResponse("Policy not found", { status: 404 });

      // Mocking external API call to Stedi/Change Healthcare
      const isValid = Math.random() > 0.1; // 90% success rate for demo
      
      await prisma.insurancePolicy.update({
        where: { id: policyId },
        data: { status: isValid ? 'ACTIVE' : 'FAILED_VERIFICATION' }
      });

      return NextResponse.json({ 
        status: isValid ? 'ACTIVE' : 'FAILED_VERIFICATION',
        coverageDetails: isValid ? "Covered: Outpatient Psychotherapy (CPT 90837)" : "Coverage not verified"
      });
    }

    if (action === 'SUBMIT_CLAIM') {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { service: true, client: { include: { insurancePolicies: { where: { isPrimary: true } } } } }
      });

      if (!appointment || !appointment.client || !appointment.client.insurancePolicies[0]) {
        return new NextResponse("Incomplete claim data", { status: 400 });
      }

      const claim = await prisma.claim.create({
        data: {
          policyId: appointment.client.insurancePolicies[0].id,
          appointmentId: appointment.id,
          status: 'SUBMITTED',
          claimAmount: appointment.service.price,
          filedAt: new Date()
        }
      });

      return NextResponse.json({ success: true, claimId: claim.id });
    }

    return new NextResponse("Invalid Action", { status: 400 });

  } catch (error) {
    console.error("[INSURANCE_ENGINE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
