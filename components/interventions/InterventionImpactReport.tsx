'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, CheckCircle, Target, Users, Brain, Award, Calendar, ArrowRight, Sparkles, BookmarkPlus, Bookmark } from 'lucide-react'
import { INTERVENTIONS } from '@/lib/constants/interventions'
import { calculateSentimentHeatmap } from '@/lib/calculations/sentiment-ranking'
import { calculateCapabilityAssessment } from '@/lib/calculations/capability-analysis'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface InterventionImpactReportProps {
  baselineData: any[]
  phase2Data: any[]
  phase3Data: any[]
  baselineCapability: any[]
  phase2Capability: any[]
  phase3Capability: any[]
  selectedPhase: 'phase2' | 'phase3'
}

interface PhaseInterventions {
  phase: string
  phaseName: string
  interventions: string[]
  fromDate: string
  toDate: string
}

const PHASE_CONFIG: Record<string, PhaseInterventions> = {
  phase2: {
    phase: 'phase2',
    phaseName: 'Phase 2: Initial Implementation',
    interventions: ['A1', 'B2', 'C1'],
    fromDate: 'Oct 2024',
    toDate: 'Mar 2025'
  },
  phase3: {
    phase: 'phase3',
    phaseName: 'Phase 3: Advanced Implementation',
    interventions: ['A2', 'C3', 'D1'],
    fromDate: 'Mar 2025',
    toDate: 'Nov 2025'
  }
}

export default function InterventionImpactReport({
  baselineData,
  phase2Data,
  phase3Data,
  baselineCapability,
  phase2Capability,
  phase3Capability,
  selectedPhase
}: InterventionImpactReportProps) {
  const config = PHASE_CONFIG[selectedPhase]

  // Committed interventions state
  const [committedInterventions, setCommittedInterventions] = useState<Set<string>>(new Set())

  // Load committed interventions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('committed-interventions')
      if (saved) {
        setCommittedInterventions(new Set(JSON.parse(saved)))
      }
    } catch (error) {
      console.error('Failed to load committed interventions:', error)
    }
  }, [])

  // Toggle commitment to an intervention
  const toggleCommitment = (code: string) => {
    const newCommitted = new Set(committedInterventions)
    if (newCommitted.has(code)) {
      newCommitted.delete(code)
      toast.success(`Removed ${code} from committed interventions`, {
        icon: '📋',
        duration: 2000
      })
    } else {
      newCommitted.add(code)
      toast.success(`Committed to intervention ${code}`, {
        icon: '✅',
        duration: 2000
      })
    }
    setCommittedInterventions(newCommitted)

    // Save to localStorage
    try {
      localStorage.setItem('committed-interventions', JSON.stringify(Array.from(newCommitted)))
    } catch (error) {
      console.error('Failed to save committed interventions:', error)
      toast.error('Failed to save commitment')
    }
  }

  // Calculate actual impacts
  const impacts = useMemo(() => {
    const isPhase2 = selectedPhase === 'phase2'

    // Sentiment data
    const beforeSentiment = isPhase2 ? baselineData : phase2Data
    const afterSentiment = isPhase2 ? phase2Data : phase3Data

    const beforeSentimentCalc = calculateSentimentHeatmap(beforeSentiment, {})
    const afterSentimentCalc = calculateSentimentHeatmap(afterSentiment, {})

    const sentimentBefore = beforeSentimentCalc.stats.overallAverage
    const sentimentAfter = afterSentimentCalc.stats.overallAverage
    const sentimentDelta = sentimentBefore - sentimentAfter // Lower is better, so this gives positive for improvement

    // Capability data
    const beforeCapability = isPhase2 ? baselineCapability : phase2Capability
    const afterCapability = isPhase2 ? phase2Capability : phase3Capability

    const benchmarks: Record<number, number> = {
      1: 4.3, 2: 5.5, 3: 4.1, 4: 3.7, 5: 4.6, 6: 4.8, 7: 5.0, 8: 4.9
    }

    const beforeCapabilityCalc = calculateCapabilityAssessment(beforeCapability, benchmarks, {})
    const afterCapabilityCalc = calculateCapabilityAssessment(afterCapability, benchmarks, {})

    const capabilityBefore = beforeCapabilityCalc.overall.average
    const capabilityAfter = afterCapabilityCalc.overall.average
    const capabilityDelta = capabilityAfter - capabilityBefore

    // Calculate dimension-specific impacts
    const dimensionImpacts = afterCapabilityCalc.dimensions.map((afterDim, idx) => {
      const beforeDim = beforeCapabilityCalc.dimensions[idx]
      return {
        dimensionId: afterDim.dimensionId,
        name: afterDim.name,
        before: beforeDim.average,
        after: afterDim.average,
        delta: afterDim.average - beforeDim.average,
        isTargeted: config.interventions.some(code =>
          INTERVENTIONS[code].targets.capabilityDimensions?.includes(afterDim.dimensionId)
        )
      }
    }).sort((a, b) => b.delta - a.delta) // Sort by biggest improvement first

    // Calculate sentiment cell impacts (for targeted cells)
    const targetedCells = new Map<string, number>()
    config.interventions.forEach(code => {
      const intervention = INTERVENTIONS[code]
      if (intervention.targets.sentimentLevels && intervention.targets.sentimentCategories) {
        intervention.targets.sentimentLevels.forEach(level => {
          intervention.targets.sentimentCategories!.forEach(category => {
            const cellId = `L${level}_C${category}`
            const beforeCell = beforeSentimentCalc.cells.find(c => c.cellId === cellId)
            const afterCell = afterSentimentCalc.cells.find(c => c.cellId === cellId)
            if (beforeCell && afterCell && beforeCell.count > 0 && afterCell.count > 0) {
              targetedCells.set(cellId, beforeCell.score - afterCell.score) // Positive = improvement
            }
          })
        })
      }
    })

    return {
      sentimentBefore,
      sentimentAfter,
      sentimentDelta,
      capabilityBefore,
      capabilityAfter,
      capabilityDelta,
      dimensionImpacts,
      targetedCells
    }
  }, [selectedPhase, baselineData, phase2Data, phase3Data, baselineCapability, phase2Capability, phase3Capability, config.interventions])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Leadership': return Target
      case 'Communication': return Users
      case 'Training': return Brain
      case 'Process': return CheckCircle
      case 'Culture': return Sparkles
      case 'Technology': return Award
      default: return CheckCircle
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Leadership': return 'from-blue-500 to-indigo-500'
      case 'Communication': return 'from-purple-500 to-pink-500'
      case 'Training': return 'from-green-500 to-emerald-500'
      case 'Process': return 'from-orange-500 to-amber-500'
      case 'Culture': return 'from-pink-500 to-rose-500'
      case 'Technology': return 'from-cyan-500 to-teal-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto p-4">

      {/* Header */}
      <div className="flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{config.phaseName}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Intervention Impact Report • {config.fromDate} → {config.toDate}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Overall Impact Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0"
      >
        {/* Sentiment Impact */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-teal-200 dark:border-teal-600/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Sentiment Improvement
            </h3>
            <div className={cn(
              "px-2 py-1 rounded-lg text-xs font-bold",
              impacts.sentimentDelta > 0 ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-red-500/20 text-red-700 dark:text-red-400"
            )}>
              {impacts.sentimentDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-teal-700 dark:text-teal-400">
                {impacts.sentimentDelta > 0 ? '-' : '+'}{Math.abs(impacts.sentimentDelta).toFixed(2)}
              </span>
              <span className="text-lg text-gray-600 dark:text-gray-400">points</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">From</span>
              <span className="font-bold text-gray-900 dark:text-white">{impacts.sentimentBefore.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="font-bold text-teal-700 dark:text-teal-400">{impacts.sentimentAfter.toFixed(2)}</span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-500 mt-2">
              Lower resistance scores indicate better sentiment
            </p>
          </div>
        </div>

        {/* Capability Impact */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-600/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Capability Growth
            </h3>
            <div className={cn(
              "px-2 py-1 rounded-lg text-xs font-bold",
              impacts.capabilityDelta > 0 ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-red-500/20 text-red-700 dark:text-red-400"
            )}>
              {impacts.capabilityDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-purple-700 dark:text-purple-400">
                {impacts.capabilityDelta > 0 ? '+' : ''}{impacts.capabilityDelta.toFixed(2)}
              </span>
              <span className="text-lg text-gray-600 dark:text-gray-400">points</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">From</span>
              <span className="font-bold text-gray-900 dark:text-white">{impacts.capabilityBefore.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="font-bold text-purple-700 dark:text-purple-400">{impacts.capabilityAfter.toFixed(2)}</span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-500 mt-2">
              Scale: 1-7, higher scores indicate greater maturity
            </p>
          </div>
        </div>
      </motion.div>

      {/* Interventions Applied */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Interventions Applied ({config.interventions.length})
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {config.interventions.map((code, idx) => {
            const intervention = INTERVENTIONS[code]
            const Icon = getCategoryIcon(intervention.category)

            return (
              <motion.div
                key={code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                    getCategoryColor(intervention.category)
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{code}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {intervention.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          {intervention.name}
                        </h3>
                      </div>

                      <div className="flex gap-1 flex-shrink-0">
                        <div className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                          <div className="text-[9px] text-blue-600 dark:text-blue-400 uppercase tracking-wide">Effort</div>
                          <div className="text-xs font-bold text-blue-700 dark:text-blue-300 capitalize">{intervention.effort}</div>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                          <div className="text-[9px] text-green-600 dark:text-green-400 uppercase tracking-wide">Cost</div>
                          <div className="text-xs font-bold text-green-700 dark:text-green-300 capitalize">{intervention.cost}</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {intervention.description}
                    </p>

                    {/* Expected Impact */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      {intervention.impact.sentimentReduction !== 0 && (
                        <div className="px-2 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700">
                          <div className="text-[9px] text-teal-600 dark:text-teal-400 uppercase tracking-wide mb-0.5">Expected Sentiment</div>
                          <div className="font-bold text-teal-700 dark:text-teal-300">
                            {intervention.impact.sentimentReduction.toFixed(2)} reduction
                          </div>
                        </div>
                      )}
                      {intervention.impact.capabilityIncrease !== 0 && (
                        <div className="px-2 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                          <div className="text-[9px] text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-0.5">Expected Capability</div>
                          <div className="font-bold text-purple-700 dark:text-purple-300">
                            +{intervention.impact.capabilityIncrease.toFixed(2)} increase
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Commit Button */}
                    <motion.button
                      onClick={() => toggleCommitment(code)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2",
                        committedInterventions.has(code)
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {committedInterventions.has(code) ? (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Committed</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-4 h-4" />
                          <span>Commit to This</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Dimension-Specific Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          Capability Dimension Results
        </h2>

        <div className="space-y-2">
          {impacts.dimensionImpacts.map((dim, idx) => (
            <motion.div
              key={dim.dimensionId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              className={cn(
                "rounded-lg border p-3",
                dim.isTargeted
                  ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-300 dark:border-purple-600"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {dim.isTargeted && (
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{dim.name}</h4>
                      {dim.isTargeted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white">
                          TARGETED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>{dim.before.toFixed(2)}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-bold text-purple-700 dark:text-purple-400">{dim.after.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "px-3 py-1.5 rounded-lg font-bold text-sm",
                  dim.delta > 0.5 ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                  dim.delta > 0 ? "bg-blue-500/20 text-blue-700 dark:text-blue-400" :
                  "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                )}>
                  {dim.delta > 0 ? '+' : ''}{dim.delta.toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
