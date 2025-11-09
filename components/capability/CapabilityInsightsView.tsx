'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Brain, TrendingUp, AlertTriangle, Lightbulb, Target, 
  Zap, Clock, CheckCircle, BarChart3, Users, ChevronDown, ChevronUp, Info 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CapabilityInsight {
  dimension: string
  current_score: number
  benchmark: number
  gap_percentage: number
  priority: 'critical' | 'high' | 'medium'
  evidence: {
    score: number
    response_count: number
    common_themes: string[]
  }
  root_causes: string[]
  immediate_actions: {
    action: string
    impact: string
    effort: 'low' | 'medium' | 'high'
  }[]
  recommended_interventions: string[]
  why_these_interventions: string
}

interface CapabilityInsightsViewProps {
  weakDimensions: any[]
  companyContext: any
  filters: any
  onBack: () => void
}

export default function CapabilityInsightsView({
  weakDimensions,
  companyContext,
  filters,
  onBack
}: CapabilityInsightsViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [insights, setInsights] = useState<CapabilityInsight[]>([])
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set([0]))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Generate insights from actual dimension data
    generateDataDrivenInsights()
  }, [])

  const generateDataDrivenInsights = () => {
    setTimeout(() => {
      const dataInsights: CapabilityInsight[] = weakDimensions
        .slice(0, 3) // Top 3 weakest
        .map((dim) => {
          const gap = ((dim.benchmark - dim.score) / dim.benchmark) * 100
          
          return {
            dimension: dim.dimension,
            current_score: dim.score,
            benchmark: dim.benchmark,
            gap_percentage: Math.round(gap),
            priority: gap > 30 ? 'critical' : gap > 20 ? 'high' : 'medium',
            evidence: {
              score: dim.score,
              response_count: dim.count || 0,
              common_themes: generateThemesForDimension(dim.dimension, dim.score)
            },
            root_causes: generateRootCauses(dim.dimension, dim.score),
            immediate_actions: generateImmediateActions(dim.dimension),
            recommended_interventions: getInterventionsForDimension(dim.dimension),
            why_these_interventions: getInterventionRationale(dim.dimension)
          }
        })

      setInsights(dataInsights)
      setIsAnalyzing(false)
    }, 1200)
  }

  const generateThemesForDimension = (dimension: string, score: number): string[] => {
    const themes: Record<string, string[]> = {
      'Strategy & Vision': score < 5 
        ? ['Unclear AI direction', 'No executive sponsor', 'Ad-hoc initiatives']
        : ['Some alignment gaps', 'Need clearer roadmap'],
      'Data': score < 5
        ? ['Data silos', 'Quality issues', 'Access barriers']
        : ['Improving infrastructure', 'Some governance gaps'],
      'Talent & Skills': score < 5
        ? ['Skills shortage', 'Limited training', 'High consultant dependency']
        : ['Growing capability', 'Need more depth'],
      'Technology & Tools': score < 5
        ? ['Legacy systems', 'Tool fragmentation', 'Technical debt']
        : ['Modernizing stack', 'Integration challenges'],
      'Ethics & Governance': score < 5
        ? ['No clear policies', 'Compliance gaps', 'Risk concerns']
        : ['Basic frameworks exist', 'Need formalization']
    }
    return themes[dimension] || ['Gap identified', 'Needs attention']
  }

  const generateRootCauses = (dimension: string, score: number): string[] => {
    const causes: Record<string, string[]> = {
      'Strategy & Vision': [
        'AI initiatives lack connection to business strategy',
        'No dedicated leadership or budget allocation',
        'Teams working in silos without shared direction'
      ],
      'Data': [
        'Data scattered across disconnected systems',
        'Quality and documentation inconsistent',
        'No central data governance or ownership'
      ],
      'Talent & Skills': [
        'Limited AI knowledge beyond IT department',
        'No formal training or upskilling programs',
        'Competing for talent with limited success'
      ],
      'Technology & Tools': [
        'Legacy infrastructure not AI-ready',
        'Tools purchased without integration plan',
        'Technical debt slowing innovation'
      ],
      'Ethics & Governance': [
        'No formal AI ethics review process',
        'Unclear accountability for AI decisions',
        'Risk management not adapted for AI'
      ]
    }
    return causes[dimension] || ['Structural gap needs addressing']
  }

  const generateImmediateActions = (dimension: string) => {
    const actions: Record<string, any[]> = {
      'Strategy & Vision': [
        { action: 'Schedule AI alignment workshop with executive team', impact: 'Builds shared vision', effort: 'low' },
        { action: 'Identify one AI champion to drive coordination', impact: 'Creates accountability', effort: 'low' },
        { action: 'Document top 3 AI opportunities aligned to business goals', impact: 'Provides focus', effort: 'medium' }
      ],
      'Data': [
        { action: 'Audit data sources for planned AI use cases', impact: 'Identifies readiness', effort: 'low' },
        { action: 'Assign data ownership for key datasets', impact: 'Enables governance', effort: 'medium' },
        { action: 'Run data quality assessment on priority data', impact: 'Surfaces issues', effort: 'medium' }
      ],
      'Talent & Skills': [
        { action: 'Survey current AI skills across departments', impact: 'Baseline understanding', effort: 'low' },
        { action: 'Identify 3-5 AI champions to train as ambassadors', impact: 'Peer learning', effort: 'low' },
        { action: 'Pilot AI literacy workshops with one team', impact: 'Tests approach', effort: 'medium' }
      ],
      'Technology & Tools': [
        { action: 'Map current AI tools and their usage', impact: 'Shows fragmentation', effort: 'low' },
        { action: 'Evaluate one integration opportunity', impact: 'Quick win potential', effort: 'medium' },
        { action: 'Document technical requirements for AI', impact: 'Guides investment', effort: 'medium' }
      ],
      'Ethics & Governance': [
        { action: 'Review one AI use case for ethical considerations', impact: 'Builds awareness', effort: 'low' },
        { action: 'Draft basic AI usage guidelines', impact: 'Sets expectations', effort: 'low' },
        { action: 'Establish AI review checkpoint in project workflow', impact: 'Creates oversight', effort: 'medium' }
      ]
    }
    return actions[dimension] || [{ action: 'Assess current state', impact: 'Understand gap', effort: 'low' }]
  }

  const getInterventionsForDimension = (dimension: string): string[] => {
    const mapping: Record<string, string[]> = {
      'Strategy & Vision': ['A1', 'A2'],
      'Data': ['A3', 'C1'],
      'Talent & Skills': ['B2', 'B4'],
      'Technology & Tools': ['C1', 'C2'],
      'Ethics & Governance': ['A2', 'A3']
    }
    return mapping[dimension] || ['A1']
  }

  const getInterventionRationale = (dimension: string): string => {
    const rationales: Record<string, string> = {
      'Strategy & Vision': 'Strategic workshops (A1, A2) help align teams and leadership on AI direction before investing in execution',
      'Data': 'Data governance (A3) plus experimentation (C1) balances structure with learning what works',
      'Talent & Skills': 'Learning programs (B2) and peer networks (B4) build capability sustainably',
      'Technology & Tools': 'Rapid prototyping (C1, C2) validates tech choices before major investment',
      'Ethics & Governance': 'Governance frameworks (A2, A3) establish guardrails as AI use scales'
    }
    return rationales[dimension] || 'These interventions address the identified gaps systematically'
  }

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedCards(newExpanded)
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'from-red-500 to-orange-500',
      high: 'from-orange-500 to-yellow-500',
      medium: 'from-yellow-500 to-green-500'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const getEffortBadge = (effort: string) => {
    const config = {
      low: { label: 'Low effort', color: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' },
      medium: { label: 'Medium effort', color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' },
      high: { label: 'High effort', color: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' }
    }
    return config[effort as keyof typeof config] || config.medium
  }

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4"
        >
          <BarChart3 className="w-16 h-16 text-teal-600 dark:text-teal-400" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
          Analyzing Your Data
        </h3>
        <p className="text-sm text-slate-600 dark:text-gray-400 text-center max-w-md">
          Processing {weakDimensions.length} dimensions below benchmark...
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 pb-4">
          <button
            onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Overview
          </button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Gap Analysis & Next Steps</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Based on your assessment scores - Focus on these {insights.length} areas
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <Users className="w-4 h-4 text-slate-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {weakDimensions.reduce((sum, d) => sum + (d.count || 0), 0)} responses
            </span>
          </div>
        </div>
      </div>

      {/* Priority Summary Bar */}
      <div className="flex-shrink-0 mb-4 flex gap-3">
        {insights.filter(i => i.priority === 'critical').length > 0 && (
          <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              {insights.filter(i => i.priority === 'critical').length} Critical
            </span>
          </div>
        )}
        {insights.filter(i => i.priority === 'high').length > 0 && (
          <div className="px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
              {insights.filter(i => i.priority === 'high').length} High Priority
            </span>
          </div>
        )}
      </div>

      {/* Insights Cards */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3">
          {insights.map((insight, index) => {
          const isExpanded = expandedCards.has(index)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-teal-300 dark:hover:border-teal-500/40 transition-all"
            >
              {/* Collapsible Header */}
              <button
                onClick={() => toggleCard(index)}
                className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg",
                        getPriorityColor(insight.priority)
                      )}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{insight.dimension}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-slate-600 dark:text-gray-400">
                            Score: <span className="font-semibold text-slate-900 dark:text-white">{insight.current_score.toFixed(1)}</span> / {insight.benchmark.toFixed(1)}
                          </span>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {insight.gap_percentage}% below benchmark
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Evidence Tags */}
                    <div className="flex flex-wrap gap-2">
                      {insight.evidence.common_themes.map((theme, idx) => (
                        <span key={idx} className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/10">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-600 dark:text-gray-400" /> : <ChevronDown className="w-5 h-5 text-slate-600 dark:text-gray-400" />}
                    <span className="text-xs text-slate-500 dark:text-gray-500">
                      {insight.evidence.response_count} responses
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-200 dark:border-white/10"
                  >
                    <div className="p-4 space-y-4">
                      {/* Root Causes */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Why This Gap Exists
                  </h4>
                  <ul className="space-y-1.5">
                          {insight.root_causes.map((cause, idx) => (
                            <li key={idx} className="text-sm text-slate-700 dark:text-gray-400 flex items-start gap-2">
                              <span className="text-slate-400 dark:text-gray-600">•</span>
                              <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                      {/* Immediate Actions */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          Start Here (Next 30 Days)
                        </h4>
                        <div className="space-y-2">
                          {insight.immediate_actions.map((item, idx) => {
                            const effortBadge = getEffortBadge(item.effort)
                            return (
                              <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <div className="flex items-start justify-between gap-3 mb-1">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white flex-1">{item.action}</p>
                                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap", effortBadge.color)}>
                                    {effortBadge.label}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-gray-400">→ {item.impact}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Recommended Interventions */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-teal-50 to-purple-50 dark:from-teal-500/10 dark:to-purple-500/10 border border-teal-200 dark:border-teal-500/30">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          Strategic Interventions ({insight.recommended_interventions.join(', ')})
                  </h4>
                        <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                          {insight.why_these_interventions}
                        </p>
                      </div>
                </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </motion.div>
            )
          })}
      </div>
    </div>
  )
}
