import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Granting Tanisha Singh editorial permissions...')
  
  const tanisha = await prisma.user.findUnique({
    where: { email: 'tanisha@okutherapy.com' }
  })

  if (!tanisha) {
    console.error('Tanisha not found. Run seed first.')
    return
  }

  await prisma.practitionerProfile.update({
    where: { userId: tanisha.id },
    data: { canPostBlogs: true }
  })

  console.log('Successfully granted Tanisha Singh editorial power!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
