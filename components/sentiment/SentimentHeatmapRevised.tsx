'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, TrendingUp, TrendingDown, Sparkles, ArrowRight, Users, AlertTriangle, X, Lightbulb } from 'lucide-react'
import { calculateSentimentHeatmap, getLowestScoringCells } from '@/lib/calculations/sentiment-ranking'
import { SENTIMENT_LEVELS, SENTIMENT_CATEGORIES } from '@/lib/constants/sentiment-metadata'
import { FilterState } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'
import { CategoryDataService } from '@/lib/services/category-data.service'
import CategoryDetailModal from './CategoryDetailModal'
import GamificationHint from './GamificationHint'

interface SentimentHeatmapRevisedProps {
  data: any[]
  filters: FilterState
  onAnalyzeProblemAreas: (lowestCells: any[]) => void
  baselineData?: any[]  // Optional baseline data for delta calculation
  showDelta?: boolean    // Whether to show delta indicators
}

export default function SentimentHeatmapRevised({ data, filters, onAnalyzeProblemAreas, baselineData, showDelta = false }: SentimentHeatmapRevisedProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [categoryDataLoaded, setCategoryDataLoaded] = useState(false)
  const [showHint, setShowHint] = useState(true)

  // Load category data on mount
  useEffect(() => {
    CategoryDataService.loadData().then(() => {
      setCategoryDataLoaded(true)
    })
  }, [])

  const { cells, stats } = useMemo(() =>
    calculateSentimentHeatmap(data, filters),
    [data, filters]
  )

  // Calculate baseline cells for delta comparison
  const baselineCells = useMemo(() => {
    if (!baselineData || !showDelta) return null
    return calculateSentimentHeatmap(baselineData, filters).cells
  }, [baselineData, filters, showDelta])

  // Calculate delta for each cell
  const getCellDelta = (cellId: string, currentScore: number) => {
    if (!baselineCells) return null
    const baselineCell = baselineCells.find(c => c.cellId === cellId)
    if (!baselineCell || baselineCell.count === 0) return null
    // Resistance: lower is better, so negative delta = improvement (green)
    return currentScore - baselineCell.score
  }
  
  const lowestCells = useMemo(() =>
    getLowestScoringCells(cells, 5),
    [cells]
  )
  
  const selectedCellData = cells.find(c => c.cellId === selectedCell)

  return (
    <div className="h-full flex flex-col gap-2 md:gap-3 overflow-hidden relative px-2 md:px-0">
      
      {/* ULTRA COMPACT HEADER - Single row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3 flex-shrink-0">
        {/* Left: Title and meta */}
        <div className="flex items-center gap-2 md:gap-2.5 flex-wrap">
          <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">Sentiment Heatmap</h2>
          {categoryDataLoaded && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
            >
              <Sparkles className="w-2.5 h-2.5 text-purple-700 dark:text-purple-400" />
              <span className="text-[9px] font-bold text-purple-700 dark:text-purple-300">Interactive</span>
            </motion.div>
          )}
          <span className="text-[10px] md:text-xs text-slate-600 dark:text-gray-400">
            {stats.totalRespondents.toLocaleString()} employees • 25 dimensions
          </span>
        </div>

        {/* Right: Stats and action */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20">
            <div>
              <div className="text-[8px] md:text-[9px] text-slate-600 dark:text-gray-400 uppercase tracking-wide">Overall</div>
              <div className="text-base md:text-lg font-bold text-teal-700 dark:text-teal-400 tabular-nums leading-tight">{stats.overallAverage.toFixed(2)}</div>
            </div>
            <div className="text-sm md:text-base">
              {stats.overallAverage >= 3.5 ? '✅' :
               stats.overallAverage >= 3.0 ? '⚠️' :
               stats.overallAverage >= 2.5 ? '🔶' : '🔴'}
            </div>
          </div>
          <div className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="text-[8px] md:text-[9px] text-slate-600 dark:text-gray-400 uppercase tracking-wide">Priority</div>
            <div className="text-base md:text-lg font-bold text-orange-700 dark:text-orange-400 tabular-nums leading-tight">{lowestCells.length}</div>
          </div>

          {/* AI Insights Button - Compact */}
          {lowestCells.length > 0 && (
            <button
              onClick={() => onAnalyzeProblemAreas(lowestCells)}
              className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-purple-500/10 hover:from-teal-500/15 hover:to-purple-500/15 border border-teal-500/30 hover:border-teal-500/40 transition-all group"
            >
              <Sparkles className="w-3.5 md:w-4 h-3.5 md:h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs md:text-sm text-teal-700 dark:text-teal-300 font-semibold">
                AI Insights
              </span>
              <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5 text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/30 transition-all"
          >
            <Info className="w-3.5 md:w-4 h-3.5 md:h-4 text-blue-700 dark:text-blue-400" />
            <span className="text-xs md:text-sm text-blue-700 dark:text-blue-300 font-medium">
              {showExplanation ? 'Hide' : 'Show'} Guide
            </span>
          </button>
        </div>
      </div>

      {/* HEATMAP EXPLANATION - Overlay (doesn't push content) */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 z-30 mx-4"
          >
            <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-xl border-2 border-blue-500/30 dark:border-blue-500/50 p-5 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-6 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-400 text-xs font-bold">Y</span>
                    Rows: 5 Concern Levels
                  </h3>
                  <div className="space-y-2 text-slate-700 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L1</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Personal Workflow Preferences</span> - How AI affects individual work</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L2</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Collaboration & Role Adjustments</span> - Team dynamics and responsibilities</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L3</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Professional Trust & Fairness</span> - Ethical concerns and bias</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L4</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Career Security & Job Redefinition</span> - Long-term employment anxiety</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L5</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Organizational Stability at Risk</span> - Company-wide transformation concerns</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-700 dark:text-purple-400 text-xs font-bold">X</span>
                    Columns: 5 Sentiment Categories (Why They're Concerned)
                  </h3>
                  <div className="space-y-2 text-slate-700 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C1</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">AI is too Autonomous</span> - Loss of human control</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C2</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">AI is too Inflexible</span> - Can't handle exceptions</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C3</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">AI is Emotionless</span> - Lacks empathy and understanding</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C4</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">AI is too Opaque</span> - Black box, no transparency</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C5</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">People Prefer Human Interaction</span> - Value personal touch</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="mb-3">
                  <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed mb-3">
                    <span className="text-teal-700 dark:text-teal-400 font-semibold">Understanding Your Heatmap:</span> Each cell represents how employees feel about a specific AI concern. Lower scores (green) indicate comfort and readiness. Higher scores (red) indicate resistance that needs attention.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/10">
                      <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white text-xs">✓</span>
                        What the Scores Mean
                      </div>
                      <div className="text-slate-700 dark:text-gray-300 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold">3.5-4.0:</span> 
                          <span>Ready to adopt AI</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400 font-bold">2.5-3.5:</span> 
                          <span>Some concerns, manageable</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600 dark:text-orange-400 font-bold">1.5-2.5:</span> 
                          <span>Significant resistance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 dark:text-red-400 font-bold">1.0-1.5:</span> 
                          <span>Critical - needs intervention</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/10">
                      <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs">★</span>
                        What the Colors Show
                      </div>
                      <div className="text-slate-700 dark:text-gray-300 space-y-1.5">
                        <div><span className="inline-block w-4 h-4 bg-green-700 rounded mr-2"></span> <strong>Green:</strong> Your strongest areas</div>
                        <div><span className="inline-block w-4 h-4 bg-lime-500 rounded mr-2"></span> Doing well here</div>
                        <div><span className="inline-block w-4 h-4 bg-yellow-400 rounded mr-2"></span> Average performance</div>
                        <div><span className="inline-block w-4 h-4 bg-orange-500 rounded mr-2"></span> Needs improvement</div>
                        <div><span className="inline-block w-4 h-4 bg-red-600 rounded mr-2"></span> <strong>Red:</strong> Focus here first</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-2 mt-3 border border-blue-500/20">
                  <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-blue-700 dark:text-blue-400">💡 Quick Tip:</strong> Don't worry about absolute numbers—focus on the <strong>red cells</strong> (your priority areas) and <strong>green cells</strong> (your strengths). Use filters to see specific departments or regions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEATMAP GRID - REFINED DATA-RICH DESIGN */}
      <div id="sentiment-heatmap" className="bg-white dark:bg-black rounded-xl border-2 border-slate-200 dark:border-white/10 p-3 md:p-4 lg:p-6 flex flex-col shadow-lg flex-1 min-h-0 overflow-auto mb-3 md:mb-4">
        
        {/* Legend - Professional Data Visualization Style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3 lg:gap-4 pb-2 md:pb-3 lg:pb-4 mb-2 md:mb-3 lg:mb-4 border-b-2 border-slate-200 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-purple-500 rounded-full" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Resistance Intensity</div>
              <div className="text-[10px] text-slate-600 dark:text-gray-400 font-medium">5×5 Matrix Analysis</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-300 dark:border-green-500/30">
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-sm" style={{ backgroundColor: '#15803d' }}></div>
              <span className="text-[9px] md:text-[10px] text-slate-700 dark:text-green-300 font-bold">Low</span>
            </div>
            <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 border border-yellow-300 dark:border-yellow-500/30">
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-sm" style={{ backgroundColor: '#fcd34d' }}></div>
              <span className="text-[9px] md:text-[10px] text-slate-700 dark:text-yellow-300 font-bold">Mod</span>
            </div>
            <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 border border-red-300 dark:border-red-500/30">
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-sm" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-[9px] md:text-[10px] text-slate-700 dark:text-red-300 font-bold">High</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 ml-2">
              <TrendingUp className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span className="text-[10px] text-slate-600 dark:text-gray-400 font-medium">Scale: 1.0-5.0</span>
            </div>
          </div>
        </div>

        {/* Grid Container with Averages - Optimized */}
        <div className="flex gap-1.5 md:gap-2 min-h-0 flex-1">
          
          {/* Y-Axis Labels - Clean aligned */}
          <div className="hidden lg:flex flex-col flex-shrink-0 gap-1.5 md:gap-2 justify-between">
            {/* Row labels aligned with grid rows */}
            <div className="flex flex-col gap-1.5 md:gap-2 flex-1">
              {SENTIMENT_LEVELS.map((level, idx) => (
                <div key={level.id} className="flex items-center justify-end pr-2 md:pr-3 flex-1">
                  <div className="text-right flex items-center gap-1.5 md:gap-2">
                    <div className="text-[9px] md:text-[10px] font-bold text-gray-900 dark:text-white leading-tight text-right max-w-[140px] md:max-w-[160px]">
                      {level.name}
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] flex-shrink-0",
                      idx === 0 ? "bg-blue-500 text-white" :
                      idx === 1 ? "bg-purple-500 text-white" :
                      idx === 2 ? "bg-orange-500 text-white" :
                      idx === 3 ? "bg-red-500 text-white" :
                      "bg-rose-600 text-white"
                    )}>
                      L{level.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Empty spacer for column averages alignment */}
            <div className="h-[50px] flex-shrink-0" />
          </div>

          {/* Grid + Averages */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Main Grid with Row Averages */}
            <div className="flex gap-1.5 md:gap-2 flex-1">
              {/* Heatmap Grid - Responsive with breathing room */}
              <div className="grid grid-cols-5 gap-1 sm:gap-1.5 md:gap-2 flex-1" style={{ gridTemplateRows: 'repeat(5, 1fr)', maxHeight: 'min(calc(100vh - 320px), 700px)' }}>
                {SENTIMENT_LEVELS.map((level) => (
                  SENTIMENT_CATEGORIES.map((cat) => {
                    const cellId = `L${level.id}_C${cat.id}`
                    const cell = cells.find(c => c.cellId === cellId)

                    return (
                      <motion.button
                        key={cellId}
                        onClick={() => cell && cell.count > 0 ? setSelectedCell(cellId) : null}
                        className={cn(
                          "relative rounded-xl transition-all border group overflow-hidden w-full h-full",
                          selectedCell === cellId 
                            ? 'ring-4 ring-teal-400/50 dark:ring-teal-500/60 ring-offset-2 ring-offset-white dark:ring-offset-black scale-[1.08] z-20 border-white dark:border-white/70 shadow-2xl' 
                            : 'ring-0 border-white/20 dark:border-white/10',
                          cell && cell.count > 0 
                            ? 'cursor-pointer hover:scale-[1.03] hover:z-10 hover:shadow-2xl hover:border-white/40 dark:hover:border-white/30' 
                            : 'cursor-default opacity-20'
                        )}
                        style={{
                          backgroundColor: cell?.color || '#1f2937',
                          minHeight: '80px'
                        }}
                        whileHover={cell && cell.count > 0 ? { 
                          scale: 1.03,
                        } : {}}
                        whileTap={cell && cell.count > 0 ? { scale: 0.98 } : {}}
                      >
                        {cell && cell.count > 0 ? (
                          <>
                            {/* Subtle grid pattern overlay */}
                            <div className="absolute inset-0 opacity-5"
                              style={{
                                backgroundImage: `
                                  linear-gradient(to right, white 1px, transparent 1px),
                                  linear-gradient(to bottom, white 1px, transparent 1px)
                                `,
                                backgroundSize: '8px 8px'
                              }}
                            />

                            {/* Gradient overlay for depth */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />
                            
                            {/* Main Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-1 sm:p-1.5 md:p-2 z-10">
                              {/* Score */}
                              <div className="text-lg sm:text-xl md:text-2xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] tabular-nums leading-none mb-0.5 md:mb-1">
                                {cell.score.toFixed(2)}
                              </div>

                              {/* Sample size with bar indicator */}
                              <div className="flex items-center gap-0.5 sm:gap-1 bg-black/30 backdrop-blur-sm px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full border border-white/20">
                                <Users className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-white/80" />
                                <span className="text-[8px] sm:text-[9px] text-white/90 font-bold">{cell.count}</span>
                              </div>

                              {/* Cell ID for data context */}
                              <div className="absolute top-0.5 sm:top-1 left-1 sm:left-1.5">
                                <span className="text-[7px] sm:text-[8px] font-mono font-bold text-white/60 bg-black/20 px-0.5 sm:px-1 py-0.5 rounded border border-white/10">
                                  {cellId}
                                </span>
                              </div>

                              {/* Delta indicator - only show if showDelta is true and delta exists */}
                              {(() => {
                                const delta = getCellDelta(cellId, cell.score)
                                if (delta === null || delta === 0) return null
                                const isImprovement = delta < 0 // Negative delta = resistance went down = good
                                const Icon = isImprovement ? TrendingDown : TrendingUp
                                return (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="absolute bottom-1 left-1.5"
                                  >
                                    <div className={cn(
                                      "flex items-center gap-0.5 backdrop-blur-sm px-1 py-0.5 rounded-md border shadow-lg",
                                      isImprovement
                                        ? "bg-emerald-500/95 border-emerald-300/50"
                                        : "bg-red-500/95 border-red-300/50"
                                    )}>
                                      <Icon className="w-2.5 h-2.5 text-white" />
                                      <span className="text-[8px] font-bold text-white tabular-nums">
                                        {Math.abs(delta).toFixed(2)}
                                      </span>
                                    </div>
                                  </motion.div>
                                )
                              })()}
                            </div>

                            {/* Sparkle indicator for interactive cells */}
                            {/* Ranking Badge */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 + (level.id * 0.02) + (cat.id * 0.01), type: "spring" }}
                              className="absolute top-1.5 right-1.5 z-20"
                            >
                              <div className={cn(
                                "px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-sm border",
                                // Color based on ranking (1-25, NOW: 1 = best/lowest resistance, 25 = worst/highest resistance)
                                cell.ranking <= 5 ? "bg-emerald-500/90 text-white border-emerald-600" :  // #1-5 = Best (dark green)
                                cell.ranking <= 10 ? "bg-green-500/90 text-white border-green-600" :     // #6-10 = Good (green)
                                cell.ranking <= 15 ? "bg-yellow-500/90 text-gray-900 border-yellow-600" : // #11-15 = Moderate (yellow)
                                cell.ranking <= 20 ? "bg-orange-500/90 text-white border-orange-600" :   // #16-20 = Concern (orange)
                                "bg-red-500/90 text-white border-red-600"                                 // #21-25 = Critical (red)
                              )}>
                                #{cell.ranking}
                              </div>
                            </motion.div>

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none rounded-xl" />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-xl text-white/20 font-light">—</span>
                              <div className="text-[7px] text-white/30 font-medium mt-0.5">No data</div>
                            </div>
                          </div>
                        )}
                      </motion.button>
                    )
                  })
                ))}
              </div>

              {/* Row Averages - Enhanced */}
              <div className="hidden md:flex flex-col gap-1.5 md:gap-2 w-14 md:w-16 flex-shrink-0" style={{ gridTemplateRows: 'repeat(5, 1fr)' }}>
                {stats.rowAverages.map((avg, idx) => {
                  const isHigh = avg >= 3.5
                  const isMed = avg >= 2.5 && avg < 3.5
                  const isLow = avg < 2.5
                  
                  return (
                    <div key={idx} className={cn(
                      "flex items-center justify-center rounded-lg border-2 shadow-md backdrop-blur-sm flex-1",
                      isHigh ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/15 dark:to-rose-500/15 border-red-300 dark:border-red-500/40" :
                      isMed ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/15 dark:to-amber-500/15 border-yellow-300 dark:border-yellow-500/40" :
                      "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/15 dark:to-emerald-500/15 border-green-300 dark:border-green-500/40"
                    )}>
                      <div className="text-center">
                        <div className={cn(
                          "text-base font-black tabular-nums leading-none",
                          isHigh ? "text-red-700 dark:text-red-400" :
                          isMed ? "text-yellow-700 dark:text-yellow-400" :
                          "text-green-700 dark:text-green-400"
                        )}>{avg.toFixed(2)}</div>
                        <div className="text-[8px] text-slate-600 dark:text-gray-400 uppercase font-bold mt-0.5">Avg</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Column Averages + Labels + Overall */}
            <div className="flex gap-1.5 md:gap-2 mt-1.5 md:mt-2">
              <div className="flex-1 grid grid-cols-5 gap-1 sm:gap-1.5 md:gap-2">
                {SENTIMENT_CATEGORIES.map((cat, idx) => {
                  const avg = stats.columnAverages[idx]
                  const isHigh = avg >= 3.5
                  const isMed = avg >= 2.5 && avg < 3.5
                  const isLow = avg < 2.5
                  
                  return (
                    <div key={cat.id} className="flex flex-col gap-0.5 sm:gap-1">
                      {/* Column Average */}
                      <div className={cn(
                        "flex items-center justify-center rounded-lg border-2 h-[32px] sm:h-[36px] md:h-[40px] shadow-sm",
                        isHigh ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/15 dark:to-rose-500/15 border-red-300 dark:border-red-500/40" :
                        isMed ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/15 dark:to-amber-500/15 border-yellow-300 dark:border-yellow-500/40" :
                        "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/15 dark:to-emerald-500/15 border-green-300 dark:border-green-500/40"
                      )}>
                        <div className="text-center">
                          <div className={cn(
                            "text-xs sm:text-sm md:text-base font-black tabular-nums leading-none",
                            isHigh ? "text-red-700 dark:text-red-400" :
                            isMed ? "text-yellow-700 dark:text-yellow-400" :
                            "text-green-700 dark:text-green-400"
                          )}>{avg?.toFixed(2) || '—'}</div>
                          <div className="text-[6px] sm:text-[7px] text-slate-600 dark:text-gray-400 uppercase font-bold mt-0.5">AVG</div>
                        </div>
                      </div>
                      {/* Category Label */}
                      <div className="text-center">
                        <div className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{cat.shortName}</div>
                        <div className={cn(
                          "inline-block text-[6px] sm:text-[7px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md",
                          idx === 0 ? "bg-blue-500/20 text-blue-700 dark:text-blue-400" :
                          idx === 1 ? "bg-purple-500/20 text-purple-700 dark:text-purple-400" :
                          idx === 2 ? "bg-pink-500/20 text-pink-700 dark:text-pink-400" :
                          idx === 3 ? "bg-orange-500/20 text-orange-700 dark:text-orange-400" :
                          "bg-teal-500/20 text-teal-700 dark:text-teal-400"
                        )}>C{cat.id}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Overall Average - Compact & Aligned */}
              <div className="hidden md:flex w-14 md:w-16 flex-shrink-0 flex-col gap-0.5 sm:gap-1">
                <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-500/20 dark:to-cyan-500/20 border-2 border-teal-400 dark:border-teal-500/50 shadow-sm h-[32px] sm:h-[36px] md:h-[40px]">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm md:text-base font-black text-teal-700 dark:text-teal-300 tabular-nums leading-none">{stats.overallAverage.toFixed(2)}</div>
                    <div className="text-[6px] sm:text-[7px] text-teal-600 dark:text-teal-400 uppercase font-bold mt-0.5">AVG</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[8px] sm:text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase leading-tight">OVERALL</div>
                  <div className="text-[6px] sm:text-[7px] text-gray-500 dark:text-gray-400">n={stats.totalRespondents.toLocaleString()}</div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* ENHANCED CELL DETAIL MODAL WITH GAMIFICATION */}
      <AnimatePresence>
        {selectedCellData && selectedCellData.count > 0 && (
          <CategoryDetailModal
            cellData={selectedCellData}
            categoryData={CategoryDataService.getCategoryForCell(selectedCellData.cellId)}
            onClose={() => setSelectedCell(null)}
          />
        )}
      </AnimatePresence>


      {/* GAMIFICATION HINT - First-time users */}
      {categoryDataLoaded && showHint && (
        <GamificationHint onDismiss={() => setShowHint(false)} />
      )}
      </div>
    </div>
  )
}
