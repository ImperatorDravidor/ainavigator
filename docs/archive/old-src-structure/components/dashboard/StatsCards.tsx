'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Gauge, Target } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatsCardsProps {
  stats: {
    totalResponses: number
    readinessScore: number
    sentimentAverage: string
    capabilityAverage: string
  }
}

// Simple value display
const DisplayValue = ({ value, suffix = '', decimals = 0 }: any) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const formatted = decimals > 0 
    ? numValue.toFixed(decimals)
    : Math.floor(numValue).toLocaleString()

  return <span>{formatted}{suffix}</span>
}

// Simple progress bar
const ProgressBar = ({ value, max = 100, color }: any) => {
  const percentage = (value / max) * 100

  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
        className="h-full"
        style={{ background: color }}
      />
    </div>
  )
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Responses',
      value: stats.totalResponses,
      icon: Users,
      gradient: 'from-teal-500/15 to-cyan-400/15',
      glowColor: 'rgba(13, 124, 127, 0.3)',
      iconColor: 'text-teal-300',
      iconBg: 'from-teal-500/20 to-cyan-400/20',
      suffix: '',
      decimals: 0,
      showProgress: false
    },
    {
      label: 'AI Readiness',
      value: stats.readinessScore,
      icon: Gauge,
      gradient: 'from-purple-500/15 to-indigo-500/15',
      glowColor: 'rgba(78, 74, 175, 0.3)',
      iconColor: 'text-purple-300',
      iconBg: 'from-purple-500/20 to-indigo-500/20',
      suffix: '%',
      decimals: 0,
      showProgress: true,
      progressColor: '#7B77D9',
      progressMax: 100,
      status: stats.readinessScore >= 60 ? 'good' : 'needs-attention'
    },
    {
      label: 'Sentiment Score',
      value: stats.sentimentAverage,
      icon: TrendingUp,
      gradient: 'from-teal-400/15 to-emerald-400/15',
      glowColor: 'rgba(20, 184, 166, 0.3)',
      iconColor: 'text-teal-300',
      iconBg: 'from-teal-400/20 to-emerald-400/20',
      suffix: '/5',
      decimals: 1,
      showProgress: true,
      progressColor: '#14B8A6',
      progressMax: 5,
      status: Number(stats.sentimentAverage) >= 3 ? 'good' : 'needs-attention'
    },
    {
      label: 'Capability Score',
      value: stats.capabilityAverage,
      icon: Target,
      gradient: 'from-orange-500/15 to-amber-500/15',
      glowColor: 'rgba(255, 107, 53, 0.3)',
      iconColor: 'text-orange-300',
      iconBg: 'from-orange-500/20 to-amber-500/20',
      suffix: '/5',
      decimals: 1,
      showProgress: true,
      progressColor: '#FF8C5F',
      progressMax: 5,
      status: Number(stats.capabilityAverage) >= 3 ? 'good' : 'needs-attention'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="glass-dark rounded-lg p-3 relative overflow-hidden">

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${card.iconBg} ${card.iconColor}`}>
                <card.icon className="w-4 h-4" />
              </div>
              {card.status && (
                <div
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    card.status === 'good'
                      ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {card.status === 'good' ? '✓' : '⚠'}
                </div>
              )}
            </div>

            {/* Value */}
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {card.label}
              </p>
              <p className="text-xl font-bold text-white">
                <DisplayValue
                  value={card.value}
                  suffix={card.suffix}
                  decimals={card.decimals}
                />
              </p>

              {/* Progress bar */}
              {card.showProgress && (
                <div className="mt-2">
                  <ProgressBar
                    value={Number(card.value)}
                    max={card.progressMax}
                    color={card.progressColor}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}