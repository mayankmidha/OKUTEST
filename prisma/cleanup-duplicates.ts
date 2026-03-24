import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning up duplicate therapist accounts with correct field names...')
  
  const duplicates = await prisma.user.findMany({
    where: {
      email: {
        contains: '.therapist@'
      }
    }
  })

  console.log(`Found ${duplicates.length} duplicate accounts to remove.`)

  for (const user of duplicates) {
    console.log(`Cleaning up data for ${user.email}...`)
    
    const appointments = await prisma.appointment.findMany({
        where: { practitionerId: user.id }
    })
    
    const appointmentIds = appointments.map(a => a.id)

    if (appointmentIds.length > 0) {
        await prisma.payment.deleteMany({ where: { appointmentId: { in: appointmentIds } } })
        await prisma.soapNote.deleteMany({ where: { appointmentId: { in: appointmentIds } } })
        await prisma.transcript.deleteMany({ where: { appointmentId: { in: appointmentIds } } })
        await prisma.appointment.deleteMany({ where: { id: { in: appointmentIds } } })
    }

    await prisma.practitionerProfile.deleteMany({ where: { userId: user.id } })
    await prisma.auditLog.deleteMany({ where: { userId: user.id } })
    await prisma.userActivity.deleteMany({ where: { userId: user.id } })
    await prisma.notification.deleteMany({ where: { userId: user.id } })
    await prisma.message.deleteMany({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } })

    await prisma.user.delete({ where: { id: user.id } })
    
    console.log(`Successfully deleted ${user.email}`)
  }

  console.log('Database cleanup complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
