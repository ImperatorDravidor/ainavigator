import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Company {
  id: string
  name: string
  display_name: string
  logo_url?: string
}

interface User {
  id: string
  email: string
  fullName: string
  role: string
}

interface Session {
  user: User
  company: Company
  isAuthenticated: boolean
  loginTime: string
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load session from storage
    const sessionStr = sessionStorage.getItem('aiNavigatorSession')
    if (sessionStr) {
      try {
        const parsedSession = JSON.parse(sessionStr)
        setSession(parsedSession)
      } catch (error) {
        console.error('Failed to parse session:', error)
        sessionStorage.removeItem('aiNavigatorSession')
      }
    }
    setIsLoading(false)
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      sessionStorage.removeItem('aiNavigatorSession')
      setSession(null)
      router.push('/login')
    }
  }

  const requireAuth = () => {
    if (!isLoading && !session) {
      router.push('/login')
    }
  }

  return {
    session,
    user: session?.user || null,
    company: session?.company || null,
    isAuthenticated: session?.isAuthenticated || false,
    isLoading,
    logout,
    requireAuth,
  }
}

