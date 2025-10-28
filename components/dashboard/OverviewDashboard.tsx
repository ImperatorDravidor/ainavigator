'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Target, Sparkles, ArrowRight, AlertCircle, CheckCircle, Zap, Brain, BarChart } from 'lucide-react'
import { useMemo } from 'react'
import { MotionWrapper, staggerContainer, fadeInUp } from '@/components/ui/motion-wrapper'
import { Card } from '@/components/ui/Card'

interface OverviewDashboardProps {
  companyName: string
  userName: string
  sentimentData: any[]
  capabilityData: any[]
  onNavigate: (view: 'sentiment' | 'capability') => void
}

export default function OverviewDashboard({
  companyName,
  userName,
  sentimentData,
  capabilityData,
  onNavigate
}: OverviewDashboardProps) {

  // Calculate key metrics
  const metrics = useMemo(() => {
    // Sentiment average (1-5 scale)
    const sentimentScores = sentimentData.flatMap(r =>
      Array.from({ length: 25 }, (_, i) => r[`Sentiment_${i + 1}`])
    ).filter(s => typeof s === 'number' && !isNaN(s))

    const sentimentAvg = sentimentScores.length > 0
      ? sentimentScores.reduce((sum, s) => sum + s, 0) / sentimentScores.length
      : 0

    // Capability average (would come from actual data)
    const capabilityAvg = 4.1 // TODO: Calculate from real capability data

    // Overall readiness (weighted combination)
    const readiness = Math.round(((sentimentAvg / 5) * 0.4 + (capabilityAvg / 7) * 0.6) * 100)

    // Identify key concerns
    const lowScores = sentimentScores.filter(s => s < 2.0).length
    const concernLevel = lowScores > sentimentScores.length * 0.2 ? 'high' :
                        lowScores > sentimentScores.length * 0.1 ? 'medium' : 'low'

    return {
      respondentCount: sentimentData.length,
      sentimentAvg: sentimentAvg.toFixed(1),
      capabilityAvg: capabilityAvg.toFixed(1),
      readinessScore: readiness,
      concernLevel,
      lowScoreCount: lowScores
    }
  }, [sentimentData, capabilityData])

  const getReadinessColor = (score: number) => {
    if (score >= 75) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getReadinessMessage = (score: number) => {
    if (score >= 75) return 'Strong AI readiness with clear momentum'
    if (score >= 60) return 'Moderate readiness with room for improvement'
    return 'Significant opportunity for AI readiness growth'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <motion.div 
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-teal-400" />
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            Welcome back, {userName}!
          </motion.h1>
        </motion.div>
        <motion.p 
          className="text-xl text-gray-300 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your AI Readiness Assessment for <span className="text-teal-400 font-semibold animate-pulse">{companyName}</span> is ready
        </motion.p>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Based on insights from <motion.span 
            className="font-semibold text-white"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >{metrics.respondentCount} employees</motion.span> across your organization
        </motion.p>
      </motion.div>

      {/* Key Metrics Cards */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Overall Readiness */}
        <motion.div 
          className="glass-dark rounded-2xl p-8 border border-teal-500/20 hover:border-teal-400/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] cursor-pointer group"
          variants={fadeInUp}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}>
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Target className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition-colors" />
            </motion.div>
            <h3 className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">Overall AI Readiness</h3>
          </div>
          <motion.div 
            className={`text-5xl font-bold mb-2 ${getReadinessColor(metrics.readinessScore)}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            {metrics.readinessScore}%
          </motion.div>
          <p className="text-sm text-gray-400">
            {getReadinessMessage(metrics.readinessScore)}
          </p>
        </motion.div>

        {/* Sentiment Average */}
        <motion.div 
          className="glass-dark rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(167,79,139,0.2)] cursor-pointer group"
          variants={fadeInUp}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}>
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </motion.div>
            <h3 className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">Employee Sentiment</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <motion.div 
              className="text-5xl font-bold text-purple-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4 }}
            >
              {metrics.sentimentAvg}
            </motion.div>
            <div className="text-xl text-gray-500">/5.0</div>
          </div>
          <p className="text-sm text-gray-400">
            {parseFloat(metrics.sentimentAvg) >= 3.5 ? 'Positive outlook on AI adoption' :
             parseFloat(metrics.sentimentAvg) >= 2.5 ? 'Mixed feelings about AI transformation' :
             'Notable concerns about AI integration'}
          </p>
        </motion.div>

        {/* Capability Maturity */}
        <motion.div 
          className="glass-dark rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(83,128,179,0.2)] cursor-pointer group"
          variants={fadeInUp}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}>
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </motion.div>
            <h3 className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">Capability Maturity</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <motion.div 
              className="text-5xl font-bold text-blue-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
            >
              {metrics.capabilityAvg}
            </motion.div>
            <div className="text-xl text-gray-500">/7.0</div>
          </div>
          <p className="text-sm text-gray-400">
            {parseFloat(metrics.capabilityAvg) >= 5.5 ? 'Strong organizational capabilities' :
             parseFloat(metrics.capabilityAvg) >= 4.0 ? 'Solid foundation for growth' :
             'Building blocks in place'}
          </p>
        </motion.div>
      </motion.div>

      {/* AI-Generated Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-dark rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl font-bold">Key Insights</h2>
          <span className="px-2 py-1 text-xs bg-teal-500/10 text-teal-400 rounded-md border border-teal-500/20">
            AI Analysis
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Strength */}
          <div className="glass rounded-xl p-4 border border-green-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-400 mb-2">Key Strength</h3>
                <p className="text-sm text-gray-300">
                  Strong positive sentiment around <span className="font-semibold">collaboration and human interaction</span> preferences.
                  Employees value the human element in AI adoption.
                </p>
              </div>
            </div>
          </div>

          {/* Challenge */}
          <div className="glass rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">Primary Challenge</h3>
                <p className="text-sm text-gray-300">
                  Concerns about <span className="font-semibold">AI transparency and autonomy</span> at the personal workflow level.
                  {metrics.lowScoreCount} areas need attention.
                </p>
              </div>
            </div>
          </div>

          {/* Opportunity */}
          <div className="glass rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Top Opportunity</h3>
                <p className="text-sm text-gray-300">
                  High capability scores in <span className="font-semibold">Ethics and Innovation</span> provide
                  a strong foundation for responsible AI scaling.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="glass rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-400 mb-2">Recommended Focus</h3>
                <p className="text-sm text-gray-300">
                  Address <span className="font-semibold">transparency and communication</span> gaps through
                  targeted change management and training interventions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analysis Paths */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Explore Your Results</h2>
          <p className="text-gray-400">Choose an analysis path to dive deeper</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sentiment Path */}
          <motion.button
            onClick={() => onNavigate('sentiment')}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="glass-dark rounded-2xl p-8 text-left border border-teal-500/30 hover:border-teal-400/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <Users className="w-6 h-6 text-teal-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-teal-400 transform group-hover:translate-x-2 transition-transform" />
            </div>

            <h3 className="text-2xl font-bold mb-3 group-hover:text-teal-300 transition-colors">
              Sentiment Analysis
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              See how your employees <span className="font-semibold text-gray-300">feel</span> about AI across 25 dimensions.
              Understand emotional readiness and resistance patterns.
            </p>

            <div className="flex items-center gap-4 text-sm">
              <div className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                {metrics.respondentCount} responses
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                5×5 heatmap
              </div>
            </div>
          </motion.button>

          {/* Capability Path */}
          <motion.button
            onClick={() => onNavigate('capability')}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="glass-dark rounded-2xl p-8 text-left border border-purple-500/30 hover:border-purple-400/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-purple-400 transform group-hover:translate-x-2 transition-transform" />
            </div>

            <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
              Capability Assessment
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Measure organizational <span className="font-semibold text-gray-300">maturity</span> across 8 key dimensions.
              Compare against industry benchmarks and identify gaps.
            </p>

            <div className="flex items-center gap-4 text-sm">
              <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                8 dimensions
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                32 constructs
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
