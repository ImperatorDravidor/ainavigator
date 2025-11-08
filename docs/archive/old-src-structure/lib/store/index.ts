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

interface FileUpload {
  id: string
  name: string
  size: number
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error'
  progress: number
  error?: string
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
  setSentimentData: (data: SentimentResponse[]) => void
  setCapabilityData: (data: CapabilityResponse[]) => void
  setOrganization: (org: Organization | null) => void
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

interface UISlice {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  activeView: string
  notifications: Notification[]
  modals: ModalState
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setActiveView: (view: string) => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  openModal: (modalId: string, data?: any) => void
  closeModal: (modalId: string) => void
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
  modals: {}
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
          
          clearData: () => set((state) => {
            state.sentimentData = []
            state.capabilityData = []
            state.dataError = null
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
          sidebarOpen: state.sidebarOpen
        })
      }
    ),
    {
      name: 'AINavigatorStore'
    }
  )
)

// Selectors for optimized re-renders
export const useAuth = () => useStore((state) => ({
  user: state.user,
  session: state.session,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  setUser: state.setUser,
  setSession: state.setSession,
  logout: state.logout
}))

export const useData = () => useStore((state) => ({
  organization: state.organization,
  sentimentData: state.sentimentData,
  capabilityData: state.capabilityData,
  isDataLoading: state.isDataLoading,
  dataError: state.dataError,
  setSentimentData: state.setSentimentData,
  setCapabilityData: state.setCapabilityData,
  setOrganization: state.setOrganization,
  clearData: state.clearData
}))

export const useFilters = () => useStore((state) => ({
  filters: state.filters,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters
}))

export const useUI = () => useStore((state) => ({
  theme: state.theme,
  sidebarOpen: state.sidebarOpen,
  activeView: state.activeView,
  notifications: state.notifications,
  modals: state.modals,
  setTheme: state.setTheme,
  toggleSidebar: state.toggleSidebar,
  setActiveView: state.setActiveView,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  openModal: state.openModal,
  closeModal: state.closeModal
}))

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


