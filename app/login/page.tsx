'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      // CRITICAL: Clear ALL storage before setting new session
      // This prevents data from previous users/companies from persisting
      sessionStorage.clear()
      
      // Clear zustand persist store (keeps theme/UI prefs, clears user data)
      localStorage.removeItem('ai-navigator-store')
      
      // Store new session
      sessionStorage.setItem('aiNavigatorSession', JSON.stringify(data.session))

      // Redirect directly to assessment
      router.push('/assessment')
    } catch (err) {
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    { email: 'demo@acmewealth.com', company: 'Acme Wealth Advisors' },
    { email: 'analyst@acmewealth.com', company: 'Acme Wealth Advisors' },
    { email: 'executive@acmewealth.com', company: 'Acme Wealth Advisors' },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/5 via-transparent to-transparent" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <img 
                  src="/LeadingwithAI-removebg-preview.png" 
                  alt="AI Navigator" 
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold mb-3 text-white">
                Summit Demo Login
              </h1>
              <p className="text-gray-400">
                Access your company's AI readiness insights
              </p>
            </div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8 border border-white/10"
            >
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo@acmewealth.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                    isLoading
                      ? 'bg-blue-600/50 text-white/75 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-[1.02]'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </motion.div>

            {/* Demo Accounts Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 p-6 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Demo Accounts</h3>
              <div className="space-y-3">
                {demoAccounts.map((account, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                    onClick={() => {
                      setEmail(account.email)
                      setPassword('demo123')
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{account.company}</p>
                      <p className="text-xs text-gray-500">{account.email}</p>
                    </div>
                    <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded">
                      demo123
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Click any account to auto-fill credentials
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient blur */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
    </div>
  )
}

