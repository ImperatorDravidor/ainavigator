'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  X,
  ArrowRight,
  Sparkles,
  Lightbulb,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NextStep {
  code: string
  name: string
  level: string
  core_function: string
}

interface InterventionData {
  code: string
  name: string
  level: string
  core_function: string
  description: string | null
  next_steps: {
    rationale: string | null
    interventions: NextStep[]
  }
}

interface InterventionDetailProps {
  isOpen: boolean
  onClose: () => void
  interventionCode: string | null
  onSelectNextStep?: (code: string) => void
}

export function InterventionDetail({
  isOpen,
  onClose,
  interventionCode,
  onSelectNextStep
}: InterventionDetailProps) {
  const [intervention, setIntervention] = useState<InterventionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!interventionCode || !isOpen) {
      return
    }

    const fetchIntervention = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/interventions/${interventionCode}`)

        if (!response.ok) {
          throw new Error('Failed to fetch intervention details')
        }

        const data = await response.json()
        setIntervention(data.intervention)
      } catch (err) {
        console.error('Error fetching intervention:', err)
        setError('Failed to load intervention details')
      } finally {
        setLoading(false)
      }
    }

    fetchIntervention()
  }, [interventionCode, isOpen])

  const getLevelColor = (level: string) => {
    if (level.startsWith('A')) return 'from-purple-600 to-purple-700'
    if (level.startsWith('B')) return 'from-blue-600 to-blue-700'
    if (level.startsWith('C')) return 'from-teal-600 to-teal-700'
    return 'from-gray-600 to-gray-700'
  }

  const getLevelBadgeColor = (level: string) => {
    if (level.includes('Strategy')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    if (level.includes('Adoption')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    if (level.includes('Innovation')) return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }

  const formatDescription = (description: string) => {
    // Split by double newlines to preserve paragraph structure
    return description.split('\n\n').filter(para => para.trim())
  }

  if (!intervention && !loading) {
    return null
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="sr-only">
            {intervention?.name || 'Intervention Details'}
          </Dialog.Title>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading intervention details...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          ) : intervention ? (
            <>
              {/* Header */}
              <div className={cn("relative bg-gradient-to-r px-8 py-10 text-white", getLevelColor(intervention.level))}>
                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/20 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </Dialog.Close>

                <div className="flex items-start gap-6">
                  <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
                    <Sparkles className="h-10 w-10" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-4xl font-bold">{intervention.code}</span>
                      <span className={cn("px-4 py-1.5 rounded-full text-sm font-semibold", getLevelBadgeColor(intervention.level))}>
                        {intervention.level.split(' - ')[0]}
                      </span>
                    </div>
                    <Dialog.Title className="text-3xl font-bold mb-3">
                      {intervention.name}
                    </Dialog.Title>
                    <p className="text-xl text-white/90 leading-relaxed">
                      {intervention.core_function}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8 max-h-[calc(100vh-400px)] overflow-y-auto">
                {/* Full Description */}
                {intervention.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Intervention Details
                      </h3>
                    </div>
                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
                      {formatDescription(intervention.description).map((paragraph, index) => (
                        <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Next Steps */}
                {intervention.next_steps.interventions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Recommended Next Steps
                      </h3>
                    </div>

                    {intervention.next_steps.rationale && (
                      <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500 p-4 rounded-r-lg">
                        {intervention.next_steps.rationale}
                      </p>
                    )}

                    <div className="grid gap-4">
                      {intervention.next_steps.interventions.map((nextStep, index) => (
                        <motion.div
                          key={nextStep.code}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 p-5 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => onSelectNextStep && onSelectNextStep(nextStep.code)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                                  {nextStep.code}
                                </span>
                                <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getLevelBadgeColor(nextStep.level))}>
                                  {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'}
                                </span>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {nextStep.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {nextStep.core_function}
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click on next steps to explore the recommended progression
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
