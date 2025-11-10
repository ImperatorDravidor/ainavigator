'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Search, Dice6, Flame, Shield, Target, 
  ArrowRight, Filter as FilterIcon, Zap, Heart, Users, Brain, X
} from 'lucide-react'
import { CategoryDataService, CategoryActionData } from '@/lib/services/category-data.service'
import { cn } from '@/lib/utils'

type SolutionFlavor = 'action1' | 'action2' | 'action3'

const FLAVOR_CONFIG = {
  action1: {
    icon: Target,
    label: 'Procedural',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Structured approaches & governance'
  },
  action2: {
    icon: Zap,
    label: 'Playful',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500',
    description: 'Gamified & engaging methods'
  },
  action3: {
    icon: Heart,
    label: 'Reflective',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Mindful & accountability-focused'
  }
}

const LEVEL_CONFIG: Record<string, { name: string; icon: any; color: string }> = {
  'Personal Workflow Preferences': { name: 'Level 1', icon: Users, color: 'from-emerald-500 to-teal-500' },
  'Collaboration & Role Adjustments': { name: 'Level 2', icon: Users, color: 'from-blue-500 to-cyan-500' },
  'Professional Trust & Fairness Issues': { name: 'Level 3', icon: Shield, color: 'from-purple-500 to-pink-500' },
  'Career Security & Job Redefinition Anxiety': { name: 'Level 4', icon: Flame, color: 'from-orange-500 to-red-500' },
  'Organizational Stability at Risk': { name: 'Level 5', icon: Brain, color: 'from-red-500 to-rose-500' }
}

interface SelectedAction {
  category: CategoryActionData
  flavor: SolutionFlavor
  action: string
  explanation: string
}

export default function GamifiedInterventionsView() {
  const [categories, setCategories] = useState<CategoryActionData[]>([])
  const [filteredCategories, setFilteredCategories] = useState<CategoryActionData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [reasonFilter, setReasonFilter] = useState<string>('all')
  const [selectedAction, setSelectedAction] = useState<SelectedAction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [categories, searchQuery, levelFilter, reasonFilter])

  const loadCategories = async () => {
    setLoading(true)
    try {
      await CategoryDataService.loadData()
      const allCategories = CategoryDataService.getAllCategories()
      setCategories(allCategories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCategories = () => {
    let filtered = categories

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(cat =>
        cat.category.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query) ||
        cat.reason.toLowerCase().includes(query)
      )
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(cat => cat.level === levelFilter)
    }

    if (reasonFilter !== 'all') {
      filtered = filtered.filter(cat => cat.reason === reasonFilter)
    }

    setFilteredCategories(filtered)
  }

  const handleSelectAction = (category: CategoryActionData, flavor: SolutionFlavor) => {
    const actionKey = flavor === 'action1' ? 'action1' : flavor === 'action2' ? 'action2' : 'action3'
    const explanationKey = flavor === 'action1' ? 'explanation1' : flavor === 'action2' ? 'explanation2' : 'explanation3'
    
    setSelectedAction({
      category,
      flavor,
      action: category[actionKey],
      explanation: category[explanationKey]
    })
  }

  const handleFeelingLucky = (category: CategoryActionData) => {
    const flavors: SolutionFlavor[] = ['action1', 'action2', 'action3']
    const randomFlavor = flavors[Math.floor(Math.random() * flavors.length)]
    handleSelectAction(category, randomFlavor)
  }

  const uniqueReasons = categories.length > 0 ? Array.from(new Set(categories.map(c => c.reason))).sort() : []
  const levels = categories.length > 0 ? Array.from(new Set(categories.map(c => c.level))).sort() : []

  // Group by level
  const groupedCategories = filteredCategories.length > 0 ? filteredCategories.reduce((acc, cat) => {
    if (!acc[cat.level]) acc[cat.level] = []
    acc[cat.level].push(cat)
    return acc
  }, {} as Record<string, CategoryActionData[]>) : {}

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* HEADER */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                Quick Actions Library
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {categories.length} gamified micro-interventions for daily friction points
              </p>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border-2 border-purple-200 dark:border-purple-500/30"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Showing</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{filteredCategories.length}</div>
            </div>
          </motion.div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3">
          <motion.div
            className="relative flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by category, description, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm font-medium placeholder:text-gray-400"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="relative"
          >
            <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="pl-11 pr-8 py-3 rounded-xl bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm font-medium appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level.substring(0, 20)}...</option>
              ))}
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="pl-11 pr-8 py-3 rounded-xl bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm font-medium appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">All Reasons</option>
              {uniqueReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </motion.div>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No quick actions found</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="space-y-8 pb-6">
            {Object.keys(groupedCategories).sort().map((level, levelIndex) => {
              const levelConfig = LEVEL_CONFIG[level] || { name: level, icon: Users, color: 'from-gray-500 to-gray-600' }
              const LevelIcon = levelConfig.icon
              
              return (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: levelIndex * 0.1 }}
                >
                  {/* Level Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg", levelConfig.color)}>
                        <LevelIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                          {levelConfig.name}: {level}
                        </h2>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-bold text-gray-600 dark:text-gray-400">
                        {groupedCategories[level].length} {groupedCategories[level].length === 1 ? 'category' : 'categories'}
                      </span>
                    </div>
                  </div>

                  {/* Category Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {groupedCategories[level].map((category, idx) => (
                      <motion.div
                        key={`${category.category}-${idx}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all p-5"
                      >
                        {/* Category Header */}
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {category.category}
                            </h3>
                            <span className="px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-xs font-bold text-purple-800 dark:text-purple-300">
                              {category.reason}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {category.description}
                          </p>
                        </div>

                        {/* Action Flavor Buttons */}
                        <div className="grid grid-cols-4 gap-2">
                          {(['action1', 'action2', 'action3'] as SolutionFlavor[]).map((flavor) => {
                            const config = FLAVOR_CONFIG[flavor]
                            const Icon = config.icon
                            return (
                              <motion.button
                                key={flavor}
                                onClick={() => handleSelectAction(category, flavor)}
                                className={cn(
                                  "relative p-3 rounded-xl border-2 transition-all text-center group/btn",
                                  "hover:scale-105 hover:shadow-lg"
                                )}
                                style={{
                                  borderColor: `rgb(${config.color === 'blue' ? '59, 130, 246' : config.color === 'orange' ? '249, 115, 22' : '168, 85, 247'} / 0.3)`,
                                  background: `linear-gradient(135deg, rgb(${config.color === 'blue' ? '59, 130, 246' : config.color === 'orange' ? '249, 115, 22' : '168, 85, 247'} / 0.05), rgb(${config.color === 'blue' ? '34, 211, 238' : config.color === 'orange' ? '251, 191, 36' : '236, 72, 153'} / 0.05))`
                                }}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: `rgb(${config.color === 'blue' ? '59, 130, 246' : config.color === 'orange' ? '249, 115, 22' : '168, 85, 247'})` }} />
                                <div className="text-xs font-bold" style={{ color: `rgb(${config.color === 'blue' ? '59, 130, 246' : config.color === 'orange' ? '249, 115, 22' : '168, 85, 247'})` }}>
                                  {config.label}
                                </div>
                              </motion.button>
                            )
                          })}

                          {/* Feeling Lucky Button */}
                          <motion.button
                            onClick={() => handleFeelingLucky(category)}
                            className="relative p-3 rounded-xl border-2 border-pink-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all text-center group/btn hover:scale-105 hover:shadow-lg"
                            whileHover={{ y: -2, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Dice6 className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1 group-hover/btn:rotate-180 transition-transform duration-500" />
                            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">Lucky</div>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Action Detail Modal */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setSelectedAction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className={cn(
                "p-6 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r",
                FLAVOR_CONFIG[selectedAction.flavor].gradient.replace('from-', 'from-').replace('to-', 'to-')
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const Icon = FLAVOR_CONFIG[selectedAction.flavor].icon
                        return <Icon className="w-6 h-6 text-white" />
                      })()}
                      <span className="px-3 py-1 rounded-lg bg-white/20 text-white text-xs font-bold">
                        {FLAVOR_CONFIG[selectedAction.flavor].label} Approach
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedAction.category.category}
                    </h2>
                    <p className="text-white/90 text-sm">
                      {selectedAction.category.reason} • {selectedAction.category.level}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAction(null)}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
                  >
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Action Card */}
                  <div className="bg-gradient-to-br from-slate-50 to-white dark:from-white/5 dark:to-black/50 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        `bg-gradient-to-br ${FLAVOR_CONFIG[selectedAction.flavor].gradient}`
                      )}>
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Recommended Action</h3>
                        <p className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
                          {selectedAction.action}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Explanation Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-xl border border-purple-200 dark:border-purple-500/30 p-5">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-2">Why This Works</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {selectedAction.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Try Another Button */}
                  <motion.button
                    onClick={() => setSelectedAction(null)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                    Try Another Action
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

