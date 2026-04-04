'use client'

import { useState } from 'react'
import { BodyDoublingClient } from './BodyDoublingClient'
import { BodyDoublePresence } from '../BodyDoublePresence'

export function BodyDoublingWrapper() {
  const [isActive, setIsActive] = useState(false)
  const [currentTask, setCurrentTask] = useState('')

  const handleSessionChange = (active: boolean, task: string) => {
    setIsActive(active)
    setCurrentTask(task)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:gap-8">
      <BodyDoublingClient onSessionChange={handleSessionChange} />
      <BodyDoublePresence isActive={isActive} currentTask={currentTask} />
    </div>
  )
}
