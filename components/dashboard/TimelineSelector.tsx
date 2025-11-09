'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, ChevronDown, Plus, Upload, Check,
  TrendingUp, TrendingDown, Activity, Users
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { useData } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import PeriodUploadModal from './PeriodUploadModal'

interface TimelineSelectorProps {
  // onUploadClick prop removed - handled internally
}

export default function TimelineSelector() {
  const {
    assessmentPeriods,
    currentPeriodId,
    currentPeriod,
    setAssessmentPeriods,
    setCurrentPeriod
  } = useData()

  const [isOpen, setIsOpen] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load assessment periods on mount
  useEffect(() => {
    loadAssessmentPeriods()
  }, [])

  const loadAssessmentPeriods = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('assessment_periods')
        .select('*')
        .order('assessment_date', { ascending: true })

      if (error) throw error

      if (data) {
        setAssessmentPeriods(data)
      }
    } catch (error) {
      console.error('Error loading assessment periods:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePeriodChange = (periodId: string) => {
    setCurrentPeriod(periodId)
    setIsOpen(false)
  }

  const getPeriodProgress = (period: any, index: number) => {
    if (index === 0 || !assessmentPeriods[index - 1]) return null

    const previousPeriod = assessmentPeriods[index - 1]
    const currentCount = period.sentiment_respondents || 0
    const previousCount = previousPeriod.sentiment_respondents || 0

    if (previousCount === 0) return null

    const percentChange = ((currentCount - previousCount) / previousCount) * 100
    return {
      value: percentChange,
      isPositive: percentChange >= 0
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 animate-pulse">
        <Calendar className="w-4 h-4 text-gray-400" />
        <div className="w-32 h-4 bg-white/10 rounded" />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Current Period Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
          "bg-gradient-to-r from-teal-500/10 to-purple-500/10",
          "border border-teal-500/30 hover:border-teal-400/50",
          "hover:from-teal-500/15 hover:to-purple-500/15",
          isOpen && "border-teal-400/50"
        )}
      >
        <Calendar className="w-4 h-4 text-teal-400" />
        <div className="flex flex-col items-start">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Assessment Period</div>
          <div className="text-sm font-semibold text-white">
            {currentPeriod?.name || 'Select Period'}
          </div>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-gray-400 transition-transform ml-2",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 w-80 bg-slate-900/95 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Assessment Timeline</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Select a period to view data and insights
              </p>
            </div>

            {/* Period List */}
            <div className="max-h-96 overflow-y-auto">
              {assessmentPeriods.map((period, index) => {
                const progress = getPeriodProgress(period, index)
                const isBaseline = period.survey_wave.includes('baseline')
                const isCurrent = period.id === currentPeriodId
                const hasData = (period.sentiment_respondents || 0) > 0

                return (
                  <button
                    key={period.id}
                    onClick={() => hasData ? handlePeriodChange(period.id) : null}
                    disabled={!hasData}
                    className={cn(
                      "w-full px-4 py-3 flex items-center gap-3 transition-all",
                      "border-b border-white/5",
                      hasData && "hover:bg-white/5 cursor-pointer",
                      !hasData && "opacity-50 cursor-not-allowed",
                      isCurrent && "bg-teal-500/10 border-l-2 border-l-teal-400"
                    )}
                  >
                    {/* Period Icon & Status */}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isCurrent ? "bg-teal-500/20 border border-teal-500/30" : "bg-white/5"
                    )}>
                      {hasData ? (
                        isCurrent ? (
                          <Check className="w-5 h-5 text-teal-400" />
                        ) : (
                          <Calendar className="w-5 h-5 text-gray-400" />
                        )
                      ) : (
                        <Upload className="w-5 h-5 text-gray-500" />
                      )}
                    </div>

                    {/* Period Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-sm font-semibold",
                          isCurrent ? "text-white" : "text-gray-300"
                        )}>
                          {period.name}
                        </span>
                        {isBaseline && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 border border-blue-500/30 text-blue-400 font-medium">
                            BASELINE
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-500/20 border border-teal-500/30 text-teal-400 font-medium">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{format(parseISO(period.assessment_date), 'MMM dd, yyyy')}</span>
                        {hasData ? (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {period.sentiment_respondents} responses
                            </span>
                          </>
                        ) : (
                          <>
                            <span>•</span>
                            <span className="text-orange-400">No data uploaded</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    {progress && hasData && (
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded",
                        progress.isPositive
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      )}>
                        {progress.isPositive ? (
                          <TrendingUp className="w-3 h-3 text-green-400" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        )}
                        <span className={cn(
                          "text-xs font-bold",
                          progress.isPositive ? "text-green-400" : "text-red-400"
                        )}>
                          {progress.isPositive ? '+' : ''}{progress.value.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Upload New Period Button */}
            <div className="p-3 border-t border-white/10 bg-white/5">
              <button
                onClick={() => {
                  setIsOpen(false)
                  setShowUploadModal(true)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 transition-all text-white font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Upload New Assessment Data
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Upload Modal */}
      <PeriodUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  )
}
