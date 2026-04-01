import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const context = await prisma.careContext.findUnique({
      where: { userId: session.user.id }
    })
    
    // Default 80% energy if no context exists
    const energy = (context?.executiveFunction as any)?.energyLevel ?? 80
    return NextResponse.json({ energy })
  } catch (error) {
    return new NextResponse("Error fetching energy", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { energy } = await req.json()
    
    await prisma.careContext.upsert({
      where: { userId: session.user.id },
      update: {
        executiveFunction: {
          energyLevel: energy,
          lastUpdated: new Date().toISOString()
        }
      },
      create: {
        userId: session.user.id,
        executiveFunction: {
          energyLevel: energy,
          lastUpdated: new Date().toISOString()
        }
      }
    })

    return new NextResponse("Energy synchronized", { status: 200 })
  } catch (error) {
    console.error("[ENERGY_SYNC_ERROR]", error)
    return new NextResponse("Error syncing energy", { status: 500 })
  }
}
