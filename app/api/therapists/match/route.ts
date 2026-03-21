import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { CATEGORY_MATCHES } from "@/lib/assessments"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 })
  }

  const specializations = CATEGORY_MATCHES[category] || []

  // Find practitioners whose specializations overlap with the category's keywords
  const practitioners = await prisma.practitionerProfile.findMany({
    where: {
      OR: specializations.map(spec => ({
        specialization: {
          has: spec
        }
      }))
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true
        }
      }
    },
    take: 3 // Limit to 3 matches
  })

  // Fallback to top 3 practitioners if no exact matches found
  if (practitioners.length === 0) {
    const fallback = await prisma.practitionerProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      take: 3
    })
    return NextResponse.json(fallback)
  }

  return NextResponse.json(practitioners)
}
