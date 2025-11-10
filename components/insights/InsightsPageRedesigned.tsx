'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Target, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { analyzeSentimentWeaknesses, analyzeCapabilityWeaknesses, getRecommendedInterventions } from '@/lib/analysis/phase-weakness-analyzer'
import { InterventionCommitCard } from '../interventions/InterventionCommitCard'

interface InsightsPageProps {
  sentimentData: any[]
  capabilityData: any[]
  benchmarks: Record<number, number>
  currentPhase: 'baseline' | 'phase2' | 'phase3'
  onRefresh?: () => void
}

export function InsightsPageRedesigned({
  sentimentData,
  capabilityData,
  benchmarks,
  currentPhase,
  onRefresh
}: InsightsPageProps) {
  const [weaknesses, setWeaknesses] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    // Analyze current phase data
    const sentimentWeak = analyzeSentimentWeaknesses(sentimentData)
    const capabilityWeak = analyzeCapabilityWeaknesses(capabilityData, benchmarks)
    const allWeaknesses = [...sentimentWeak, ...capabilityWeak]
    
    setWeaknesses(allWeaknesses)
    setRecommendations(getRecommendedInterventions(allWeaknesses))
  }, [sentimentData, capabilityData, currentPhase])

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case 'baseline': return 'Baseline Analysis - Problems Identified'
      case 'phase2': return 'Phase 2 Analysis - Progress Check'
      case 'phase3': return 'Phase 3 Analysis - Transformation Complete'
      default: return 'AI-Powered Insights'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {getPhaseTitle()}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Data-driven recommendations based on your assessment
            </p>
          </div>
        </div>
      </div>

      {/* Weaknesses Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-300 dark:border-red-700 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Critical Areas</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Require immediate attention</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {weaknesses.filter(w => w.severity === 'critical' || w.severity === 'high').length}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">High-priority issues identified</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Recommended Actions</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Ready to implement</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {recommendations.length}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Interventions available</p>
        </div>
      </div>

      {/* Top Weaknesses */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Issues to Address</h3>
        <div className="space-y-3">
          {weaknesses.slice(0, 5).map((weakness, idx) => (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-xs font-bold uppercase",
                      weakness.severity === 'critical' && "bg-red-500 text-white",
                      weakness.severity === 'high' && "bg-orange-500 text-white",
                      weakness.severity === 'medium' && "bg-yellow-500 text-white"
                    )}>
                      {weakness.severity}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {weakness.area}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {weakness.details}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">
                    {weakness.score?.toFixed(2) || weakness.gap?.toFixed(1)}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {weakness.type === 'sentiment' ? 'Resistance' : 'Gap'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Interventions */}
      {currentPhase === 'baseline' && recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Recommended Interventions - Commit to Implement
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <InterventionCommitCard
                key={rec.code}
                code={rec.code}
                name={rec.name}
                level={rec.code[0]}
                coreFunction={`Addresses: ${rec.targetWeaknesses.join(', ')}`}
                targetAreas={rec.targetWeaknesses}
                expectedImpact={rec.expectedImpact}
                currentPhase={currentPhase}
                onCommitChange={onRefresh}
              />
            ))}
          </div>
        </div>
      )}

      {/* Phase Progress Summary */}
      {currentPhase !== 'baseline' && (
        <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-teal-950/20 border-2 border-blue-300 dark:border-blue-600 rounded-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            {currentPhase === 'phase2' ? 'Phase 2 Progress' : 'Phase 3 Transformation'}
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {currentPhase === 'phase2' 
              ? 'Showing improvements after implementing committed interventions from baseline phase.'
              : 'Showing complete transformation after implementing all committed interventions.'}
          </p>
        </div>
      )}
    </div>
  )
}

