'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Loader2,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  BarChart3,
  Lightbulb,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { executeActions, createDefaultHandlers } from '@/lib/ai/chat-actions'
import { prepareEnhancedContext } from '@/lib/ai/chat-data-fetcher'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: any
}

interface AIAgentViewProps {
  sentimentData: any[]
  capabilityData: any[]
  filters: any
  setFilters: (filters: any) => void
  companyName?: string
}

export default function AIAgentView({
  sentimentData,
  capabilityData,
  filters,
  setFilters,
  companyName = 'Your Organization'
}: AIAgentViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: sentimentData.length > 0 || capabilityData.length > 0
        ? `**Welcome!** I'm analyzing ${companyName}'s AI readiness data.\n\n**Available Data:**\n• ${sentimentData.length} sentiment responses\n• ${capabilityData.length} capability assessments\n\n**I can help you:**\n• Identify top challenges and strengths\n• Generate executive summaries\n• Recommend specific interventions\n• Compare teams and time periods\n\n**Try asking:** "What are our top 3 challenges?" or "Show me capability gaps"`
        : `**Ready to help!** Upload your assessment data or try the demo to get started.\n\nI can analyze sentiment patterns, capability gaps, and generate actionable recommendations.`,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const router = useRouter()
  const organization = useStore((state) => state.organization)
  const user = useStore((state) => state.user)
  const addNotification = useStore((state) => state.addNotification)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
      const baseContext = {
        current_page: '/assessment',
        user_info: {
          name: user?.email || 'User',
          organization: organization?.name || companyName
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

      // Pass actual data to AI for real analysis
      const enhancedContext = await prepareEnhancedContext(
        baseContext,
        sentimentData.length > 0 ? sentimentData : [],
        capabilityData.length > 0 ? capabilityData : []
      )
      
      // Debug: Log what we're sending
      console.log('Sending to AI:', {
        message: userMessage.content,
        has_sentiment: sentimentData.length > 0,
        has_capability: capabilityData.length > 0,
        context_has_summaries: !!(enhancedContext.data_state.sentiment_summary || enhancedContext.data_state.capability_summary)
      })

      const response = await fetch('/api/gpt/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: messages.slice(-15),
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

        if (data.metadata?.actions && data.metadata.actions.length > 0) {
          await executeAIActions(data.metadata.actions)
        }
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "❌ I encountered an error processing your request. Please check that your OpenAI API key is set in the .env.local file and try again.\n\nError: " + (error instanceof Error ? error.message : 'Unknown error'),
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIActions = useCallback(async (actions: any[]) => {
    try {
      const handlers = createDefaultHandlers(router, setFilters)
      const result = await executeActions(actions, handlers)
      
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
    { 
      icon: TrendingUp, 
      text: "Top 3 AI adoption challenges", 
      prompt: "What are the top 3 problems we're facing with AI adoption based on our sentiment data? Give me specific scores and affected employee counts."
    },
    {
      icon: BarChart3,
      text: "Capability maturity analysis",
      prompt: "Analyze our AI capability maturity across all 8 dimensions. Show me strengths, weaknesses, and gaps with specific scores."
    },
    { 
      icon: FileText, 
      text: "Executive summary", 
      prompt: "Generate a comprehensive executive summary of our AI readiness that's board-ready. Include current state, top 3 priorities, and recommended first step."
    },
    { 
      icon: Lightbulb, 
      text: "Intervention recommendations", 
      prompt: "Based on our data, recommend 3 specific interventions we should implement. Include effort estimates, timeline, and expected impact."
    },
  ]

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex gap-4',
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {/* Avatar */}
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg',
              message.role === 'user'
                ? 'bg-gradient-to-br from-teal-500 to-teal-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            )}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message Content */}
            <div className={cn(
              'flex-1 max-w-3xl',
              message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            )}>
              <div className={cn(
                'rounded-2xl px-6 py-4 shadow-md',
                message.role === 'user'
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    // Headers
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-xl font-bold mb-3 mt-0 text-gray-900 dark:text-white">{line.slice(2)}</h1>
                    } else if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-lg font-bold mb-2 mt-4 text-gray-800 dark:text-gray-100">{line.slice(3)}</h2>
                    } else if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-base font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200">{line.slice(4)}</h3>
                    }
                    // Bold text
                    else if (line.includes('**')) {
                      const parts = line.split('**')
                      return (
                        <p key={i} className="my-1.5 text-gray-700 dark:text-gray-300">
                          {parts.map((part, j) => 
                            j % 2 === 1 ? <strong key={j} className="font-semibold text-gray-900 dark:text-white">{part}</strong> : part
                          )}
                        </p>
                      )
                    }
                    // Lists
                    else if (line.startsWith('- ') || line.startsWith('• ')) {
                      return <li key={i} className="ml-4 my-1.5 text-gray-700 dark:text-gray-300">{line.slice(2)}</li>
                    }
                    // Numbered lists
                    else if (/^\d+\./.test(line)) {
                      return <li key={i} className="ml-4 my-1.5 text-gray-700 dark:text-gray-300 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>
                    }
                    // Regular paragraphs
                    else if (line.trim()) {
                      return <p key={i} className="my-1.5 text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>
                    }
                    return <br key={i} />
                  })}
                </div>
                <p className="text-xs opacity-60 mt-3">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Analyzing...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts (show when conversation is minimal) */}
      {messages.length <= 1 && !isLoading && (
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">Quick Actions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickPrompts.map((prompt, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  setInputValue(prompt.prompt)
                  inputRef.current?.focus()
                }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all text-left group shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <prompt.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {prompt.text}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors opacity-0 group-hover:opacity-100" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl px-6 py-4">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your AI readiness... (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={isLoading}
            className={cn(
              'w-full px-6 py-4 pr-14 resize-none',
              'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
              'rounded-2xl text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
              'transition-all shadow-sm hover:shadow-md',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{ minHeight: '56px', maxHeight: '200px' }}
            onInput={(e: any) => {
              e.target.style.height = '56px'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              'absolute right-3 bottom-3',
              'w-10 h-10 rounded-xl',
              'flex items-center justify-center',
              'transition-all shadow-lg',
              inputValue.trim() && !isLoading
                ? 'bg-gradient-to-br from-teal-500 to-blue-600 hover:scale-105 active:scale-95 text-white'
                : 'bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed text-gray-500'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-2">
          AI • Verify important information
        </p>
      </div>
    </div>
  )

  async function executeAIActions(actions: any[]) {
    try {
      const handlers = createDefaultHandlers(router, setFilters)
      const result = await executeActions(actions, handlers)
      
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
  }
}

