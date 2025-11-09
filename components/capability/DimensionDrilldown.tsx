'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, Info, Lightbulb, Sparkles } from 'lucide-react'
import { getDimensionById, getConstructsForDimension } from '@/lib/constants/capability-metadata'
import { DimensionScore } from '@/lib/calculations/capability-analysis'
import { useTheme } from '@/lib/contexts/theme-context'
import { InterventionDetail } from '@/components/interventions/InterventionDetail'

interface DimensionDrilldownProps {
  dimensionId: number
  data: any[]
  benchmark: number
  filters: any
  onBack: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export default function DimensionDrilldown({
  dimensionId,
  data,
  benchmark,
  filters,
  onBack,
  onNext,
  onPrevious
}: DimensionDrilldownProps) {

  const { theme } = useTheme()
  const dimensionMeta = getDimensionById(dimensionId)
  const constructsMeta = getConstructsForDimension(dimensionId)

  // Intervention state
  const [interventions, setInterventions] = useState<any[]>([])
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)
  const [interventionsLoading, setInterventionsLoading] = useState(false)

  // Fetch interventions for this dimension
  useEffect(() => {
    const fetchInterventions = async () => {
      setInterventionsLoading(true)
      try {
        const response = await fetch(`/api/interventions/capability?dimension=${dimensionId}`)
        const data = await response.json()
        setInterventions(data.interventions || [])
      } catch (error) {
        console.error('Failed to fetch interventions:', error)
        setInterventions([])
      } finally {
        setInterventionsLoading(false)
      }
    }
    fetchInterventions()
  }, [dimensionId])

  // Calculate dimension scores from data
  const dimension = useMemo(() => {
    // Calculate scores for each construct in this dimension
    const constructScores = constructsMeta.map(construct => {
      const scores = data.map(d => d[`construct_${construct.id}`]).filter((s): s is number => typeof s === 'number' && !isNaN(s))
      const avg = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
      const max = scores.length > 0 ? Math.max(...scores) : 0
      const min = scores.length > 0 ? Math.min(...scores) : 0
      return { name: construct.name, score: avg, max, min }
    })
    
    const avgScore = constructScores.reduce((sum, c) => sum + c.score, 0) / constructScores.length
    const status = avgScore >= benchmark ? 'above' : avgScore < benchmark - 1 ? 'significantly_below' : 'below'
    
    return {
      dimensionId,
      name: dimensionMeta?.name || '',
      average: avgScore,
      benchmark,
      status,
      constructs: constructScores
    }
  }, [data, dimensionId, benchmark, constructsMeta, dimensionMeta])

  const radarData = useMemo(() =>
    dimension.constructs.map((construct) => ({
      construct: construct.name,
      score: construct.score,
      benchmark: benchmark / 2 // Rough estimate for constructs
    })),
    [dimension, benchmark]
  )

  const getStatusDisplay = () => {
    const diff = dimension.average - dimension.benchmark
    if (dimension.status === 'significantly_below') {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        text: 'Significantly below benchmark',
        color: 'text-red-400'
      }
    } else if (dimension.status === 'below') {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        text: 'Below benchmark',
        color: 'text-orange-400'
      }
    } else if (dimension.status === 'above') {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        text: 'Above benchmark',
        color: 'text-green-400'
      }
    }
    return {
      icon: <CheckCircle className="w-5 h-5 text-slate-600 dark:text-gray-400" />,
      text: 'At benchmark',
      color: 'text-slate-600 dark:text-gray-400'
    }
  }

  const status = getStatusDisplay()
  const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

  return (
    <>
    <div className="h-full flex flex-col overflow-hidden p-6">
      
      {/* HEADER */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-gray-300 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Back to Overview</span>
          </button>
          
          <div className="flex items-center gap-2">
            {onPrevious && (
              <button onClick={onPrevious} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-gray-200 transition-all">
                ← Previous
              </button>
            )}
            {onNext && (
              <button onClick={onNext} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-sm flex items-center gap-2 text-slate-700 dark:text-gray-200 transition-all">
                Next → 
              </button>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{dimension.name}</h1>
            {dimensionMeta?.description && (
              <p className="text-sm text-slate-600 dark:text-gray-400 max-w-3xl leading-relaxed">{dimensionMeta.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            {status.icon}
            <span className={cn("text-sm font-semibold", status.color)}>
              {status.text}
            </span>
          </div>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="flex-shrink-0 grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5 rounded-xl border border-blue-200 dark:border-blue-500/30 p-4">
          <div className="text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wide mb-2 font-semibold">Your Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">{dimension.average.toFixed(1)}</span>
            <span className="text-lg text-slate-500 dark:text-gray-500 font-medium">/10</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-500/5 rounded-xl border border-purple-200 dark:border-purple-500/30 p-4">
          <div className="text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wide mb-2 font-semibold">Benchmark</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-purple-700 dark:text-purple-400 tabular-nums">{dimension.benchmark.toFixed(1)}</span>
            <span className="text-lg text-slate-500 dark:text-gray-500 font-medium">/10</span>
          </div>
        </div>

        <div className={cn(
          "rounded-xl border p-4",
          dimension.average >= dimension.benchmark 
            ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-500/5 border-green-200 dark:border-green-500/30"
            : "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-500/10 dark:to-orange-500/5 border-orange-200 dark:border-orange-500/30"
        )}>
          <div className="text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wide mb-2 font-semibold">Gap</div>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-4xl font-bold tabular-nums",
              dimension.average >= dimension.benchmark ? "text-green-700 dark:text-green-400" : "text-orange-700 dark:text-orange-400"
            )}>
              {dimension.average >= dimension.benchmark ? '+' : ''}{(dimension.average - dimension.benchmark).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/10 p-4">
          <div className="text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wide mb-2 font-semibold">Constructs</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">{dimension.constructs.length}</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        
        {/* Construct Radar Chart */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/10 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">4-Construct Analysis</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400">Visual breakdown of component scores</p>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid
                  stroke={theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={1}
                />
                <PolarAngleAxis
                  dataKey="construct"
                  tick={{ fill: theme === 'light' ? '#475569' : '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  domain={[0, 10]}
                  tick={{ fill: theme === 'light' ? '#64748b' : '#6B7280', fontSize: 10 }}
                  tickCount={6}
                />
                
                <Radar
                  name="Your Score"
                  dataKey="score"
                  stroke="#0d9488"
                  fill="#0d9488"
                  fillOpacity={0.3}
                  strokeWidth={2.5}
                />
                
                <Radar
                  name="Benchmark"
                  dataKey="benchmark"
                  stroke="#a855f7"
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-600 dark:bg-teal-500" />
              <span className="text-xs text-slate-700 dark:text-gray-300 font-medium">Your Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-purple-600" />
              <span className="text-xs text-slate-700 dark:text-gray-300 font-medium">Benchmark</span>
            </div>
          </div>
        </div>

        {/* Construct Details Table */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/10 p-5 flex flex-col overflow-hidden">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Construct Breakdown</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400">Detailed scores for each component</p>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white dark:bg-slate-800 z-10">
                <tr className="border-b-2 border-slate-200 dark:border-white/10">
                  <th className="text-left py-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs">Construct</th>
                  <th className="text-center py-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs">Score</th>
                  <th className="text-center py-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs">Range</th>
                  <th className="text-right py-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {dimension.constructs.map((construct: any, idx: number) => {
                  const isWeak = construct.score < dimension.average - 0.5
                  const isStrong = construct.score >= dimension.average + 0.3
                  return (
                    <tr key={idx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 text-slate-900 dark:text-white font-medium text-sm">{construct.name}</td>
                      <td className="text-center">
                        <span className={cn(
                          "inline-block px-3 py-1 rounded-lg font-bold text-base tabular-nums",
                          construct.score >= dimension.average ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" : "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
                        )}>
                          {construct.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="text-sm text-slate-600 dark:text-gray-400 tabular-nums">
                          {construct.min.toFixed(1)} - {construct.max.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide inline-block",
                          isWeak && "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30",
                          isStrong && "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30",
                          !isWeak && !isStrong && "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30"
                        )}>
                          {isWeak ? 'Needs Focus' : isStrong ? 'Strength' : 'On Track'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Focus Areas Alert */}
          {dimension.constructs.some((c: any) => c.score < dimension.average - 0.5) && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-500/10 rounded-lg border border-orange-200 dark:border-orange-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">Priority Focus Areas</div>
                  <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                    {dimension.constructs
                      .filter((c: any) => c.score < dimension.average - 0.5)
                      .map((c: any) => c.name)
                      .join(', ')} require immediate attention to improve this dimension.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Intervention Recommendations */}
      <div className="flex-shrink-0 mt-6">
        <div className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-purple-500/10 dark:to-teal-500/10 rounded-xl border border-purple-200 dark:border-purple-500/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Recommended Interventions
              </h3>
            </div>
            {interventionsLoading && (
              <span className="text-sm text-slate-600 dark:text-gray-400">Loading...</span>
            )}
          </div>

          {!interventionsLoading && interventions.length === 0 && (
            <div className="text-sm text-slate-600 dark:text-gray-400 text-center py-4">
              No interventions available for this dimension
            </div>
          )}

          {!interventionsLoading && interventions.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {interventions.slice(0, 3).map((intervention: any, idx: number) => (
                <motion.button
                  key={intervention.code}
                  onClick={() => setSelectedIntervention(intervention.code)}
                  className="bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-400/50 rounded-xl p-4 transition-all text-left group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
                      {intervention.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                        {intervention.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wide">
                        {intervention.level} • Priority {idx + 1}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {intervention.core_function}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>

    {/* Intervention Detail Modal */}
    <InterventionDetail
      isOpen={selectedIntervention !== null}
      interventionCode={selectedIntervention}
      onClose={() => setSelectedIntervention(null)}
      onSelectNextStep={(code) => setSelectedIntervention(code)}
    />
  </>
  )
}


