import { prisma } from "./lib/prisma"

async function cleanup() {
  const practitioners = await prisma.practitionerProfile.findMany({
    include: { user: true }
  })

  const seenEmails = new Set()
  const toDelete = []

  for (const p of practitioners) {
    if (seenEmails.has(p.user.email)) {
      toDelete.push(p.id)
    } else {
      seenEmails.add(p.user.email)
    }
  }

  console.log(`Found ${toDelete.length} duplicate practitioner profiles.`)

  for (const id of toDelete) {
    await prisma.practitionerProfile.delete({ where: { id } })
    console.log(`Deleted duplicate profile: ${id}`)
  }
}

cleanup()
