'use client'

import { useMemo } from 'react'
import { useTheme } from '@/lib/contexts/theme-context'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import {
  ChevronRight, AlertTriangle, CheckCircle, TrendingUp, TrendingDown,
  Target, Info, Zap, Award, AlertCircle, Sparkles
} from 'lucide-react'
import { calculateCapabilityAssessment } from '@/lib/calculations/capability-analysis'
import { FilterState } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'

interface CapabilityOverviewProps {
  data: any[]
  benchmarks: Record<number, number>
  filters: FilterState
  onDimensionClick: (dimensionId: number) => void
  onViewSummary: () => void
  onAnalyzeWeakDimensions?: (weakDimensions: any[]) => void
}

export default function CapabilityOverview({
  data,
  benchmarks,
  filters,
  onDimensionClick,
  onViewSummary,
  onAnalyzeWeakDimensions
}: CapabilityOverviewProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const assessment = useMemo(() =>
    calculateCapabilityAssessment(data, benchmarks, filters),
    [data, benchmarks, filters]
  )

  const radarData = useMemo(() =>
    assessment.dimensions.map(dim => ({
      dimension: dim.name,
      average: dim.average,
      max: dim.max,
      min: dim.min,
      benchmark: dim.benchmark
    })),
    [assessment.dimensions]
  )

  const aboveBenchmark = assessment.dimensions.filter(d => d.status === 'above').length
  const belowBenchmark = assessment.dimensions.filter(d => d.status === 'below' || d.status === 'significantly_below').length
  const weakDimensions = assessment.dimensions.filter(d => d.status === 'below' || d.status === 'significantly_below')

  return (
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-2 overflow-hidden">
      
      {/* TOP ROW: KEY METRICS - Row 1-3 */}
      
      {/* Overall Maturity - Large */}
      <div className="col-span-3 row-span-3 glass-dark rounded-lg p-3 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-wider">Overall Maturity</span>
          <Info className="w-2.5 h-2.5 text-gray-700 dark:text-gray-600" />
        </div>
        <div className="flex-1 flex items-center">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-5xl font-bold tabular-nums",
              assessment.overall.average >= 6 ? "text-green-600 dark:text-green-400" :
              assessment.overall.average >= 4 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
            )}>
              {assessment.overall.average.toFixed(1)}
            </span>
            <span className="text-lg text-gray-600 dark:text-gray-500 mb-2">/7</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-gray-600 dark:text-gray-500">
            {assessment.overall.average >= 6 ? 'Advanced' : assessment.overall.average >= 4 ? 'Intermediate' : 'Developing'}
          </span>
          <div className="flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400">+12%</span>
          </div>
        </div>
      </div>

      {/* Highest Dimension */}
      <div className="col-span-2 row-span-3 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/5 dark:to-transparent rounded-lg border border-green-200 dark:border-green-500/20 p-3 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-wider">Highest</span>
          <Award className="w-3 h-3 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-[11px] font-medium text-gray-900 dark:text-white mb-0.5">{assessment.overall.highest?.name}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">{assessment.overall.highest?.average.toFixed(1)}</span>
            <span className="text-xs text-gray-600 dark:text-gray-500">/7</span>
          </div>
        </div>
      </div>

      {/* Lowest Dimension */}
      <div className="col-span-2 row-span-3 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-500/5 dark:to-transparent rounded-lg border border-orange-200 dark:border-orange-500/20 p-3 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-wider">Needs Focus</span>
          <AlertCircle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-[11px] font-medium text-gray-900 dark:text-white mb-0.5">{assessment.overall.lowest?.name}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">{assessment.overall.lowest?.average.toFixed(1)}</span>
            <span className="text-xs text-gray-600 dark:text-gray-500">/7</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="col-span-5 row-span-3 grid grid-cols-3 gap-1.5">
        <div className="glass-dark rounded border p-2 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">8</span>
          <span className="text-[8px] text-gray-600 dark:text-gray-500 uppercase tracking-wide">Dimensions</span>
        </div>
        <div className="glass-dark rounded border p-2 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">32</span>
          <span className="text-[8px] text-gray-600 dark:text-gray-500 uppercase tracking-wide">Constructs</span>
        </div>
        <div className="glass-dark rounded border p-2 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{data.length}</span>
          <span className="text-[8px] text-gray-600 dark:text-gray-500 uppercase tracking-wide">Responses</span>
        </div>
        <div className="glass-dark rounded border p-2 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-green-600 dark:text-green-400 tabular-nums">{aboveBenchmark}</span>
          <span className="text-[8px] text-gray-600 dark:text-gray-500 uppercase tracking-wide">Above Bench</span>
        </div>
        <div className="glass-dark rounded border p-2 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">{belowBenchmark}</span>
          <span className="text-[8px] text-gray-600 dark:text-gray-500 uppercase tracking-wide">Below Bench</span>
        </div>
        <div className="glass-dark rounded border p-2 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-teal-600 dark:text-teal-400 tabular-nums">{assessment.overall.biggestGap?.spread.toFixed(1)}</span>
          <span className="text-[8px] text-gray-600 dark:text-gray-500 uppercase tracking-wide">Max Spread</span>
        </div>
      </div>

      {/* MID SECTION: RADAR & TABLE - Row 4-12 */}
      
      {/* Capability Radar Chart - Left side */}
      <div className="col-span-5 row-span-9 glass-dark rounded-lg p-3 flex flex-col">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <Target className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wider">Capability Diamond</span>
          </div>
          <button 
            onClick={onViewSummary}
            className="text-[8px] text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-0.5"
          >
            View Summary <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid
                stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.15)"}
                strokeWidth={0.5}
              />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: isDark ? '#9CA3AF' : '#374151', fontSize: 9 }}
              />
              <PolarRadiusAxis
                domain={[0, 7]}
                tick={{ fill: isDark ? '#6B7280' : '#4B5563', fontSize: 8 }}
                tickCount={8}
              />
              
              {/* Max (outer bound) */}
              <Radar
                name="Max"
                dataKey="max"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.05}
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              
              {/* Average (main line) */}
              <Radar
                name="Average"
                dataKey="average"
                stroke="#0D7C7F"
                fill="#0D7C7F"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              
              {/* Min (inner bound) */}
              <Radar
                name="Min"
                dataKey="min"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.05}
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              
              {/* Benchmark */}
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="#a855f7"
                fill="none"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '6px',
                  fontSize: '10px',
                  padding: '6px 8px',
                  color: isDark ? '#ffffff' : '#000000'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-[8px] text-gray-700 dark:text-gray-400">Max</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#0D7C7F]" />
            <span className="text-[8px] text-gray-700 dark:text-gray-400">Avg</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="text-[8px] text-gray-700 dark:text-gray-400">Min</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-0.5 bg-[#a855f7]" style={{ width: '10px' }} />
            <span className="text-[8px] text-gray-700 dark:text-gray-400">Bench</span>
          </div>
        </div>

        {/* AI Insights Button */}
        {weakDimensions.length > 0 && onAnalyzeWeakDimensions && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-white/5">
            <button
              onClick={() => onAnalyzeWeakDimensions(weakDimensions)}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-teal-100 to-purple-100 dark:from-teal-500/10 dark:to-purple-500/10 hover:from-teal-200 hover:to-purple-200 dark:hover:from-teal-500/20 dark:hover:to-purple-500/20 border border-teal-300 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-all flex items-center justify-center gap-2 text-[10px] font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate AI Insights ({weakDimensions.length} weak {weakDimensions.length === 1 ? 'dimension' : 'dimensions'})
            </button>
          </div>
        )}
      </div>

      {/* Dimension Table & Insights - Right side */}
      <div className="col-span-7 row-span-9 flex flex-col gap-2">
        
        {/* Dimension Table */}
        <div className="flex-1 glass-dark rounded-lg p-2 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wider">Dimension Analysis</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-[9px]">
              <thead className="sticky top-0 bg-white/90 dark:bg-[#0a0a0a] backdrop-blur-sm z-10">
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <th className="text-left py-1 text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wide">Dimension</th>
                  <th className="text-right py-1 text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wide">Avg</th>
                  <th className="text-right py-1 text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wide">Max</th>
                  <th className="text-right py-1 text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wide">Min</th>
                  <th className="text-right py-1 text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wide">Bench</th>
                  <th className="text-right py-1 text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wide">Δ</th>
                  <th className="text-right py-1 text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {assessment.dimensions.map((dim) => {
                  const delta = ((dim.average - dim.benchmark) / dim.benchmark) * 100
                  return (
                    <tr 
                      key={dim.dimensionId} 
                      className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                      onClick={() => onDimensionClick(dim.dimensionId)}
                    >
                      <td className="py-1.5 text-gray-900 dark:text-white font-medium">{dim.name}</td>
                      <td className="text-right tabular-nums">
                        <span className={cn(
                          "font-semibold",
                          dim.average >= dim.benchmark ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                        )}>
                          {dim.average.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-right text-green-600 dark:text-green-400 tabular-nums">{dim.max.toFixed(1)}</td>
                      <td className="text-right text-orange-600 dark:text-orange-400 tabular-nums">{dim.min.toFixed(1)}</td>
                      <td className="text-right text-purple-600 dark:text-purple-400 tabular-nums">{dim.benchmark.toFixed(1)}</td>
                      <td className="text-right tabular-nums">
                        <span className={cn(
                          "flex items-center justify-end gap-0.5",
                          delta > 0 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                        )}>
                          {delta > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          {Math.abs(delta).toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-right">
                        <span className={cn(
                          "px-1 py-0.5 rounded text-[8px] font-medium",
                          dim.status === 'above' ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/20" :
                          dim.status === 'below' ? "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/20" :
                          "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/20"
                        )}>
                          {dim.status === 'above' ? 'ABOVE' : dim.status === 'below' ? 'BELOW' : 'LOW'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="text-[8px] text-gray-600 dark:text-gray-500 mt-1.5 pt-1.5 border-t border-gray-200 dark:border-white/5">
            Click any dimension to view 4-construct breakdown
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/5 dark:to-transparent rounded-lg border border-green-200 dark:border-green-500/20 p-2">
            <div className="flex items-center gap-1 mb-0.5">
              <CheckCircle className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
              <span className="text-[9px] font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Top Strength</span>
            </div>
            <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="text-gray-900 dark:text-white font-medium">{assessment.overall.highest?.name}</span> shows strong maturity with excellent scores across all constructs.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-500/5 dark:to-transparent rounded-lg border border-orange-200 dark:border-orange-500/20 p-2">
            <div className="flex items-center gap-1 mb-0.5">
              <AlertTriangle className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400" />
              <span className="text-[9px] font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">Focus Area</span>
            </div>
            <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="text-gray-900 dark:text-white font-medium">{assessment.overall.lowest?.name}</span> needs attention. Consider targeted capability building initiatives.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

