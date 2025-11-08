'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { logger } from '@/lib/services/logger.service'
import { config } from '@/lib/config'

function AnalyticsContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Analytics disabled for now
    // TODO: Re-enable when features config is set up
    const analyticsEnabled = false
    if (!analyticsEnabled) return

    // Track page view
    const url = pathname + (searchParams ? `?${searchParams}` : '')
    
    logger.info('Page view', {
      url,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    })

    // Google Analytics or other analytics service integration
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_ANALYTICS_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  // Track user interactions
  useEffect(() => {
    const analyticsEnabled = false
    if (!analyticsEnabled) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const trackableElement = target.closest('[data-track]')
      
      if (trackableElement) {
        const trackData = trackableElement.getAttribute('data-track')
        logger.info('User interaction', {
          action: 'click',
          element: trackData,
          timestamp: new Date().toISOString()
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return <>{children}</>
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AnalyticsContent>{children}</AnalyticsContent>
    </Suspense>
  )
}
