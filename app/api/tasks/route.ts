import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return new NextResponse("Error fetching tasks", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { title } = await req.json()
    const task = await prisma.task.create({
      data: { userId: session.user.id, title }
    })
    return NextResponse.json(task)
  } catch (error) {
    return new NextResponse("Error creating task", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { id, isCompleted } = await req.json()
    const task = await prisma.task.update({
      where: { id, userId: session.user.id },
      data: { isCompleted }
    })
    return NextResponse.json(task)
  } catch (error) {
    return new NextResponse("Error updating task", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return new NextResponse("Missing ID", { status: 400 })

    await prisma.task.delete({
      where: { id, userId: session.user.id }
    })
    return new NextResponse("Deleted", { status: 200 })
  } catch (error) {
    return new NextResponse("Error deleting task", { status: 500 })
  }
}
