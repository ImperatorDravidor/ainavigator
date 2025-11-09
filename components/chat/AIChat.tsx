'use client'

import { useState, useRef, useEffect, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Loader2,
  User,
  Bot,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  Maximize2,
  Minimize2,
  BarChart3,
  FileText,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { usePathname, useRouter } from 'next/navigation'
import { executeActions, createDefaultHandlers } from '@/lib/ai/chat-actions'
import { prepareEnhancedContext } from '@/lib/ai/chat-data-fetcher'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    action?: string
    data?: any
  }
}

interface AIChatProps {
  className?: string
}

const AIChatComponent = ({ className }: AIChatProps) => {
  const pathname = usePathname()
  const activeView = useStore((state) => state.activeView)
  
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI insights companion. I can analyze your data, generate reports, design interventions, and help you navigate the platform.\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  
  // Use individual selectors to prevent re-renders
  const sentimentData = useStore((state) => state.sentimentData)
  const capabilityData = useStore((state) => state.capabilityData)
  const organization = useStore((state) => state.organization)
  const filters = useStore((state) => state.filters)
  const setFilters = useStore((state) => state.setFilters)
  const user = useStore((state) => state.user)
  const addNotification = useStore((state) => state.addNotification)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Prepare enhanced context with data summaries
      const baseContext = {
        current_page: pathname,
        user_info: {
          name: user?.email || 'User',
          organization: organization?.name || 'Demo Organization'
        },
        data_state: {
          has_sentiment_data: sentimentData.length > 0,
          has_capability_data: capabilityData.length > 0,
          sentiment_count: sentimentData.length,
          capability_count: capabilityData.length
        },
        active_filters: filters,
        timestamp: new Date().toISOString()
      }

      const enhancedContext = await prepareEnhancedContext(
        baseContext,
        sentimentData,
        capabilityData
      )

      // Send message to AI with full context
      const response = await fetch('/api/gpt/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: messages.slice(-15), // Last 15 messages for context
          context: enhancedContext
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          metadata: data.metadata
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Execute any actions suggested by the AI
        if (data.metadata?.actions && data.metadata.actions.length > 0) {
          await handleAIActions(data.metadata.actions)
        }
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIActions = useCallback(async (actions: any[]) => {
    try {
      // Create action handlers
      const handlers = createDefaultHandlers(router, setFilters)
      
      // Execute all actions
      const result = await executeActions(actions, handlers)
      
      // Show notifications for executed actions
      result.results.forEach(({ action, success, message }) => {
        if (success && addNotification) {
          addNotification({
            id: `action-${Date.now()}-${Math.random()}`,
            type: 'success',
            message: message || action.description,
            timestamp: new Date(),
            duration: 3000
          })
        }
      })
    } catch (error) {
      console.error('Error executing AI actions:', error)
    }
  }, [router, setFilters, addNotification])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickPrompts = [
    { icon: TrendingUp, text: "Top challenges", prompt: "What are our top 3 AI adoption challenges?" },
    { icon: BarChart3, text: "Maturity analysis", prompt: "Analyze our capability maturity" },
    { icon: FileText, text: "Executive summary", prompt: "Generate an executive summary" },
    { icon: Lightbulb, text: "Interventions", prompt: "Recommend interventions with ROI" },
  ]
  
  // Determine if we should hide the chat
  const hideOnPages = ['/', '/login']
  const shouldHide = hideOnPages.includes(pathname) || (pathname === '/assessment' && activeView === 'ai-agent')
  
  // Don't render anything if should be hidden
  if (shouldHide) {
    return null
  }

  // Floating Chat Button (when closed)
  if (!isOpen) {
    return (
      <motion.button
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-14 h-14 rounded-2xl',
          'bg-gradient-to-br from-teal-500 via-teal-600 to-purple-600',
          'shadow-[0_8px_30px_rgba(20,184,166,0.4)] hover:shadow-[0_12px_40px_rgba(20,184,166,0.5)]',
          'flex items-center justify-center',
          'transition-shadow duration-300',
          'border border-white/20',
          className
        )}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 15,
          rotate: { duration: 0.6, ease: 'easeOut' }
        }}
      >
        <Sparkles className="w-6 h-6 text-white" />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-lg"
          animate={{ 
            scale: [1, 1.3, 1],
            boxShadow: [
              '0 0 0 0 rgba(52, 211, 153, 0.4)',
              '0 0 0 6px rgba(52, 211, 153, 0)',
              '0 0 0 0 rgba(52, 211, 153, 0)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    )
  }

  // Chat Sidebar (when open)
  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <motion.div
        className={cn(
          'fixed z-50 flex flex-col overflow-hidden',
          'bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl',
          'border border-slate-200/80 dark:border-white/10',
          'shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]',
          'bottom-5 right-5 rounded-2xl w-[340px] h-[500px]',
          className
        )}
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ 
          type: 'spring', 
          damping: 20, 
          stiffness: 260,
          mass: 0.8
        }}
      >
        {/* Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-white/10 shrink-0 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-white/5 dark:to-transparent">
          <div className="flex items-center gap-2.5">
            <motion.div 
              className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/20"
              animate={{ 
                boxShadow: [
                  '0 4px 14px rgba(20, 184, 166, 0.2)',
                  '0 4px 20px rgba(168, 85, 247, 0.3)',
                  '0 4px 14px rgba(20, 184, 166, 0.2)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bot className="w-4 h-4 text-white" />
              <motion.div 
                className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AI Insights</h3>
              <p className="text-[10px] text-slate-600 dark:text-gray-400 flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                Online
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-4 h-4 text-slate-600 dark:text-gray-400" />
          </motion.button>
        </div>

        {/* Messages Container */}
        <div className="relative flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent min-h-0">
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: idx * 0.05,
                type: 'spring',
                stiffness: 500,
                damping: 30
              }}
              className={cn(
                'flex gap-2 items-end',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Avatar for assistant */}
              {message.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              
              {/* Message Bubble */}
              <div className={cn(
                'max-w-[80%] group',
                message.role === 'user' ? 'order-2' : 'order-1'
              )}>
                <motion.div 
                  className={cn(
                    'rounded-2xl px-3.5 py-2.5 shadow-sm overflow-hidden',
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-teal-500 to-purple-600 text-white rounded-br-md'
                      : 'bg-slate-100/80 dark:bg-white/[0.07] text-slate-900 dark:text-white backdrop-blur-sm rounded-bl-md border border-slate-200/50 dark:border-white/5'
                  )}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {message.role === 'user' ? (
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  ) : (
                    <div className="text-[13px] leading-relaxed chat-markdown text-slate-900 dark:text-white">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="my-1">{children}</p>,
                          ul: ({ children }) => <ul className="my-1 space-y-0.5">{children}</ul>,
                          ol: ({ children }) => <ol className="my-1 space-y-0.5">{children}</ol>,
                          li: ({ children }) => <li className="text-[12px]">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          code: ({ children, className }) => {
                            const isInline = !className
                            return isInline ? (
                              <code className="text-[11px] bg-slate-200/60 dark:bg-white/10 px-1 py-0.5 rounded font-mono">
                                {children}
                              </code>
                            ) : (
                              <code className={className}>{children}</code>
                            )
                          },
                          pre: ({ children }) => (
                            <pre className="text-[11px] bg-slate-200/60 dark:bg-white/10 p-2 rounded my-1 overflow-x-auto">
                              {children}
                            </pre>
                          ),
                          h1: ({ children }) => <h3 className="text-[14px] font-semibold mt-2 mb-1">{children}</h3>,
                          h2: ({ children }) => <h4 className="text-[13px] font-semibold mt-1.5 mb-0.5">{children}</h4>,
                          h3: ({ children }) => <h5 className="text-[13px] font-semibold mt-1 mb-0.5">{children}</h5>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-slate-300 dark:border-white/20 pl-2 italic my-1 text-slate-700 dark:text-gray-300">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </motion.div>
                <p className={cn(
                  "text-[9px] text-slate-500 dark:text-gray-500 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity",
                  message.role === 'user' ? 'text-right' : 'text-left'
                )}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {/* Avatar for user */}
              {message.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/5 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User className="w-3.5 h-3.5 text-slate-600 dark:text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start items-end gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="bg-slate-100/80 dark:bg-white/[0.07] rounded-2xl rounded-bl-md px-3.5 py-2.5 backdrop-blur-sm border border-slate-200/50 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <motion.div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-teal-600 dark:bg-teal-400 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </motion.div>
                  <span className="text-[11px] text-slate-600 dark:text-white/60">Thinking</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <motion.div 
            className="relative px-4 pb-2.5 space-y-1.5 shrink-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[10px] text-slate-500 dark:text-gray-500 font-medium tracking-wide mb-2">
              Popular questions
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  onClick={() => {
                    setInputValue(prompt.prompt)
                    inputRef.current?.focus()
                  }}
                  className="flex flex-col items-start gap-1 p-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-white/5 dark:to-white/[0.02] hover:from-teal-50 hover:to-purple-50 dark:hover:from-teal-500/10 dark:hover:to-purple-500/10 border border-slate-200/60 dark:border-white/5 hover:border-teal-200 dark:hover:border-teal-500/30 transition-all text-left group hover:shadow-md"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <prompt.icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-slate-700 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors font-medium leading-tight">
                    {prompt.text}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="relative px-4 py-3 border-t border-slate-200/80 dark:border-white/10 shrink-0 bg-gradient-to-t from-slate-50/30 to-transparent dark:from-white/[0.02] dark:to-transparent">
          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              className={cn(
                'w-full pl-3.5 pr-10 py-2.5',
                'bg-slate-100/80 dark:bg-white/[0.07]',
                'border border-slate-200/60 dark:border-white/10',
                'rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40',
                'focus:bg-white dark:focus:bg-white/10',
                'transition-all duration-200',
                'text-[13px] backdrop-blur-sm'
              )}
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                'absolute right-1.5 top-1/2 -translate-y-1/2',
                'w-8 h-8 rounded-lg',
                'flex items-center justify-center',
                'transition-all duration-200',
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-br from-teal-500 to-purple-600 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30'
                  : 'bg-slate-300/50 dark:bg-white/10 opacity-50 cursor-not-allowed'
              )}
              whileHover={inputValue.trim() && !isLoading ? { scale: 1.05, rotate: 5 } : {}}
              whileTap={inputValue.trim() && !isLoading ? { scale: 0.95 } : {}}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const AIChat = memo(AIChatComponent)
export default AIChat

