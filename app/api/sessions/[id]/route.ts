import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    const sessionDetails = await prisma.appointment.findUnique({
      where: { id },
      include: { 
        client: true,
        practitioner: true,
        service: true
      }
    });

    if (!sessionDetails) return new NextResponse("Session not found", { status: 404 });

    // Access Control
    const isClient = sessionDetails.clientId === session.user.id;
    const isTherapist = sessionDetails.practitionerId === session.user.id;

    if (!isClient && !isTherapist) {
      return new NextResponse("Unauthorized access to this secure clinical space.", { status: 403 });
    }

    return NextResponse.json(sessionDetails);
  } catch (error) {
    console.error("[SESSION_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
