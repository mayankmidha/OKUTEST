import { AppointmentStatus, Prisma } from '@prisma/client'

export const BOOKING_HOLD_MINUTES = 20

type AppointmentConflictWhereOptions = {
  practitionerId: string
  startTime: Date
  endTime: Date
  excludeAppointmentId?: string
  includePendingHolds?: boolean
  now?: Date
}

export function buildAppointmentConflictWhere(
  options: AppointmentConflictWhereOptions
): Prisma.AppointmentWhereInput {
  const activeStatuses: Prisma.AppointmentWhereInput[] = [
    {
      status: {
        in: [
          AppointmentStatus.SCHEDULED,
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.EXTERNAL_BLOCK,
        ],
      },
    },
  ]

  if (options.includePendingHolds) {
    activeStatuses.push({
      status: AppointmentStatus.PENDING,
      createdAt: {
        gte: new Date(
          (options.now ?? new Date()).getTime() - BOOKING_HOLD_MINUTES * 60 * 1000
        ),
      },
    })
  }

  return {
    practitionerId: options.practitionerId,
    isGroupSession: false,
    ...(options.excludeAppointmentId ? { id: { not: options.excludeAppointmentId } } : {}),
    startTime: { lt: options.endTime },
    endTime: { gt: options.startTime },
    OR: activeStatuses,
  }
}
