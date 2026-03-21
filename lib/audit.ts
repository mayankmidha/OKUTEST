import { prisma } from './prisma'

export async function createAuditLog({
  userId,
  action,
  resourceType,
  resourceId,
  changes,
  ipAddress,
  userAgent
}: {
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  changes?: string,
  ipAddress?: string,
  userAgent?: string
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        changes,
        ipAddress,
        userAgent
      }
    })
  } catch (error) {
    console.error('FAILED_TO_CREATE_AUDIT_LOG', error)
  }
}
