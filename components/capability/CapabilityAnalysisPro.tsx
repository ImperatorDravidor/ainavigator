'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import {
  ChevronRight, TrendingUp, TrendingDown,
  Target, Info, BarChart3, Layers, Eye, Sparkles, ArrowRight, Lightbulb, AlertTriangle
} from 'lucide-react'
import { calculateCapabilityAssessment } from '@/lib/calculations/capability-analysis'
import { FilterState } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/contexts/theme-context'
import { brandColors } from '@/lib/constants/brand-colors'

interface CapabilityAnalysisProProps {
  data: any[]
  benchmarks: Record<number, number>
  filters: FilterState
  onDimensionClick: (dimensionId: number) => void
  onViewSummary: () => void
  onAnalyzeWeakDimensions?: (weakDimensions: any[]) => void
  baselineData?: any[]  // Optional baseline data for delta calculation
  showDelta?: boolean    // Whether to show growth indicators
  phase2Data?: any[]     // Phase 2 data for cumulative comparison
  currentPhase?: 'baseline' | 'phase2' | 'phase3'  // Current phase being viewed
}

type ChartView = 'comparison' | 'variance' | 'performance'
type BenchmarkType = 'industry' | 'region' | 'all'

export default function CapabilityAnalysisPro({
  data,
  benchmarks,
  filters,
  onDimensionClick,
  onViewSummary,
  onAnalyzeWeakDimensions,
  baselineData,
  showDelta = false,
  phase2Data,
  currentPhase = 'baseline'
}: CapabilityAnalysisProProps) {

  const { theme } = useTheme()
  const [chartView, setChartView] = useState<ChartView>('comparison')
  const [benchmarkType, setBenchmarkType] = useState<BenchmarkType>('industry')
  const [showGuide, setShowGuide] = useState(false)

  // Calculate baseline assessment for delta comparison
  const baselineAssessment = useMemo(() => {
    if (!baselineData || !showDelta) return null
    return calculateCapabilityAssessment(baselineData, benchmarks, filters)
  }, [baselineData, benchmarks, filters, showDelta])

  // Calculate Phase 2 assessment for cumulative comparison (when viewing Phase 3)
  const phase2Assessment = useMemo(() => {
    if (!phase2Data || currentPhase !== 'phase3') return null
    return calculateCapabilityAssessment(phase2Data, benchmarks, filters)
  }, [phase2Data, benchmarks, filters, currentPhase])

  // Mock benchmark data (replace with actual database queries)
  const benchmarkComparisons = useMemo(() => ({
    all: { label: 'All Companies', avg: 4.3, count: 150 },
    industry: { label: 'Financial Services', avg: 4.5, count: 42 },
    region: { label: 'North America', avg: 4.2, count: 68 },
  }), [])

  // Adjust benchmarks based on selected benchmark type
  const adjustedBenchmarks = useMemo(() => {
    // Industry is the baseline (what was passed in as the default benchmarks prop)
    const baselineAvg = benchmarkComparisons['industry'].avg
    const targetAvg = benchmarkComparisons[benchmarkType].avg
    const scaleFactor = targetAvg / baselineAvg

    // Scale all benchmark values proportionally
    const adjusted: Record<number, number> = {}
    Object.keys(benchmarks).forEach(dimId => {
      adjusted[Number(dimId)] = benchmarks[Number(dimId)] * scaleFactor
    })
    return adjusted
  }, [benchmarks, benchmarkType, benchmarkComparisons])

  const assessment = useMemo(() =>
    calculateCapabilityAssessment(data, adjustedBenchmarks, filters),
    [data, adjustedBenchmarks, filters]
  )
  
  // Chart 1: Your Score vs Benchmark - Enhanced with cumulative phase data
  const comparisonData = useMemo(() =>
    assessment.dimensions.map(dim => {
      const baselineDim = baselineAssessment?.dimensions.find(d => d.dimensionId === dim.dimensionId)
      const phase2Dim = phase2Assessment?.dimensions.find(d => d.dimensionId === dim.dimensionId)

      return {
        dimension: dim.name.split(' ')[0],
        yourScore: dim.average,
        benchmark: dim.benchmark,
        baseline: baselineDim?.average,
        phase2: phase2Dim?.average,
        fullName: dim.name
      }
    }),
    [assessment.dimensions, baselineAssessment, phase2Assessment]
  )

  // Chart 2: Max/Min/Avg Variance
  const varianceData = useMemo(() => 
    assessment.dimensions.map(dim => ({
      dimension: dim.name.split(' ')[0],
      max: dim.max,
      average: dim.average,
      min: dim.min,
      fullName: dim.name
    })),
    [assessment.dimensions]
  )

  // Chart 3: Performance vs Target
  const performanceData = useMemo(() => 
    assessment.dimensions.map(dim => ({
      dimension: dim.name.split(' ')[0],
      actual: dim.average,
      target: 7.0, // Full maturity
      gap: Math.max(0, 7.0 - dim.average),
      fullName: dim.name
    })),
    [assessment.dimensions]
  )


  const chartViews = [
    { id: 'comparison' as ChartView, icon: Target, label: 'vs Benchmark', description: 'Compare to industry' },
    { id: 'variance' as ChartView, icon: BarChart3, label: 'Variance', description: 'Max/Min/Avg spread' },
    { id: 'performance' as ChartView, icon: Layers, label: 'Maturity', description: 'Progress to full maturity' },
  ]

  const aboveBenchmark = assessment.dimensions.filter(d => d.status === 'above').length
  const belowBenchmark = assessment.dimensions.filter(d => d.status === 'below' || d.status === 'significantly_below').length
  const weakDimensions = assessment.dimensions.filter(d => d.status === 'below' || d.status === 'significantly_below')

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      
      {/* REFINED HEADER - Clear hierarchy with brand colors */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        {/* Top row: Title and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Organizational Capability Analysis
            </h2>
            {currentPhase !== 'baseline' && baselineAssessment && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20"
              >
                <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                  {currentPhase === 'phase3' ? 'Showing 3-Phase Journey' : 'Showing Growth vs Baseline'}
                </span>
              </motion.div>
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Click dimensions for details</span>
            </motion.div>
          </div>

          <motion.button
            onClick={() => setShowGuide(!showGuide)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
              showGuide
                ? "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 ring-2 ring-teal-200 dark:ring-teal-500/30"
                : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">{showGuide ? 'Hide' : 'How to Read'}</span>
          </motion.button>
        </div>

        {/* Key metrics cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div 
            className="px-4 py-3 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-500/10 dark:to-cyan-500/10 border-2 border-teal-200 dark:border-teal-500/30"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Avg Score</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{assessment.overall.average.toFixed(1)}</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="px-4 py-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border-2 border-green-200 dark:border-green-500/30"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Above Benchmark</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{aboveBenchmark}</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="px-4 py-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 border-2 border-orange-200 dark:border-orange-500/30"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Need Improvement</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{belowBenchmark}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action - Weak Dimensions */}
        {weakDimensions.length > 0 && onAnalyzeWeakDimensions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-500/10 dark:via-red-500/10 dark:to-pink-500/10 border-2 border-orange-300 dark:border-orange-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {weakDimensions.length} {weakDimensions.length === 1 ? 'dimension needs' : 'dimensions need'} strengthening
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Below industry benchmark - view AI-powered recommendations
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => onAnalyzeWeakDimensions(weakDimensions)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Insights</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Guide Panel */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Understanding Your Capability Assessment</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
                    <div>
                      <span className="font-semibold">8 Dimensions:</span> Key areas for AI readiness
                    </div>
                    <div>
                      <span className="font-semibold">Benchmarks:</span> Compare against industry standards
                    </div>
                    <div>
                      <span className="font-semibold">Scores 1-10:</span> Higher is better, 7+ is mature
                    </div>
                    <div>
                      <span className="font-semibold">Click dimensions:</span> Deep dive into specific areas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT - Charts and Dimensions */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4 overflow-hidden">
      
      {/* LEFT: MULTI-VIEW RADAR CHARTS */}
      <div className="md:w-5/12 flex flex-col gap-3">

        {/* Chart View Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-lg border border-white/10">
          {chartViews.map((view) => {
            const Icon = view.icon
            return (
              <button
                key={view.id}
                onClick={() => setChartView(view.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all text-sm font-medium",
                  chartView === view.id
                    ? "bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-500/30 shadow-lg"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            )
          })}
        </div>

        {/* Benchmark Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-lg border border-white/10">
          {(['all', 'industry', 'region'] as BenchmarkType[]).map((type) => (
            <button
              key={type}
              onClick={() => setBenchmarkType(type)}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-md transition-all text-sm font-medium",
                benchmarkType === type
                  ? "bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/5"
              )}
            >
              {benchmarkComparisons[type].label}
            </button>
          ))}
        </div>
        
        {/* Benchmark Info */}
        <div className="px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-gray-400">Comparing to {benchmarkComparisons[benchmarkType].count} companies</span>
            <span className="text-purple-400 font-semibold">
              Avg: {benchmarkComparisons[benchmarkType].avg.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="flex-1 glass-dark rounded-lg p-4 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-700 dark:text-gray-400">{chartViews.find(v => v.id === chartView)?.description}</span>
              {currentPhase === 'phase3' && phase2Assessment && baselineAssessment && chartView === 'comparison' && (
                <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                  Cumulative growth: Baseline → Phase 2 → Phase 3
                </span>
              )}
              {currentPhase === 'phase2' && baselineAssessment && chartView === 'comparison' && (
                <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                  Growth from Baseline (Oct 2024)
                </span>
              )}
            </div>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{benchmarkComparisons[benchmarkType].label}</span>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                data={
                  chartView === 'comparison' ? comparisonData :
                  chartView === 'variance' ? varianceData :
                  performanceData
                }
                margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
              >
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
                    border: theme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px',
                    color: theme === 'light' ? '#1f2937' : '#ffffff'
                  }}
                />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: theme === 'light' ? '#1f2937' : '#ffffff', fontSize: 12, fontWeight: 700 }}
                />
                <PolarRadiusAxis
                  domain={[0, 10]}
                  tick={{ fill: theme === 'light' ? '#6b7280' : '#9ca3af', fontSize: 10 }}
                  tickCount={6}
                />
                <PolarGrid
                  stroke={theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={1}
                  radialLines={chartView !== 'variance'}
                />
                
                {chartView === 'comparison' && (
                  <>
                    <Radar
                      name="Industry Benchmark"
                      dataKey="benchmark"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.15}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    {/* Show baseline for Phase 2 and Phase 3 */}
                    {currentPhase !== 'baseline' && baselineAssessment && (
                      <Radar
                        name="Baseline (Oct 2024)"
                        dataKey="baseline"
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        fillOpacity={0.08}
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                      />
                    )}
                    {/* Show Phase 2 when viewing Phase 3 */}
                    {currentPhase === 'phase3' && phase2Assessment && (
                      <Radar
                        name="Phase 2 (Mar 2025)"
                        dataKey="phase2"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        strokeDasharray="2 4"
                      />
                    )}
                    {/* Current phase - always shown as the main line */}
                    <Radar
                      name={currentPhase === 'phase3' ? 'Phase 3 (Nov 2025)' : currentPhase === 'phase2' ? 'Phase 2 (Mar 2025)' : 'Current'}
                      dataKey="yourScore"
                      stroke="#14b8a6"
                      fill="#14b8a6"
                      fillOpacity={0.25}
                      strokeWidth={3}
                    />
                  </>
                )}

                {chartView === 'variance' && (
                  <>
                    <Radar
                      name="Max Score"
                      dataKey="max"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                    <Radar
                      name="Average"
                      dataKey="average"
                      stroke="#14b8a6"
                      fill="#14b8a6"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                    <Radar
                      name="Min Score"
                      dataKey="min"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  </>
                )}

                {chartView === 'performance' && (
                  <>
                    <Radar
                      name="Target (Full Maturity)"
                      dataKey="target"
                      stroke="#6b7280"
                      fill="none"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fillOpacity={0}
                    />
                    <Radar
                      name="Current Level"
                      dataKey="actual"
                      stroke="#14b8a6"
                      fill="#14b8a6"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </>
                )}
                
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend - Dynamic based on phases */}
          <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-200 dark:border-white/5 flex-wrap">
            {chartView === 'comparison' && (
              <>
                {currentPhase !== 'baseline' && baselineAssessment && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 bg-slate-400" style={{ borderTop: '1.5px dashed #94a3b8' }} />
                    <span className="text-xs text-gray-700 dark:text-gray-400">Baseline</span>
                  </div>
                )}
                {currentPhase === 'phase3' && phase2Assessment && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 bg-blue-500" style={{ borderTop: '2px dashed #3b82f6' }} />
                    <span className="text-xs text-gray-700 dark:text-gray-400">Phase 2</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-400">
                    {currentPhase === 'phase3' ? 'Phase 3' : currentPhase === 'phase2' ? 'Phase 2' : 'Current'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-purple-400" style={{ borderTop: '2px dashed #a855f7' }} />
                  <span className="text-xs text-gray-700 dark:text-gray-400">Benchmark</span>
                </div>
              </>
            )}
            {chartView === 'variance' && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-green-400" style={{ borderTop: '2px dashed #10b981' }} />
                  <span className="text-xs text-gray-700 dark:text-gray-400">Max</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <span className="text-xs text-gray-700 dark:text-gray-400">Average</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-red-400" style={{ borderTop: '2px dashed #ef4444' }} />
                  <span className="text-xs text-gray-700 dark:text-gray-400">Min</span>
                </div>
              </>
            )}
            {chartView === 'performance' && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <span className="text-xs text-gray-700 dark:text-gray-400">Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-gray-500" style={{ borderTop: '2px dashed #6b7280' }} />
                  <span className="text-xs text-gray-700 dark:text-gray-400">Target (7.0)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-teal-500/10 to-transparent rounded-lg border border-teal-500/20 p-2.5 text-center">
            <div className="text-2xl font-bold text-teal-700 dark:text-teal-400 tabular-nums mb-0.5">
              {assessment.overall.average.toFixed(1)}
            </div>
            <div className="text-xs text-slate-700 dark:text-gray-400">Overall</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-lg border border-green-500/20 p-2.5 text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400 tabular-nums mb-0.5">
              {aboveBenchmark}
            </div>
            <div className="text-xs text-slate-700 dark:text-gray-400">Above</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-transparent rounded-lg border border-orange-500/20 p-2.5 text-center">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400 tabular-nums mb-0.5">
              {belowBenchmark}
            </div>
            <div className="text-xs text-slate-700 dark:text-gray-400">Below</div>
          </div>
        </div>
      </div>

      {/* RIGHT: DIMENSION TABLE */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dimension Breakdown</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">Click any row for 4-construct drill-down</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {weakDimensions.length > 0 && onAnalyzeWeakDimensions && (
              <button
                onClick={() => onAnalyzeWeakDimensions(weakDimensions)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/10 to-purple-500/10 hover:from-teal-500/20 hover:to-purple-500/20 border border-teal-500/30 hover:border-teal-500/40 text-sm text-teal-400 hover:text-teal-300 flex items-center gap-2 transition-all font-medium"
              >
                <Sparkles className="w-4 h-4" />
                AI Insights ({weakDimensions.length}) <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onViewSummary}
              className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 hover:border-purple-500/30 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-all font-medium"
            >
              <Eye className="w-4 h-4" />
              Open-Ended Summary <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 glass-dark rounded-lg overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl z-10">
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Dimension</th>
                  <th className="text-center py-3 px-3 text-gray-700 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Score</th>
                  <th className="text-center py-3 px-3 text-gray-700 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Max</th>
                  <th className="text-center py-3 px-3 text-gray-700 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Min</th>
                  <th className="text-center py-3 px-3 text-gray-700 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Benchmark</th>
                  <th className="text-center py-3 px-3 text-gray-700 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Gap</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {assessment.dimensions.map((dim, index) => {
                  // Calculate growth delta vs baseline (if available)
                  const baselineDim = baselineAssessment?.dimensions.find(d => d.dimensionId === dim.dimensionId)
                  const growth = baselineDim ? dim.average - baselineDim.average : null
                  const growthPercent = baselineDim ? ((dim.average - baselineDim.average) / baselineDim.average) * 100 : null

                  // Fallback to benchmark delta if no baseline
                  const delta = ((dim.average - dim.benchmark) / dim.benchmark) * 100

                  return (
                    <tr
                      key={dim.dimensionId}
                      className={cn(
                        "border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group",
                        index % 2 === 0 ? "bg-gray-50/50 dark:bg-white/[0.02]" : ""
                      )}
                      onClick={() => onDimensionClick(dim.dimensionId)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">{dim.name}</span>
                          {/* Growth badge - only show if we have baseline data */}
                          {showDelta && growthPercent !== null && Math.abs(growthPercent) > 1 && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={cn(
                                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold border",
                                growthPercent > 0
                                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30"
                                  : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30"
                              )}
                            >
                              {growthPercent > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                              {Math.abs(growthPercent).toFixed(0)}%
                            </motion.span>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                      <td className="text-center px-3 tabular-nums">
                        <div className="flex flex-col items-center">
                          <span className={cn(
                            "font-bold text-base",
                            dim.average >= dim.benchmark ? "text-green-700 dark:text-green-400" : "text-orange-700 dark:text-orange-400"
                          )}>
                            {dim.average.toFixed(1)}
                          </span>
                          <span className="text-gray-600 dark:text-gray-600 text-sm">/10</span>
                        </div>
                      </td>
                      <td className="text-center px-3 text-green-700 dark:text-green-400 tabular-nums font-medium">{dim.max.toFixed(1)}</td>
                      <td className="text-center px-3 text-orange-700 dark:text-orange-400 tabular-nums font-medium">{dim.min.toFixed(1)}</td>
                      <td className="text-center px-3 text-purple-700 dark:text-purple-400 tabular-nums font-medium">{dim.benchmark.toFixed(1)}</td>
                      <td className="text-center px-3 tabular-nums">
                        <span className={cn(
                          "inline-flex items-center gap-1 font-semibold",
                          delta > 0 ? "text-green-700 dark:text-green-400" : "text-orange-700 dark:text-orange-400"
                        )}>
                          {delta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {Math.abs(delta).toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-right px-4">
                        <span className={cn(
                          "inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider",
                          dim.status === 'above' ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/20" :
                          dim.status === 'below' ? "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/20" :
                          "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/20"
                        )}>
                          {dim.status === 'above' ? 'EXCEEDS' : dim.status === 'below' ? 'BELOW' : 'CRITICAL'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 px-4 py-2.5 border-t border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="text-gray-600 dark:text-gray-500">
                Industry benchmark: <span className="text-gray-700 dark:text-gray-400 font-medium">Financial Services (1000-5000 employees)</span>
              </span>
              <span className="hidden sm:inline text-gray-400 dark:text-gray-600">•</span>
              <span className="text-gray-600 dark:text-gray-500">
                Scale: <span className="text-gray-700 dark:text-gray-400 font-medium">1-10 Capability Maturity</span>
              </span>
            </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
