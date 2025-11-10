'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, TrendingDown, TrendingUp, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { commitIntervention, uncommitIntervention, isCommitted } from '@/lib/store/intervention-store'

interface InterventionCommitCardProps {
  code: string
  name: string
  level: string
  coreFunction: string
  targetAreas: string[]
  expectedImpact: { area: string; improvement: string }[]
  currentPhase: 'baseline' | 'phase2' | 'phase3'
  disabled?: boolean
  onCommitChange?: () => void
}

export function InterventionCommitCard({
  code,
  name,
  level,
  coreFunction,
  targetAreas,
  expectedImpact,
  currentPhase,
  disabled = false,
  onCommitChange
}: InterventionCommitCardProps) {
  const [committed, setCommitted] = useState(isCommitted(code, currentPhase))
  
  const handleToggle = () => {
    if (disabled) return
    
    if (committed) {
      uncommitIntervention(code, currentPhase)
      setCommitted(false)
    } else {
      commitIntervention({
        code,
        phase: currentPhase,
        committedDate: new Date().toISOString(),
        targetAreas,
        expectedImpact: expectedImpact.map(e => e.improvement).join(', ')
      })
      setCommitted(true)
    }
    
    onCommitChange?.()
  }
  
  const levelColors: Record<string, { bg: string; border: string; text: string }> = {
    'A': { bg: 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-400' },
    'B': { bg: 'from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-400' },
    'C': { bg: 'from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20', border: 'border-teal-300 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-400' }
  }
  
  const levelKey = code[0] as 'A' | 'B' | 'C'
  const colors = levelColors[levelKey] || levelColors['A']
  
  return (
    <motion.div
      className={cn(
        "p-4 rounded-xl border-2 transition-all",
        committed
          ? "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border-teal-500 shadow-lg"
          : `bg-gradient-to-br ${colors.bg} ${colors.border}`,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      whileHover={!disabled ? { scale: 1.01, y: -2 } : {}}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0",
            committed
              ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md"
              : `bg-gradient-to-br ${colors.bg} ${colors.text}`
          )}>
            {code}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              {name}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {coreFunction}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all",
            committed
              ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-500",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {committed ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Committed
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              Commit
            </>
          )}
        </button>
      </div>
      
      {/* Expected Impact */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Expected Impact:</span>
        </div>
        {expectedImpact.map((impact, idx) => (
          <div key={idx} className="flex items-start gap-2 pl-6">
            <TrendingDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-slate-900 dark:text-white">{impact.area}:</span>
              <span className="text-slate-600 dark:text-slate-400 ml-1">{impact.improvement}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

