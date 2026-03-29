import { prisma } from "./lib/prisma"

async function main() {
  const practitioners = await prisma.practitionerProfile.findMany({
    include: { user: true }
  })
  console.log("Current Practitioners:")
  practitioners.forEach(p => {
    console.log(`- ID: ${p.id}, UserID: ${p.userId}, Name: ${p.user.name}, Email: ${p.user.email}, Calendly: ${p.calendlyLink}`)
  })
}

main()
