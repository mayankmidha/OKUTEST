import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.THERAPIST) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { clientId, medicationName, dosage, frequency, instructions, refills } = await req.json();

    const prescription = await prisma.prescription.create({
      data: {
        clientId,
        practitionerId: session.user.id,
        medicationName,
        dosage,
        frequency,
        instructions,
        refills,
        startDate: new Date(),
        status: 'ACTIVE'
      }
    });

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("[PRESCRIPTION_ENGINE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    const prescriptions = await prisma.prescription.findMany({
      where: { 
        clientId: clientId || session.user.id,
        status: 'ACTIVE'
      },
      include: { practitioner: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("[PRESCRIPTION_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
