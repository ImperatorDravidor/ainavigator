'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter, Download, Activity,
  Users, Target, ChevronRight,
  BarChart3, Brain, FileText,
  Maximize2, Minimize2, Search, Lightbulb, Sparkles,
  Upload, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { useStore } from '@/lib/store'
import { SimpleThemeToggle } from '@/components/ui/simple-theme-toggle'
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip'
import { ContextualHelp } from '@/components/ui/contextual-help'
import { OnboardingHint } from '@/components/ui/onboarding-hint'
import { CommandPalette } from '@/components/ui/command-palette'
import { DataComparisonMode } from '@/components/ui/data-comparison-mode'
import { KeyboardShortcutsHelp } from '@/components/ui/keyboard-shortcuts-help'
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'
import { toast } from 'react-hot-toast'
import { EasterEggAchievement, useAchievements } from '@/components/ui/easter-egg-achievement'
import { useFunInteractions } from '@/hooks/use-fun-interactions'
import { ViewState, FilterState, CompanyProfile } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'
import FilterPanel from '@/components/dashboard/FilterPanel'
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard'
import SentimentHeatmapRevised from '@/components/sentiment/SentimentHeatmapRevised'
import ProblemCategoriesView from '@/components/sentiment/ProblemCategoriesView'
import InterventionsView from '@/components/sentiment/InterventionsView'
import CapabilityAnalysisPro from '@/components/capability/CapabilityAnalysisPro'
import DimensionDrilldown from '@/components/capability/DimensionDrilldown'
import OpenEndedSummary from '@/components/capability/OpenEndedSummary'
import CapabilityInsightsView from '@/components/capability/CapabilityInsightsView'
import RecommendationsView from '@/components/recommendations/RecommendationsView'
import ReportsView from '@/components/reports/ReportsView'
import AIAgentView from '@/components/ai-agent/AIAgentView'
import InterventionsBrowsePage from '@/components/interventions/InterventionsBrowsePage'
// InterventionTracker ready but not yet integrated - add to interventions page when needed
// import { InterventionTracker } from '@/components/interventions/InterventionTracker'
import InterventionImpactReport from '@/components/interventions/InterventionImpactReport'
import { ImportSnapshotDialog } from '@/components/ui/import-snapshot-dialog'
import { generateCompletePDF } from '@/lib/utils/pdfExport-complete'
import { calculateSentimentHeatmap, getLowestScoringCells } from '@/lib/calculations/sentiment-ranking'
import { calculateCapabilityAssessment } from '@/lib/calculations/capability-analysis'
// Skeleton component imported but not actively used in current view
// import { SkeletonDashboard } from '@/components/ui/skeleton'

type NavigationView = 'overview' | 'sentiment' | 'capability' | 'interventions' | 'recommendations' | 'reports' | 'ai-agent'

export default function AssessmentPage() {
  const { session, company } = useAuth()
  
  const [activeView, setActiveView] = useState<NavigationView>('overview')
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'overview' })
  const setStoreActiveView = useStore((state) => state.setActiveView)
  
  // Sync activeView with store so floating chat knows when to hide
  useEffect(() => {
    setStoreActiveView(activeView)
  }, [activeView, setStoreActiveView])
  const [sentimentData, setSentimentData] = useState<any[]>([])
  const [capabilityData, setCapabilityData] = useState<any[]>([])
  const [openEndedResponses, setOpenEndedResponses] = useState<string[]>([])
  const [baselineSentimentData, setBaselineSentimentData] = useState<any[]>([]) // For delta calculation
  const [baselineCapabilityData, setBaselineCapabilityData] = useState<any[]>([]) // For delta calculation
  const [phase2SentimentData, setPhase2SentimentData] = useState<any[]>([]) // For impact analysis
  const [phase2CapabilityData, setPhase2CapabilityData] = useState<any[]>([]) // For impact analysis
  const [phase3SentimentData, setPhase3SentimentData] = useState<any[]>([]) // For impact analysis
  const [phase3CapabilityData, setPhase3CapabilityData] = useState<any[]>([]) // For impact analysis
  const [filters, setFilters] = useState<FilterState>({})
  const [showFilters, setShowFilters] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPhase, setIsLoadingPhase] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [selectedWave, setSelectedWave] = useState<string | undefined>('oct-2024-baseline')
  // selectedPeriodId removed - can be added when InterventionTracker is integrated
  const [visitedSections, setVisitedSections] = useState<Set<NavigationView>>(new Set())
  const [keyboardShortcutCount, setKeyboardShortcutCount] = useState(0)
  const { achievementToShow, unlock, dismiss } = useAchievements()

  // Mock company profile (replace with actual data)
  const companyProfile: CompanyProfile = {
    id: company?.id || 'demo',
    name: company?.display_name || 'Demo Company',
    displayName: company?.display_name || 'Demo Company',
    industry: 'Financial Services', // TODO: Get from company data
    size: '1000-5000',
    aiMaturity: 'early_adoption'
  }

  const benchmarks: Record<number, number> = {
    1: 4.3, // Strategy
    2: 5.5, // Data
    3: 4.1, // Technology
    4: 3.7, // Talent
    5: 4.6, // Org Processes
    6: 4.3, // Innovation
    7: 4.1, // Adaptation
    8: 4.9  // Ethics
  }

  useEffect(() => {
    // Only load data once we have a valid company ID
    if (company?.id) {
      loadData()
    }
  }, [company?.id])

  // Reload data when selectedWave changes (temporal filtering)
  useEffect(() => {
    if (company?.id && selectedWave !== undefined) {
      loadData(selectedWave, true) // Pass true to indicate phase switch
    }
  }, [selectedWave])

  useEffect(() => {
    // Show onboarding hint for first-time users
    const hasSeenOnboarding = localStorage.getItem('assessment-onboarding-seen')
    if (!hasSeenOnboarding && !isLoading) {
      setTimeout(() => {
        setShowOnboarding(true)
      }, 1500)
    }
  }, [isLoading])

  // Load all phases' data for impact analysis (one-time load)
  useEffect(() => {
    if (company?.id) {
      loadAllPhasesData()
    }
  }, [company?.id])

  const loadAllPhasesData = async () => {
    if (!company?.id) return

    try {
      // Load Phase 2 data
      const phase2SentimentResponse = await fetch(`/api/data/respondents?survey_wave=mar-2025-phase2`, {
        headers: { 'x-company-id': company.id }
      })
      if (phase2SentimentResponse.ok) {
        const phase2SentimentResult = await phase2SentimentResponse.json()
        setPhase2SentimentData(phase2SentimentResult.data)
      }

      const phase2CapabilityResponse = await fetch(`/api/data/capability?survey_wave=mar-2025-phase2`, {
        headers: { 'x-company-id': company.id }
      })
      if (phase2CapabilityResponse.ok) {
        const phase2CapabilityResult = await phase2CapabilityResponse.json()
        setPhase2CapabilityData(phase2CapabilityResult.data)
      }

      // Load Phase 3 data
      const phase3SentimentResponse = await fetch(`/api/data/respondents?survey_wave=nov-2025-phase3`, {
        headers: { 'x-company-id': company.id }
      })
      if (phase3SentimentResponse.ok) {
        const phase3SentimentResult = await phase3SentimentResponse.json()
        setPhase3SentimentData(phase3SentimentResult.data)
      }

      const phase3CapabilityResponse = await fetch(`/api/data/capability?survey_wave=nov-2025-phase3`, {
        headers: { 'x-company-id': company.id }
      })
      if (phase3CapabilityResponse.ok) {
        const phase3CapabilityResult = await phase3CapabilityResponse.json()
        setPhase3CapabilityData(phase3CapabilityResult.data)
      }
    } catch (error) {
      console.error('Failed to load all phases data:', error)
    }
  }

  // PDF Export handler - COMPLETE with all real data
  const handleExportPDF = async () => {
    try {
      toast.loading('Generating comprehensive PDF report...')
      
      // Calculate real sentiment analysis
      const sentimentAnalysis = sentimentData.length > 0 ? 
        calculateSentimentHeatmap(sentimentData, filters) : null
      
      // Calculate real capability assessment
      const capabilityAnalysis = capabilityData.length > 0 ?
        calculateCapabilityAssessment(capabilityData, benchmarks, filters) : null
      
      // Calculate real readiness score
      const sentimentScore = sentimentAnalysis?.stats.overallAverage || 3.0
      const capabilityScore = capabilityAnalysis?.overall.average || 4.0
      const readinessScore = Math.round(
        ((sentimentScore / 5) * 0.4 + (capabilityScore / 10) * 0.6) * 100
      )

      // Get lowest scoring cells
      const lowestCells = sentimentAnalysis ? 
        getLowestScoringCells(sentimentAnalysis.cells, 10) : []
      
      // Get weak dimensions
      const weakDimensions = capabilityAnalysis?.dimensions
        .filter(d => d.status === 'below' || d.status === 'significantly_below')
        .slice(0, 5) || []
      
      // Get strong dimensions
      const strongDimensions = capabilityAnalysis?.dimensions
        .filter(d => d.status === 'above')
        .slice(0, 3) || []

      // Prepare comprehensive PDF data
      const pdfData = {
        companyName: companyProfile.displayName,
        industry: companyProfile.industry,
        size: companyProfile.size,
        
        assessment: {
          date: new Date().toLocaleDateString(),
          respondents: sentimentData.length,
          readinessScore,
          sentimentAverage: Number(sentimentScore).toFixed(1),
          capabilityMaturity: Number(capabilityScore).toFixed(1)
        },
        
        sentimentData: sentimentAnalysis ? {
          stats: {
            overallAverage: sentimentAnalysis.stats.overallAverage,
            totalRespondents: sentimentAnalysis.stats.totalRespondents,
            cellsAnalyzed: sentimentAnalysis.cells.filter(c => c.count > 0).length
          },
          lowestCells: lowestCells,
          allCells: sentimentAnalysis.cells
        } : undefined,
        
        capabilityData: capabilityAnalysis ? {
          overall: {
            average: capabilityAnalysis.overall.average,
            max: capabilityAnalysis.overall.highest?.average || 0,
            min: capabilityAnalysis.overall.lowest?.average || 0
          },
          dimensions: capabilityAnalysis.dimensions,
          weakestDimensions: weakDimensions,
          strongestDimensions: strongDimensions
        } : undefined,
        
        interventions: [
          // Include smart interventions based on gaps
          ...generateSmartInterventions(weakDimensions, lowestCells)
        ],
        
        taboos: {
          highlighted: lowestCells.slice(0, 6).map((cell, idx) => ({
            code: `T${idx + 1}`,
            name: `${cell.levelName} × ${cell.categoryName}`,
            description: `This taboo manifests as ${cell.levelName.toLowerCase()} sentiment when AI is perceived as ${cell.categoryName.toLowerCase()}. It affects ${cell.count} employees.`,
            severity: cell.score < 2.5 ? 'critical' : cell.score < 3.0 ? 'high' : 'medium',
            affected: cell.count
          }))
        },
        
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        
        elementIds: {
          heatmap: 'sentiment-heatmap',
          radarChart: 'capability-radar',
          dashboard: 'executive-dashboard'
        }
      }

      await generateCompletePDF(pdfData)
      
      toast.dismiss()
      toast.success('📄 Complete PDF report downloaded successfully!')
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.dismiss()
      toast.error('Failed to generate PDF report. Please try again.')
    }
  }

  // Generate smart interventions based on actual gaps
  const generateSmartInterventions = (weakDims: any[], lowCells: any[]): any[] => {
    const interventions: any[] = []
    
    // From weak capability dimensions
    if (weakDims.length > 0) {
      const topWeak = weakDims[0]
      interventions.push({
        title: `Strengthen ${topWeak.name}`,
        description: `Targeted program to improve ${topWeak.name.toLowerCase()} from current ${topWeak.average.toFixed(1)} to industry benchmark ${topWeak.benchmark.toFixed(1)}. Focus on the key constructs.`,
        investmentRange: '$100K-$250K',
        expectedROI: '35-45%',
        timeline: '12-16 weeks',
        impact: 'high',
        effort: 'medium'
      })
    }
    
    // From sentiment gaps
    if (lowCells.length > 0) {
      const topLow = lowCells[0]
      interventions.push({
        title: `Address ${topLow.levelName} Concerns about ${topLow.categoryName}`,
        description: `Intervention to address ${topLow.levelName.toLowerCase()} sentiment when employees perceive AI as ${topLow.categoryName.toLowerCase()}. Affects ${topLow.count} employees with score of ${topLow.score.toFixed(2)}.`,
        investmentRange: '$75K-$150K',
        expectedROI: '25-40%',
        timeline: '8-10 weeks',
        impact: 'high',
        effort: 'low'
      })
    }
    
    // Add strategic interventions
    interventions.push(
      {
        title: 'AI Transparency & Trust Program',
        description: 'Implement clear communication protocols, explainable AI practices, and regular town halls to build trust and reduce opacity concerns.',
        investmentRange: '$150K-$300K',
        expectedROI: '30-50%',
        timeline: '12 weeks',
        impact: 'high',
        effort: 'medium'
      },
      {
        title: 'Human-in-the-Loop Design Framework',
        description: 'Balance AI automation with human oversight to address autonomy concerns while maintaining efficiency gains.',
        investmentRange: '$80K-$200K',
        expectedROI: '25-35%',
        timeline: '8 weeks',
        impact: 'medium',
        effort: 'low'
      },
      {
        title: 'AI Skills Development Program',
        description: 'Comprehensive training program addressing competence anxiety and building practical AI literacy across all levels.',
        investmentRange: '$120K-$280K',
        expectedROI: '40-60%',
        timeline: '16 weeks',
        impact: 'high',
        effort: 'high'
      }
    )
    
    return interventions.slice(0, 6)
  }

  // Keyboard navigation with achievement tracking
  useKeyboardNavigation({
    onCommandPalette: () => {
      setShowCommandPalette(true)
      setKeyboardShortcutCount(prev => {
        const newCount = prev + 1
        if (newCount === 1) {
          unlock('power-user')
        }
        return newCount
      })
    },
    onToggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),
    onToggleFilters: () => setShowFilters(!showFilters),
    onExport: handleExportPDF,
    onHelp: () => setShowKeyboardHelp(true),
    onNavigate: (view) => {
      setActiveView(view as NavigationView)
      if (view === 'overview') setCurrentView({ type: 'overview' })
      else if (view === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
      else if (view === 'capability') setCurrentView({ type: 'capability_overview' })
      else if (view === 'interventions') setCurrentView({ type: 'overview' })

      // Track keyboard navigation
      setKeyboardShortcutCount(prev => {
        const newCount = prev + 1
        if (newCount >= 5) {
          unlock('speed-demon')
        }
        return newCount
      })
    }
  })

  // Fun interactions
  useFunInteractions({
    onKonamiCode: () => {
      toast.success('🎮 Konami Code! You found our secret! Here\'s some confetti! 🎉')
      unlock('secret-finder')
    },
    onTripleClick: () => {
      toast('👆 Someone\'s clicking enthusiastically! We like your energy!')
    }
  })

  // Track section visits for explorer achievement
  useEffect(() => {
    setVisitedSections(prev => {
      const newSet = new Set(prev)
      if (!newSet.has(activeView)) {
        newSet.add(activeView)
        
        if (newSet.size >= 5) {
          unlock('explorer')
        }
        
        return newSet
      }
      return prev // Don't update if already visited
    })
  }, [activeView, unlock])

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'export':
        handleExportPDF()
        toast.success('Exporting PDF report...')
        break
      case 'refresh':
        loadData()
        toast.success('Refreshing data...')
        break
      case 'toggle-filters':
        setShowFilters(!showFilters)
        break
      case 'help':
        setShowKeyboardHelp(true)
        break
    }
  }

  const loadData = async (wave?: string, isPhaseSwitch = false) => {
    if (!company?.id) {
      setIsLoading(false)
      return
    }

    // Use different loading state for phase switches vs initial load
    if (isPhaseSwitch) {
      setIsLoadingPhase(true)
    } else {
      setIsLoading(true)
    }
    try {
      // Build query params for temporal filtering
      const queryParams = wave ? `?survey_wave=${encodeURIComponent(wave)}` : ''

      // Load sentiment data
      const sentimentResponse = await fetch(`/api/data/respondents${queryParams}`, {
        headers: {
          'x-company-id': company.id
        }
      })

      if (!sentimentResponse.ok) throw new Error('Failed to load sentiment data')

      const sentimentResult = await sentimentResponse.json()
      setSentimentData(sentimentResult.data)

      // Load capability data from API
      const capabilityResponse = await fetch(`/api/data/capability${queryParams}`, {
        headers: {
          'x-company-id': company.id
        }
      })

      if (capabilityResponse.ok) {
        const capabilityResult = await capabilityResponse.json()
        setCapabilityData(capabilityResult.data)
      } else {
        console.warn('Failed to load capability data, using empty array')
        setCapabilityData([])
      }

      // Always load baseline data for delta comparison (if not already baseline)
      if (wave !== 'oct-2024-baseline') {
        const baselineQueryParams = '?survey_wave=oct-2024-baseline'

        const baselineSentimentResponse = await fetch(`/api/data/respondents${baselineQueryParams}`, {
          headers: {
            'x-company-id': company.id
          }
        })

        if (baselineSentimentResponse.ok) {
          const baselineSentimentResult = await baselineSentimentResponse.json()
          setBaselineSentimentData(baselineSentimentResult.data)
        }

        const baselineCapabilityResponse = await fetch(`/api/data/capability${baselineQueryParams}`, {
          headers: {
            'x-company-id': company.id
          }
        })

        if (baselineCapabilityResponse.ok) {
          const baselineCapabilityResult = await baselineCapabilityResponse.json()
          setBaselineCapabilityData(baselineCapabilityResult.data)
        }
      } else {
        // Clear baseline data if we're viewing baseline itself
        setBaselineSentimentData([])
        setBaselineCapabilityData([])
      }

      // Load open-ended responses for NLP analysis
      const openEndedResponse = await fetch(`/api/data/open-ended${queryParams}`, {
        headers: {
          'x-company-id': company.id
        }
      })

      if (openEndedResponse.ok) {
        const openEndedResult = await openEndedResponse.json()
        setOpenEndedResponses(openEndedResult.allResponses || [])
      } else {
        console.warn('Failed to load open-ended responses, using empty array')
        setOpenEndedResponses([])
      }
    } catch (error) {
      console.error('Data load error:', error)
      toast.error('Failed to load data')
    } finally {
      if (isPhaseSwitch) {
        setIsLoadingPhase(false)
        // Show success toast for phase switches
        const phaseName = wave === 'oct-2024-baseline' ? 'Baseline (Oct 2024)'
          : wave === 'mar-2025-phase2' ? 'Phase 2 (Mar 2025)'
          : 'Phase 3 (Nov 2025)'
        toast.success(`Switched to ${phaseName}`, {
          icon: wave === 'oct-2024-baseline' ? '📊' : wave === 'mar-2025-phase2' ? '🚀' : '✨',
          duration: 2000
        })
      } else {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center overflow-hidden"
      >
        {/* Simplified gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent dark:from-teal-900/10" />
        </div>
        
        {/* Loading content */}
        <div className="relative z-10 text-center px-4">
          {/* Simplified animated logo */}
          <motion.div
            className="relative mb-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Loading Your Assessment
          </motion.h2>
          
          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Preparing your insights...
          </motion.p>

          {/* Simple progress dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-teal-500"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  // Simplified Navigation - More Intuitive Structure
  const navigationSections = [
    {
      title: 'Overview',
      items: [
        { 
          id: 'overview' as NavigationView, 
          icon: BarChart3, 
          label: 'Dashboard', 
          description: 'Overview',
          tooltip: 'Your AI readiness at a glance - see high-level insights and key metrics.'
        },
      ]
    },
    {
      title: 'Assessment',
      items: [
        { 
          id: 'sentiment' as NavigationView, 
          icon: Users, 
          label: 'Sentiment', 
          description: 'Employee attitudes',
          tooltip: 'Analyze employee sentiment across 25 dimensions to identify engagement patterns.'
        },
        {
          id: 'capability' as NavigationView,
          icon: Target,
          label: 'Capability',
          description: 'Organizational readiness',
          tooltip: 'Assess organizational AI capabilities across 8 strategic dimensions.'
        },
      ]
    },
    {
      title: 'Solutions',
      items: [
        {
          id: 'recommendations' as NavigationView,
          icon: Brain,
          label: 'Impact Analysis',
          description: 'Intervention results',
          tooltip: 'See which interventions were applied and their measured impact on your organization.'
        },
        {
          id: 'interventions' as NavigationView,
          icon: Lightbulb,
          label: 'Interventions',
          description: 'Action plans',
          tooltip: 'Explore proven interventions to improve your AI readiness.'
        },
      ]
    },
    {
      title: 'Tools',
      items: [
        { 
          id: 'ai-agent' as NavigationView, 
          icon: Sparkles, 
          label: 'AI Assistant', 
          description: 'Insights & Analysis',
          tooltip: 'AI-powered analysis and recommendations based on your assessment data'
        },
        { 
          id: 'reports' as NavigationView, 
          icon: FileText, 
          label: 'Reports', 
          description: 'Export & share',
          tooltip: 'Generate and export comprehensive reports for stakeholders.'
        },
      ]
    }
  ]

  // Flatten for easy lookup
  const navigationItems = navigationSections.flatMap(section => section.items)

  return (
    <div className="fixed inset-0 bg-white dark:bg-black overflow-hidden">
      {/* Light mode optimized gradient background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-purple-50 dark:from-slate-950 dark:via-black dark:to-slate-950" />
        
        {/* Radial overlays - subtle and refined */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-transparent dark:from-teal-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent dark:from-purple-900/20" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Clean floating orbs - fewer and more subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                left: `${20 + i * 30}%`,
                top: `${10 + i * 25}%`,
                background: i === 0 
                  ? 'radial-gradient(circle, rgba(20, 184, 166, 0.08), transparent 70%)'
                  : i === 1
                  ? 'radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent 70%)'
                  : 'radial-gradient(circle, rgba(236, 72, 153, 0.08), transparent 70%)',
                filter: 'blur(60px)',
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 15 + i * 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Layout - No Scroll Command Center */}
      <div className="relative z-10 h-full flex">
        
        {/* Navigation Sidebar - Light mode optimized */}
        <motion.aside
          className="relative flex flex-col bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-gray-200 dark:border-white/[0.08] shadow-sm hidden md:flex"
          initial={false}
          animate={{ width: sidebarCollapsed ? 64 : 240 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Logo & Company - Brand colored */}
          <div className={cn(
            "h-14 border-b border-gray-200 dark:border-white/[0.08] flex items-center px-4 bg-gradient-to-r from-teal-50/50 to-transparent dark:from-teal-950/20",
            sidebarCollapsed && "justify-center"
          )}>
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-purple-400 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity" />
                <img 
                  src="/LeadingwithAI-removebg-preview.png" 
                  alt="AI Navigator" 
                  className={cn("relative object-contain flex-shrink-0", sidebarCollapsed ? "w-8 h-8" : "w-10 h-10")}
                />
              </motion.div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-bold truncate bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                    {companyProfile.displayName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 truncate font-medium">{companyProfile.industry}</p>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation Items - Organized by Section */}
          <nav className={cn("flex-1 overflow-y-auto scrollbar-thin", sidebarCollapsed ? "p-2" : "p-3")}>
            {navigationSections.map((section, sectionIndex) => (
              <div key={section.title} className={cn(sectionIndex > 0 && "mt-6")}>
                {/* Section Header - Brand colored */}
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                    className="px-3 mb-2"
                  >
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-600">
                      {section.title}
                    </h3>
                  </motion.div>
                )}
                {sidebarCollapsed && sectionIndex > 0 && (
                  <div className="h-px bg-gray-200 dark:bg-white/[0.06] my-3 mx-2" />
                )}
                
                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id
                    const globalIndex = navigationItems.findIndex(navItem => navItem.id === item.id)
                    
                    const button = (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          setActiveView(item.id)
                          // Reset to default view for each section
                          if (item.id === 'overview') setCurrentView({ type: 'overview' })
                          else if (item.id === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
                          else if (item.id === 'capability') setCurrentView({ type: 'capability_overview' })
                          // AI Agent and other sections don't need a currentView, handled by activeView
                        }}
                        className={cn(
                          "relative w-full flex items-center rounded-xl transition-all group",
                          sidebarCollapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5 gap-3',
                          isActive
                            ? 'bg-gradient-to-r from-teal-50 to-purple-50/30 dark:from-teal-500/10 dark:to-teal-500/5 text-teal-700 dark:text-teal-400 shadow-md ring-2 ring-teal-200 dark:ring-teal-500/30'
                            : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                        )}
                        aria-label={item.label}
                        aria-current={isActive ? 'page' : undefined}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                        whileHover={{ x: sidebarCollapsed ? 0 : 3, scale: sidebarCollapsed ? 1.05 : 1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Active indicator - properly positioned */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 rounded-r-full shadow-lg shadow-teal-500/30"
                            layoutId="activeNav"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}

                        <div className={cn(
                          "flex-shrink-0 flex items-center justify-center rounded-lg transition-all",
                          sidebarCollapsed ? "w-8 h-8" : "w-9 h-9",
                          isActive && "bg-gradient-to-br from-teal-100 to-purple-100 dark:from-teal-500/20 dark:to-purple-500/20 ring-2 ring-white dark:ring-white/10 shadow-sm"
                        )}>
                          <Icon className={cn(
                            "transition-all",
                            sidebarCollapsed ? "w-4.5 h-4.5" : "w-4.5 h-4.5",
                            isActive && "scale-110 text-teal-600 dark:text-teal-400"
                          )} />
                        </div>
                        
                        {!sidebarCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 text-left min-w-0"
                          >
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className={cn(
                                "text-[13px] font-semibold truncate",
                                isActive && "text-teal-700 dark:text-teal-400"
                              )}>
                                {item.label}
                              </p>
                              {!isActive && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono flex-shrink-0 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-600">
                                  {globalIndex + 1}
                                </span>
                              )}
                            </div>
                            <p className={cn(
                              "text-[10px] truncate font-medium",
                              isActive 
                                ? "text-teal-600 dark:text-teal-400/70"
                                : "text-gray-500 dark:text-gray-500"
                            )}>
                              {item.description}
                            </p>
                          </motion.div>
                        )}
                        
                        {isActive && !sidebarCollapsed && (
                          <motion.div
                            initial={{ x: -5, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                          </motion.div>
                        )}
                      </motion.button>
                    )

                    return sidebarCollapsed ? (
                      <EnhancedTooltip
                        key={item.id}
                        content={item.tooltip}
                        title={item.label}
                        icon="info"
                        position="right"
                      >
                        {button}
                      </EnhancedTooltip>
                    ) : button
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Actions - Brand styled */}
          <div className={cn(
            "border-t border-gray-200 dark:border-white/[0.08] bg-gradient-to-r from-teal-50/30 to-transparent dark:from-teal-950/10",
            sidebarCollapsed ? "p-2" : "p-3"
          )}>
            {sidebarCollapsed ? (
              <EnhancedTooltip
                content="Expand sidebar to see full navigation menu"
                title="Expand (⌘ B)"
                icon="tip"
                position="right"
              >
                <motion.button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-full flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-br from-teal-50 to-purple-50 dark:from-white/5 dark:to-white/5 hover:from-teal-100 hover:to-purple-100 dark:hover:from-teal-500/10 dark:hover:to-purple-500/10 text-teal-700 dark:text-gray-400 hover:text-teal-800 dark:hover:text-teal-400 transition-all group shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Expand sidebar"
                >
                  <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </motion.button>
              </EnhancedTooltip>
            ) : (
              <motion.button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/5 hover:from-teal-50 hover:to-purple-50 dark:hover:from-teal-500/10 dark:hover:to-purple-500/10 text-gray-700 dark:text-gray-400 hover:text-teal-700 dark:hover:text-teal-400 transition-all group shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Collapse sidebar"
              >
                <div className="flex items-center gap-2">
                  <Minimize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Collapse</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 ring-1 ring-gray-200 dark:ring-white/20 text-[10px] text-gray-600 dark:text-gray-500 font-mono">⌘ B</kbd>
              </motion.button>
            )}
          </div>
        </motion.aside>

        {/* Main Content Area - Fixed Height, No Scroll */}
        <div className="flex-1 flex flex-col h-full overflow-hidden pb-20 md:pb-0">
          
          {/* Top Action Bar - Solid, always on top */}
          <motion.div 
            className="relative flex-shrink-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/[0.12] px-4 md:px-6 flex items-center justify-between gap-4 shadow-md z-50"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {/* Left: Breadcrumbs & Current View */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-sm">
                <Link 
                  href="/"
                  className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
                >
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-900 dark:text-white font-semibold">
                  {navigationItems.find(item => item.id === activeView)?.label || 'Dashboard'}
                </span>
              </div>

              <div className="hidden lg:block h-5 w-px bg-gray-300 dark:bg-white/10" />
              
              {/* Current View Icon */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Stats Badges */}
                <EnhancedTooltip
                  content="Total respondents in your assessment"
                  icon="info"
                  position="bottom"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 cursor-help border border-gray-200 dark:border-white/10">
                    <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-[12px] font-bold text-gray-900 dark:text-gray-400">
                      {sentimentData.length}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-600">responses</span>
                  </div>
                </EnhancedTooltip>
                
                {/* Assessment Period Selector - Enhanced */}
                <motion.div
                  className="relative"
                  animate={isLoadingPhase ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <select
                    value={selectedWave || 'oct-2024-baseline'}
                    onChange={(e) => setSelectedWave(e.target.value)}
                    disabled={isLoadingPhase}
                    className={cn(
                      "px-4 py-2 pr-10 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer",
                      isLoadingPhase
                        ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-wait opacity-60 animate-pulse"
                        : "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-300 dark:border-blue-600 text-blue-900 dark:text-blue-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md"
                    )}
                  >
                    <option value="oct-2024-baseline">📊 Baseline (Oct 2024)</option>
                    <option value="mar-2025-phase2">🚀 Phase 2 (Mar 2025)</option>
                    <option value="nov-2025-phase3">✨ Phase 3 (Nov 2025)</option>
                  </select>
                  {isLoadingPhase && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </motion.div>

                <EnhancedTooltip
                  content="Data is synced and up-to-date"
                  icon="sparkle"
                  position="bottom"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 cursor-help border border-emerald-200 dark:border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Live</span>
                  </div>
                </EnhancedTooltip>
              </div>
            </div>

            {/* Right: Actions & Tools */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search - Compact */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setShowCommandPalette(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-md hover:shadow-lg border border-slate-200 dark:border-white/20 transition-all group relative z-50"
                  aria-label="Open command palette"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-gray-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors" />
                  <span className="text-[11px] text-slate-600 dark:text-gray-300">Search</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[9px] text-slate-600 dark:text-gray-300 font-mono border border-slate-200 dark:border-white/10">⌘K</kbd>
                </button>
              </div>

              <div className="hidden lg:block w-px h-6 bg-slate-300 dark:bg-white/10" />

              {/* Filter button - only show on sentiment/capability views */}
              {(activeView === 'sentiment' || activeView === 'capability') && (
                <>
                  <EnhancedTooltip
                    content="Filter data by demographics and segments"
                    title="Filters"
                    icon="tip"
                    position="bottom"
                  >
                    <motion.button
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow-md",
                        showFilters
                          ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 ring-2 ring-teal-200 dark:ring-teal-500/30"
                          : "bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-gray-400 ring-1 ring-slate-200/50 dark:ring-white/5"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label="Toggle filters"
                      aria-pressed={showFilters}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      {Object.keys(filters).length > 0 && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                          showFilters 
                            ? "bg-teal-500 text-white"
                            : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-400"
                        )}>
                          {Object.keys(filters).length}
                        </span>
                      )}
                    </motion.button>
                  </EnhancedTooltip>
                  
                  <div className="w-px h-6 bg-slate-300 dark:bg-white/10" />
                </>
              )}
              
              {/* Import Snapshot */}
              <EnhancedTooltip
                content="Import new assessment snapshot"
                icon="tip"
                position="bottom"
              >
                <motion.button
                  onClick={() => setShowImportDialog(true)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all flex items-center gap-1.5 text-slate-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-300 shadow-md hover:shadow-lg border border-slate-200 dark:border-white/20 relative z-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Import new snapshot"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px] font-medium">Import</span>
                </motion.button>
              </EnhancedTooltip>

              {/* Export */}
              <EnhancedTooltip
                content="Export comprehensive PDF report"
                icon="tip"
                position="bottom"
              >
                <motion.button
                  onClick={handleExportPDF}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-500/20 transition-all flex items-center gap-1.5 text-slate-700 dark:text-gray-200 hover:text-teal-700 dark:hover:text-teal-300 shadow-md hover:shadow-lg border border-slate-200 dark:border-white/20 relative z-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Export PDF report"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px] font-medium">Export</span>
                </motion.button>
              </EnhancedTooltip>

              <div className="w-px h-6 bg-slate-300 dark:bg-white/10" />

              {/* Theme Toggle */}
              <EnhancedTooltip
                content="Switch theme"
                position="bottom"
              >
                <SimpleThemeToggle />
              </EnhancedTooltip>

              {/* Help */}
              <ContextualHelp
                title="Need Help?"
                description="Learn how to navigate your AI readiness assessment and get the most from your insights."
                articles={[
                  {
                    title: 'Understanding Your Dashboard',
                    description: 'Navigate the command center and key metrics',
                    link: '#'
                  },
                  {
                    title: 'Using Filters Effectively',
                    description: 'Segment your data for deeper insights',
                    link: '#'
                  },
                  {
                    title: 'Interpreting Benchmarks',
                    description: 'Compare against industry standards',
                    link: '#'
                  },
                  {
                    title: 'Exporting Reports',
                    description: 'Share insights with stakeholders',
                    link: '#'
                  }
                ]}
              />
            </div>
          </motion.div>

          {/* Content Viewport - NO SCROLL */}
          <div className="flex-1 relative overflow-hidden">
            {/* Filter Panel Overlay */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="absolute top-0 right-0 w-80 h-full bg-white/98 dark:bg-black/60 backdrop-blur-2xl border-l border-slate-200/60 dark:border-white/[0.08] z-50 overflow-y-auto scrollbar-thin"
                  initial={{ x: 320 }}
                  animate={{ x: 0 }}
                  exit={{ x: 320 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  <FilterPanel
                    sentimentData={sentimentData}
                    capabilityData={capabilityData}
                    filters={filters}
                    onFiltersChange={setFilters}
                    selectedWave={selectedWave}
                    onWaveChange={setSelectedWave}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content - Fills viewport perfectly */}
            <motion.div
              className="h-full p-4"
              key={`content-${selectedWave}`}
              initial={{ opacity: 0.7, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {/* OVERVIEW */}
                {activeView === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ExecutiveDashboard
                      companyName={companyProfile.displayName}
                      userName={session?.user?.fullName?.split(' ')[0] || 'Sarah'}
                      sentimentData={sentimentData}
                      capabilityData={capabilityData}
                      benchmarks={benchmarks}
                      selectedWave={selectedWave}
                      baselineSentimentData={baselineSentimentData}
                      baselineCapabilityData={baselineCapabilityData}
                      onNavigate={(view) => {
                        if (view === 'sentiment') {
                          setActiveView('sentiment')
                          setCurrentView({ type: 'sentiment_heatmap' })
                        } else {
                          setActiveView('capability')
                          setCurrentView({ type: 'capability_overview' })
                        }
                      }}
                    />
                  </motion.div>
                )}

                {/* SENTIMENT FLOW */}
                {activeView === 'sentiment' && (
                  <AnimatePresence mode="wait">
                    {/* Sentiment Heatmap */}
                    {(currentView.type === 'sentiment_heatmap' || currentView.type === 'overview') && (
                      <motion.div
                        key="sentiment-heatmap"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <SentimentHeatmapRevised
                          data={sentimentData}
                          filters={filters}
                          onAnalyzeProblemAreas={(lowestCells) =>
                            setCurrentView({ type: 'sentiment_problem_categories', lowestCells })
                          }
                          baselineData={baselineSentimentData}
                          showDelta={selectedWave !== 'oct-2024-baseline' && baselineSentimentData.length > 0}
                        />
                      </motion.div>
                    )}

                    {/* Problem Categories */}
                    {currentView.type === 'sentiment_problem_categories' && (
                      <motion.div
                        key="problem-categories"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <ProblemCategoriesView
                          lowestCells={currentView.lowestCells || []}
                          companyContext={companyProfile}
                          filters={filters}
                          onBack={() => setCurrentView({ type: 'sentiment_heatmap' })}
                          onViewInterventions={(category) =>
                            setCurrentView({ type: 'sentiment_interventions', problemCategory: category })
                          }
                        />
                      </motion.div>
                    )}

                    {/* Interventions */}
                    {currentView.type === 'sentiment_interventions' && (
                      <motion.div
                        key="interventions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <InterventionsView
                          problemCategory={currentView.problemCategory!}
                          companyContext={companyProfile}
                          onBack={() => setCurrentView({ type: 'sentiment_problem_categories', lowestCells: [] })}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* CAPABILITY FLOW */}
                {activeView === 'capability' && (
                  <AnimatePresence mode="wait">
                    {/* Capability Overview */}
                    {(currentView.type === 'capability_overview' || currentView.type === 'overview') && (
                      <motion.div
                        key="capability-overview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <CapabilityAnalysisPro
                          data={capabilityData}
                          benchmarks={benchmarks}
                          filters={filters}
                          onDimensionClick={(dimensionId) =>
                            setCurrentView({ type: 'capability_dimension', dimensionId })
                          }
                          onViewSummary={() => setCurrentView({ type: 'capability_summary' })}
                          onAnalyzeWeakDimensions={(weakDimensions) =>
                            setCurrentView({ type: 'capability_insights', weakDimensions })
                          }
                          baselineData={baselineCapabilityData}
                          showDelta={selectedWave !== 'oct-2024-baseline' && baselineCapabilityData.length > 0}
                          phase2Data={phase2CapabilityData}
                          currentPhase={
                            selectedWave === 'oct-2024-baseline' ? 'baseline' :
                            selectedWave === 'mar-2025-phase2' ? 'phase2' :
                            'phase3'
                          }
                        />
                      </motion.div>
                    )}

                    {/* Dimension Drilldown */}
                    {currentView.type === 'capability_dimension' && currentView.dimensionId && (
                      <motion.div
                        key="dimension-drilldown"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <DimensionDrilldown
                          dimensionId={currentView.dimensionId}
                          data={capabilityData}
                          benchmark={benchmarks[currentView.dimensionId] || 5.0}
                          filters={filters}
                          onBack={() => setCurrentView({ type: 'capability_overview' })}
                        />
                      </motion.div>
                    )}

                    {/* Open-Ended Summary */}
                    {currentView.type === 'capability_summary' && (
                      <motion.div
                        key="open-ended-summary"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <OpenEndedSummary
                          openEndedResponses={openEndedResponses}
                          companyContext={companyProfile}
                          onBack={() => setCurrentView({ type: 'capability_overview' })}
                        />
                      </motion.div>
                    )}

                    {/* Capability AI Insights */}
                    {currentView.type === 'capability_insights' && currentView.weakDimensions && (
                      <motion.div
                        key="capability-insights"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <CapabilityInsightsView
                          weakDimensions={currentView.weakDimensions}
                          companyContext={companyProfile}
                          filters={filters}
                          onBack={() => setCurrentView({ type: 'capability_overview' })}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* INTERVENTIONS */}
                {activeView === 'interventions' && (
                  <motion.div
                    key="interventions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <InterventionsBrowsePage />
                  </motion.div>
                )}

                {/* IMPACT ANALYSIS (formerly RECOMMENDATIONS) */}
                {activeView === 'recommendations' && (
                  <motion.div
                    key="impact-analysis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full overflow-y-auto scrollbar-thin"
                  >
                    {selectedWave === 'oct-2024-baseline' ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center max-w-md p-8">
                          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            No Impact Data for Baseline
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Switch to Phase 2 or Phase 3 to see intervention impact analysis.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <InterventionImpactReport
                        baselineData={baselineSentimentData}
                        phase2Data={phase2SentimentData}
                        phase3Data={phase3SentimentData}
                        baselineCapability={baselineCapabilityData}
                        phase2Capability={phase2CapabilityData}
                        phase3Capability={phase3CapabilityData}
                        selectedPhase={selectedWave === 'nov-2025-phase3' ? 'phase3' : 'phase2'}
                      />
                    )}
                  </motion.div>
                )}

                {/* REPORTS */}
                {activeView === 'reports' && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ReportsView
                      companyName={companyProfile.displayName}
                      onExportPDF={handleExportPDF}
                    />
                  </motion.div>
                )}

                {/* AI AGENT */}
                {activeView === 'ai-agent' && (
                  <motion.div
                    key="ai-agent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <AIAgentView
                      sentimentData={sentimentData}
                      capabilityData={capabilityData}
                      filters={filters}
                      setFilters={setFilters}
                      companyName={companyProfile.displayName}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(view) => {
          setActiveView(view as NavigationView)
          if (view === 'overview') setCurrentView({ type: 'overview' })
          else if (view === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
          else if (view === 'capability') setCurrentView({ type: 'capability_overview' })
        }}
        onAction={handleQuickAction}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />

      {/* Data Comparison Mode */}
      <DataComparisonMode
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onCompare={(config) => {
          console.log('Comparison config:', config)
          toast.success('Comparison mode activated!')
        }}
      />

      {/* Import Snapshot Dialog */}
      <ImportSnapshotDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onSuccess={() => {
          toast.success('Snapshot imported successfully!')
          loadData()
        }}
      />

      {/* Onboarding Hint */}
      {showOnboarding && (
        <OnboardingHint
          id="assessment-welcome"
          title="Welcome to Your AI Readiness Assessment! 🎉"
          description="Navigate through different views using the sidebar. Press ⌘K for quick search, or hover over any element for helpful tips. Use keyboard shortcuts (1-5) for instant navigation!"
          onDismiss={() => {
            setShowOnboarding(false)
            localStorage.setItem('assessment-onboarding-seen', 'true')
          }}
          autoShow={false}
        />
      )}

      {/* Achievements */}
      <EasterEggAchievement
        achievementId={achievementToShow}
        onDismiss={dismiss}
      />

      {/* Mobile Bottom Navigation - Refined */}
      <motion.nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 dark:bg-black/98 backdrop-blur-2xl border-t border-slate-200/60 dark:border-white/[0.08] safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="grid grid-cols-7 gap-0 max-w-screen overflow-x-auto scrollbar-hide">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id)
                  if (item.id === 'overview') setCurrentView({ type: 'overview' })
                  else if (item.id === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
                  else if (item.id === 'capability') setCurrentView({ type: 'capability_overview' })
                  else if (item.id === 'interventions') setCurrentView({ type: 'overview' })
                  else if (item.id === 'recommendations') setCurrentView({ type: 'recommendations_combined' })
                  else if (item.id === 'reports') setCurrentView({ type: 'recommendations_combined' })
                  else if (item.id === 'ai-agent') setCurrentView({ type: 'overview' })
                }}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 px-1 min-h-[68px] transition-all relative",
                  isActive
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-slate-600 dark:text-gray-400"
                )}
                whileTap={{ scale: 0.92 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Active indicator - top border */}
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-purple-500 rounded-b-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Icon with background on active */}
                <motion.div
                  className={cn(
                    "relative mb-1 rounded-xl transition-all",
                    isActive && "bg-teal-50 dark:bg-teal-500/10 p-1.5"
                  )}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "drop-shadow-lg"
                  )} />
                  
                  {/* Pulse indicator for active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-teal-400/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
                
                <span className={cn(
                  "text-[9px] font-medium leading-tight text-center max-w-[60px]",
                  isActive && "font-bold"
                )}>
                  {item.label === 'Command Center' ? 'Dashboard' : item.label}
                </span>
                
                {/* Badge with keyboard shortcut on active */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center"
                  >
                    <span className="text-[8px] font-bold text-white">{index + 1}</span>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.nav>
    </div>
  )
}
