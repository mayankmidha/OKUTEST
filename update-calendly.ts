import { prisma } from "./lib/prisma"

async function main() {
  const updates = [
    { name: "Rananjay Singh", link: "https://calendly.com/rananjay1508" },
    { name: "Amna Ansari", link: "https://calendly.com/amna1312ansari" },
    { name: "Gursheel Kaur", link: "https://calendly.com/gursheelkaur222" },
    { name: "Tanisha Singh", link: "https://calendly.com/tanishas113/30min" }
  ]

  for (const update of updates) {
    const user = await prisma.user.findFirst({
        where: { name: { contains: update.name } },
        include: { practitionerProfile: true }
    })

    if (user?.practitionerProfile) {
        await prisma.practitionerProfile.update({
            where: { id: user.practitionerProfile.id },
            data: { 
                calendlyLink: update.link,
                syncEnabled: true // Enable the sync for these users
            }
        })
        console.log(`Updated ${update.name} with ${update.link}`)
    } else {
        console.warn(`Could not find practitioner for ${update.name}`)
    }
  }
}

main()
