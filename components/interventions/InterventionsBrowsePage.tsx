'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Lightbulb, ArrowRight, Search, Filter as FilterIcon, Zap, LayoutGrid } from 'lucide-react'
import { InterventionDetail } from './InterventionDetail'
import GamifiedInterventionsView from './GamifiedInterventionsView'
import { cn } from '@/lib/utils'

interface Intervention {
  code: string
  name: string
  level: string
  core_function: string
  description?: string
}

type ViewMode = 'programs' | 'quick-actions'

export default function InterventionsBrowsePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('programs')
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([])
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllInterventions()
  }, [])

  useEffect(() => {
    filterInterventions()
  }, [interventions, searchQuery, levelFilter])

  const fetchAllInterventions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/interventions')
      const data = await response.json()
      setInterventions(data.interventions || [])
    } catch (error) {
      console.error('Failed to fetch interventions:', error)
      setInterventions([])
    } finally {
      setLoading(false)
    }
  }

  const filterInterventions = () => {
    let filtered = interventions

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (intervention) =>
          intervention.name.toLowerCase().includes(query) ||
          intervention.code.toLowerCase().includes(query) ||
          intervention.core_function.toLowerCase().includes(query)
      )
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter((intervention) =>
        intervention.level.toLowerCase().includes(levelFilter.toLowerCase())
      )
    }

    setFilteredInterventions(filtered)
  }

  const getLevelColor = (level: string) => {
    if (level.includes('Strategy')) return 'from-purple-600 to-purple-700'
    if (level.includes('Adoption')) return 'from-blue-600 to-blue-700'
    if (level.includes('Innovation')) return 'from-teal-600 to-teal-700'
    return 'from-gray-600 to-gray-700'
  }

  const getLevelBadgeColor = (level: string) => {
    if (level.includes('Strategy')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    if (level.includes('Adoption')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    if (level.includes('Innovation')) return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }

  const getLevelDescription = (levelKey: string) => {
    if (levelKey.includes('A - Strategy')) return 'Direction, frameworks, alignment'
    if (levelKey.includes('B - Adoption')) return 'Motivation, learning psychology, culture change'
    if (levelKey.includes('C - Innovation')) return 'Experimentation, learning, ROI'
    return ''
  }

  // Group interventions by level
  const groupedInterventions = filteredInterventions.reduce((acc, intervention) => {
    const levelKey = intervention.level.split(' - ')[0]
    if (!acc[levelKey]) acc[levelKey] = []
    acc[levelKey].push(intervention)
    return acc
  }, {} as Record<string, Intervention[]>)

  const levels = Object.keys(groupedInterventions).sort()

  if (viewMode === 'quick-actions') {
    return <GamifiedInterventionsView />
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* REFINED HEADER with brand colors */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Lightbulb className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">
                Interventions Library
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {interventions.length} strategic programs + 78 quick actions
              </p>
            </div>
          </div>
          
          {/* Stats badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border-2 border-orange-200 dark:border-orange-500/30"
          >
            <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Showing</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{filteredInterventions.length}</div>
            </div>
          </motion.div>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setViewMode('programs')}
            className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-md"
          >
            <LayoutGrid className="w-4 h-4" />
            Strategic Programs
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300">
              {interventions.length}
            </span>
          </button>
          <button
            onClick={() => setViewMode('quick-actions')}
            className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Zap className="w-4 h-4" />
            Quick Actions
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400">
              78
            </span>
          </button>
        </div>

        {/* REFINED Search and Filter */}
        <div className="flex gap-3">
          <motion.div 
            className="relative flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, code, or function..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 focus:border-teal-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm font-medium placeholder:text-gray-400"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="pl-11 pr-8 py-3 rounded-xl bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 focus:border-teal-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm font-medium appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="all">All Levels</option>
              <option value="strategy">A - Strategy</option>
              <option value="adoption">B - Adoption</option>
              <option value="innovation">C - Innovation</option>
            </select>
          </motion.div>
        </div>
      </div>

      {/* BEAUTIFUL Interventions Grid */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        ) : filteredInterventions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No interventions found</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="space-y-8 pb-6">
            {levels.map((levelKey, levelIndex) => (
              <motion.div 
                key={levelKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIndex * 0.1 }}
              >
                {/* Level Header - Modern with gradient and description */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${getLevelColor(levelKey)}`} />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {levelKey}
                    </h2>
                    <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-bold text-gray-600 dark:text-gray-400">
                      {groupedInterventions[levelKey].length}
                    </span>
                  </div>
                  {getLevelDescription(levelKey) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic ml-16">
                      {getLevelDescription(levelKey)}
                    </p>
                  )}
                </div>

                {/* Beautiful Intervention Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedInterventions[levelKey].map((intervention, idx) => (
                    <motion.button
                      key={intervention.code}
                      onClick={() => setSelectedIntervention(intervention.code)}
                      className="group relative text-left overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-orange-300 dark:hover:border-orange-500/40 transition-all"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, type: "spring", stiffness: 300 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/5 dark:to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Card Content */}
                      <div className="relative p-5">
                        {/* Code Badge - Floating */}
                        <motion.div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${getLevelColor(intervention.level)} text-white shadow-lg mb-3`}
                          whileHover={{ scale: 1.05, rotate: 2 }}
                        >
                          <span className="text-sm font-bold">{intervention.code}</span>
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {intervention.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                          {intervention.core_function}
                        </p>

                        {/* Action hint */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          <span>View Details</span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Bottom gradient indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Intervention Detail Modal */}
      <InterventionDetail
        isOpen={selectedIntervention !== null}
        interventionCode={selectedIntervention}
        onClose={() => setSelectedIntervention(null)}
        onSelectNextStep={(code) => setSelectedIntervention(code)}
      />
    </div>
  )
}
