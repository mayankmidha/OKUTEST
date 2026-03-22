import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tanisha = await prisma.user.findUnique({
    where: { email: 'tanisha@okutherapy.com' },
    include: { practitionerProfile: true }
  })

  const sarah = await prisma.user.findUnique({
    where: { email: 'sarah@client.com' }
  })

  if (!tanisha || !sarah || !tanisha.practitionerProfile) {
    console.error('Tanisha or Sarah not found')
    return
  }

  const service = await prisma.service.findFirst()
  if (!service) {
    console.error('No service found')
    return
  }

  const now = new Date()
  const appt = await prisma.appointment.create({
    data: {
      clientId: sarah.id,
      practitionerId: tanisha.id,
      serviceId: service.id,
      startTime: now,
      endTime: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour session
      status: AppointmentStatus.CONFIRMED
    }
  })

  console.log('Immediate test session created for Tanisha and Sarah:', appt.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
