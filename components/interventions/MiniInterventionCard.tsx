/**
 * Mini Intervention Card Component
 * Beautiful, reusable card for displaying tactical quick-action interventions
 */

import { motion } from 'framer-motion'
import { Zap, Target, Shield, Sparkles } from 'lucide-react'
import { MiniIntervention } from '@/lib/services/mini-interventions-service'

interface MiniInterventionCardProps {
  intervention: MiniIntervention
  index?: number
  onSelect?: (intervention: MiniIntervention) => void
  selected?: boolean
  compact?: boolean
}

const flavorConfig = {
  basic: {
    icon: Target,
    gradient: 'from-blue-600 to-blue-700',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10',
    borderColor: 'border-blue-200 dark:border-blue-500/30',
    textColor: 'text-blue-900 dark:text-blue-100',
    badgeGradient: 'from-blue-600 to-cyan-600',
    label: 'Structured',
    description: 'Procedural approach with clear frameworks'
  },
  risky: {
    icon: Zap,
    gradient: 'from-orange-600 to-red-600',
    bgGradient: 'from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10',
    borderColor: 'border-orange-200 dark:border-orange-500/30',
    textColor: 'text-orange-900 dark:text-orange-100',
    badgeGradient: 'from-orange-600 to-red-600',
    label: 'Creative',
    description: 'Bold, innovative approach with high engagement'
  },
  safe: {
    icon: Shield,
    gradient: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10',
    borderColor: 'border-emerald-200 dark:border-emerald-500/30',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    badgeGradient: 'from-emerald-600 to-teal-600',
    label: 'Reflective',
    description: 'Thoughtful, low-risk approach'
  }
}

export default function MiniInterventionCard({
  intervention,
  index = 0,
  onSelect,
  selected = false,
  compact = false
}: MiniInterventionCardProps) {
  const config = flavorConfig[intervention.flavor]
  const Icon = config.icon

  if (compact) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => onSelect?.(intervention)}
        className={`
          w-full text-left p-3 rounded-lg border-2
          bg-gradient-to-br ${config.bgGradient}
          ${selected ? config.borderColor : 'border-white/10'}
          hover:${config.borderColor}
          transition-all duration-200
          ${selected ? 'ring-2 ring-offset-2 ring-offset-black' : ''}
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`
            w-8 h-8 rounded-lg flex-shrink-0
            bg-gradient-to-br ${config.gradient}
            flex items-center justify-center
          `}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`
                text-xs font-bold uppercase tracking-wider
                ${config.textColor}
              `}>
                {config.label}
              </span>
            </div>
            <h4 className={`text-sm font-semibold mb-1 line-clamp-2 ${config.textColor}`}>
              {intervention.title}
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-400 line-clamp-2">
              {intervention.explanation}
            </p>
          </div>
        </div>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
      className={`
        relative rounded-xl overflow-hidden
        bg-gradient-to-br ${config.bgGradient}
        border-2 ${selected ? config.borderColor : 'border-white/10'}
        hover:${config.borderColor}
        transition-all duration-300
        ${onSelect ? 'cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-offset-2 ring-offset-black scale-105' : 'hover:scale-102'}
      `}
      onClick={() => onSelect?.(intervention)}
    >
      {/* Header with icon and label */}
      <div className={`
        px-4 py-3 border-b border-gray-200 dark:border-white/10
        bg-gradient-to-r ${config.gradient}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {config.label} Approach
              </div>
              <div className="text-[10px] text-white/90">
                {config.description}
              </div>
            </div>
          </div>
          
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={`text-base font-bold mb-2 ${config.textColor}`}>
          {intervention.title}
        </h3>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          {intervention.explanation}
        </p>

        {/* Context tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-[10px] font-medium text-gray-600 dark:text-gray-400">
            {intervention.reason}
          </span>
          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-[10px] font-medium text-gray-600 dark:text-gray-400">
            Level {intervention.levelId}
          </span>
        </div>
      </div>

      {/* Hover effect overlay */}
      {onSelect && (
        <motion.div
          className={`
            absolute inset-0 bg-gradient-to-br ${config.gradient}
            opacity-0 hover:opacity-5 transition-opacity pointer-events-none
          `}
        />
      )}
    </motion.div>
  )
}

