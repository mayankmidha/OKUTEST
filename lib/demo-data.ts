import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function seedDemoData(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const demoUsers = [
    {
      email: 'admin@okutherapy.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    {
      email: 'therapist@okutherapy.com',
      name: 'Dr. Jane Smith',
      password: hashedPassword,
      role: UserRole.THERAPIST,
    },
    {
      email: 'client@okutherapy.com',
      name: 'John Doe',
      password: hashedPassword,
      role: UserRole.CLIENT,
    },
  ]

  const credentials = []

  for (const userData of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    })
    
    credentials.push({
      email: userData.email,
      password: 'password123',
      role: userData.role
    })

    // If therapist, create practitioner profile
    if (userData.role === UserRole.THERAPIST) {
      await prisma.practitionerProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          bio: 'Demo therapist profile',
          specialization: ['Anxiety', 'Depression'],
          isVerified: true
        }
      })
    }
  }

  return { credentials }
}
