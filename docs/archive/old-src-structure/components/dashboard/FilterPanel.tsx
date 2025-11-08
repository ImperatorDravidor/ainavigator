'use client'

import { useState, useEffect } from 'react'
import { X, RefreshCw, Filter, ChevronDown, Database, Cpu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterState, SentimentResponse, CapabilityResponse } from '@/lib/types'

interface FilterPanelProps {
  sentimentData: Partial<SentimentResponse>[]
  capabilityData: Partial<CapabilityResponse>[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const FilterSelect = ({ 
  label, 
  value, 
  options, 
  onChange, 
  icon 
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  icon?: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 rounded-lg glass hover:glass-hover text-left flex items-center justify-between group transition-all"
        >
          <span className={value === 'all' ? 'text-gray-500' : 'text-white'}>
            {value === 'all' ? `All ${label}s` : value}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 rounded-lg glass-premium overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    onChange('all')
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-white/10 transition-colors ${
                    value === 'all' ? 'bg-teal-500/20 text-teal-400' : 'text-gray-400'
                  }`}
                >
                  All {label}s
                </button>
                {options.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-white/10 transition-colors ${
                      value === option ? 'bg-teal-500/20 text-teal-400' : 'text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function FilterPanel({
  sentimentData,
  capabilityData,
  filters,
  onFiltersChange
}: FilterPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Extract unique values for each filter
  const getUniqueValues = (key: string) => {
    const allData = [...sentimentData, ...capabilityData] as any[]
    const values = new Set<string>()
    allData.forEach(item => {
      if (item[key]) values.add(item[key])
    })
    return Array.from(values).sort()
  }

  const regions = getUniqueValues('region')
  const departments = getUniqueValues('department')
  const functions = getUniqueValues('function')
  const ageGroups = getUniqueValues('ageGroup')
  const roles = getUniqueValues('role')

  const handleFilterChange = (key: keyof FilterState, value: string | undefined) => {
    setIsProcessing(true)
    const newFilters = { ...filters }
    if (value === undefined || value === 'all') {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    onFiltersChange(newFilters)
    setTimeout(() => setIsProcessing(false), 300)
  }

  const clearFilters = () => {
    setIsProcessing(true)
    onFiltersChange({})
    setTimeout(() => setIsProcessing(false), 300)
  }

  const activeFilterCount = Object.keys(filters).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500/20 to-purple-500/20">
            <Filter className="w-5 h-5 text-teal-400 neon-glow" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Data Filters</h3>
            {activeFilterCount > 0 && (
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                {activeFilterCount} ACTIVE
              </p>
            )}
          </div>
        </div>
        {activeFilterCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="p-2 rounded-lg glass hover:glass-hover transition-all"
            title="Clear all filters"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500/10 border border-teal-500/30">
              <Cpu className="w-4 h-4 text-teal-400 animate-pulse" />
              <span className="text-xs text-teal-400">Applying filters...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Controls */}
      <div className="space-y-4">
        {regions.length > 0 && (
          <FilterSelect
            label="Region"
            value={filters.region || 'all'}
            options={regions}
            onChange={(value) => handleFilterChange('region', value)}
            icon={<Database className="w-3 h-3" />}
          />
        )}

        {departments.length > 0 && (
          <FilterSelect
            label="Department"
            value={filters.department || 'all'}
            options={departments}
            onChange={(value) => handleFilterChange('department', value)}
            icon={<Database className="w-3 h-3" />}
          />
        )}

        {functions.length > 0 && (
          <FilterSelect
            label="Function"
            value={filters.function || 'all'}
            options={functions}
            onChange={(value) => handleFilterChange('function', value)}
            icon={<Database className="w-3 h-3" />}
          />
        )}

        {ageGroups.length > 0 && (
          <FilterSelect
            label="Age Group"
            value={filters.ageGroup || 'all'}
            options={ageGroups}
            onChange={(value) => handleFilterChange('ageGroup', value)}
            icon={<Database className="w-3 h-3" />}
          />
        )}

        {roles.length > 0 && (
          <FilterSelect
            label="Role"
            value={filters.role || 'all'}
            options={roles}
            onChange={(value) => handleFilterChange('role', value)}
            icon={<Database className="w-3 h-3" />}
          />
        )}
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-white/10"
          >
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Active Filters</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 text-sm"
                >
                  <span className="text-gray-400 capitalize">{key}:</span>
                  <span className="font-medium text-teal-400">{value}</span>
                  <button
                    onClick={() => handleFilterChange(key as keyof FilterState, undefined)}
                    className="ml-1 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Stats */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Data Overview</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {sentimentData.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Sentiment</div>
          </div>
          <div className="glass rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-teal-400">
              {capabilityData.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Capability</div>
          </div>
        </div>
      </div>
    </div>
  )
}