import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating all existing circles to community price: 500 INR...')
  
  // 1. Update the Service definition
  await prisma.service.updateMany({
    where: { name: 'Group Circle' },
    data: { price: 500 }
  })

  // 2. Update all existing Group Session records
  const result = await prisma.appointment.updateMany({
    where: { isGroupSession: true },
    data: { priceSnapshot: 500 }
  })

  console.log(`Successfully updated ${result.count} circle sessions to 500 INR.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
