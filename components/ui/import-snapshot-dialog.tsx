'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Calendar, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

interface ImportSnapshotDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ImportSnapshotDialog({ isOpen, onClose, onSuccess }: ImportSnapshotDialogProps) {
  const { company } = useAuth()
  const [step, setStep] = useState<'confirm' | 'upload' | 'processing' | 'success'>('confirm')
  const [snapshotName, setSnapshotName] = useState('')
  const [assessmentDate, setAssessmentDate] = useState('')
  const [description, setDescription] = useState('')
  const [sentimentFile, setSentimentFile] = useState<File | null>(null)
  const [capabilityFile, setCapabilityFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    setStep('upload')
  }

  const handleUpload = async () => {
    if (!snapshotName || !assessmentDate || !sentimentFile || !capabilityFile) {
      setError('Please fill in all required fields')
      return
    }

    setStep('processing')
    setError('')

    try {
      const formData = new FormData()
      formData.append('snapshotName', snapshotName)
      formData.append('assessmentDate', assessmentDate)
      formData.append('description', description)
      formData.append('sentimentFile', sentimentFile)
      formData.append('capabilityFile', capabilityFile)
      formData.append('companyId', company?.id || '')

      const response = await fetch('/api/data/import-snapshot', {
        method: 'POST',
        headers: {
          'x-company-id': company?.id || ''
        },
        body: formData
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to import snapshot')
      }

      setStep('success')
      setTimeout(() => {
        onSuccess?.()
        handleClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setStep('upload')
    }
  }

  const handleClose = () => {
    setStep('confirm')
    setSnapshotName('')
    setAssessmentDate('')
    setDescription('')
    setSentimentFile(null)
    setCapabilityFile(null)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-950/20 dark:to-purple-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Import New Snapshot
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Add a new assessment period for temporal comparison
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        Before you import a new snapshot:
                      </p>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
                        <li>Make sure you've marked any interventions that were implemented</li>
                        <li>New data will be added as a separate time period (existing data is preserved)</li>
                        <li>You'll be able to compare baseline vs. new snapshot side-by-side</li>
                        <li>Prepare CSV files for both sentiment and capability assessments</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-950/10 dark:to-purple-950/10 rounded-xl border border-teal-200/50 dark:border-teal-800/50">
                  <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Track Progress Over Time</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      See how your organization improves after implementing interventions
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/25"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
                    {error}
                  </div>
                )}

                {/* Snapshot Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Snapshot Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={snapshotName}
                      onChange={(e) => setSnapshotName(e.target.value)}
                      placeholder="e.g., Nov 2024 Progress Check"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Assessment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={assessmentDate}
                      onChange={(e) => setAssessmentDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of this assessment period..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Sentiment Data CSV <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setSentimentFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {sentimentFile && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Selected: {sentimentFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Capability Data CSV <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCapabilityFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {capabilityFile && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Selected: {capabilityFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep('confirm')}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!snapshotName || !assessmentDate || !sentimentFile || !capabilityFile}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all",
                      snapshotName && assessmentDate && sentimentFile && capabilityFile
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    Upload & Import
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Processing your data...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  This may take a few moments
                </p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Snapshot imported successfully!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  You can now compare your progress over time
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

