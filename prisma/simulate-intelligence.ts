import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sarah = await prisma.user.findUnique({ where: { email: 'sarah@client.com' } })
  const suraj = await prisma.user.findUnique({ where: { email: 'suraj@okutherapy.com' } })

  if (!sarah || !suraj) {
    console.error('Users not found. Run seed first.')
    return
  }

  // Create a completed appointment
  const appt = await prisma.appointment.create({
    data: {
      clientId: sarah.id,
      practitionerId: suraj.id,
      serviceId: (await prisma.service.findFirst())?.id || '',
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(),
      status: AppointmentStatus.COMPLETED,
    }
  })

  // Create a simulated transcript with AI analysis
  await prisma.transcript.create({
    data: {
      appointmentId: appt.id,
      content: "Practitioner: How have you been feeling since our last session? Client: I've been struggling a lot with my work-life balance. I feel overwhelmed and my sleep has been poor. Practitioner: I'm sorry to hear that. Let's explore what's making it feel particularly heavy this week...",
      summary: "The client discussed significant challenges with work-life balance and sleep hygiene. We explored recent stressors and identified patterns of over-commitment.",
      sentiment: "NEGATIVE",
      keyInsights: [
        "High work-related stress identified",
        "Insomnia symptoms reported",
        "Boundary setting needs focus"
      ]
    }
  })

  console.log('Simulated AI Intelligence data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
