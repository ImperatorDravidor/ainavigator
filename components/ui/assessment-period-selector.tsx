'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

interface AssessmentPeriod {
  id: string
  survey_wave: string
  assessment_date: string
  name: string
  description?: string
  interventions_applied?: string[]
  sentiment_respondents: number
  capability_respondents: number
  status: 'draft' | 'active' | 'archived'
}

interface AssessmentPeriodSelectorProps {
  selectedWave?: string
  onWaveChange: (wave: string | undefined) => void
  showComparison?: boolean
  onComparisonChange?: (enabled: boolean) => void
}

export function AssessmentPeriodSelector({
  selectedWave,
  onWaveChange,
  showComparison = false,
  onComparisonChange
}: AssessmentPeriodSelectorProps) {
  const { company } = useAuth()
  const [periods, setPeriods] = useState<AssessmentPeriod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPeriods()
  }, [company?.id])

  const loadPeriods = async () => {
    if (!company?.id) return

    try {
      setLoading(true)
      const response = await fetch('/api/data/assessment-periods', {
        headers: {
          'x-company-id': company.id
        }
      })

      if (response.ok) {
        const result = await response.json()
        const allPeriods = result.data || []
        
        // Filter to only show baseline and phase 2
        const filteredPeriods = allPeriods.filter((p: AssessmentPeriod) => 
          p.survey_wave === 'oct-2024-baseline' || 
          p.survey_wave === 'mar-2025-phase2'
        )
        
        setPeriods(filteredPeriods)
        
        // Set default to baseline if no wave selected
        if (!selectedWave && filteredPeriods.length > 0) {
          const baseline = filteredPeriods.find((p: AssessmentPeriod) => 
            p.survey_wave === 'oct-2024-baseline'
          )
          if (baseline) {
            onWaveChange(baseline.survey_wave)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load assessment periods:', error)
    } finally {
      setLoading(false)
    }
  }

  const baselinePeriod = periods.find(p => p.survey_wave === 'oct-2024-baseline')
  const phase2Period = periods.find(p => p.survey_wave === 'mar-2025-phase2')
  const selectedPeriod = periods.find(p => p.survey_wave === selectedWave)

  if (loading) {
    return (
      <div className="p-3 text-center">
        <RefreshCw className="w-4 h-4 animate-spin mx-auto text-slate-400" />
      </div>
    )
  }

  if (periods.length === 0) {
    return null // No temporal tracking available
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Assessment Period</h3>
        </div>
        {periods.length > 1 && onComparisonChange && (
          <button
            onClick={() => onComparisonChange(!showComparison)}
            className={cn(
              "px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all",
              showComparison
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Compare Waves
          </button>
        )}
      </div>

      {/* Period Selection */}
      <div className="space-y-2">
        {/* Baseline Period */}
        {baselinePeriod && (
          <motion.button
            onClick={() => onWaveChange(baselinePeriod.survey_wave)}
            className={cn(
              "w-full p-3 rounded-xl border-2 transition-all text-left",
              selectedWave === baselinePeriod.survey_wave
                ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border-blue-500 dark:border-blue-400 shadow-md"
                : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-sm"
            )}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={cn(
                    "text-sm font-bold",
                    selectedWave === baselinePeriod.survey_wave 
                      ? "text-blue-700 dark:text-blue-400" 
                      : "text-slate-900 dark:text-white"
                  )}>
                    {baselinePeriod.name}
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500 text-white uppercase tracking-wider">
                    Baseline
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-gray-400">
                  {new Date(baselinePeriod.assessment_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {baselinePeriod.description && (
                  <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-1 line-clamp-2">
                    {baselinePeriod.description}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {baselinePeriod.sentiment_respondents || 0}
                </div>
                <div className="text-[9px] font-semibold text-slate-600 dark:text-gray-500 uppercase tracking-wide">
                  Responses
                </div>
              </div>
            </div>
          </motion.button>
        )}

        {/* Phase 2 Period */}
        {phase2Period && (
          <motion.button
            onClick={() => onWaveChange(phase2Period.survey_wave)}
            className={cn(
              "w-full p-3 rounded-xl border-2 transition-all text-left",
              selectedWave === phase2Period.survey_wave
                ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border-emerald-500 dark:border-emerald-400 shadow-md"
                : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-sm"
            )}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={cn(
                    "text-sm font-bold",
                    selectedWave === phase2Period.survey_wave 
                      ? "text-emerald-700 dark:text-emerald-400" 
                      : "text-slate-900 dark:text-white"
                  )}>
                    {phase2Period.name}
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white uppercase tracking-wider">
                    Phase 2
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-gray-400">
                  {new Date(phase2Period.assessment_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {phase2Period.interventions_applied && phase2Period.interventions_applied.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Interventions:</span>
                    <div className="flex gap-1">
                      {phase2Period.interventions_applied.map((code, idx) => (
                        <span 
                          key={idx} 
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {phase2Period.sentiment_respondents || 0}
                </div>
                <div className="text-[9px] font-semibold text-slate-600 dark:text-gray-500 uppercase tracking-wide">
                  Responses
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </div>

      {/* Helper info */}
      {periods.length === 1 && (
        <div className="p-2.5 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-lg">
          <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed">
            <strong>Next step:</strong> Phase 2 data will appear here after interventions are implemented and the next assessment is completed.
          </p>
        </div>
      )}
    </div>
  )
}
