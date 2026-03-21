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

  // 2. Create THERAPISTS (from your official team)
  const therapists = [
    {
      name: 'Dr. Suraj Singh',
      email: 'suraj.therapist@okutherapy.com',
      title: 'Consultant Psychiatrist',
      specialization: ['Mood Disorders', 'Depression', 'Anxiety'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg'
    },
    {
      name: 'Tanisha Singh',
      email: 'tanisha.therapist@okutherapy.com',
      title: 'Clinical Psychologist (A.) & Psychodynamic Psychotherapist',
      specialization: ['Trauma', 'PTSD', 'Depression'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Tanisha_-821x1024.jpg'
    },
    {
      name: 'Rananjay Singh',
      email: 'rananjay.therapist@okutherapy.com',
      title: 'Queer Affirmative & Family Therapist',
      specialization: ['Queer-Affirmative', 'Family Therapy', 'Anxiety'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Rananjay--579x1024.jpg'
    },
    {
      name: 'Amna Ansari',
      email: 'amna.therapist@okutherapy.com',
      title: 'Clinical Psychologist (A.)',
      specialization: ['OCD', 'Intrusive Thoughts', 'Anxiety'],
      avatar: 'https://okutherapy.com/wp-content/uploads/2025/07/Amna-670x1024.jpg'
    }
  ]

  for (const t of therapists) {
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
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

  // 3. Create CLIENTS / PATIENTS
  const clients = [
    { name: 'Sarah Miller', email: 'sarah.client@gmail.com' },
    { name: 'Michael Ross', email: 'michael.client@gmail.com' }
  ]

  for (const c of clients) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
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

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
