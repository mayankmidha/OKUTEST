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
    <div className="grid lg:grid-cols-2 gap-8">
      <BodyDoublingClient onSessionChange={handleSessionChange} />
      <BodyDoublePresence isActive={isActive} currentTask={currentTask} />
    </div>
  )
}
