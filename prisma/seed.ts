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
      specialization: ['Psychiatry', 'Medication Management', 'Mood Disorders', 'Clinical Assessment'],
      avatar: '/wp-content/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg'
    },
    {
      name: 'Tanisha Singh',
      email: 'tanisha@okutherapy.com',
      title: 'Clinical Psychologist & Psychodynamic Psychotherapist',
      specialization: ['Psychodynamic', 'Trauma-Informed', 'Depression', 'Clinical Psychology', 'Trauma-Informed Care'],
      avatar: '/wp-content/uploads/2025/07/Tanisha_-821x1024.jpg'
    },
    {
      name: 'Rananjay Singh',
      email: 'rananjay@okutherapy.com',
      title: 'Queer Affirmative & Family Therapist',
      specialization: ['Queer-Affirmative', 'Family Therapy', 'Relationships', 'Queer-Affirmative Therapy', 'Relationship Counseling'],
      avatar: '/wp-content/uploads/2025/07/Rananjay--579x1024.jpg'
    },
    {
      name: 'Amna Ansari',
      email: 'amna@okutherapy.com',
      title: 'Clinical Psychologist (A.)',
      specialization: ['Clinical Psychology', 'Anxiety', 'OCD', 'Cognitive Behavioral Therapy', 'Anxiety Treatment'],
      avatar: '/wp-content/uploads/2025/07/Amna-670x1024.jpg'
    },
    {
      name: 'Mohit Dudeja',
      email: 'mohit@okutherapy.com',
      title: 'Queer Affirmative Therapist',
      specialization: ['Queer-Affirmative', 'Individual Therapy', 'Grief', 'Gender Identity', 'LGBTQ+ Support'],
      avatar: '/wp-content/uploads/2025/07/Mohit-911x1024.jpg'
    },
    {
      name: 'Gursheel Kaur',
      email: 'gursheel@okutherapy.com',
      title: 'Psychodynamic Psychotherapist',
      specialization: ['Psychodynamic', 'Relational Therapy', 'Self-Esteem', 'Depth Psychology', 'Trauma Work'],
      avatar: '/wp-content/uploads/2025/07/gursheel_pfp-1024x980.jpg'
    }
  ]

  for (const t of therapists) {
    // First, find if a user with this email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: t.email },
      include: { practitionerProfile: true }
    })

    if (existingUser) {
      // Update existing user and their profile
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: t.name,
          avatar: t.avatar,
          practitionerProfile: {
            update: {
              bio: `${t.name} is a ${t.title} at Oku Therapy.`,
              specialization: t.specialization,
            }
          }
        }
      })
    } else {
      // Create new user and profile
      await prisma.user.create({
        data: {
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

  // 4. Create ASSESSMENTS
  const assessments = [
    {
      id: 'anxiety-check',
      title: 'Anxiety Check',
      description: 'A gentle look at your recent feelings of worry and tension.',
      questions: [
        { id: '1', text: 'Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '2', text: 'How often have you been unable to stop or control worrying?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '3', text: 'How often have you worried too much about different things?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '4', text: 'How often have you had trouble relaxing?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '5', text: 'How often have you been so restless that it is hard to sit still?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '6', text: 'How often have you become easily annoyed or irritable?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '7', text: 'How often have you felt afraid, as if something awful might happen?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] }
      ]
    },
    {
      id: 'mood-landscape',
      title: 'Mood Landscape',
      description: 'Understanding the patterns of your emotional well-being.',
      questions: [
        { id: '1', text: 'Little interest or pleasure in doing things?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '2', text: 'Feeling down, depressed, or hopeless?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '3', text: 'Trouble falling or staying asleep, or sleeping too much?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '4', text: 'Feeling tired or having little energy?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '5', text: 'Poor appetite or overeating?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '6', text: 'Feeling bad about yourself - or that you are a failure?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '7', text: 'Trouble concentrating on things?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '8', text: 'Moving or speaking slowly, or being fidgety/restless?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '9', text: 'Thoughts that you would be better off dead or hurting yourself?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] },
        { id: '10', text: 'How difficult have these problems made it to do your work or daily activities?', options: [{ label: 'Not at all', value: 0 }, { label: 'Several days', value: 1 }, { label: 'More than half the days', value: 2 }, { label: 'Nearly every day', value: 3 }] }
      ]
    },
    {
      id: 'trauma-screening',
      title: 'Trauma Screening',
      description: 'A safe, body-aware check-in for stored experiences.',
      questions: [
        { id: '1', text: 'Have you experienced or witnessed a traumatic event?', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
        { id: '2', text: 'Do you have repeated, disturbing memories or dreams?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '3', text: 'Do you feel very upset when reminded of the experience?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '4', text: 'Do you avoid activities that remind you of the experience?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '5', text: 'Do you feel distant or cut off from other people?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '6', text: 'Do you feel irritable or have angry outbursts?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '7', text: 'Do you feel constantly on guard or easily startled?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '8', text: 'Do you have trouble concentrating?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '9', text: 'Do you have trouble falling or staying asleep?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '10', text: 'Have you experienced flashbacks or felt like the event was happening again?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '11', text: 'Do you have physical reactions when reminded (heart racing, sweating)?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] },
        { id: '12', text: 'Do you try to avoid thoughts or feelings about the experience?', options: [{ label: 'Not at all', value: 0 }, { label: 'A little bit', value: 1 }, { label: 'Moderately', value: 2 }, { label: 'Quite a bit', value: 3 }, { label: 'Extremely', value: 4 }] }
      ]
    }
  ]

  for (const a of assessments) {
    await prisma.assessment.upsert({
      where: { id: a.id },
      update: {
        title: a.title,
        description: a.description,
        questions: a.questions,
        isActive: true
      },
      create: {
        id: a.id,
        title: a.title,
        description: a.description,
        questions: a.questions,
        isActive: true
      }
    })
  }

  console.log('Assessments seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
