import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Create ADMIN
  await prisma.user.upsert({
    where: { email: 'admin@okutherapy.com' },
    update: {},
    create: {
      email: 'admin@okutherapy.com',
      name: 'Oku Admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  })

  // 2. Create THERAPISTS (Official Team)
  const therapists = [
    {
      name: 'Dr. Suraj Singh',
      email: 'suraj@okutherapy.com',
      title: 'Consultant Psychiatrist',
      specialization: ['Psychiatry', 'Medication Management', 'Mood Disorders'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg'
    },
    {
      name: 'Tanisha Singh',
      email: 'tanisha@okutherapy.com',
      title: 'Clinical Psychologist & Psychodynamic Psychotherapist',
      specialization: ['Psychodynamic', 'Trauma-Informed', 'Depression'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Tanisha_-821x1024.jpg'
    },
    {
      name: 'Rananjay Singh',
      email: 'rananjay@okutherapy.com',
      title: 'Queer Affirmative & Family Therapist',
      specialization: ['Queer-Affirmative', 'Family Therapy', 'Relationships'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Rananjay--579x1024.jpg'
    },
    {
      name: 'Amna Ansari',
      email: 'amna@okutherapy.com',
      title: 'Clinical Psychologist (A.)',
      specialization: ['Clinical Psychology', 'Anxiety', 'OCD'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Amna-670x1024.jpg'
    },
    {
      name: 'Mohit Dudeja',
      email: 'mohit@okutherapy.com',
      title: 'Queer Affirmative Therapist',
      specialization: ['Queer-Affirmative', 'Individual Therapy', 'Grief'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Mohit-911x1024.jpg'
    },
    {
      name: 'Gursheel Kaur',
      email: 'gursheel@okutherapy.com',
      title: 'Psychodynamic Psychotherapist',
      specialization: ['Psychodynamic', 'Relational Therapy', 'Self-Esteem'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/gursheel_pfp-1024x980.jpg'
    }
  ]

  for (const t of therapists) {
    await prisma.user.upsert({
      where: { email: t.email },
      update: {
        name: t.name,
        avatar: t.avatar,
      },
      create: {
        email: t.email,
        name: t.name,
        password: hashedPassword,
        role: UserRole.THERAPIST,
        avatar: t.avatar,
        practitionerProfile: {
          create: {
            bio: `${t.name} is a ${t.title} at Oku Therapy.`,
            specialization: t.specialization,
            isVerified: true,
            availability: {
              create: [
                { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
                { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
                { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
                { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
                { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
              ]
            }
          }
        }
      }
    })
  }

  // 3. Create CLIENTS
  const clients = [
    { name: 'Sarah Miller', email: 'sarah@client.com' },
    { name: 'Michael Ross', email: 'michael@client.com' },
    { name: 'Elena Gilbert', email: 'elena@client.com' }
  ]

  for (const c of clients) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: { name: c.name },
      create: {
        email: c.email,
        name: c.name,
        password: hashedPassword,
        role: UserRole.CLIENT,
        clientProfile: {
          create: {
            noShowCount: 0
          }
        }
      }
    })
  }

  console.log('Database seeded with official team successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
