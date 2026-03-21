import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const practitioner = await prisma.practitionerProfile.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!practitioner) {
    return new NextResponse("Not Found", { status: 404 })
  }

  return NextResponse.json(practitioner)
}
