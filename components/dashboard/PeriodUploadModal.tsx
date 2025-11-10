'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Upload, Calendar, FileText, CheckCircle, AlertCircle,
  Loader2, Info, ChevronRight, Lightbulb
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useData } from '@/lib/store'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

interface Intervention {
  code: string
  name: string
  level: string
  core_function: string
  description: string
}

interface PeriodUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PeriodUploadModal({ isOpen, onClose }: PeriodUploadModalProps) {
  const { addAssessmentPeriod } = useData()

  const [step, setStep] = useState(1) // 1: Period Info, 2: Interventions, 3: Upload Files
  const [periodName, setPeriodName] = useState('')
  const [periodDate, setPeriodDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([])
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [sentimentFile, setSentimentFile] = useState<File | null>(null)
  const [capabilityFile, setCapabilityFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Load available interventions
  useEffect(() => {
    if (isOpen) {
      loadInterventions()
    }
  }, [isOpen])

  const loadInterventions = async () => {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select('*')
        .order('code')

      if (error) throw error
      setInterventions(data || [])
    } catch (error) {
      console.error('Error loading interventions:', error)
      toast.error('Failed to load interventions')
    }
  }

  const toggleIntervention = (code: string) => {
    setSelectedInterventions(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    )
  }

  const handleFileChange = (type: 'sentiment' | 'capability', file: File | null) => {
    if (type === 'sentiment') {
      setSentimentFile(file)
    } else {
      setCapabilityFile(file)
    }
  }

  const handleUpload = async () => {
    if (!sentimentFile && !capabilityFile) {
      toast.error('Please upload at least one data file')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('periodName', periodName)
      formData.append('periodDate', periodDate)
      formData.append('interventions', JSON.stringify(selectedInterventions))

      if (sentimentFile) formData.append('sentimentFile', sentimentFile)
      if (capabilityFile) formData.append('capabilityFile', capabilityFile)

      // Upload to API
      const response = await fetch('/api/data/upload-period', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const result = await response.json()

      setUploadProgress(100)
      toast.success('Assessment period uploaded successfully!')

      // Add period to store
      if (result.period) {
        addAssessmentPeriod(result.period)
      }

      // Close modal and reset
      setTimeout(() => {
        onClose()
        resetModal()
      }, 1000)

    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload assessment data')
    } finally {
      setIsUploading(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setPeriodName('')
    setPeriodDate(format(new Date(), 'yyyy-MM-dd'))
    setSelectedInterventions([])
    setSentimentFile(null)
    setCapabilityFile(null)
    setUploadProgress(0)
  }

  const canProceedToStep2 = periodName.trim().length > 0
  const canProceedToStep3 = true // Can skip intervention selection
  const canUpload = (sentimentFile || capabilityFile) && !isUploading

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-950/20 dark:to-purple-950/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upload New Assessment Period
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Step {step} of 3: {step === 1 ? 'Period Details' : step === 2 ? 'Select Interventions' : 'Upload Data Files'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={cn(
                    "flex-1 h-1.5 rounded-full transition-all",
                    step >= s ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-700"
                  )} />
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Period Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Period Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={periodName}
                      onChange={(e) => setPeriodName(e.target.value)}
                      placeholder="e.g., November 2024 - Post-Intervention"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Assessment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={periodDate}
                      onChange={(e) => setPeriodDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900 dark:text-blue-300">
                        <p className="font-semibold mb-1">Creating a new assessment period</p>
                        <p>This will create a new timeline point to compare against your baseline (October 2024).</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Select Interventions */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Which interventions did you implement? (Optional)
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Select the interventions you applied between the baseline and this new assessment period.
                      This helps track which actions drove improvements.
                    </p>
                  </div>

                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {interventions.map((intervention) => (
                      <button
                        key={intervention.code}
                        onClick={() => toggleIntervention(intervention.code)}
                        className={cn(
                          "p-3 rounded-lg border-2 text-left transition-all",
                          selectedInterventions.includes(intervention.code)
                            ? "border-teal-500 bg-teal-50 dark:bg-teal-500/10"
                            : "border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                            selectedInterventions.includes(intervention.code)
                              ? "border-teal-500 bg-teal-500"
                              : "border-gray-300 dark:border-gray-600"
                          )}>
                            {selectedInterventions.includes(intervention.code) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                                {intervention.code}
                              </span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {intervention.name}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {intervention.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Upload Files */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Upload Assessment Data Files
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Upload CSV files containing sentiment and/or capability assessment data for this period.
                    </p>
                  </div>

                  {/* Sentiment File Upload */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-6 hover:border-teal-400 dark:hover:border-teal-500 transition-colors">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange('sentiment', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {sentimentFile ? sentimentFile.name : 'Sentiment Data (CSV)'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {sentimentFile ? 'Click to change file' : 'Click to select file'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Capability File Upload */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-6 hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileChange('capability', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {capabilityFile ? capabilityFile.name : 'Capability Data (CSV)'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {capabilityFile ? 'Click to change file' : 'Click to select file'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            <div className="flex gap-2">
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !canProceedToStep2}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all",
                    (step === 1 && canProceedToStep2) || step === 2
                      ? "bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  )}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleUpload}
                  disabled={!canUpload}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all",
                    canUpload
                      ? "bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  )}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Assessment
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
