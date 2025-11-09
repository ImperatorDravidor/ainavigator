'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Sparkles, 
  Target,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingDown
} from 'lucide-react'
import { ProblemCategory, Intervention } from '@/lib/ai/gpt-service'
import { cn } from '@/lib/utils'

interface InterventionsViewProps {
  problemCategory: ProblemCategory
  companyContext: any
  onBack: () => void
}

export default function InterventionsView({
  problemCategory,
  companyContext,
  onBack
}: InterventionsViewProps) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [expandedAction, setExpandedAction] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateInterventions()
  }, [])

  const generateInterventions = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/gpt/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_category: problemCategory,
          company_context: companyContext
        })
      })

      if (!response.ok) throw new Error('Failed to generate interventions')

      const result = await response.json()
      setInterventions(result.data.interventions)
    } catch (err: any) {
      setError(err.message)
      console.error('Intervention generation failed:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      default: return 'text-slate-600 dark:text-gray-400'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-slate-600 dark:text-gray-400'
      default: return 'text-slate-600 dark:text-gray-400'
    }
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        {/* Beautiful loading animation */}
        <motion.div
          className="relative mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Generating Solutions...</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6 leading-relaxed">
          Our AI is analyzing your data and creating 3 targeted, actionable recommendations for:
        </p>
        <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20">
          <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {problemCategory.category_name}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-dark rounded-xl p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to Generate Interventions</h3>
        <p className="text-slate-600 dark:text-gray-400 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={generateInterventions} className="btn-primary">
            Retry
          </button>
          <button onClick={onBack} className="btn-secondary">
            Back to Categories
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Problem Context Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-white/5 border-2 border-gray-200 dark:border-white/10 p-6 shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Severity Badge */}
            <motion.div 
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase mb-4 shadow-md",
                problemCategory.severity === 'critical' && 'bg-gradient-to-r from-red-500 to-red-600 text-white',
                problemCategory.severity === 'high' && 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
                problemCategory.severity === 'medium' && 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
              )}
              whileHover={{ scale: 1.05 }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{problemCategory.severity} Priority</span>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {problemCategory.category_name}
            </h2>
            
            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-semibold">
                {problemCategory.reason}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 text-xs font-semibold">
                {problemCategory.level}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {problemCategory.description}
            </p>

            {problemCategory.business_impact && (
              <div className="rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-500/10 dark:to-cyan-500/10 border border-teal-200 dark:border-teal-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-sm font-bold text-teal-700 dark:text-teal-400">Business Impact</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{problemCategory.business_impact}</p>
              </div>
            )}
          </div>

          {/* Affected Count - Prominent */}
          <motion.div 
            className="ml-6 flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-500/20 dark:to-red-500/20 border-2 border-orange-300 dark:border-orange-500/30 p-6 text-center min-w-[140px]">
              <Users className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Affected Employees</div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                {problemCategory.affected_count}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Recommended Interventions
        </h3>
        <span className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-xs font-bold text-purple-700 dark:text-purple-400">
          {interventions.length} Solutions
        </span>
      </div>

      {/* Interventions Cards */}
      <div className="space-y-4">

        {interventions.map((intervention, index) => (
          <motion.div
            key={intervention.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
            className="rounded-2xl bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          >
            {/* Card Header - Beautiful gradient */}
            <motion.button
              onClick={() => setExpandedAction(
                expandedAction === intervention.number ? null : intervention.number
              )}
              className="w-full p-6 text-left bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-500/15 dark:hover:to-pink-500/15 transition-all"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Number badge */}
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-2xl font-bold text-white">{intervention.number}</span>
                    </motion.div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{intervention.title}</h4>
                  </div>

                  {/* Quick Stats - Colorful badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm",
                      intervention.impact === 'high' && 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
                      intervention.impact === 'medium' && 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
                      intervention.impact === 'low' && 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400'
                    )}>
                      <TrendingUp className="w-4 h-4" />
                      <span className="uppercase tracking-wide">{intervention.impact} Impact</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm",
                      intervention.effort === 'low' && 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
                      intervention.effort === 'medium' && 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
                      intervention.effort === 'high' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    )}>
                      <Target className="w-4 h-4" />
                      <span className="uppercase tracking-wide">{intervention.effort} Effort</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold shadow-sm">
                      <Clock className="w-4 h-4" />
                      <span className="tracking-wide">{intervention.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-sm">
                      <DollarSign className="w-4 h-4" />
                      <span className="tracking-wide">{intervention.budget_estimate}</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-white/5 rounded-xl p-5 border-l-4 border-purple-500 shadow-sm">
                    <h5 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      What to Do
                    </h5>
                    <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed font-normal">
                      {intervention.what_to_do}
                    </p>
                  </div>
                </div>

                <motion.div 
                  className="ml-4 flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center"
                  animate={{ rotate: expandedAction === intervention.number ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
              </div>
            </motion.button>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedAction === intervention.number && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10"
                >
                  <div className="p-8 space-y-6 bg-gradient-to-b from-white to-gray-50 dark:from-black/20 dark:to-black/30">
                    {/* Why It Works - Highlighted */}
                    <motion.div
                      className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/15 dark:to-pink-500/15 border-2 border-purple-200 dark:border-purple-500/30 p-6 shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-purple-500/20">
                          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h5 className="text-xl font-extrabold text-purple-900 dark:text-purple-300">Why This Works</h5>
                      </div>
                      <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed font-normal">
                        {intervention.why_it_works}
                      </p>
                    </motion.div>

                    {/* Quick Wins - If available, show first */}
                    {intervention.quick_wins && intervention.quick_wins.length > 0 && (
                      <motion.div
                        className="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-500/15 dark:to-cyan-500/15 border-2 border-teal-200 dark:border-teal-500/30 p-6 shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-teal-500/20">
                            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div>
                            <h5 className="text-xl font-extrabold text-teal-900 dark:text-teal-300">Quick Wins</h5>
                            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wide">First 2-4 Weeks</p>
                          </div>
                        </div>
                        <ul className="space-y-3">
                          {intervention.quick_wins.map((win, idx) => (
                            <motion.li
                              key={idx}
                              className="text-base text-gray-800 dark:text-gray-200 flex items-start gap-3 bg-white/50 dark:bg-white/5 p-3 rounded-xl font-normal"
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + idx * 0.05 }}
                            >
                              <span className="text-teal-600 dark:text-teal-400 text-xl font-bold flex-shrink-0">→</span>
                              <span className="leading-relaxed">{win}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Resources & Stakeholders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/15 dark:to-cyan-500/15 border-2 border-blue-200 dark:border-blue-500/30 p-6 shadow-lg"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-blue-500/20">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h5 className="text-lg font-extrabold text-blue-900 dark:text-blue-300">Key Stakeholders</h5>
                        </div>
                        <ul className="space-y-3">
                          {intervention.key_stakeholders.map((stakeholder, idx) => (
                            <motion.li
                              key={idx}
                              className="text-sm text-gray-800 dark:text-gray-200 flex items-start gap-3 bg-white/50 dark:bg-white/5 p-3 rounded-xl font-normal"
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.25 + idx * 0.05 }}
                            >
                              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{stakeholder}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/15 dark:to-amber-500/15 border-2 border-orange-200 dark:border-orange-500/30 p-6 shadow-lg"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-orange-500/20">
                            <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <h5 className="text-lg font-extrabold text-orange-900 dark:text-orange-300">Required Resources</h5>
                        </div>
                        <ul className="space-y-3">
                          {intervention.required_resources.map((resource, idx) => (
                            <motion.li
                              key={idx}
                              className="text-sm text-gray-800 dark:text-gray-200 flex items-start gap-3 bg-white/50 dark:bg-white/5 p-3 rounded-xl font-normal"
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.25 + idx * 0.05 }}
                            >
                              <CheckCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{resource}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Success Metrics */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/15 dark:to-emerald-500/15 border-2 border-green-200 dark:border-green-500/30 p-6 shadow-lg"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-green-500/20">
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h5 className="text-xl font-extrabold text-green-900 dark:text-green-300">Success Metrics</h5>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {intervention.success_metrics.map((metric, idx) => (
                          <motion.span
                            key={idx}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold border-2 border-green-600 dark:border-green-400 shadow-md"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.35 + idx * 0.05, type: "spring", stiffness: 500 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                          >
                            ✓ {metric}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {interventions.length === 0 && !isGenerating && (
        <div className="glass-dark rounded-xl p-12 text-center">
          <p className="text-slate-600 dark:text-gray-400">No interventions generated. Please try again.</p>
        </div>
      )}
    </div>
  )
}

