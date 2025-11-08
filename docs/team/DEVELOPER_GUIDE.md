# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Navigator is an enterprise-grade, **AI-chat-first platform** for assessing AI adoption readiness. It combines sentiment analysis with capability maturity assessment, wrapped in an intelligent conversational interface. Built with Next.js 16 (App Router), React 19, TypeScript 5, Supabase, and OpenAI GPT-4o.

**Target Demo**: Web Summit 2025 MVP (October 26, 2025)

## Essential Commands

### Development
```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Create production build
npm start                # Start production server
npm run import-demo-data # Import demo data to Supabase (requires .env.local)
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking (tsc --noEmit)
npm run format           # Format with Prettier
npm run format:check     # Check formatting without changes
```

### Testing
```bash
npm test                 # Run all Jest tests
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:e2e         # Run Playwright E2E tests
npm run test:coverage    # Generate coverage report
```

### Data Management
```bash
npm run import-demo-data # Import demo sentiment data from CSV to Supabase
npx tsx scripts/import_interventions.py # Import interventions data
npx tsx scripts/import_capability_wide.py # Import capability assessment data
```

### Database Management (Supabase)
```bash
# Supabase CLI operations (if Supabase CLI is installed)
supabase db push         # Apply migrations to remote database
supabase db reset        # Reset local database (development only)
supabase migration new <name> # Create new migration file
supabase gen types typescript --local > lib/supabase/types.ts # Regenerate types
```

### Analysis
```bash
npm run analyze          # Analyze bundle size with next-bundle-analyzer
```

## Architecture Principles

### 1. **AI-Chat-First Architecture**

The platform features an **intelligent conversational AI** powered by GPT-4o that can:
- Execute actions (navigate, filter, query data)
- Analyze patterns and correlations
- Generate board-ready reports
- Provide proactive insights and suggestions

**AI System Location**: `lib/ai/`
- `chat-service.ts` - Core chat orchestration with streaming support
- `chat-prompts.ts` - System prompts and context generation
- `chat-actions.ts` - Action execution system (navigate, filter, query, generate, visualize)
- `chat-data-fetcher.ts` - Real-time data fetching for chat context
- `gpt-service.ts` - OpenAI API integration with GPT-4o
- `prompts.ts` - Additional prompt templates

**Action Execution System**:
The AI can execute actions through a handler-based system. When implementing new action handlers:
```typescript
import { executeAction, ActionExecutor } from '@/lib/ai/chat-actions'

const handlers: Partial<ActionExecutor> = {
  navigate: async (payload) => { /* Navigate to page */ },
  filter: async (payload) => { /* Apply filters */ },
  query: async (payload) => { /* Query data */ },
  generate: async (payload) => { /* Generate report */ },
  visualize: async (payload) => { /* Update visualization */ }
}

await executeAction(action, handlers)
```

**Chat API Routes**: `app/api/gpt/`
- `/api/gpt/chat` - Main chat endpoint with streaming
- `/api/gpt/analyze` - Deep analysis requests
- `/api/gpt/interventions` - Intervention recommendations
- `/api/gpt/summary` - Executive summary generation

### 2. **Database Layer - Supabase**

Full backend powered by Supabase PostgreSQL:

**Supabase Integration**: `lib/supabase/`
- `client.ts` - Supabase client configuration
- `types.ts` - Auto-generated database types

**Database Tables**:
- `respondents` - Survey response data (sentiment + capability scores)
- `assessment_periods` - Time-based assessment groupings
- `interventions` - Curated intervention recommendations
- `benchmarks_sentiment` - Industry sentiment benchmarks
- `benchmarks_capability` - Industry capability benchmarks
- `organizations` - Organization/company data

**API Routes for Data**: `app/api/data/`
- `/api/data/respondents` - Query respondent data with filters
- `/api/data/capability` - Capability assessment data
- `/api/data/assessment-periods` - Time period data

### 3. **Enterprise-Grade Structure**

The codebase follows strict separation of concerns:

- **`app/`**: Next.js App Router pages, layouts, and API routes
  - `app/page.tsx` - Landing page
  - `app/dashboard/page.tsx` - Main dashboard
  - `app/assessment/page.tsx` - Assessment flow
  - `app/demo/page.tsx` - Demo mode
  - `app/login/page.tsx` - Authentication
  - `app/upload/page.tsx` - Data upload
  - `app/api/` - API route handlers

- **`components/`**: React components
  - `ai-agent/` - AI chat interface components
  - `capability/` - Capability diamond visualizations
  - `sentiment/` - Sentiment heatmap components
  - `dashboard/` - Dashboard widgets
  - `chat/` - Chat UI components
  - `interventions/` - Intervention displays
  - `ui/` - Reusable UI components (45+ components)

- **`lib/`**: Core business logic layer
  - `ai/` - AI chat services and prompts
  - `calculations/` - Analysis algorithms (sentiment-ranking, capability-analysis)
  - `config/` - Environment-based configuration
  - `constants/` - Metadata (capability-metadata, sentiment-metadata)
  - `contexts/` - React contexts (theme-context)
  - `hooks/` - Custom React hooks (useAuth)
  - `services/` - Service layer (API, logger, error handling, benchmarks)
  - `store/` - Zustand state management with persistence
  - `supabase/` - Database client and types
  - `types/` - TypeScript type definitions (models, assessment, index)
  - `utils/` - Utility functions (security, pdfExport, index)

### 4. **State Management with Zustand**

The application uses a **slice-based Zustand store** (`lib/store/index.ts`) with middleware:
- **Immer** for immutable updates
- **Persist** for localStorage persistence (user, theme, filters, sidebarOpen)
- **DevTools** for debugging
- **SubscribeWithSelector** for granular subscriptions

**Store slices**:
- `AuthSlice`: user, session, authentication state
- `DataSlice`: sentimentData, capabilityData, organization
- `FilterSlice`: regions, departments, ageGroups, businessUnits, dateRange
- `UploadSlice`: file upload tracking and progress
- `UISlice`: theme, sidebar, activeView, notifications, modals
- `ChatSlice`: chatMessages, chatHistory, chatOpen

**Usage pattern**: Use specific selectors (`useAuth()`, `useData()`, `useFilters()`, `useUI()`) instead of the full store to optimize re-renders.

### 5. **Data Fetching with TanStack React Query**

The application uses **TanStack React Query v5** for server state management:
- Automatic caching and background refetching
- Optimistic updates
- Query invalidation and refetching
- DevTools for debugging (`@tanstack/react-query-devtools`)

**Common patterns**:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['sentimentData', filters],
  queryFn: () => fetchSentimentData(filters)
})

// Mutations
const mutation = useMutation({
  mutationFn: uploadData,
  onSuccess: () => queryClient.invalidateQueries(['sentimentData'])
})
```

### 6. **Error Management Architecture**

Centralized error handling via `lib/services/error.service.ts`:

**Error Categories**:
- `NETWORK`: Retry with exponential backoff
- `VALIDATION`: Show inline feedback
- `AUTHENTICATION`: Redirect to login
- `AUTHORIZATION`: Access denied message
- `BUSINESS_LOGIC`: User-friendly message
- `SYSTEM`: Log and show generic message

**Custom error classes**: `NetworkError`, `ValidationError`, `AuthenticationError`, `AuthorizationError`, `BusinessLogicError`, `SystemError`

All errors include metadata: category, severity, code, timestamp, context, recoverable flag.

### 7. **Type Safety**

- **Strict TypeScript**: No `any` types allowed (`strict: true` in tsconfig.json)
- **Database types**: Auto-generated from Supabase schema (`lib/supabase/types.ts`)
- **Domain models**: Comprehensive type definitions in `lib/types/models.ts`
  - `Organization`, `User`, `Session`
  - `SentimentResponse`, `CapabilityResponse` (in `lib/types/assessment.ts`)
  - `FilterState`, `HeatmapData`, `Recommendation`
  - `FileUpload`, `ChatMessage`

**Import path alias**: Use `@/` for imports (e.g., `@/lib/services/logger.service`)

## Data Flow & Business Logic

### Core Data Models

The platform handles two primary data types:

1. **Sentiment Data**: 25-zone heatmap (5 sentiment levels × 5 reason categories)
   - Tracks emotional readiness and resistance blockers
   - Includes demographic metadata (region, department, age, business unit)
   - Source: `respondents` table in Supabase

2. **Capability Data**: 8-dimension diamond chart with 32 constructs
   - **Dimensions**: Strategy & Vision, Data, Technology, Talent & Skills, Organisation & Processes, Innovation, Adaptation & Adoption, Ethics & Responsibility
   - Each dimension has 4 constructs for granular assessment
   - Source: Same `respondents` table with construct score columns

### Analysis Flow

1. **Upload**: CSV data ingestion with validation → Import to Supabase
2. **Visualize**: Generate sentiment heatmap or capability diamond from database
3. **Filter**: Real-time queries with Supabase filters (region, department, age, business unit)
4. **Explore**: Drill down into specific areas or dimensions
5. **AI Chat**: Ask questions, get insights, execute actions
6. **Recommend**: System suggests "spotlight interventions" from `interventions` table
7. **Impact**: View directional ROI estimates
8. **Export**: Generate PDF summary report

### Calculations Layer

**Sentiment Ranking** (`lib/calculations/sentiment-ranking.ts`):
- Aggregates sentiment responses into 25-zone heatmap (5 levels × 5 categories)
- Calculates percentages and rankings (1 = highest, 25 = lowest)
- Color-coded intensity mapping (green → yellow → red) based on relative ranking
- Supports filtering by region, department, age, business unit
- Returns both cell data and statistics (overall average, std dev, row/column averages)

**Key Function**:
```typescript
calculateSentimentHeatmap(
  data: any[],
  filters: FilterState
): { cells: SentimentCellData[], stats: SentimentStats }
```

**Capability Analysis** (`lib/calculations/capability-analysis.ts`):
- Aggregates construct scores into dimension averages (32 constructs → 8 dimensions)
- Generates radar chart data points for capability diamond visualization
- Identifies strengths (high scores) and gaps (low scores)
- Each dimension has 4 constructs that are averaged together

**Data Flow for Calculations**:
1. Raw data from Supabase (`respondents` table)
2. Apply filters (if any) via `FilterState`
3. Aggregate scores using calculation functions
4. Return structured data for visualization components
5. Components render using `recharts` library

### Service Layer

**API Service**: Standard HTTP client (using native fetch or axios)

**Logger Service** (`lib/services/logger.service.ts`):
- Structured logging with multiple levels (debug, info, warn, error, fatal)
- Automatic error capture and performance monitoring
- Remote log aggregation support (production)

**Benchmark Services**:
- `benchmark.service.ts` - Overview benchmarks
- `capability-benchmark.service.ts` - Capability-specific benchmarks
- Fetches industry and regional comparison data

**Category Data Service** (`lib/services/category-data.service.ts`):
- Provides metadata for sentiment categories and capability dimensions

## API Routes Structure

All API routes follow Next.js 16 App Router conventions with `route.ts` files.

### Authentication (`app/api/auth/`)
- `POST /api/auth/login` - User login with Supabase Auth
- `POST /api/auth/logout` - User logout

### Data Operations (`app/api/data/`)
- `GET /api/data/respondents` - Fetch respondent data with filters
- `GET /api/data/capability` - Capability assessment data
- `GET /api/data/assessment-periods` - Time period data

### Benchmarks (`app/api/benchmarks/`)
- `GET /api/benchmarks/overview` - Overview benchmark data
- `GET /api/benchmarks/sentiment` - Sentiment benchmarks
- `GET /api/benchmarks/capability` - Capability benchmarks

### Interventions (`app/api/interventions/`)
- `GET /api/interventions/sentiment` - Sentiment-based interventions
- `GET /api/interventions/capability` - Capability-based interventions
- `GET /api/interventions/[code]` - Specific intervention details

### AI Chat (`app/api/gpt/`)
- `POST /api/gpt/chat` - Conversational AI with streaming (supports streaming: true in body)
- `POST /api/gpt/analyze` - Deep analysis requests
- `POST /api/gpt/interventions` - AI-generated intervention recommendations
- `POST /api/gpt/summary` - Executive summary generation

### Taboos (`app/api/taboos/`)
- `GET /api/taboos` - Fetch taboo/sensitive topics data

## Security Measures

**Input Security** (`lib/utils/security.ts`):
- XSS attack prevention via sanitization
- CSRF token generation and validation
- File upload restrictions and validation
- Password strength validation utilities

**Network Security**:
- HTTPS only in production
- Supabase Row Level Security (RLS) policies
- API route authentication middleware
- CORS configuration

**Supabase Security**:
- Row Level Security (RLS) enabled on all tables
- Service role key only used in secure server contexts
- Anon key for client-side requests (limited permissions)

## Performance Optimization

### Data Fetching
- **TanStack React Query** for intelligent caching
- Automatic background refetching
- Optimistic updates for perceived performance
- Query deduplication

### Bundle Optimization
- Dynamic imports for code splitting
- Tree shaking with ES modules
- Image optimization with Next.js Image component
- React.memo, useMemo, useCallback for component optimization

## Development Guidelines

### Code Style
- Follow existing patterns in the codebase
- Use ESLint and Prettier configurations
- All functions should have TypeScript types (no implicit `any`)
- Services and utilities should have JSDoc comments

### Best Practices
- **SOLID principles**: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
- **DRY**: Abstract common functionality
- **KISS**: Prefer simplicity over complexity
- **Error handling**: Always use centralized error service
- **Logging**: Use logger service instead of console.log

### Import Organization
```typescript
// 1. External dependencies
import { create } from 'zustand'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal lib imports (use @ alias)
import { logger } from '@/lib/services/logger.service'
import { useStore } from '@/lib/store'
import type { User } from '@/lib/types/models'
import { supabase } from '@/lib/supabase/client'

// 3. Component imports
import { Button } from '@/components/ui/Button'
```

### State Management Patterns
```typescript
// ✅ Correct: Use specific selectors
const { user, isAuthenticated, logout } = useAuth()

// ❌ Wrong: Use full store (causes unnecessary re-renders)
const user = useStore(state => state.user)
const session = useStore(state => state.session)
```

### Error Handling Pattern
```typescript
import { errorService, NetworkError } from '@/lib/services/error.service'

try {
  const data = await fetchData()
} catch (error) {
  throw new NetworkError('Failed to fetch data', {
    endpoint: '/api/data',
    status: error.response?.status
  })
}
```

### Supabase Query Pattern
```typescript
import { supabase } from '@/lib/supabase/client'

// Fetch with filters
const { data, error } = await supabase
  .from('respondents')
  .select('*')
  .eq('region', 'EMEA')
  .gte('capability_strategy_vision_avg', 3)

if (error) throw error
return data
```

## Key Files & Locations

- **Store**: `lib/store/index.ts` - Central state management
- **Types**: `lib/types/models.ts`, `lib/types/assessment.ts` - TypeScript definitions
- **Supabase Client**: `lib/supabase/client.ts` - Database client
- **AI Chat**: `lib/ai/chat-service.ts` - Conversational AI
- **Services**: `lib/services/` - API, logger, error handling, benchmarks
- **Security**: `lib/utils/security.ts` - Security utilities
- **Config**: `lib/config/index.ts` - Environment configuration
- **Calculations**: `lib/calculations/` - Analysis algorithms
- **Constants**: `lib/constants/` - Metadata for capabilities and sentiment

## Environment Variables

Required environment variables (create `.env.local`):
```bash
# Next.js
NEXT_PUBLIC_ENVIRONMENT=development

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only, NEVER expose to client

# OpenAI
OPENAI_API_KEY=sk-your-api-key  # Required for AI chat features

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG_MODE=false
```

**Important Notes**:
- Copy `.env.example` to `.env.local` for local development
- Never commit `.env.local` or any file containing secrets
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` is server-side only - use for admin operations in API routes
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is client-side safe with RLS policies

## Common Patterns

### Adding a New Feature
1. Define types in `lib/types/models.ts` or `lib/types/assessment.ts`
2. Create database table in Supabase (if needed)
3. Add state slice to `lib/store/index.ts` if needed
4. Implement service layer in `lib/services/`
5. Create API route in `app/api/`
6. Create UI components in `components/`
7. Add page/route in `app/`
8. Use TanStack React Query for data fetching

### Creating a New Component

**Component Organization**:
- `components/ui/` - Reusable UI primitives (buttons, inputs, dialogs)
- `components/sentiment/` - Sentiment heatmap specific components
- `components/capability/` - Capability diamond specific components
- `components/dashboard/` - Dashboard widgets and layouts
- `components/ai-agent/` - AI chat interface components
- `components/chat/` - Chat UI components
- `components/interventions/` - Intervention display components

**Component Template**:
```typescript
// components/ui/NewComponent.tsx
'use client' // Required for client components in Next.js 16 App Router

import { logger } from '@/lib/services/logger.service'

interface NewComponentProps {
  title: string
  onAction: () => void
}

export function NewComponent({ title, onAction }: NewComponentProps) {
  // Component implementation
  // Use logger instead of console.log
  // Follow existing patterns from components/ui/
}
```

**Client vs Server Components**:
- Use `'use client'` directive for components with interactivity, hooks, or browser APIs
- Server components by default (no directive needed)
- All components in `components/` are typically client components due to interactivity
- API routes and page components can be server components

### Adding API Integration
```typescript
// app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { logger } from '@/lib/services/logger.service'

export async function GET(request: Request) {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    logger.error('API error', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
```

### Using AI Chat Service
```typescript
import { chatWithGPT } from '@/lib/ai/chat-service'

const response = await chatWithGPT(
  messages,
  platformContext,
  { stream: true }
)
```

## Debugging & Development Workflows

### Common Debugging Patterns

**Type Errors**:
```bash
# Run type checking before committing
npm run type-check

# TypeScript is in strict mode - no implicit any, undefined, or null
# All functions must have explicit types
```

**Supabase Query Debugging**:
```typescript
// Enable query logging in development
const { data, error } = await supabase
  .from('respondents')
  .select('*')
  .eq('region', 'EMEA')

console.log('Query result:', { data, error }) // Check for errors
if (error) {
  logger.error('Supabase query failed', error) // Use logger service
}
```

**AI Chat Debugging**:
```typescript
// Check chat service logs for action execution
// Actions are logged in chat-actions.ts with console.warn/error
// Enable DEBUG_MODE in .env.local for verbose logging
```

**Store Debugging**:
```typescript
// Zustand DevTools are enabled in development
// Open Redux DevTools extension to inspect state
// Use selective subscriptions to avoid re-render issues:

// ✅ Good - selective subscription
const user = useStore(state => state.user)

// ❌ Bad - subscribes to entire store
const store = useStore()
```

### Data Import Workflows

**Importing New Data**:
1. Place CSV files in `data-foundation/` directory
2. Use appropriate import script from `scripts/` directory
3. Verify data in Supabase dashboard
4. Run type generation if schema changed: `supabase gen types typescript`

**Python Import Scripts** (in `scripts/`):
- `import_interventions.py` - Import intervention recommendations
- `import_capability_wide.py` - Import capability scores (wide format)
- `import_real_capability_data.py` - Import real capability data
- `csv_to_sql.py` - General CSV to SQL conversion utility

### Database Migrations

**Creating Migrations**:
```bash
# Create new migration
supabase migration new <descriptive_name>

# Edit the .sql file in supabase/migrations/
# Apply migration
supabase db push
```

**Migration Naming Convention**:
- Use sequential numbers: `001_`, `002_`, etc.
- Descriptive names: `001_demo_schema.sql`, `002_add_capability_constructs.sql`
- Include both schema changes AND data loading if needed

### Performance Debugging

**React Query Debugging**:
```typescript
// Enable React Query DevTools (already configured)
// Open floating DevTools panel in development
// Check query status, cache, and refetch behavior
```

**Bundle Analysis**:
```bash
npm run analyze  # Opens bundle analyzer in browser
# Look for large dependencies or duplicate code
```

## Notes

- The project is in active MVP development for Web Summit 2025
- Current sprint: Milestone 1 of 4 (Foundation & Data Infrastructure)
- Next.js 16 uses the App Router (not Pages Router)
- React 19.2 is the current version
- All dates are managed with `date-fns` library
- CSV parsing uses `papaparse` library (for client-side parsing)
- Charts use `recharts` library
- Database: Supabase PostgreSQL with Row Level Security
- AI: OpenAI GPT-4o for chat and analysis
- State: Zustand with persistence middleware
- Data fetching: TanStack React Query v5
- TypeScript strict mode is enabled - all code must be fully typed
