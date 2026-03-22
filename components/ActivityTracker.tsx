'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function ActivityTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackActivity = async (action: string, metadata: any) => {
      try {
        await fetch('/api/activities/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, metadata })
        })
      } catch (e) {
        // Silently fail to not disrupt user experience
      }
    }

    // Track Page Views
    trackActivity('VIEW', { url: pathname, params: searchParams.toString() })

    // Track Clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        trackActivity('CLICK', { 
            text: target.innerText.substring(0, 50),
            tag: target.tagName,
            id: target.id,
            url: pathname
        })
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [pathname, searchParams])

  return null // Ghost component
}
