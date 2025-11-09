'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirect to new assessment page
export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediate redirect, no loading screen
    router.replace('/assessment')
  }, [router])

  // Return null - no loading UI needed for instant redirect
  return null
}
