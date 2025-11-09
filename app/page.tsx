"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Sun, Moon, Brain, ArrowRight, Sparkles, Shield, Check, X, Building2, ChevronRight, BarChart3, Target, Zap, Clock, AlertTriangle, TrendingUp, Users, Layers, FileText, Lock, Globe, Database, Award, Hexagon, Activity, ArrowUpRight, Cpu } from "lucide-react"
import Link from 'next/link'
import { useTheme } from '@/lib/contexts/theme-context'

// Safely check if theme is available (for build-time)
const useThemeSafe = () => {
  try {
    return useTheme()
  } catch {
    return { theme: 'light', toggleTheme: () => {} }
  }
}

// Company demo data schema
const COMPANY_ACCESS_CODES = {
  "TECH2024": {
    name: "TechCorp Industries",
    industry: "Technology",
    size: "5000+ employees",
    contact: "Sarah Chen",
    role: "Chief Innovation Officer",
    challenges: ["AI Strategy", "Data Infrastructure", "Talent Gap"],
    readiness: 67
  },
  "FINX2024": {
    name: "Global Finance Partners",
    industry: "Financial Services", 
    size: "10000+ employees",
    contact: "Michael Thompson",
    role: "VP of Digital Transformation",
    challenges: ["Regulatory Compliance", "Legacy Systems", "Risk Management"],
    readiness: 78
  },
  "HEALTH24": {
    name: "MedTech Solutions",
    industry: "Healthcare",
    size: "2500+ employees",
    contact: "Dr. Emily Rodriguez",
    role: "Director of AI Innovation",
    challenges: ["Patient Data Privacy", "Clinical Integration", "ROI Measurement"],
    readiness: 72
  },
  "RETAIL24": {
    name: "OmniCommerce Group",
    industry: "Retail",
    size: "15000+ employees",
    contact: "James Park",
    role: "CTO",
    challenges: ["Customer Personalization", "Supply Chain", "Fraud Detection"],
    readiness: 81
  },
  "DEMO2024": {
    name: "Acme Wealth Advisors",
    industry: "Financial Services",
    size: "1000+ employees",
    contact: "Alex Morgan",
    role: "Chief Innovation Officer",
    challenges: ["Client AI Personalization", "Risk Management", "Digital Transformation"],
    readiness: 75
  }
}

// Custom Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { isDark?: boolean }>(
  ({ className, type, isDark = true, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full rounded-2xl border backdrop-blur-2xl px-5 py-3 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
          isDark
            ? 'border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/40 focus:ring-white/20 focus:ring-offset-black focus:bg-white/[0.05] focus:border-white/20'
            : 'border-gray-200 bg-white/70 text-gray-900 placeholder:text-gray-400 focus:ring-[#5380b3]/20 focus:ring-offset-white focus:bg-white focus:border-[#5380b3]/30'
        } ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

// Custom Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { isDark?: boolean, variant?: 'primary' | 'secondary' }>(
  ({ className, children, isDark = true, variant = 'primary', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-[15px] font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] h-12 px-8"
    
    const variants = {
      primary: isDark
        ? 'bg-white text-black hover:bg-white/90 focus:ring-white/50 focus:ring-offset-black shadow-xl'
        : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900/50 focus:ring-offset-white shadow-xl',
      secondary: isDark
        ? 'bg-white/[0.06] text-white hover:bg-white/[0.10] focus:ring-white/30 focus:ring-offset-black border border-white/[0.08]'
        : 'bg-black/[0.03] text-gray-900 hover:bg-black/[0.06] focus:ring-gray-900/20 focus:ring-offset-white border border-gray-200'
    }
    
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export default function Home() {
  const { theme, toggleTheme } = useThemeSafe()
  const isDarkMode = theme === 'dark'
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState('sentiment')
  const [isMounted, setIsMounted] = useState(false)
  const [accessCode, setAccessCode] = useState("")
  const [showCompanyLogin, setShowCompanyLogin] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [codeError, setCodeError] = useState("")
  
  // Calculate time until Web Summit - Nov 12, 2025 CET
  const calculateTimeLeft = () => {
    const webSummitDate = new Date('2025-11-12T09:00:00+01:00')
    const now = new Date()
    const difference = webSummitDate.getTime() - now.getTime()
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      console.log("Email submitted:", email)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail("")
      }, 3000)
    }
  }

  const handleAccessCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setCodeError("")
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const company = COMPANY_ACCESS_CODES[accessCode.toUpperCase() as keyof typeof COMPANY_ACCESS_CODES]
    
    if (company) {
      setCompanyData(company)
      setIsValidating(false)
      
      setTimeout(() => {
        sessionStorage.setItem('companyAccess', JSON.stringify(company))
        window.location.href = "/assessment"
      }, 2000)
    } else {
      setCodeError("Invalid access code. Please check and try again.")
      setIsValidating(false)
    }
  }

  const bgColor = isDarkMode ? "bg-gradient-to-b from-black to-gray-950" : "bg-gradient-to-b from-gray-50 to-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-900"
  const subTextColor = isDarkMode ? "text-white/60" : "text-gray-500"

  const navItems = [
    { name: 'Framework', href: '#framework' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Demo', href: '/demo' },
  ]

  return (
    <main className={`relative min-h-screen ${bgColor} w-full transition-all duration-500 overflow-hidden`}>
      {/* Optimized static gradient background - much better performance */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
        }`} />
      </div>
      
      {/* Subtle radial overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100/20 via-transparent to-transparent'
        }`} />
      </div>

      {/* Optimized CSS animations */}
      <style jsx global>{`
        @keyframes floatingCard {
          0%, 100% { 
            transform: translateY(0px) scale(1);
          }
          50% { 
            transform: translateY(-8px) scale(1.005);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Navigation Bar - iOS Style with Glass Morphism */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4 md:pt-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="max-w-7xl mx-auto">
            <div className={`relative ${
              isDarkMode 
                ? 'bg-black/40 border-white/[0.06] shadow-2xl' 
                : 'bg-white/70 border-gray-200 shadow-lg'
            } backdrop-blur-2xl border rounded-[24px] md:rounded-[28px] px-4 md:px-6 py-2.5 md:py-3 transition-all duration-300`}>
              <div className={`absolute inset-0 rounded-[28px] ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-white/[0.03] to-transparent' 
                  : 'bg-gradient-to-b from-white/50 to-transparent'
              } pointer-events-none`} />
            
            <div className="relative flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                  <img 
                    src="/LeadingwithAI-removebg-preview.png" 
                    alt="AI Navigator" 
                    className="w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-300 group-hover:scale-105"
                  />
                  <span className={`font-semibold text-[15px] md:text-[17px] tracking-tight ${textColor}`}>AI Navigator</span>
              </Link>
              
                <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                      className={`text-[14px] font-medium px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                      isDarkMode
                          ? 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-black/[0.03]'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
                
                  <div className={`mx-3 w-px h-6 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                  
                  <Link href="/login">
                <button
                      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[14px] font-semibold transition-all duration-300 ${
                    isDarkMode 
                          ? "bg-white/[0.08] text-white hover:bg-white/[0.12] border border-white/[0.08]"
                          : "bg-black/[0.04] text-gray-900 hover:bg-black/[0.08] border border-gray-200"
                  }`}
                >
                      <Building2 size={16} strokeWidth={2} />
                      <span>Sign In</span>
                </button>
                  </Link>
                
                <button
                  onClick={toggleTheme}
                    className={`p-2.5 rounded-2xl transition-all duration-300 ${
                    isDarkMode 
                        ? "bg-white/[0.06] hover:bg-white/[0.10] text-white" 
                        : "bg-black/[0.03] hover:bg-black/[0.06] text-gray-900"
                  }`}
                >
                    {isDarkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                </button>
            </div>
          </div>
        </div>
                      </div>
      </nav>

        {/* Hero Section - Compact & Refined */}
        <section className="relative min-h-[55vh] flex items-center justify-center px-6 pt-32 md:pt-36 pb-12 overflow-hidden">
          {/* Optimized gradient orbs with better performance */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-[#5380b3]/10 rounded-full blur-3xl animate-pulse will-change-transform" />
            <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-[#a74f8b]/10 rounded-full blur-3xl animate-pulse will-change-transform" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 md:w-72 h-48 md:h-72 bg-[#e0874e]/5 rounded-full blur-3xl animate-pulse will-change-transform" style={{ animationDelay: '2s' }} />
          </div>

          <div className="w-full max-w-xl relative z-10 px-4 md:px-0">
            {/* Refined floating card with better performance */}
            <div 
              className={`relative ${
                              isDarkMode
                ? 'bg-black/20 border-white/[0.06]' 
                : 'bg-white/60 border-gray-200'
            } backdrop-blur-2xl border rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-2xl transform transition-all duration-500 hover:scale-[1.01] will-change-transform`}
              style={{
                animation: isMounted ? 'floatingCard 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
              }}>
              <div className={`absolute inset-0 rounded-[32px] pointer-events-none ${
                    isDarkMode
                  ? 'bg-gradient-to-b from-white/[0.02] to-transparent' 
                  : 'bg-gradient-to-b from-white/30 to-transparent'
              }`} />
              
              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <div className="mb-4 md:mb-6 flex justify-center">
                        <img 
                          src="/Leadingwith.AI clean.png" 
                          alt="Leading.ai" 
                          className="h-12 md:h-16 w-auto object-contain"
                        />
                      </div>

                      <h1 className={`text-[32px] md:text-[42px] font-light ${textColor} mb-4 tracking-[-0.02em] leading-[1.1] animate-fade-in-up`}>
                        Break Through<br />
                        <span className="font-normal bg-gradient-to-r from-[#5380b3] via-[#7a6ca8] to-[#a74f8b] bg-clip-text text-transparent">
                AI Taboos
              </span>
            </h1>
                      <p className={`${subTextColor} text-[14px] md:text-[15px] leading-relaxed max-w-sm mx-auto opacity-0 animate-fade-in-up`} style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        Discover and address the 100 unspoken fears holding back your AI transformation
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-6">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          type="email"
                          placeholder="your@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1"
                          isDark={isDarkMode}
                        />
                        <Button
                          type="submit"
                          isDark={isDarkMode}
                          variant="primary"
                          className="w-full sm:w-auto"
                        >
                          Get Started
                        </Button>
                      </div>
                    </form>

                    <div className="text-center">
                      <p className={`text-[12px] font-semibold mb-3 ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                        Web Summit 2025 · Lisbon
                      </p>
                      {!isMounted ? (
                        <div className="h-[50px]" />
                      ) : (
                        <div className="flex items-center justify-center gap-4 text-[13px]">
                          {[
                            { value: timeLeft.days, label: 'D' },
                            { value: String(timeLeft.hours).padStart(2, '0'), label: 'H' },
                            { value: String(timeLeft.minutes).padStart(2, '0'), label: 'M' },
                            { value: String(timeLeft.seconds).padStart(2, '0'), label: 'S' },
                          ].map((item, idx) => (
                            <React.Fragment key={item.label}>
                              <div className="flex items-baseline gap-1">
                                <span className={`text-[24px] font-light ${textColor} tabular-nums`}>
                                  {item.value}
                                </span>
                                <span className={`text-[10px] ${subTextColor} font-medium`}>
                                  {item.label}
                                </span>
                            </div>
                              {idx < 3 && <span className={`${subTextColor} opacity-20`}>:</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`mt-8 pt-8 text-center ${isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-gray-200'}`}>
                      <div className="flex gap-3 justify-center">
                        <Link href="/demo">
                          <button className={`text-[12px] font-medium px-4 py-2 rounded-2xl transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white'
                              : 'bg-black/[0.02] hover:bg-black/[0.04] text-gray-600 hover:text-gray-900'
                          }`}>
                            Try Demo
                          </button>
              </Link>
                        <Link href="/assessment">
                          <button className={`text-[12px] font-medium px-4 py-2 rounded-2xl transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white'
                              : 'bg-black/[0.02] hover:bg-black/[0.04] text-gray-600 hover:text-gray-900'
                          }`}>
                            Quick Scan
                          </button>
              </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className={`w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center ${
                      isDarkMode
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-green-500/10 border border-green-500/30'
                    }`}>
                      <Check className="w-8 h-8 text-green-500" strokeWidth={2} />
                    </div>
                    <h3 className={`text-[24px] font-light ${textColor} mb-2`}>
                      You're on the list!
                    </h3>
                    <p className={`${subTextColor} text-[14px]`}>
                      We'll notify you when we launch.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section - The Elephant in the Room */}
        <section className="py-24 px-6 relative">
          {/* Optimized background accent */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-0 top-1/2 w-48 md:w-72 h-48 md:h-72 bg-red-500/5 rounded-full blur-3xl" />
            <div className="absolute right-0 bottom-1/2 w-48 md:w-72 h-48 md:h-72 bg-orange-500/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto relative">
            <div className="mb-12 animate-fade-in-up text-center">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
                The Hidden Problem
              </p>
              <h2 className={`text-[42px] md:text-[52px] font-light ${textColor} tracking-tight mb-4`}>
                The biggest barriers are<br />the ones <span className="italic font-normal">nobody talks about</span>
              </h2>
              <p className={`${subTextColor} text-[16px] max-w-2xl mx-auto leading-relaxed`}>
                Most AI resistance stems from psychological <span className="font-semibold">taboos</span>—unspoken fears and concerns that employees feel they can't discuss openly
              </p>
            </div>
            
            {/* Taboo Symptoms */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className={`p-6 rounded-[24px] ${
                isDarkMode
                  ? 'bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20'
                  : 'bg-gradient-to-br from-red-50 to-white border border-red-200'
              }`}>
                <div className="text-center mb-6">
                  <span className="text-[32px] mb-2 block">🤫</span>
                  <h3 className={`text-[18px] font-semibold ${textColor}`}>
                    Spot the Taboos: What You'll See
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { emoji: '🙈', symptom: 'Quiet Non-Adoption', example: 'Tools are available but mysteriously unused' },
                    { emoji: '🎭', symptom: 'Surface Agreement', example: '"Great idea!" in meetings, resistance in practice' },
                    { emoji: '🔧', symptom: 'Creative Workarounds', example: 'Bypassing AI systems to use "the old way"' }
                  ].map(item => (
                    <div key={item.symptom} className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-black/20' : 'bg-white/60'
                    }`}>
                      <div className="text-[24px] mb-2">{item.emoji}</div>
                      <div className={`text-[13px] font-semibold ${textColor} mb-1`}>{item.symptom}</div>
                      <div className={`text-[11px] ${subTextColor} italic`}>"{item.example}"</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className={`p-8 md:p-12 rounded-[32px] ${
                isDarkMode
                  ? 'bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06]'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
              }`}>
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                        <X className="w-6 h-6 text-red-500" strokeWidth={2} />
                      </div>
                      <h3 className={`text-[22px] font-semibold ${textColor}`}>What Doesn't Work</h3>
                    </div>
                    <ul className="space-y-4">
                      {[
                        'Assuming everyone is excited about AI',
                        'Generic "change management" programs',
                        'Ignoring emotional and psychological resistance',
                        'One-size-fits-all training approaches'
                      ].map(point => (
                        <li key={point} className={`text-[14px] ${subTextColor} flex items-start gap-3`}>
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-red-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-6 h-6 text-green-500" strokeWidth={2} />
                      </div>
                      <h3 className={`text-[22px] font-semibold ${textColor}`}>Our Approach</h3>
                    </div>
                    <ul className="space-y-4">
                      {[
                        'Identify all 100 AI taboos in your organization',
                        'Map resistance by reason and intensity level',
                        'Provide targeted, neuroscience-based interventions',
                        'Track progress and measure effectiveness'
                      ].map(point => (
                        <li key={point} className={`text-[14px] ${subTextColor} flex items-start gap-3`}>
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-green-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Periodic Table Section */}
        <section id="framework" className="py-32 px-6 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#5380b3]/5 via-[#7a6ca8]/5 to-[#a74f8b]/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16 animate-fade-in-up">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                The Framework
              </p>
              <h2 className={`text-[42px] md:text-[52px] font-light ${textColor} tracking-tight mb-4`}>
                The Periodic Table of AI Taboos
              </h2>
              <p className={`${subTextColor} text-[16px] max-w-3xl mx-auto leading-relaxed`}>
                Like the periodic table organizes chemical elements, we've mapped the <span className="font-semibold text-[#5380b3]">100 unspoken fears</span> about AI into <span className="font-semibold text-[#a74f8b]">25 distinct zones</span>. Each zone contains <span className="font-semibold text-[#6ba368]">2 specific taboos</span> with shared patterns, triggers, and science-based remedies.
              </p>
            </div>
            
            {/* Real-world examples teaser */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    persona: '🚛 Truck Driver',
                    age: '55+',
                    quote: 'AI makes decisions without me—I prefer talking to my supervisor',
                    zone: 'Autonomy × Concerned',
                    color: '#e0874e'
                  },
                  {
                    persona: '⚖️ Young Lawyer',
                    age: '30',
                    quote: 'Will AI make my years of training obsolete?',
                    zone: 'Career Security × Resistant',
                    color: '#c44569'
                  }
                ].map((example) => (
                  <div key={example.persona} className={`p-6 rounded-[20px] ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08]'
                      : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[28px]">{example.persona.split(' ')[0]}</span>
                      <div>
                        <div className={`text-[15px] font-semibold ${textColor}`}>{example.persona.slice(2)}</div>
                        <div className={`text-[12px] ${subTextColor}`}>{example.age}</div>
                      </div>
                    </div>
                    <p className={`text-[13px] ${subTextColor} italic mb-3 leading-relaxed`}>
                      "{example.quote}"
                    </p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: example.color }}
                      />
                      <span className={`text-[11px] font-semibold uppercase tracking-wider`} style={{ color: example.color }}>
                        {example.zone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Playful Callout */}
            <div className={`max-w-4xl mx-auto mb-12 p-6 rounded-[24px] text-center ${
              isDarkMode
                ? 'bg-gradient-to-r from-[#5380b3]/10 via-[#7a6ca8]/10 to-[#a74f8b]/10 border border-white/[0.08]'
                : 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-gray-200'
            }`}>
              <div className="text-[32px] mb-3">🧪 ✨</div>
              <h3 className={`text-[20px] font-semibold ${textColor} mb-2`}>
                Like Chemistry, But for Change
              </h3>
              <p className={`${subTextColor} text-[14px] max-w-2xl mx-auto`}>
                Just as Mendeleev's periodic table revealed patterns in elements, our framework reveals the hidden patterns in how people <span className="italic">really</span> feel about AI—helping you design interventions that actually work.
              </p>
            </div>

            {/* Visual Grid Representation - Enhanced */}
            <div className="max-w-7xl mx-auto mb-16">
              <div className={`p-8 md:p-12 rounded-[32px] ${
                isDarkMode
                  ? 'bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-white/[0.08]'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
              }`}>
                {/* Header with 5 Reasons */}
                <div className="mb-8">
                  <div className={`text-center text-[12px] ${subTextColor} mb-6 flex items-center justify-center gap-2`}>
                    <span className="text-[16px]">👆</span>
                    <span className="italic">Hover any cell to explore • Each zone contains multiple taboos</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3 md:gap-4 mb-6">
                    {[
                      { icon: '🤖', title: 'AI is too Autonomous', subtitle: 'Autonomy concerns', color: '#5380b3' },
                      { icon: '🔧', title: 'AI is too Inflexible', subtitle: 'Rigidity issues', color: '#e0874e' },
                      { icon: '🤐', title: 'AI is Emotionless', subtitle: 'Lacks warmth', color: '#6ba368' },
                      { icon: '🌫️', title: 'AI is too Opaque', subtitle: 'Unclear decisions', color: '#808080' },
                      { icon: '🤝', title: 'People Prefer Human Interaction', subtitle: 'Connection matters', color: '#d4a834' }
                    ].map((reason) => (
                      <div key={reason.title} className="text-center">
                        <div className="text-[32px] mb-2">{reason.icon}</div>
                        <div 
                          className="text-[11px] md:text-[12px] font-bold leading-tight mb-1"
                          style={{ color: reason.color }}
                        >
                          {reason.title}
                        </div>
                        <div className={`text-[10px] ${subTextColor} italic`}>
                          {reason.subtitle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6 md:gap-8">
                  {/* Y-axis labels */}
                  <div className="flex flex-col gap-3">
                    {[
                      { level: '1', label: 'Workflow', icon: '👤', color: '#5380b3' },
                      { level: '2', label: 'Collaboration', icon: '👥', color: '#7a6ca8' },
                      { level: '3', label: 'Trust & Fairness', icon: '⚖️', color: '#a74f8b' },
                      { level: '4', label: 'Career Security', icon: '💼', color: '#c44569' },
                      { level: '5', label: 'Org Stability', icon: '🏢', color: '#e0874e' }
                    ].map((item) => (
                      <div key={item.level} className={`flex items-center gap-3 h-[70px] md:h-[90px] px-3 rounded-2xl ${
                        isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'
                      }`}>
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[14px]"
                          style={{ 
                            backgroundColor: isDarkMode ? `${item.color}30` : `${item.color}20`,
                            color: item.color 
                          }}
                        >
                          {item.level}
                        </div>
                        <span className="text-[20px]">{item.icon}</span>
                        <div className={`text-[10px] ${subTextColor} leading-tight hidden md:block`}>
                          <div className="font-semibold">Level {item.level}</div>
                          <div>{item.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Main Grid - 5x5 with actual taboo codes */}
                  <div className="flex-1">
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        // Row 1
                        { codes: ['Bw', 'Sy'], names: ['Bewilderment', 'Superiority'], col: 0 },
                        { codes: ['Am', 'Mi'], names: ['Amplification', 'Mismatch'], col: 1 },
                        { codes: ['Cn', 'Ds'], names: ['Condescension', 'Dismissiveness'], col: 2 },
                        { codes: ['Av', 'Fg'], names: ['Aversion', 'Fogginess'], col: 3 },
                        { codes: ['Al', 'An'], names: ['Alienation', 'Antipathy'], col: 4 },
                        // Row 2
                        { codes: ['Dl', 'Ov'], names: ['Delegation', 'Overtrust'], col: 0 },
                        { codes: ['Cf', 'Eg'], names: ['Conformity', 'Exaggeration'], col: 1 },
                        { codes: ['Dt', 'Hw'], names: ['Detachment', 'Hollowness'], col: 2 },
                        { codes: ['Bl', 'Cc'], names: ['Blindspot', 'Concealment'], col: 3 },
                        { codes: ['Dd', 'Di'], names: ['Dependence', 'Distance'], col: 4 },
                        // Row 3
                        { codes: ['Dc', 'Du'], names: ['Discrimination', 'Diffusion'], col: 0 },
                        { codes: ['Ce', 'Co'], names: ['Convergence', 'Constraint'], col: 1 },
                        { codes: ['Cr', 'Dv'], names: ['Corruption', 'Devastation'], col: 2 },
                        { codes: ['Cv', 'Dr'], names: ['Covertness', 'Disproportion'], col: 3 },
                        { codes: ['Df', 'Of'], names: ['Defiance', 'Offloading'], col: 4 },
                        // Row 4
                        { codes: ['Dm', 'Dp'], names: ['Dismissal', 'Displacement'], col: 0 },
                        { codes: ['Ad', 'Ay'], names: ['Adaptation', 'Atrophy'], col: 1 },
                        { codes: ['Da', 'Im'], names: ['Disappointment', 'Impairment'], col: 2 },
                        { codes: ['In', 'Ob'], names: ['Inscrutability', 'Obscurity'], col: 3 },
                        { codes: ['Dt', 'La'], names: ['Destitution', 'Lagging'], col: 4 },
                        // Row 5
                        { codes: ['Fa', 'Oh'], names: ['Favoritism', 'Overhaul'], col: 0 },
                        { codes: ['Fr', 'Li'], names: ['Fragility', 'Lock-in'], col: 1 },
                        { codes: ['Dn', 'Do'], names: ['Depletion', 'Domination'], col: 2 },
                        { codes: ['Em', 'Et'], names: ['Enmeshment', 'Extinction'], col: 3 },
                        { codes: ['De', 'Ed'], names: ['Dissonance', 'Endangerment'], col: 4 }
                      ].map((cell, idx) => {
                        const row = Math.floor(idx / 5)
                        const colors = ['#5380b3', '#e0874e', '#6ba368', '#808080', '#d4a834']
                        const color = colors[cell.col]
                        const intensity = 0.2 + (row / 4) * 0.5
                        
                        return (
                          <div
                            key={idx}
                            className={`h-[70px] md:h-[90px] rounded-2xl transition-all duration-300 hover:scale-110 hover:-rotate-2 cursor-pointer group relative ${
                              isDarkMode
                                ? 'border-2 border-white/[0.08] hover:border-white/40 shadow-lg hover:shadow-2xl'
                                : 'border-2 border-gray-300 hover:border-gray-500 shadow-md hover:shadow-xl'
                            }`}
                            style={{
                              backgroundColor: isDarkMode 
                                ? `${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}` 
                                : `${color}${Math.floor(intensity * 200).toString(16).padStart(2, '0')}`,
                              boxShadow: isDarkMode 
                                ? `0 4px 20px ${color}20` 
                                : `0 2px 10px ${color}30`
                            }}
                          >
                            {/* Default view - abbreviations */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 group-hover:opacity-0 transition-opacity">
                              <div 
                                className="text-[16px] md:text-[18px] font-bold mb-1"
                                style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                              >
                                {cell.codes[0]}
                              </div>
                              <div className="w-4 h-[2px] rounded-full opacity-50" style={{ backgroundColor: color }} />
                              <div 
                                className="text-[16px] md:text-[18px] font-bold mt-1"
                                style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                              >
                                {cell.codes[1]}
                              </div>
                            </div>
                            
                            {/* Hover view - full names */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className={`text-[10px] md:text-[11px] font-bold leading-tight text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                <div className="mb-1">{cell.names[0]}</div>
                                <div className="text-[8px] opacity-60">+</div>
                                <div className="mt-1">{cell.names[1]}</div>
                              </div>
                            </div>
                            
                            {/* Tooltip */}
                            <div className={`absolute -top-24 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-xl ${
                              isDarkMode ? 'bg-black/95 border-2 border-white/20' : 'bg-gray-900 border-2 border-gray-700'
                            } text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-2xl`}>
                              <div className="font-bold mb-2 flex items-center gap-2">
                                <span>Zone {idx + 1}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}40` }}>
                                  2 Taboos
                                </span>
                              </div>
                              <div className="text-[10px] opacity-80 mb-2">
                                Level {row + 1} × {['Autonomous', 'Inflexible', 'Emotionless', 'Opaque', 'Human'][cell.col]}
                              </div>
                              <div className="text-[10px] opacity-90 space-y-1">
                                <div>• {cell.codes[0]}: {cell.names[0]}</div>
                                <div>• {cell.codes[1]}: {cell.names[1]}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Legend with Examples */}
                <div className={`mt-10 pt-8 border-t ${isDarkMode ? 'border-white/[0.06]' : 'border-gray-200'}`}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className={`text-[16px] font-semibold ${textColor} mb-4`}>📊 5 Levels of Discomfort</h4>
                      <div className="space-y-3">
                        {[
                          { level: 'Excited', emoji: '🚀', example: '"This will transform my work!"' },
                          { level: 'Supportive', emoji: '👍', example: '"I see the potential benefits"' },
                          { level: 'Neutral', emoji: '😐', example: '"Not sure what to think yet"' },
                          { level: 'Concerned', emoji: '😟', example: '"I have some worries about this"' },
                          { level: 'Resistant', emoji: '🛑', example: '"This threatens what I value"' }
                        ].map((item, idx) => (
                          <div key={item.level} className={`p-3 rounded-xl ${
                            isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-3 mb-1">
                              <div className={`w-4 h-4 rounded`} style={{ 
                                background: `linear-gradient(to right, #5380b3, #a74f8b)`,
                                opacity: 0.3 + ((4 - idx) / 4) * 0.7
                              }} />
                              <span className="text-[16px]">{item.emoji}</span>
                              <span className={`text-[13px] font-semibold ${textColor}`}>{item.level}</span>
                            </div>
                            <p className={`text-[11px] ${subTextColor} italic pl-7`}>{item.example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className={`text-[16px] font-semibold ${textColor} mb-4`}>🎯 5 Underlying Reasons</h4>
                      <div className="space-y-3">
                        {[
                          { reason: 'Career Security', icon: '💼', concern: 'Will AI replace my job or devalue my skills?' },
                          { reason: 'Competence Anxiety', icon: '🧠', concern: 'Can I learn to work effectively with AI?' },
                          { reason: 'Ethics & Trust', icon: '⚖️', concern: 'Is AI making fair and reliable decisions?' },
                          { reason: 'Autonomy', icon: '🎮', concern: 'Am I losing control over how I work?' },
                          { reason: 'Human Connection', icon: '🤝', concern: 'Is work becoming too impersonal?' }
                        ].map(item => (
                          <div key={item.reason} className={`p-3 rounded-xl ${
                            isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[16px]">{item.icon}</span>
                              <span className={`text-[13px] font-semibold ${textColor}`}>{item.reason}</span>
                            </div>
                            <p className={`text-[11px] ${subTextColor} pl-7`}>{item.concern}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-World Use Cases */}
            <div className="mt-16 max-w-6xl mx-auto">
              <h3 className={`text-[28px] font-semibold ${textColor} mb-8 text-center`}>
                See It In Action
              </h3>
              
              <div className="space-y-6">
                {/* Truck Driver Case */}
                <div className={`p-6 md:p-8 rounded-[24px] ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20'
                    : 'bg-gradient-to-br from-orange-50 to-white border border-orange-200'
                }`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[36px]">
                        🚛
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h4 className={`text-[20px] font-semibold ${textColor}`}>Driving Home</h4>
                        <span className={`text-[12px] px-3 py-1 rounded-full ${
                          isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-100 text-orange-700'
                        }`}>
                          European Logistics | 55+ years
                        </span>
                      </div>
                      
                      <p className={`${subTextColor} text-[14px] mb-4 leading-relaxed`}>
                        <span className="font-semibold">The Situation:</span> Experienced truck drivers nearing retirement resist AI-assisted routing and logistics systems.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-black/20' : 'bg-white/60'}`}>
                          <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${subTextColor}`}>How it showed up</div>
                          <ul className="space-y-1.5">
                            {[
                              'Avoid AI tools, prefer manual methods',
                              'Bypass AI systems, seek human advice',
                              'Disable AI features silently'
                            ].map(point => (
                              <li key={point} className={`text-[12px] ${subTextColor} flex items-start gap-2`}>
                                <X className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-black/20' : 'bg-white/60'}`}>
                          <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${subTextColor}`}>Our intervention</div>
                          <ul className="space-y-1.5">
                            {[
                              'Designated Human: colleague available for edge cases',
                              'What to Change/Keep: drivers identify where AI helps vs. hinders'
                            ].map(point => (
                              <li key={point} className={`text-[12px] ${subTextColor} flex items-start gap-2`}>
                                <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-[11px] px-3 py-1.5 rounded-full font-semibold ${
                          isDarkMode ? 'bg-white/[0.06] text-orange-400' : 'bg-orange-50 text-orange-600'
                        }`}>
                          🎮 Autonomy × Concerned
                        </span>
                        <span className={`text-[11px] px-3 py-1.5 rounded-full font-semibold ${
                          isDarkMode ? 'bg-white/[0.06] text-orange-400' : 'bg-orange-50 text-orange-600'
                        }`}>
                          🤝 Human Connection × Concerned
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Young Lawyer Case */}
                <div className={`p-6 md:p-8 rounded-[24px] ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20'
                    : 'bg-gradient-to-br from-red-50 to-white border border-red-200'
                }`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[36px]">
                        ⚖️
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h4 className={`text-[20px] font-semibold ${textColor}`}>The Young Lawyer</h4>
                        <span className={`text-[12px] px-3 py-1 rounded-full ${
                          isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700'
                        }`}>
                          International Law Firm | 30 years
                        </span>
                      </div>
                      
                      <p className={`${subTextColor} text-[14px] mb-4 leading-relaxed`}>
                        <span className="font-semibold">The Situation:</span> Associates who invested years in training now face AI tools that can draft documents and analyze cases in seconds.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-black/20' : 'bg-white/60'}`}>
                          <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${subTextColor}`}>How it showed up</div>
                          <ul className="space-y-1.5">
                            {[
                              'Manually rework AI outputs',
                              'Question AI conclusions and decisions',
                              'Disengage when AI performance is unclear',
                              'Quiet skepticism toward AI deployments'
                            ].map(point => (
                              <li key={point} className={`text-[12px] ${subTextColor} flex items-start gap-2`}>
                                <X className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-black/20' : 'bg-white/60'}`}>
                          <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${subTextColor}`}>Our intervention</div>
                          <ul className="space-y-1.5">
                            {[
                              'Human Oversight Sessions: diverse group evaluates AI outcomes',
                              'AI Experiments: compare AI vs human work in simulations'
                            ].map(point => (
                              <li key={point} className={`text-[12px] ${subTextColor} flex items-start gap-2`}>
                                <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-[11px] px-3 py-1.5 rounded-full font-semibold ${
                          isDarkMode ? 'bg-white/[0.06] text-red-400' : 'bg-red-50 text-red-600'
                        }`}>
                          💼 Career Security × Resistant
                        </span>
                        <span className={`text-[11px] px-3 py-1.5 rounded-full font-semibold ${
                          isDarkMode ? 'bg-white/[0.06] text-red-400' : 'bg-red-50 text-red-600'
                        }`}>
                          ⚖️ Ethics & Trust × Concerned
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-4 mt-16">
              {[
                { number: '100', label: 'Unique Taboos', sublabel: '50 pairs across the table', emoji: '🧪' },
                { number: '25', label: 'Zones', sublabel: '5 Reasons × 5 Levels', emoji: '📍' },
                { number: '5', label: 'Core Dimensions', sublabel: 'From Autonomy to Connection', emoji: '🎯' },
                { number: '∞', label: 'Solutions', sublabel: 'Tailored interventions', emoji: '✨' }
              ].map(stat => (
                <div key={stat.label} className={`p-6 rounded-[24px] text-center transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-white/[0.02] border border-white/[0.06] hover:border-white/20'
                    : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="text-[32px] mb-2">{stat.emoji}</div>
                  <div className={`text-[42px] font-light ${textColor} mb-2 bg-gradient-to-r from-[#5380b3] to-[#a74f8b] bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className={`text-[15px] font-semibold ${textColor} mb-1`}>{stat.label}</div>
                  <div className={`text-[12px] ${subTextColor}`}>{stat.sublabel}</div>
                </div>
              ))}
            </div>
            
            {/* How to Read It */}
            <div className={`mt-12 max-w-4xl mx-auto p-6 rounded-[24px] ${
              isDarkMode
                ? 'bg-gradient-to-r from-[#5380b3]/5 to-[#a74f8b]/5 border border-white/[0.06]'
                : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200'
            }`}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-[48px]">📖</div>
                <div className="flex-1">
                  <h4 className={`text-[16px] font-semibold ${textColor} mb-2`}>
                    How to Read the Table
                  </h4>
                  <p className={`${subTextColor} text-[13px] leading-relaxed`}>
                    Each <span className="font-semibold">zone</span> represents the intersection of a <span className="italic">reason for resistance</span> (column) and a <span className="italic">level of discomfort</span> (row). 
                    Within each zone live <span className="font-semibold">2 specific taboos</span>—individual fears or concerns that share similar patterns and require tailored interventions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Three Levels */}
        <section id="how-it-works" className="py-32 px-6 relative bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-[#a74f8b]' : 'text-[#a74f8b]'}`}>
                Three Levels of Customization
              </p>
              <h2 className={`text-[42px] font-light ${textColor} tracking-tight mb-4`}>
                From Quick Insights to Deep Transformation
              </h2>
              <p className={`${subTextColor} text-[16px] max-w-2xl mx-auto`}>
                Choose the level of depth that matches your needs and organizational readiness
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-6">
              {[
                {
                  level: '01',
                  title: 'Predictive Analysis',
                  subtitle: 'Based on Your Data',
                  description: 'We analyze your organization\'s demographics (age, profession, education, industry, AI experience) to predict which taboos are likely present and suggest areas of focus.',
                  icon: Database,
                  color: '#5380b3',
                  features: ['No employee survey needed', 'Instant insights', 'General recommendations'],
                  time: '< 1 hour'
                },
                {
                  level: '02',
                  title: 'AI Taboo Quick Scan',
                  subtitle: 'Digital Questionnaire',
                  description: 'A targeted questionnaire that pinpoints actual areas where AI adoption is challenging. Provides precise suggestions for actions and measurable evaluation.',
                  icon: Activity,
                  color: '#7a6ca8',
                  features: ['15-minute digital assessment', 'Specific problem areas identified', 'Targeted action plans'],
                  time: '< 1 day'
                },
                {
                  level: '03',
                  title: 'AI Taboo Assessment',
                  subtitle: 'Comprehensive Deep Dive',
                  description: 'Full assessment across a larger employee group. Creates a detailed picture of your situation with tailored solutions and specific evaluation of intervention effectiveness.',
                  icon: Cpu,
                  color: '#a74f8b',
                  features: ['Org-wide assessment', 'Detailed zone mapping', 'Custom intervention design', 'Neuroscience-based activities'],
                  time: '2-4 weeks'
                }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.level} className={`group p-8 md:p-10 rounded-[32px] transition-all duration-300 hover:scale-[1.01] ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] hover:border-white/20'
                      : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                      <div className="flex items-start gap-6 flex-1">
                        <div className="flex flex-col items-center gap-3">
                          <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ 
                              backgroundColor: `${item.color}15`,
                              borderWidth: '1px',
                              borderColor: `${item.color}30`
                            }}
                          >
                            <Icon className="w-8 h-8" style={{ color: item.color }} strokeWidth={1.5} />
                          </div>
                          <div 
                            className="text-[32px] font-light opacity-40"
                            style={{ color: item.color }}
                          >
                            {item.level}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className={`text-[24px] font-semibold ${textColor} mb-1`}>{item.title}</h3>
                          <p className={`text-[14px] mb-4`} style={{ color: item.color }}>
                            {item.subtitle}
                          </p>
                          <p className={`${subTextColor} text-[15px] mb-6 leading-relaxed`}>
                            {item.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.features.map(feature => (
                              <span 
                                key={feature}
                                className={`text-[12px] px-3 py-1.5 rounded-full ${
                                  isDarkMode
                                    ? 'bg-white/[0.04] text-white/70'
                                    : 'bg-black/[0.04] text-gray-600'
                                }`}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" style={{ color: item.color }} />
                            <span className={`text-[13px] ${subTextColor}`}>
                              Timeline: <span className="font-semibold">{item.time}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Interventions Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 text-green-500`}>
                The Result
              </p>
              <h2 className={`text-[42px] font-light ${textColor} tracking-tight mb-4`}>
                Engaging, Science-Based Interventions
              </h2>
              <p className={`${subTextColor} text-[16px] max-w-2xl mx-auto`}>
                Transform resistance into adoption with playful, neuroscience-backed activities designed for lasting change
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: 'Neuroscience-Based Methods',
                  description: 'Activities grounded in proven principles of learning and behavioral change',
                  examples: ['Cognitive reframing exercises', 'Experiential learning workshops', 'Social proof techniques']
                },
                {
                  icon: Users,
                  title: 'Engaging & Playful',
                  description: 'Interactive experiences that make difficult conversations feel safe and productive',
                  examples: ['Gamified scenarios', 'Role-playing simulations', 'Team challenges']
                },
                {
                  icon: Target,
                  title: 'Tailored to Context',
                  description: 'Interventions designed specifically for your organization\'s unique taboo profile',
                  examples: ['Zone-specific activities', 'Role-based approaches', 'Culture-aware solutions']
                },
                {
                  icon: TrendingUp,
                  title: 'Measurable Impact',
                  description: 'Track progress and effectiveness with clear metrics and continuous assessment',
                  examples: ['Before/after comparisons', 'Adoption rate tracking', 'Sentiment shifts']
                }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className={`p-8 rounded-[24px] ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06]'
                      : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-green-500" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className={`text-[20px] font-semibold ${textColor} mb-2`}>{item.title}</h3>
                        <p className={`${subTextColor} text-[14px] leading-relaxed`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2 pl-16">
                      {item.examples.map(example => (
                        <li key={example} className={`text-[13px] ${subTextColor} flex items-start gap-2`}>
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className={`mt-10 p-8 rounded-[24px] text-center ${
              isDarkMode
                ? 'bg-gradient-to-r from-green-500/5 to-[#5380b3]/5 border border-green-500/20'
                : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
            }`}>
              <h3 className={`text-[20px] font-semibold ${textColor} mb-3`}>
                The Goal: Effective AI Use
              </h3>
              <p className={`${subTextColor} text-[15px] max-w-2xl mx-auto`}>
                Our objective is always to improve <span className="font-semibold">effective</span> use of AI. 
                This means helping your team understand both when to use AI—and importantly, when <span className="italic">not</span> to use it.
              </p>
            </div>
          </div>
        </section>

        {/* Complete Picture Section - Enhanced Visualizations with Interactive Elements */}
        <section className="py-32 px-6 relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                background: `radial-gradient(circle at 50% 50%, #5380b3 0%, transparent 50%)`,
                animation: 'pulse 4s ease-in-out infinite'
              }}
            />
          </div>
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16 animate-fade-in-up">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-[#a74f8b]' : 'text-[#a74f8b]'}`}>
                Dual Framework
              </p>
              <h2 className={`text-[42px] font-light ${textColor} mb-3 tracking-tight`}>
                See the Complete Picture
              </h2>
              <p className={`${subTextColor} text-[16px] max-w-2xl mx-auto`}>
                Combine emotional and capability insights for comprehensive understanding
              </p>
            </div>

            {/* Tab Switcher - Responsive */}
            <div className="flex justify-center mb-8 md:mb-12">
              <div className={`inline-flex p-1 rounded-[20px] md:rounded-[24px] ${
                isDarkMode
                  ? 'bg-white/[0.04] border border-white/[0.06]'
                  : 'bg-gray-100 border border-gray-200'
              } transition-all duration-300`}>
                <button
                  onClick={() => setActiveTab('sentiment')}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-[16px] md:rounded-[20px] text-[13px] md:text-[14px] font-semibold transition-all duration-300 ${
                    activeTab === 'sentiment'
                      ? isDarkMode 
                        ? 'bg-white text-black shadow-lg' 
                        : 'bg-white text-gray-900 shadow-lg'
                      : subTextColor
                  }`}
                >
                  <span className="hidden sm:inline">Sentiment </span>Heatmap
                </button>
                <button
                  onClick={() => setActiveTab('capability')}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-[16px] md:rounded-[20px] text-[13px] md:text-[14px] font-semibold transition-all duration-300 ${
                    activeTab === 'capability'
                      ? isDarkMode 
                        ? 'bg-white text-black shadow-lg' 
                        : 'bg-white text-gray-900 shadow-lg'
                      : subTextColor
                  }`}
                >
                  <span className="hidden sm:inline">Capability </span>Diamond
                </button>
              </div>
            </div>

            {activeTab === 'sentiment' ? (
              /* Sentiment Heatmap */
              <div className={`rounded-[24px] md:rounded-[32px] overflow-hidden ${
                isDarkMode
                  ? 'bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06]'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
              } p-6 md:p-10`}>
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <h3 className={`text-[20px] font-semibold mb-2 ${textColor}`}>
                      Sentiment Analysis Heatmap
                    </h3>
                    <p className={`${subTextColor} text-[14px]`}>
                      25 zones mapping sentiment levels against organizational reasons
                    </p>
                  </div>
                  
                  {/* Heatmap Grid with Labels */}
                  <div className="flex gap-6">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-around py-8">
                      {['Excited', 'Supportive', 'Neutral', 'Concerned', 'Resistant'].map(label => (
                        <div key={label} className={`text-[11px] ${subTextColor} text-right pr-2`}>
                          {label}
                        </div>
                      ))}
                    </div>
                    
                    {/* Main Grid */}
                    <div className="flex-1">
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {/* Sample data with realistic patterns */}
                        {[
                          [90, 75, 45, 30, 15], // Excited row
                          [80, 85, 60, 40, 25], // Supportive row
                          [50, 55, 50, 45, 40], // Neutral row
                          [30, 35, 40, 60, 70], // Concerned row
                          [10, 20, 30, 75, 85], // Resistant row
                        ].map((row, rowIdx) => (
                          row.map((value, colIdx) => {
                            const opacity = value / 100
                            const bgColor = value > 70 ? 'bg-green-500' 
                              : value > 40 ? 'bg-yellow-500' 
                              : 'bg-red-500'
                            
                            return (
                              <div
                                key={`${rowIdx}-${colIdx}`}
                                className={`aspect-square rounded-lg ${bgColor} transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer flex items-center justify-center group relative transform hover:rotate-1`}
                                style={{ 
                                  opacity: 0.3 + opacity * 0.7,
                                  boxShadow: value > 70 ? '0 0 15px rgba(34, 197, 94, 0.2)' : value > 40 ? '0 0 15px rgba(234, 179, 8, 0.2)' : '0 0 15px rgba(239, 68, 68, 0.2)'
                                }}
                              >
                                <span className={`text-[10px] font-bold ${
                                  isDarkMode ? 'text-white' : 'text-black'
                                } opacity-0 group-hover:opacity-100 transition-opacity`}>
                                  {value}%
                                </span>
                                
                                {/* Tooltip on hover */}
                                <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-lg ${
                                  isDarkMode ? 'bg-black' : 'bg-gray-900'
                                } text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10`}>
                                  {value}% readiness
                                </div>
                              </div>
                            )
                          })
                        ))}
                      </div>
                      
                      {/* X-axis labels */}
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['Technology', 'Leadership', 'Culture', 'Resources', 'Skills'].map(label => (
                          <div key={label} className={`text-[11px] ${subTextColor} text-center`}>
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-8 mt-10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500 opacity-80" />
                      <span className={`text-[12px] ${subTextColor}`}>Strong Support (70%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500 opacity-60" />
                      <span className={`text-[12px] ${subTextColor}`}>Moderate (40-70%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500 opacity-50" />
                      <span className={`text-[12px] ${subTextColor}`}>Resistance (&lt;40%)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Capability Diamond */
              <div className={`rounded-[24px] md:rounded-[32px] overflow-hidden ${
                    isDarkMode
                  ? 'bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06]'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
              } p-6 md:p-10`}>
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <h3 className={`text-[20px] font-semibold mb-2 ${textColor}`}>
                      Capability Maturity Assessment
                    </h3>
                    <p className={`${subTextColor} text-[14px]`}>
                      8 critical dimensions of AI readiness
                    </p>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
                    {/* Radar Chart */}
                    <div className="relative">
                      <div className="relative w-full aspect-square max-w-md mx-auto">
                        {/* Background circles */}
                        {[20, 40, 60, 80, 100].map((percentage) => (
                          <div
                            key={percentage}
                            className={`absolute inset-0 border rounded-full ${
                              isDarkMode ? 'border-white/[0.05]' : 'border-gray-200'
                            }`}
                            style={{
                              width: `${percentage}%`,
                              height: `${percentage}%`,
                              top: `${(100 - percentage) / 2}%`,
                              left: `${(100 - percentage) / 2}%`,
                            }}
                          />
                        ))}
                        
                        {/* Dimension labels with scores */}
                        {[
                          { name: 'Strategy', score: 72, angle: -90 },
                          { name: 'Data', score: 85, angle: -45 },
                          { name: 'Technology', score: 68, angle: 0 },
                          { name: 'Talent', score: 45, angle: 45 },
                          { name: 'Process', score: 78, angle: 90 },
                          { name: 'Innovation', score: 62, angle: 135 },
                          { name: 'Adoption', score: 58, angle: 180 },
                          { name: 'Ethics', score: 82, angle: 225 },
                        ].map((dim) => {
                          const radian = (dim.angle * Math.PI) / 180
                          const x = 50 + 45 * Math.cos(radian)
                          const y = 50 + 45 * Math.sin(radian)
                          
                          return (
                            <div
                              key={dim.name}
                              className="absolute flex flex-col items-center"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <span className={`text-[12px] font-medium ${textColor}`}>
                                {dim.name}
                              </span>
                              <span className={`text-[18px] font-light ${
                                dim.score >= 70 ? 'text-green-500' 
                                : dim.score >= 50 ? 'text-yellow-500' 
                                : 'text-red-500'
                              }`}>
                                {dim.score}
                              </span>
                            </div>
                          )
                        })}
                        
                        {/* Filled polygon shape */}
                        <svg className="absolute inset-0 w-full h-full">
                          <polygon
                            points={[
                              { score: 72, angle: -90 },
                              { score: 85, angle: -45 },
                              { score: 68, angle: 0 },
                              { score: 45, angle: 45 },
                              { score: 78, angle: 90 },
                              { score: 62, angle: 135 },
                              { score: 58, angle: 180 },
                              { score: 82, angle: 225 },
                            ].map(({ score, angle }) => {
                              const radian = (angle * Math.PI) / 180
                              const radius = (score / 100) * 40
                              const x = 50 + radius * Math.cos(radian)
                              const y = 50 + radius * Math.sin(radian)
                              return `${x}%,${y}%`
                            }).join(' ')}
                            fill="url(#capabilityGradient)"
                            fillOpacity="0.2"
                            stroke="url(#capabilityGradient)"
                            strokeWidth="2"
                          />
                          <defs>
                            <linearGradient id="capabilityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#5380b3" />
                              <stop offset="50%" stopColor="#7a6ca8" />
                              <stop offset="100%" stopColor="#a74f8b" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Dimension Details */}
                    <div className="space-y-3">
                      {[
                        { name: 'Strategy & Vision', score: 72, status: 'Good' },
                        { name: 'Data Infrastructure', score: 85, status: 'Excellent' },
                        { name: 'Technology Stack', score: 68, status: 'Moderate' },
                        { name: 'Talent & Skills', score: 45, status: 'Needs Focus' },
                        { name: 'Process & Operations', score: 78, status: 'Good' },
                        { name: 'Innovation Culture', score: 62, status: 'Moderate' },
                        { name: 'Adoption & Change', score: 58, status: 'Moderate' },
                        { name: 'Ethics & Governance', score: 82, status: 'Excellent' },
                      ].map((dim) => (
                        <div key={dim.name} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[13px] font-medium ${textColor}`}>
                                {dim.name}
                              </span>
                              <span className={`text-[11px] ${
                                dim.score >= 70 ? 'text-green-500' 
                                : dim.score >= 50 ? 'text-yellow-500' 
                                : 'text-red-500'
                              }`}>
                                {dim.status}
                              </span>
                            </div>
                            <div className={`h-1.5 rounded-full overflow-hidden ${
                              isDarkMode ? 'bg-white/[0.05]' : 'bg-gray-200'
                            }`}>
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  dim.score >= 70 ? 'bg-green-500' 
                                  : dim.score >= 50 ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                                }`}
                                style={{ width: `${dim.score}%` }}
                              />
                            </div>
                  </div>
                          <span className={`text-[14px] font-light ${textColor} w-10 text-right`}>
                            {dim.score}%
                          </span>
              </div>
            ))}
          </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>

        {/* Security - Compact Grid with Hover Effects */}
        <section className="py-20 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 text-green-500`}>
                Security
              </p>
              <h2 className={`text-[36px] font-light ${textColor} tracking-tight`}>
                Enterprise-Grade Protection
              </h2>
              </div>
              
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {[
                { icon: Shield, title: 'SOC2', detail: 'Type II' },
                { icon: Lock, title: 'AES-256', detail: 'Encryption' },
                { icon: Globe, title: 'GDPR', detail: 'Compliant' },
                { icon: Database, title: 'Residency', detail: 'Control' }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className={`p-4 md:p-5 rounded-[16px] md:rounded-[20px] text-center transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 cursor-pointer group ${
                    isDarkMode
                      ? 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-green-500/20'
                      : 'bg-gray-50 border border-gray-200 hover:bg-white hover:border-green-500/20'
                  } hover:shadow-lg will-change-transform`}>
                    <Icon className="w-6 h-6 mx-auto mb-3 text-green-500 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <h3 className={`text-[14px] font-semibold ${textColor}`}>{item.title}</h3>
                    <p className={`text-[11px] ${subTextColor}`}>{item.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final CTA - Centered & Clean with Glow Effect */}
        <section className="py-32 px-6 relative">
          {/* Glow background effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#5380b3]/10 via-[#7a6ca8]/10 to-[#a74f8b]/10 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className={`text-[48px] font-light ${textColor} mb-4 tracking-tight animate-fade-in-up`}>
              Ready to break through
              <span className="block text-[52px] font-normal bg-gradient-to-r from-[#5380b3] via-[#7a6ca8] to-[#a74f8b] bg-clip-text text-transparent">
                your AI taboos?
              </span>
            </h2>
            
            <p className={`${subTextColor} text-[16px] mb-8 max-w-xl mx-auto`}>
              Discover what's really holding your organization back—and how to fix it
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/demo">
                <Button 
                  variant="primary" 
                  isDark={isDarkMode}
                  className="w-full sm:w-auto transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl min-w-[160px]"
                >
                  View Demo
                </Button>
                </Link>
              <Link href="/assessment">
                <Button 
                  variant="secondary" 
                  isDark={isDarkMode}
                  className="w-full sm:w-auto transform transition-all duration-300 hover:scale-[1.02] min-w-[160px]"
                >
                  Take Quick Scan
                </Button>
                </Link>
            </div>
            
            <p className={`text-[12px] ${subTextColor} mt-8`}>
              See you at <span className="font-semibold">Web Summit 2025</span> · Lisbon
            </p>
          </div>
        </section>

        {/* Footer - Minimal and Refined */}
        <footer className={`py-8 md:py-12 ${isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-gray-200'}`}>
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src="/LeadingwithAI-removebg-preview.png" 
                  alt="AI Navigator" 
                  className="w-5 h-5 object-contain"
                />
                <span className={`text-[12px] md:text-[13px] ${subTextColor}`}>© 2025 AI Navigator</span>
            </div>
              
              <div className="flex gap-4 md:gap-5">
                {[
                  { label: 'Demo', href: '/demo' },
                  { label: 'Framework', href: '#framework' },
                  { label: 'How It Works', href: '#how-it-works' }
                ].map((item) => (
                  <Link key={item.label} href={item.href} className={`text-[11px] md:text-[12px] ${subTextColor} hover:${textColor} transition-colors`}>
                    {item.label}
                  </Link>
                ))}
              </div>
          </div>
        </div>
      </footer>
    </div>
    </main>
  )
}