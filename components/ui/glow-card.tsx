'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
}

export function GlowCard({ 
  children, 
  className,
  glowColor = 'rgba(20, 184, 166, 0.3)',
  onClick 
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const background = useMotionTemplate`
    radial-gradient(
      400px circle at ${mouseX}px ${mouseY}px,
      ${glowColor},
      transparent 80%
    )
  `

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl',
        'border border-gray-900/[0.12] dark:border-white/10',
        'shadow-lg dark:shadow-xl transition-shadow duration-300',
        onClick && 'cursor-pointer hover:shadow-2xl',
        className
      )}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${glowColor.replace('0.3', '0.5')},
              transparent 40%
            )
          `,
          maskImage: 'linear-gradient(transparent, transparent calc(100% - 1px), black calc(100% - 1px))',
        }}
      />
    </motion.div>
  )
}





