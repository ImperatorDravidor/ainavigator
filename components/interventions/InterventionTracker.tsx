'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Lock, Calendar, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

interface Intervention {
  code: string
  name: string
  level: string
  core_function: string
  description?: string
}

interface AppliedIntervention {
  id: string
  intervention_code: string
  applied_date: string
  status: 'planned' | 'in_progress' | 'completed' | 'abandoned'
  notes?: string
}

interface InterventionTrackerProps {
  assessmentPeriodId?: string
  onInterventionsChange?: () => void
}

export function InterventionTracker({
  assessmentPeriodId,
  onInterventionsChange
}: InterventionTrackerProps) {
  const { company } = useAuth()
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [appliedInterventions, setAppliedInterventions] = useState<AppliedIntervention[]>([])
  const [loading, setLoading] = useState(true)
  const [showLockDialog, setShowLockDialog] = useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null)
  const [appliedDate, setAppliedDate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadData()
  }, [company?.id, assessmentPeriodId])

  const loadData = async () => {
    if (!company?.id) return

    try {
      setLoading(true)

      // Load all interventions
      const intResponse = await fetch('/api/interventions', {
        headers: { 'x-company-id': company.id }
      })
      if (intResponse.ok) {
        const intData = await intResponse.json()
        setInterventions(intData.data || [])
      }

      // Load applied interventions if assessment period is selected
      if (assessmentPeriodId) {
        const appliedResponse = await fetch(
          `/api/data/applied-interventions?assessment_period_id=${assessmentPeriodId}`,
          { headers: { 'x-company-id': company.id } }
        )
        if (appliedResponse.ok) {
          const appliedData = await appliedResponse.json()
          setAppliedInterventions(appliedData.data || [])
        }
      }
    } catch (error) {
      console.error('Failed to load intervention data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLockIntervention = (intervention: Intervention) => {
    setSelectedIntervention(intervention)
    setAppliedDate(new Date().toISOString().split('T')[0])
    setNotes('')
    setShowLockDialog(true)
  }

  const handleConfirmLock = async () => {
    if (!selectedIntervention || !company?.id || !assessmentPeriodId) return

    try {
      const response = await fetch('/api/data/applied-interventions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': company.id
        },
        body: JSON.stringify({
          assessment_period_id: assessmentPeriodId,
          intervention_code: selectedIntervention.code,
          applied_date: appliedDate,
          status: 'completed',
          notes
        })
      })

      if (response.ok) {
        await loadData()
        onInterventionsChange?.()
        setShowLockDialog(false)
      }
    } catch (error) {
      console.error('Failed to lock intervention:', error)
    }
  }

  const isInterventionApplied = (code: string) => {
    return appliedInterventions.some(ai => ai.intervention_code === code)
  }

  const getInterventionStatus = (code: string): AppliedIntervention | undefined => {
    return appliedInterventions.find(ai => ai.intervention_code === code)
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Loading interventions...</p>
      </div>
    )
  }

  if (!assessmentPeriodId) {
    return (
      <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Select an assessment period
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Choose a baseline period from the sidebar to track which interventions were implemented.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Group interventions by level
  const groupedInterventions = interventions.reduce((acc, int) => {
    const level = int.level
    if (!acc[level]) acc[level] = []
    acc[level].push(int)
    return acc
  }, {} as Record<string, Intervention[]>)

  const levelInfo: Record<string, { name: string; color: string; bgColor: string }> = {
    'A (Strategy & Governance)': {
      name: 'Strategy & Governance',
      color: 'text-blue-700 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    'B (Adoption & Behaviour)': {
      name: 'Adoption & Behaviour',
      color: 'text-purple-700 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    },
    'C (Innovation & Experimentation)': {
      name: 'Innovation & Experimentation',
      color: 'text-teal-700 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Intervention Tracking
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Mark interventions as implemented to track their impact in future assessments
        </p>
      </div>

      {/* Interventions by Level */}
      {Object.entries(groupedInterventions).map(([level, ints]) => {
        const info = levelInfo[level] || { name: level, color: 'text-gray-700', bgColor: 'bg-gray-50' }
        
        return (
          <div key={level} className="space-y-3">
            <div className={cn("px-3 py-2 rounded-lg", info.bgColor)}>
              <h4 className={cn("text-sm font-semibold", info.color)}>
                {info.name}
              </h4>
            </div>

            <div className="space-y-2">
              {ints.map((intervention) => {
                const applied = getInterventionStatus(intervention.code)
                const isApplied = !!applied

                return (
                  <motion.div
                    key={intervention.code}
                    className={cn(
                      "p-4 rounded-lg border transition-all",
                      isApplied
                        ? "bg-green-50 dark:bg-green-950/10 border-green-300 dark:border-green-800"
                        : "bg-white dark:bg-white/5 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {intervention.code}
                          </span>
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {intervention.name}
                          </h5>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {intervention.core_function}
                        </p>
                        {applied && (
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Applied: {new Date(applied.applied_date).toLocaleDateString()}</span>
                            </div>
                            {applied.notes && (
                              <span className="italic">{applied.notes}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => !isApplied && handleLockIntervention(intervention)}
                        disabled={isApplied}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                          isApplied
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-not-allowed"
                            : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                        )}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Implemented</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Mark as Implemented</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Lock Intervention Dialog */}
      <AnimatePresence>
        {showLockDialog && selectedIntervention && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowLockDialog(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Mark Intervention as Implemented
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedIntervention.code}: {selectedIntervention.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Implementation Date
                  </label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional details about the implementation..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLockDialog(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLock}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/25"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

