import { PrismaClient, PaymentStatus, AppointmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sarah = await prisma.user.findUnique({ where: { email: 'sarah@client.com' } })
  const suraj = await prisma.user.findUnique({ where: { email: 'suraj@okutherapy.com' } })
  const service = await prisma.service.findFirst()

  if (!sarah || !suraj || !service) {
    console.error('Required data (client, practitioner, or service) not found. Run seed first.')
    return
  }

  // Create a completed appointment
  const appt = await prisma.appointment.create({
    data: {
      clientId: sarah.id,
      practitionerId: suraj.id,
      serviceId: service.id,
      startTime: new Date(Date.now() - 86400000), // Yesterday
      endTime: new Date(Date.now() - 86400000 + 3600000),
      status: AppointmentStatus.COMPLETED,
    }
  })

  // Create a completed payment
  await prisma.payment.create({
    data: {
      appointmentId: appt.id,
      userId: sarah.id,
      amount: service.price,
      status: PaymentStatus.COMPLETED,
      processor: 'STRIPE',
      stripePaymentId: 'ch_simulated_' + Math.random().toString(36).substring(7)
    }
  })

  console.log('Simulated completed payment created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
