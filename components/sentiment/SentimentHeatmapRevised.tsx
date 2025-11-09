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
}

export default function SentimentHeatmapRevised({ data, filters, onAnalyzeProblemAreas }: SentimentHeatmapRevisedProps) {
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
  
  const lowestCells = useMemo(() =>
    getLowestScoringCells(cells, 5),
    [cells]
  )
  
  const selectedCellData = cells.find(c => c.cellId === selectedCell)

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      
      {/* ULTRA COMPACT HEADER - Single row */}
      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        {/* Left: Title and meta */}
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Sentiment Heatmap</h2>
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
          <span className="text-xs text-slate-600 dark:text-gray-400">
            {stats.totalRespondents.toLocaleString()} employees • 25 dimensions
          </span>
        </div>

        {/* Right: Stats and action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20">
            <div>
              <div className="text-[9px] text-slate-600 dark:text-gray-400 uppercase tracking-wide">Overall</div>
              <div className="text-lg font-bold text-teal-700 dark:text-teal-400 tabular-nums leading-tight">{stats.overallAverage.toFixed(2)}</div>
            </div>
            <div className="text-base">
              {stats.overallAverage >= 3.5 ? '✅' :
               stats.overallAverage >= 3.0 ? '⚠️' :
               stats.overallAverage >= 2.5 ? '🔶' : '🔴'}
            </div>
          </div>
          <div className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="text-[9px] text-slate-600 dark:text-gray-400 uppercase tracking-wide">Priority</div>
            <div className="text-lg font-bold text-orange-700 dark:text-orange-400 tabular-nums leading-tight">{lowestCells.length}</div>
          </div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/30 transition-all"
          >
            <Info className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {showExplanation ? 'Hide' : 'Show'} Guide
            </span>
          </button>
        </div>
      </div>

      {/* HEATMAP EXPLANATION - Collapsible */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border border-blue-500/20 p-4 mb-3">
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

      {/* HEATMAP GRID */}
      <div className="flex-1 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/10 p-4 flex flex-col overflow-hidden shadow-sm">
        
        {/* Legend - Enhanced with scale explanation */}
        <div className="flex items-center justify-between gap-4 pb-2 mb-3 border-b border-slate-200 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider">Resistance Level:</span>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
              <span className="font-medium">1 = Minimal</span>
              <span className="text-slate-400 dark:text-gray-500">→</span>
              <span className="font-medium">10 = Critical</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#15803d' }}></div>
              <span className="text-[10px] text-slate-700 dark:text-green-300 font-medium">Lowest</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fcd34d' }}></div>
              <span className="text-[10px] text-slate-700 dark:text-yellow-300 font-medium">Mid</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-[10px] text-slate-700 dark:text-red-300 font-medium">Highest</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-gray-400 italic ml-2">Relative to your data</div>
          </div>
        </div>

        {/* Grid Container with Averages - SCALED DOWN */}
        <div className="flex-1 flex gap-1.5 overflow-auto min-h-0">
          
          {/* Y-Axis Labels */}
          <div className="flex flex-col flex-shrink-0 gap-1.5">
            {/* Row labels aligned with grid rows */}
            <div className="flex-1 grid grid-rows-5 gap-1.5">
              {SENTIMENT_LEVELS.map(level => (
                <div key={level.id} className="flex items-center justify-end pr-3">
                  <div className="text-right bg-slate-100 dark:bg-slate-800/50 rounded-md px-2 py-1.5 border border-slate-200 dark:border-white/20">
                    <div className="text-[8px] text-slate-600 dark:text-gray-200 font-bold uppercase tracking-wider">L{level.id}</div>
                    <div className="text-[10px] font-bold text-gray-900 dark:text-white leading-tight mt-0.5">{level.name}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Label for column averages row */}
            <div className="flex items-start justify-end pr-3 h-[38px] pt-1">
              <div className="text-[9px] font-bold text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-white/5 rounded-md px-2 py-1 border border-gray-200 dark:border-white/10">
                Col Avg
              </div>
            </div>
          </div>

          {/* Grid + Averages */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Main Grid with Row Averages */}
            <div className="flex-1 flex gap-1.5">
              {/* Heatmap Grid - FULL HEIGHT */}
              <div className="flex-1 grid grid-cols-5 grid-rows-5 gap-1.5">
                {SENTIMENT_LEVELS.map((level) => (
                  SENTIMENT_CATEGORIES.map((cat) => {
                    const cellId = `L${level.id}_C${cat.id}`
                    const cell = cells.find(c => c.cellId === cellId)

                    return (
                      <motion.button
                        key={cellId}
                        onClick={() => cell && cell.count > 0 ? setSelectedCell(cellId) : null}
                        className={cn(
                          "relative rounded-lg transition-all border-2 group min-h-0 shadow-md",
                          selectedCell === cellId 
                            ? 'ring-4 ring-teal-400/50 dark:ring-teal-400/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 scale-105 z-20 border-white dark:border-white/50' 
                            : 'ring-0 border-transparent',
                          cell && cell.count > 0 
                            ? 'cursor-pointer hover:scale-[1.05] hover:z-10 hover:shadow-xl' 
                            : 'cursor-default opacity-30'
                        )}
                        style={{
                          backgroundColor: cell?.color || '#374151',
                          boxShadow: selectedCell === cellId 
                            ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                            : cell && cell.count > 0 
                              ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
                              : 'none'
                        }}
                        whileHover={cell && cell.count > 0 ? { 
                          scale: 1.05,
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                        } : {}}
                        whileTap={cell && cell.count > 0 ? { scale: 0.97 } : {}}
                      >
                        {cell && cell.count > 0 ? (
                          <>
                            {/* Gradient overlay for depth */}
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-1.5 z-10">
                              <div className="text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tabular-nums leading-tight">
                                {cell.score.toFixed(2)}
                              </div>
                              <div className="text-[9px] text-white/90 font-semibold mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                n={cell.count}
                              </div>
                            </div>
                            {/* Sparkle indicator for interactive cells with category data */}
                            {categoryDataLoaded && CategoryDataService.getCategoryForCell(cellId) && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="absolute top-1.5 right-1.5 z-20"
                              >
                                <div className="relative">
                                  <div className="absolute inset-0 bg-white/30 rounded-full blur-sm animate-pulse" />
                                  <Sparkles className="w-4 h-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform relative z-10" />
                                </div>
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl text-white/30 font-light">—</span>
                          </div>
                        )}
                      </motion.button>
                    )
                  })
                ))}
              </div>

              {/* Row Averages */}
              <div className="grid grid-rows-5 gap-1.5 w-16 flex-shrink-0">
                {stats.rowAverages.map((avg, idx) => (
                  <div key={idx} className="flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-500/20 dark:to-slate-500/10 border border-gray-300 dark:border-slate-500/30 shadow-sm">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{avg.toFixed(2)}</div>
                      <div className="text-[8px] text-gray-600 dark:text-gray-400 uppercase font-medium">Row</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column Averages + Labels + Overall */}
            <div className="flex gap-1.5 mt-1.5">
              <div className="flex-1 grid grid-cols-5 gap-1.5">
                {SENTIMENT_CATEGORIES.map((cat, idx) => (
                  <div key={cat.id} className="flex flex-col gap-1">
                    {/* Column Average */}
                    <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-500/20 dark:to-slate-500/10 border border-gray-300 dark:border-slate-500/30 h-[38px] shadow-sm">
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{stats.columnAverages[idx]?.toFixed(2) || '—'}</div>
                        <div className="text-[7px] text-gray-600 dark:text-gray-400 uppercase font-medium">Col</div>
                      </div>
                    </div>
                    {/* Category Label */}
                    <div className="text-center px-1">
                      <div className="text-[10px] font-bold text-gray-900 dark:text-white leading-tight">{cat.shortName}</div>
                      <div className="text-[7px] text-gray-500 dark:text-gray-400 font-medium">C{cat.id}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Average */}
              <div className="w-16 flex-shrink-0">
                <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-500/20 dark:to-teal-500/10 border-2 border-teal-300 dark:border-teal-500/40 h-[38px] shadow-md">
                  <div className="text-center">
                    <div className="text-sm font-bold text-teal-700 dark:text-teal-400 tabular-nums">{stats.overallAverage.toFixed(2)}</div>
                    <div className="text-[7px] text-teal-600 dark:text-teal-500 uppercase font-semibold">All</div>
                  </div>
                </div>
                <div className="text-center mt-1">
                  <div className="text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase">Overall</div>
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

      {/* ACTION BUTTON - Ultra Compact */}
      {lowestCells.length > 0 && (
        <div className="flex-shrink-0">
          <button
            onClick={() => onAnalyzeProblemAreas(lowestCells)}
            className="w-full bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-500/10 dark:to-purple-500/10 hover:from-teal-100 hover:to-purple-100 dark:hover:from-teal-500/15 dark:hover:to-purple-500/15 rounded-lg border border-teal-300 dark:border-teal-500/30 hover:border-teal-400 dark:hover:border-teal-400/50 transition-all p-3 flex items-center justify-between group shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gray-900 dark:text-white">Generate AI Insights</div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400">
                  Analyze {lowestCells.length} priority areas • Get recommendations
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
        </div>
      )}

      {/* GAMIFICATION HINT - First-time users */}
      {categoryDataLoaded && showHint && (
        <GamificationHint onDismiss={() => setShowHint(false)} />
      )}
      </div>
    </div>
  )
}
