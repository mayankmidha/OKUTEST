'use client'

import { EnhancedVideoRoom } from '@/components/EnhancedVideoRoom'

export function VideoRoom({
  sessionId,
  userId,
  userName,
  role,
  isTrial = false,
  onLeave,
}: {
  sessionId: string
  userId: string
  userName: string
  role: string
  isTrial?: boolean
  onLeave?: () => void
}) {
  return (
    <EnhancedVideoRoom 
      sessionId={sessionId}
      userId={userId}
      userName={userName}
      role={role}
      isTrial={isTrial}
      onLeave={onLeave}
    />
  )
}
