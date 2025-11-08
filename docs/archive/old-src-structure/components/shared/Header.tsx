'use client'

import { Brain } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Features', href: '/#features', external: false },
    { name: 'How it Works', href: '/#how-it-works', external: false },
    { name: 'Demo', href: '/demo', external: false },
    { name: 'Waitlist', href: '/waitlist', external: false }
  ]

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return pathname === '/'
    }
    return pathname === href
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-6"
    >
      <div className="relative bg-black/60 border-white/[0.06] shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-[80px] border rounded-[24px] px-4 py-3">
        {/* Glass layers for depth */}
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-t from-black/40 via-transparent to-white/[0.02] pointer-events-none" />
        
        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img 
              src="/LeadingwithAI-removebg-preview.png" 
              alt="AI Navigator" 
              className="w-9 h-9 object-contain"
            />
            <span className="font-semibold text-lg tracking-tight">AI Navigator</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[14px] font-medium px-4 py-2 rounded-[18px] transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-white/[0.08] text-white shadow-lg backdrop-blur-xl'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/upload" className="ml-2 text-[14px] font-semibold px-5 py-2 rounded-[18px] text-white bg-gradient-to-br from-[#0D7C7F] to-[#14B8A6] hover:from-[#0D7C7F]/90 hover:to-[#14B8A6]/90 shadow-lg transition-all duration-200">
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </motion.div>
  )
}

