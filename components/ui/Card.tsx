'use client'

import { HTMLAttributes, forwardRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion'

const cardVariants = cva(
  'relative overflow-hidden rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'dark:bg-black/20 bg-white/70 backdrop-blur-xl dark:border-white/[0.08] border-gray-900/[0.1]',
        elevated: 'dark:bg-black/30 bg-white/80 backdrop-blur-2xl dark:border-white/[0.1] border-gray-900/[0.15] shadow-2xl',
        interactive: 'dark:bg-black/20 bg-white/70 backdrop-blur-xl dark:border-white/[0.08] border-gray-900/[0.1] cursor-pointer dark:hover:bg-white/[0.02] hover:bg-gray-900/[0.02] dark:hover:border-white/[0.12] hover:border-gray-900/[0.15] hover:shadow-2xl hover:-translate-y-0.5',
        glass: 'dark:bg-white/[0.03] bg-white/80 backdrop-blur-2xl dark:border-white/[0.08] border-gray-900/[0.12]',
        gradient: 'dark:bg-gradient-to-br dark:from-white/[0.08] dark:to-transparent bg-gradient-to-br from-gray-900/[0.05] to-transparent backdrop-blur-xl dark:border-white/[0.12] border-gray-900/[0.15]'
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      glow: {
        none: '',
        subtle: 'shadow-[0_0_30px_rgba(83,128,179,0.15)]',
        medium: 'shadow-[0_0_50px_rgba(83,128,179,0.25)]',
        strong: 'shadow-[0_0_80px_rgba(83,128,179,0.35)]'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      glow: 'none'
    }
  }
)

type MotionDivProps = HTMLMotionProps<"div"> & HTMLAttributes<HTMLDivElement>

export interface CardProps
  extends MotionDivProps,
    VariantProps<typeof cardVariants> {
  hover?: boolean
  delay?: number
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, glow, hover = false, delay = 0, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const MotionDiv = motion.div

    return (
      <MotionDiv
        ref={ref}
        className={cn(cardVariants({ variant, size, glow, className }))}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay,
          ease: [0.16, 1, 0.3, 1]
        }}
        whileHover={hover ? { scale: 1.02, y: -4 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...props}
      >
        {/* Animated gradient border on hover */}
        <AnimatePresence>
          {hover && isHovered && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'linear-gradient(90deg, #5380b3, #a74f8b, #e0874e, #5380b3)',
                backgroundSize: '300% 100%',
                padding: '1px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            >
              <motion.div
                animate={{ backgroundPosition: ['0%', '100%'] }}
                transition={{
                  duration: 3,
                  ease: 'linear',
                  repeat: Infinity
                }}
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'inherit',
                  backgroundSize: 'inherit'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle shimmer effect */}
        {variant === 'gradient' && (
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['-200% 0%', '200% 0%'],
            }}
            transition={{
              duration: 3,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </MotionDiv>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-6', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-6 pt-6 border-t dark:border-white/[0.08] border-gray-900/[0.1]', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'


