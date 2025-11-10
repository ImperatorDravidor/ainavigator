'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Info, TrendingUp, TrendingDown, Sparkles, ArrowRight, Users, AlertTriangle, BarChart3 } from 'lucide-react'
import { calculateSentimentHeatmap, getLowestScoringCells } from '@/lib/calculations/sentiment-ranking'
import { SENTIMENT_LEVELS, SENTIMENT_CATEGORIES } from '@/lib/constants/sentiment-metadata'
import { FilterState } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'

interface SentimentHeatmapProps {
  data: any[]
  filters: FilterState
  onAnalyzeProblemAreas: (lowestCells: any[]) => void
}

export default function SentimentHeatmap({ data, filters, onAnalyzeProblemAreas }: SentimentHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  
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
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-2 overflow-hidden">
      
      {/* TOP ROW: COMPACT HEADER & KEY STATS - Row 1-2 */}
      <div className="col-span-3 row-span-2 bg-gradient-to-br from-teal-500/10 to-transparent rounded-lg border border-teal-500/20 p-2 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Overall Sentiment</span>
          <Info className="w-2.5 h-2.5 text-gray-600" />
        </div>
        <div className="flex-1 flex items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-teal-400 tabular-nums">
              {stats.overallAverage.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 mb-1">/5.0</span>
          </div>
        </div>
        <div className="text-[9px] text-gray-500">
          {stats.overallAverage >= 3.5 ? 'Positive outlook' : 'Mixed sentiment'}
        </div>
      </div>

      <div className="col-span-2 row-span-2 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Respondents</span>
          <Users className="w-3 h-3 text-purple-400" />
        </div>
        <div className="flex-1 flex items-center">
          <span className="text-2xl font-bold text-white tabular-nums">
            {stats.totalRespondents.toLocaleString()}
          </span>
        </div>
        <div className="text-[9px] text-gray-500">employees surveyed</div>
      </div>

      <div className="col-span-2 row-span-2 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Variance</span>
          <BarChart3 className="w-3 h-3 text-blue-400" />
        </div>
        <div className="flex-1 flex items-center">
          <span className="text-2xl font-bold text-blue-400 tabular-nums">
            {stats.standardDeviation.toFixed(1)}
          </span>
        </div>
        <div className="text-[9px] text-gray-500">std deviation</div>
      </div>

      <div className="col-span-2 row-span-2 bg-gradient-to-br from-orange-500/5 to-transparent rounded-lg border border-orange-500/20 p-2 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Concerns</span>
          <AlertTriangle className="w-3 h-3 text-orange-400" />
        </div>
        <div className="flex-1 flex items-center">
          <span className="text-2xl font-bold text-orange-400 tabular-nums">
            {lowestCells.length}
          </span>
        </div>
        <div className="text-[9px] text-gray-500">need attention</div>
      </div>

      <div className="col-span-3 row-span-2 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2">
        <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</div>
        <div className="text-xs font-semibold text-white mb-0.5">Employee Sentiment Heatmap</div>
        <div className="text-[9px] text-gray-400 leading-tight">
          25-dimension matrix • 5 concerns × 5 levels
        </div>
      </div>

      {/* MAIN HEATMAP - Row 3-9 (reduced from 3-10 to prevent overlap) */}
      <div className="col-span-12 row-span-7 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2 flex flex-col">
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Sentiment Matrix</span>
            <span className="text-[8px] text-gray-600">• 5×5 Grid</span>
          </div>
          <span className="text-[8px] text-gray-500">Click cells for details • Rank #1 = Best (low resistance)</span>
        </div>

        <div className="flex-1 overflow-auto min-h-0 scrollbar-thin">
          <table className="w-full border-collapse text-[9px]">
            <thead className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
              <tr>
                <th className="sticky left-0 z-20 p-1 text-left font-medium text-gray-400 border-b border-white/10 bg-black/80 backdrop-blur-sm min-w-[100px]">
                  <span className="text-[8px] uppercase tracking-wide">Concern Level</span>
                </th>
                {SENTIMENT_CATEGORIES.map((cat) => (
                  <th
                    key={cat.id}
                    className="p-1 text-center font-medium text-gray-400 border-b border-white/10 min-w-[70px]"
                    title={cat.description}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-semibold text-white">{cat.shortName}</span>
                      <span className="text-[8px] text-gray-600">C{cat.id}</span>
                    </div>
                  </th>
                ))}
                <th className="p-1 text-center font-medium text-gray-400 border-b border-white/10 bg-gradient-to-r from-teal-500/5 to-transparent">
                  <span className="text-[8px] uppercase tracking-wide">Avg</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {SENTIMENT_LEVELS.map((level, levelIdx) => (
                <tr key={level.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td
                    className="sticky left-0 z-10 p-1 font-medium text-gray-300 bg-black/60 backdrop-blur-sm"
                    title={level.description}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-teal-400 font-bold text-[9px]">L{level.id}</span>
                      <span className="text-[9px] line-clamp-1">{level.name}</span>
                    </div>
                  </td>
                  {SENTIMENT_CATEGORIES.map((cat, catIdx) => {
                    const cellId = `L${level.id}_C${cat.id}`
                    const cell = cells.find(c => c.cellId === cellId)

                    return (
                      <td key={cat.id} className="p-0.5 relative group">
                        <button
                          onClick={() => setSelectedCell(cellId)}
                          className={cn(
                            "w-full aspect-square rounded text-center transition-all relative overflow-hidden text-[9px]",
                            selectedCell === cellId ? 'ring-2 ring-white shadow-lg z-20' : 'ring-1 ring-white/5',
                            cell && cell.count > 0 ? 'cursor-pointer hover:shadow-md hover:z-10' : 'cursor-default opacity-40'
                          )}
                          style={{
                            backgroundColor: cell?.color || '#6b7280'
                          }}
                        >
                          {cell && cell.count > 0 ? (
                            <>
                              <div className="text-white font-bold text-xs drop-shadow-md">
                                {cell.score.toFixed(1)}
                              </div>
                              <div className="text-white/70 text-[8px] font-medium">
                                n={cell.count}
                              </div>

                              {/* Hover Tooltip */}
                              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center p-1 pointer-events-none">
                                <div className="text-[8px] text-white text-center leading-tight">
                                  <div className="font-bold">#{cell.rank}</div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-white/30 text-[8px]">—</div>
                          )}
                        </button>
                      </td>
                    )
                  })}
                  <td className="p-1 text-center font-bold bg-gradient-to-r from-teal-500/5 to-transparent text-teal-400 tabular-nums">
                    {stats.rowAverages[levelIdx]?.toFixed(1) || '—'}
                  </td>
                </tr>
              ))}
              {/* Column Averages Row */}
              <tr className="bg-gradient-to-r from-teal-500/10 to-transparent border-t border-white/10 sticky bottom-0">
                <td className="sticky left-0 z-10 p-1 text-[8px] font-bold text-gray-300 bg-black/80 backdrop-blur-sm uppercase tracking-wide">
                  Col Avg
                </td>
                {SENTIMENT_CATEGORIES.map((cat, idx) => (
                  <td key={cat.id} className="p-1 text-center font-bold text-teal-400 tabular-nums">
                    {stats.columnAverages[idx]?.toFixed(1) || '—'}
                  </td>
                ))}
                <td className="p-1 text-center">
                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-500/20 border border-teal-500/30">
                    <span className="text-[8px] font-medium text-teal-300">Σ</span>
                    <span className="text-[10px] font-bold text-teal-400 tabular-nums">
                      {stats.overallAverage.toFixed(1)}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Compact Legend */}
        <div className="mt-1.5 pt-1.5 border-t border-white/5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[8px] text-gray-500 uppercase tracking-wide">Resistance Scale:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#15803d' }} />
                <span className="text-[8px] text-gray-400">Excellent (1.0-1.4)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#84cc16' }} />
                <span className="text-[8px] text-gray-400">Good (1.4-1.8)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#fcd34d' }} />
                <span className="text-[8px] text-gray-400">Moderate (1.8-2.2)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#fb923c' }} />
                <span className="text-[8px] text-gray-400">High (2.2-2.6)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#dc2626' }} />
                <span className="text-[8px] text-gray-400">Critical (2.6-3.0)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - Row 10-12 (3 rows for better spacing) */}
      {selectedCellData && selectedCellData.count > 0 ? (
        /* Cell Detail Panel */
        <div className="col-span-12 row-span-3 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg border border-blue-500/20 p-2 grid grid-cols-12 gap-2">
          <div className="col-span-4 flex flex-col">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-xs font-semibold text-white mb-0.5">{selectedCellData.levelName}</div>
                <div className="text-[9px] text-gray-400">{selectedCellData.categoryName}</div>
              </div>
              {selectedCellData.rank <= 3 && (
                <div className="px-1.5 py-0.5 rounded text-[8px] bg-green-500/10 border border-green-500/20 text-green-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" />
                  TOP PERFORMING
                </div>
              )}
              {selectedCellData.rank >= 23 && (
                <div className="px-1.5 py-0.5 rounded text-[8px] bg-red-500/10 border border-red-500/20 text-red-400 font-medium flex items-center gap-1">
                  <TrendingDown className="w-2.5 h-2.5" />
                  NEEDS ATTENTION
                </div>
              )}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <div className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">Resistance</div>
                <div className="text-xl font-bold tabular-nums">{selectedCellData.score.toFixed(2)}<span className="text-xs text-gray-500">/3.0</span></div>
              </div>
              <div className="flex-1">
                <div className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">Responses</div>
                <div className="text-xl font-bold tabular-nums">{selectedCellData.count.toLocaleString()}</div>
              </div>
              <div className="flex-1">
                <div className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">Rank</div>
                <div className={cn(
                  "text-xl font-bold tabular-nums",
                  selectedCellData.rank <= 5 ? 'text-green-400' :
                  selectedCellData.rank <= 8 ? 'text-lime-400' :
                  selectedCellData.rank >= 23 ? 'text-red-400' :
                  selectedCellData.rank >= 18 ? 'text-orange-400' :
                  'text-yellow-400'
                )}>
                  #{selectedCellData.rank}<span className="text-xs text-gray-500">/25</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-7 bg-white/5 rounded p-2 flex items-start gap-2">
            <Info className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[8px] font-semibold text-blue-400 uppercase tracking-wide mb-1">Analysis</div>
              <p className="text-[9px] text-gray-300 leading-relaxed line-clamp-3">
                {selectedCellData.description}
              </p>
            </div>
          </div>

          <div className="col-span-1 flex items-center justify-center">
            <button
              onClick={() => setSelectedCell(null)}
              className="px-2 py-1 rounded text-[8px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all font-medium uppercase tracking-wide"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        /* Action Button - Generate AI Recommendations */
        lowestCells.length > 0 && (
          <div className="col-span-12 row-span-3 bg-gradient-to-br from-teal-500/10 to-purple-500/5 rounded-lg border border-teal-500/20 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white mb-0.5">Ready for AI Analysis?</div>
                <div className="text-[9px] text-gray-400">
                  Analyze {lowestCells.length} priority areas • Get actionable recommendations • 10-15 sec
                </div>
              </div>
            </div>
            <button
              onClick={() => onAnalyzeProblemAreas(lowestCells)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-white text-[10px] font-semibold uppercase tracking-wide transition-all flex items-center gap-2 flex-shrink-0"
            >
              Generate Insights
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )
      )}
    </div>
  )
}

