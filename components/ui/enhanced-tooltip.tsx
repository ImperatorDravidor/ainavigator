'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Info, Sparkles, Lightbulb, TrendingUp, Target } from 'lucide-react'

interface EnhancedTooltipProps {
  children: ReactNode
  content: string | ReactNode
  title?: string
  icon?: 'info' | 'tip' | 'insight' | 'goal' | 'sparkle'
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  maxWidth?: string
  disabled?: boolean
}

const iconMap = {
  info: Info,
  tip: Lightbulb,
  insight: TrendingUp,
  goal: Target,
  sparkle: Sparkles
}

export function EnhancedTooltip({
  children,
  content,
  title,
  icon,
  position = 'top',
  delay = 200,
  maxWidth = '300px',
  disabled = false
}: EnhancedTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const IconComponent = icon ? iconMap[icon] : null

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex group/tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={cn(
              "absolute z-[9999] pointer-events-none",
              position === 'top' && "bottom-full left-1/2 -translate-x-1/2 mb-2",
              position === 'bottom' && "top-full left-1/2 -translate-x-1/2 mt-2",
              position === 'left' && "right-full top-1/2 -translate-y-1/2 mr-2",
              position === 'right' && "left-full top-1/2 -translate-y-1/2 ml-2"
            )}
            style={{ maxWidth }}
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.15,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <div className="relative bg-gray-900 dark:bg-gray-800 backdrop-blur-xl border-2 border-white/20 rounded-xl shadow-2xl overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative p-4">
                {(title || icon) && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                    {IconComponent && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-teal-500/30 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-teal-300" />
                      </div>
                    )}
                    {title && (
                      <span className="text-sm font-bold text-white">
                        {title}
                      </span>
                    )}
                  </div>
                )}

                <div className="text-sm leading-relaxed text-white font-medium">
                  {content}
                </div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'linear',
                }}
              />
            </div>

            {/* Arrow */}
            <div className={cn(
              'absolute w-0 h-0',
              position === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900',
              position === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-900',
              position === 'left' && 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900',
              position === 'right' && 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-gray-900'
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

