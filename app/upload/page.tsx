'use client'

import { motion } from 'framer-motion'
import {
  Upload,
  Database,
  TrendingUp,
  Sparkles,
  Users,
  Brain
} from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-black dark:via-slate-900 dark:to-blue-950">
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-500/30 mb-6">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Data Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Phase Data Upload
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload new assessment data for future phases
          </p>
        </motion.div>

        {/* Mock Upload Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative overflow-hidden rounded-2xl border-4 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(100, 100, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(100, 100, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* Content */}
            <div className="relative p-16 text-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mb-8"
              >
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Data Scientists Working On It
              </h3>
              <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Our data science team is currently preparing and validating phase data based on intervention models and statistical analysis.
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30">
                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">In Development</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Phase Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Available Assessment Phases
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Baseline */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Database className="w-6 h-6 text-slate-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase">Oct 2024</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">Baseline</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
                Initial assessment establishing the foundation for analysis
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Active
              </div>
            </div>

            {/* Phase 2 */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Mar 2025</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">Phase 2</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                Initial implementation with interventions A1, B2, C1
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  A1: Vision
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                  B2: Comms
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  C1: Skills
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Generated
              </div>
            </div>

            {/* Phase 3 */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-purple-400 dark:border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Nov 2025</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">Phase 3</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                Advanced implementation with interventions A2, C3, D1
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  A2: Champions
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  C3: Cert
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                  D1: Gov
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Generated
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Users className="w-5 h-5" />
            View Assessment Dashboard
          </Link>
          <p className="mt-4 text-sm text-slate-600 dark:text-gray-400">
            Explore the complete intervention-based progression story
          </p>
        </motion.div>

      </div>
    </div>
  )
}
