'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, ExternalLink, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface HelpArticle {
  title: string
  description: string
  link?: string
}

interface ContextualHelpProps {
  title: string
  description: string
  articles?: HelpArticle[]
  className?: string
}

export function ContextualHelp({
  title,
  description,
  articles = [],
  className
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('relative inline-flex', className)}>
      {/* Help button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded-full',
          'bg-gray-200/50 dark:bg-white/5 hover:bg-gray-300/50 dark:hover:bg-white/10',
          'border border-gray-300/50 dark:border-white/10',
          'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
          'transition-all duration-200',
          isOpen && 'bg-teal-500/20 border-teal-500/30 text-teal-600 dark:text-teal-400'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <HelpCircle className="w-3 h-3" />
      </motion.button>

      {/* Help panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute right-0 top-full mt-2 w-80 z-50"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
            >
              <div className="relative bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-white/20 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-teal-500/20 to-purple-500/20 p-4 border-b-2 border-gray-300 dark:border-white/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                        {title}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                        {description}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-shrink-0 p-1.5 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Articles */}
                {articles.length > 0 && (
                  <div className="p-3">
                    <div className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider px-2 py-2">
                      Related Resources
                    </div>

                    <div className="space-y-2">
                      {articles.map((article, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            if (article.link) {
                              window.open(article.link, '_blank')
                            }
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors group border border-transparent hover:border-teal-500/30"
                          whileHover={{ x: 2 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                              {article.title}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 font-medium">
                              {article.description}
                            </div>
                          </div>

                          {article.link ? (
                            <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-teal-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-teal-500 flex-shrink-0" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer tip */}
                <div className="p-3 bg-gray-100 dark:bg-white/5 border-t-2 border-gray-300 dark:border-white/10">
                  <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    💡 <span className="font-bold">Pro tip:</span> Hover over any element for quick insights
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}





