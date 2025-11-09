/**
 * Enterprise State Management Store
 * Zustand store with middleware and devtools integration
 */

import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { logger } from '@/lib/services/logger.service'
import { 
  SentimentResponse, 
  CapabilityResponse
} from '@/lib/types/assessment'
import { 
  User, 
  Session
} from '@/lib/types/models'

// Additional types for store
interface Organization {
  id: string
  name: string
  displayName?: string
}

interface AssessmentPeriod {
  id: string
  company_id: string
  survey_wave: string
  assessment_date: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'archived'
  interventions_applied?: string[]
  sentiment_respondents: number
  capability_respondents: number
  created_at: string
  updated_at: string
}

interface AppliedIntervention {
  id: string
  company_id: string
  assessment_period_id: string
  intervention_code: string
  applied_date: string
  status: 'planned' | 'in_progress' | 'completed' | 'abandoned'
  expected_impact?: any
  actual_impact?: any
  notes?: string
}

interface FileUpload {
  id: string
  name: string
  size: number
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error'
  progress: number
  error?: string
  periodId?: string  // Link upload to assessment period
}

// Store-specific filter state (different from assessment FilterState)
interface FilterState {
  regions: string[]
  departments: string[]
  ageGroups: string[]
  businessUnits: string[]
  dateRange: {
    start: Date
    end: Date
  }
  customFilters: any[]
}

// Store slices interfaces
interface AuthSlice {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  logout: () => void
}

interface DataSlice {
  organization: Organization | null
  sentimentData: SentimentResponse[]
  capabilityData: CapabilityResponse[]
  isDataLoading: boolean
  dataError: string | null
  // Period management
  assessmentPeriods: AssessmentPeriod[]
  currentPeriodId: string | null
  currentPeriod: AssessmentPeriod | null
  appliedInterventions: AppliedIntervention[]
  // Actions
  setSentimentData: (data: SentimentResponse[]) => void
  setCapabilityData: (data: CapabilityResponse[]) => void
  setOrganization: (org: Organization | null) => void
  setAssessmentPeriods: (periods: AssessmentPeriod[]) => void
  setCurrentPeriod: (periodId: string) => void
  addAssessmentPeriod: (period: AssessmentPeriod) => void
  setAppliedInterventions: (interventions: AppliedIntervention[]) => void
  addAppliedIntervention: (intervention: AppliedIntervention) => void
  clearData: () => void
}

interface FilterSlice {
  filters: FilterState
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
}

interface UploadSlice {
  uploads: FileUpload[]
  currentUpload: FileUpload | null
  uploadProgress: number
  addUpload: (upload: FileUpload) => void
  updateUploadStatus: (id: string, status: FileUpload['status']) => void
  setUploadProgress: (progress: number) => void
  clearUploads: () => void
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: any
}

interface UISlice {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  activeView: string
  notifications: Notification[]
  modals: ModalState
  chatOpen: boolean
  chatMessages: ChatMessage[]
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setActiveView: (view: string) => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  openModal: (modalId: string, data?: any) => void
  closeModal: (modalId: string) => void
  toggleChat: () => void
  setChatOpen: (open: boolean) => void
  addChatMessage: (message: ChatMessage) => void
  clearChatHistory: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
  duration?: number
}

interface ModalState {
  [key: string]: {
    isOpen: boolean
    data?: any
  }
}

// Combined store interface
export interface AppStore extends AuthSlice, DataSlice, FilterSlice, UploadSlice, UISlice {}

// Default states
const defaultFilters: FilterState = {
  regions: [],
  departments: [],
  ageGroups: [],
  businessUnits: [],
  dateRange: {
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    end: new Date()
  },
  customFilters: []
}

const defaultUIState = {
  theme: 'dark' as const,
  sidebarOpen: true,
  activeView: 'dashboard',
  notifications: [],
  modals: {},
  chatOpen: false,
  chatMessages: []
}

// Create store with middleware
export const useStore = create<AppStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // Auth Slice
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          
          setUser: (user) => set((state) => {
            state.user = user
            state.isAuthenticated = !!user
            logger.info('User state updated', { userId: user?.id })
          }),
          
          setSession: (session) => set((state) => {
            state.session = session
            state.isAuthenticated = !!session
          }),
          
          logout: () => set((state) => {
            state.user = null
            state.session = null
            state.isAuthenticated = false
            state.sentimentData = []
            state.capabilityData = []
            state.organization = null
            logger.info('User logged out')
          }),

          // Data Slice
          organization: null,
          sentimentData: [],
          capabilityData: [],
          isDataLoading: false,
          dataError: null,
          assessmentPeriods: [],
          currentPeriodId: null,
          currentPeriod: null,
          appliedInterventions: [],

          setSentimentData: (data) => set((state) => {
            state.sentimentData = data
            state.dataError = null
            logger.info('Sentiment data updated', { count: data.length })
          }),

          setCapabilityData: (data) => set((state) => {
            state.capabilityData = data
            state.dataError = null
            logger.info('Capability data updated', { count: data.length })
          }),

          setOrganization: (org) => set((state) => {
            state.organization = org
          }),

          setAssessmentPeriods: (periods) => set((state) => {
            state.assessmentPeriods = periods
            // Auto-select most recent active period if none selected
            if (!state.currentPeriodId && periods.length > 0) {
              const activePeriods = periods.filter(p => p.status === 'active')
              const mostRecent = activePeriods.sort((a, b) =>
                new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime()
              )[0]
              if (mostRecent) {
                state.currentPeriodId = mostRecent.id
                state.currentPeriod = mostRecent
              }
            }
            logger.info('Assessment periods updated', { count: periods.length })
          }),

          setCurrentPeriod: (periodId) => set((state) => {
            state.currentPeriodId = periodId
            state.currentPeriod = state.assessmentPeriods.find(p => p.id === periodId) || null
            logger.info('Current period changed', { periodId, periodName: state.currentPeriod?.name })
          }),

          addAssessmentPeriod: (period) => set((state) => {
            state.assessmentPeriods.push(period)
            logger.info('Assessment period added', { periodId: period.id, name: period.name })
          }),

          setAppliedInterventions: (interventions) => set((state) => {
            state.appliedInterventions = interventions
            logger.info('Applied interventions updated', { count: interventions.length })
          }),

          addAppliedIntervention: (intervention) => set((state) => {
            state.appliedInterventions.push(intervention)
            logger.info('Intervention applied', { code: intervention.intervention_code })
          }),

          clearData: () => set((state) => {
            state.sentimentData = []
            state.capabilityData = []
            state.dataError = null
            state.assessmentPeriods = []
            state.currentPeriodId = null
            state.currentPeriod = null
            state.appliedInterventions = []
          }),

          // Filter Slice
          filters: defaultFilters,
          
          setFilters: (filters) => set((state) => {
            state.filters = { ...state.filters, ...filters }
            logger.debug('Filters updated', filters)
          }),
          
          resetFilters: () => set((state) => {
            state.filters = defaultFilters
          }),

          // Upload Slice
          uploads: [],
          currentUpload: null,
          uploadProgress: 0,
          
          addUpload: (upload) => set((state) => {
            state.uploads.push(upload)
            state.currentUpload = upload
          }),
          
          updateUploadStatus: (id, status) => set((state) => {
            const upload = state.uploads.find(u => u.id === id)
            if (upload) {
              upload.status = status
            }
          }),
          
          setUploadProgress: (progress) => set((state) => {
            state.uploadProgress = progress
          }),
          
          clearUploads: () => set((state) => {
            state.uploads = []
            state.currentUpload = null
            state.uploadProgress = 0
          }),

          // UI Slice
          ...defaultUIState,
          
          setTheme: (theme) => set((state) => {
            state.theme = theme
            document.documentElement.classList.toggle('dark', theme === 'dark')
          }),
          
          toggleSidebar: () => set((state) => {
            state.sidebarOpen = !state.sidebarOpen
          }),
          
          setActiveView: (view) => set((state) => {
            state.activeView = view
          }),
          
          addNotification: (notification) => set((state) => {
            state.notifications.push(notification)
            
            // Auto-remove after duration
            if (notification.duration) {
              setTimeout(() => {
                get().removeNotification(notification.id)
              }, notification.duration)
            }
          }),
          
          removeNotification: (id) => set((state) => {
            state.notifications = state.notifications.filter(n => n.id !== id)
          }),
          
          openModal: (modalId, data) => set((state) => {
            state.modals[modalId] = { isOpen: true, data }
          }),
          
          closeModal: (modalId) => set((state) => {
            if (state.modals[modalId]) {
              state.modals[modalId].isOpen = false
            }
          }),
          
          toggleChat: () => set((state) => {
            state.chatOpen = !state.chatOpen
          }),
          
          setChatOpen: (open) => set((state) => {
            state.chatOpen = open
          }),
          
          addChatMessage: (message) => set((state) => {
            state.chatMessages.push(message)
          }),
          
          clearChatHistory: () => set((state) => {
            state.chatMessages = []
          })
        }))
      ),
      {
        name: 'ai-navigator-store',
        partialize: (state) => ({
          // Only persist these fields
          user: state.user,
          theme: state.theme,
          filters: state.filters,
          sidebarOpen: state.sidebarOpen,
          currentPeriodId: state.currentPeriodId  // Persist selected period
        })
      }
    ),
    {
      name: 'AINavigatorStore'
    }
  )
)

// Selectors for legacy compatibility
// Note: For new components, use individual useStore((state) => state.x) selectors
// to prevent unnecessary re-renders
export const useAuth = () => ({
  user: useStore((state) => state.user),
  session: useStore((state) => state.session),
  isAuthenticated: useStore((state) => state.isAuthenticated),
  isLoading: useStore((state) => state.isLoading),
  setUser: useStore((state) => state.setUser),
  setSession: useStore((state) => state.setSession),
  logout: useStore((state) => state.logout)
})

export const useData = () => ({
  organization: useStore((state) => state.organization),
  sentimentData: useStore((state) => state.sentimentData),
  capabilityData: useStore((state) => state.capabilityData),
  isDataLoading: useStore((state) => state.isDataLoading),
  dataError: useStore((state) => state.dataError),
  assessmentPeriods: useStore((state) => state.assessmentPeriods),
  currentPeriodId: useStore((state) => state.currentPeriodId),
  currentPeriod: useStore((state) => state.currentPeriod),
  appliedInterventions: useStore((state) => state.appliedInterventions),
  setSentimentData: useStore((state) => state.setSentimentData),
  setCapabilityData: useStore((state) => state.setCapabilityData),
  setOrganization: useStore((state) => state.setOrganization),
  setAssessmentPeriods: useStore((state) => state.setAssessmentPeriods),
  setCurrentPeriod: useStore((state) => state.setCurrentPeriod),
  addAssessmentPeriod: useStore((state) => state.addAssessmentPeriod),
  setAppliedInterventions: useStore((state) => state.setAppliedInterventions),
  addAppliedIntervention: useStore((state) => state.addAppliedIntervention),
  clearData: useStore((state) => state.clearData)
})

export const useFilters = () => ({
  filters: useStore((state) => state.filters),
  setFilters: useStore((state) => state.setFilters),
  resetFilters: useStore((state) => state.resetFilters)
})

export const useUI = () => ({
  theme: useStore((state) => state.theme),
  sidebarOpen: useStore((state) => state.sidebarOpen),
  activeView: useStore((state) => state.activeView),
  notifications: useStore((state) => state.notifications),
  modals: useStore((state) => state.modals),
  chatOpen: useStore((state) => state.chatOpen),
  chatMessages: useStore((state) => state.chatMessages),
  setTheme: useStore((state) => state.setTheme),
  toggleSidebar: useStore((state) => state.toggleSidebar),
  setActiveView: useStore((state) => state.setActiveView),
  addNotification: useStore((state) => state.addNotification),
  removeNotification: useStore((state) => state.removeNotification),
  openModal: useStore((state) => state.openModal),
  closeModal: useStore((state) => state.closeModal),
  toggleChat: useStore((state) => state.toggleChat),
  setChatOpen: useStore((state) => state.setChatOpen),
  addChatMessage: useStore((state) => state.addChatMessage),
  clearChatHistory: useStore((state) => state.clearChatHistory)
})

// Optimized selectors for individual use
export const selectSentimentData = (state: AppStore) => state.sentimentData
export const selectCapabilityData = (state: AppStore) => state.capabilityData
export const selectOrganization = (state: AppStore) => state.organization
export const selectFilters = (state: AppStore) => state.filters
export const selectUser = (state: AppStore) => state.user

// Store subscriptions for side effects
useStore.subscribe(
  (state) => state.notifications,
  (notifications) => {
    // Log notifications for monitoring
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1]
      logger.info('Notification added', {
        type: latest.type,
        message: latest.message
      })
    }
  }
)

useStore.subscribe(
  (state) => state.dataError,
  (error) => {
    if (error) {
      logger.error('Data error occurred', { error })
    }
  }
)


