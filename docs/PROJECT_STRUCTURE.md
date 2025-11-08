# AI Navigator - Project Structure

**Last Updated**: November 7, 2025

This document provides a comprehensive overview of the codebase organization for the AI Navigator platform.

---

## 📁 Root Directory

```
ainavigator/
├── README.md                    # Project overview and quick start
├── CLAUDE.md                    # Claude Code developer guide
├── CONTRIBUTING.md              # Contribution guidelines
├── CHANGELOG.md                 # Version history and changes
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── .env.example                 # Environment variables template
```

**Keep the root clean!** Only essential configuration files and key documentation should live here.

---

## 🏗️ Source Code (`/`)

### Application Code (`app/`)
Next.js 16 App Router structure - all pages, layouts, and API routes.

```
app/
├── page.tsx                     # Landing page
├── layout.tsx                   # Root layout
├── globals.css                  # Global styles
├── dashboard/                   # Dashboard pages
├── assessment/                  # Assessment flow pages
├── demo/                        # Demo mode pages
├── login/                       # Authentication pages
├── upload/                      # Data upload pages
└── api/                         # API route handlers
    ├── auth/                    # Authentication endpoints
    ├── data/                    # Data query endpoints
    ├── benchmarks/              # Benchmark data endpoints
    ├── gpt/                     # AI chat endpoints
    ├── interventions/           # Intervention recommendation endpoints
    └── taboos/                  # Taboo/sensitive topics endpoints
```

### Components (`components/`)
React components organized by feature and function.

```
components/
├── ui/                          # Reusable UI primitives (48 components)
│   ├── Button.tsx
│   ├── Dialog.tsx
│   ├── Input.tsx
│   └── ... (45 more)
├── sentiment/                   # Sentiment heatmap visualizations
├── capability/                  # Capability diamond visualizations
├── dashboard/                   # Dashboard-specific widgets
├── ai-agent/                    # AI chat interface components
├── chat/                        # Chat UI components
├── interventions/               # Intervention display components
├── recommendations/             # Recommendation components
└── reports/                     # Report generation components
```

### Business Logic (`lib/`)
Core business logic, utilities, and services.

```
lib/
├── ai/                          # AI chat system
│   ├── chat-service.ts          # Core chat orchestration
│   ├── chat-prompts.ts          # System prompts and context
│   ├── chat-actions.ts          # Action execution (navigate, filter, etc.)
│   ├── chat-data-fetcher.ts    # Real-time data fetching
│   └── gpt-service.ts           # OpenAI API integration
├── calculations/                # Analysis algorithms
│   ├── sentiment-ranking.ts    # Sentiment heatmap calculations
│   └── capability-analysis.ts  # Capability diamond calculations
├── services/                    # Service layer
│   ├── logger.service.ts        # Structured logging
│   ├── error.service.ts         # Centralized error handling
│   ├── benchmark.service.ts     # Benchmark data services
│   └── category-data.service.ts # Category metadata services
├── store/                       # Zustand state management
│   └── index.ts                 # Central store with slices
├── supabase/                    # Supabase integration
│   ├── client.ts                # Supabase client
│   └── types.ts                 # Auto-generated database types
├── types/                       # TypeScript type definitions
│   ├── models.ts                # Domain models
│   ├── assessment.ts            # Assessment types
│   └── index.ts                 # Type exports
├── hooks/                       # Custom React hooks
├── constants/                   # Metadata and constants
│   ├── capability-metadata.ts
│   └── sentiment-metadata.ts
├── contexts/                    # React contexts
├── config/                      # Environment configuration
└── utils/                       # Utility functions
    ├── security.ts              # Security utilities (XSS, CSRF)
    └── pdfExport.ts             # PDF generation
```

### Custom Hooks (`hooks/`)
Reusable React hooks.

```
hooks/
├── useAuth.ts                   # Authentication state and actions
├── useFilters.ts                # Filter management
├── useData.ts                   # Data fetching hooks
└── useUI.ts                     # UI state management
```

---

## 📊 Data & Database

### Supabase (`supabase/`)
Database migrations and schema.

```
supabase/
├── migrations/                  # SQL migration files
│   ├── 001_demo_schema.sql
│   ├── 002_load_sentiment_data.sql
│   ├── 003_add_capability_constructs.sql
│   ├── 004_add_industry_continent.sql
│   ├── 005_capability_scores_proper.sql
│   ├── 006_remove_construct_columns.sql
│   └── 007_interventions_schema.sql
└── config.toml                  # Supabase configuration
```

**Database Tables**:
- `respondents` - Survey response data (sentiment + capability scores)
- `assessment_periods` - Time-based assessment groupings
- `interventions` - Curated intervention recommendations
- `benchmarks_sentiment` - Industry sentiment benchmarks
- `benchmarks_capability` - Industry capability benchmarks
- `organizations` - Organization/company data

### Data Directory (`data/`)
All data files, source documents, and notebooks organized by purpose.

```
data/
├── csv-imports/                 # CSV files ready for database import
│   ├── *.csv                    # Data files (sentiment, capability)
│   ├── csv_schema_definition.md # Data schema documentation
│   └── README.md                # Import instructions
├── source-documents/            # Source PDFs and extracts
│   ├── *.pdf                    # Original documents
│   └── *.json                   # Extracted content
├── notebooks/                   # Jupyter notebooks for analysis
└── README.md                    # Data directory guide
```

---

## 🛠️ Scripts & Tools

### Scripts (`scripts/`)
Data import and utility scripts.

```
scripts/
├── import-demo-data.ts          # TypeScript: Import demo sentiment data
├── import_interventions.py      # Python: Import interventions
├── import_capability_wide.py    # Python: Import capability scores
├── import_real_capability_data.py # Python: Import real data
├── csv_to_sql.py                # Python: CSV to SQL converter
└── extract_taboos.py            # Python: Extract taboo topics
```

**Usage**:
```bash
# TypeScript scripts
npm run import-demo-data

# Python scripts
python3 scripts/import_interventions.py
```

---

## 📚 Documentation

### Docs Directory (`docs/`)
Comprehensive project documentation.

```
docs/
├── README.md                    # Documentation index
├── PROJECT_STRUCTURE.md         # This file
├── team/                        # Team documentation
│   ├── QUICK_START.md           # Quick start guide for team
│   └── DEVELOPER_GUIDE.md       # Developer guide (copy of CLAUDE.md)
├── development/                 # Development documentation
│   ├── claude-sessions/         # Claude work session logs
│   └── ... (development guides)
├── features/                    # Feature documentation
├── guides/                      # User and developer guides
├── archive/                     # Archived documentation
│   ├── status-reports/          # Historical status reports
│   └── old-src-structure/       # Archived old code structure
└── project-info/                # Project planning documents
```

### Important Documentation Files

**For New Developers**:
- `/README.md` - Start here for project overview
- `/docs/team/QUICK_START.md` - Quick start guide
- `/CLAUDE.md` - Comprehensive developer guide for Claude Code
- `/docs/team/DEVELOPER_GUIDE.md` - Same as CLAUDE.md, easier to find

**For Contributors**:
- `/CONTRIBUTING.md` - Contribution guidelines
- `/CHANGELOG.md` - Version history

**For Understanding the System**:
- `lib/ai/` - AI chat system architecture
- `lib/calculations/` - Core analysis algorithms
- `supabase/migrations/` - Database schema evolution

---

## 🎨 Assets

### Public Assets (`public/`)
Static files served directly.

```
public/
├── images/                      # Image assets
├── fonts/                       # Custom fonts
└── favicon.ico                  # Favicon
```

---

## ⚙️ Configuration Files

### TypeScript
- `tsconfig.json` - TypeScript compiler configuration (strict mode enabled)

### Next.js
- `next.config.js` - Next.js framework configuration
- `next-env.d.ts` - Next.js type declarations

### Styling
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Linting & Formatting
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration

### Git
- `.gitignore` - Files to ignore in version control

### Environment
- `.env.example` - Environment variables template
- `.env.local` - Local environment variables (gitignored, create from .env.example)

---

## 🔍 Finding Things Quickly

### "Where do I find...?"

**Components**:
- UI primitives → `components/ui/`
- Feature components → `components/{feature-name}/`
- Layout components → `app/layout.tsx` or `components/dashboard/`

**Business Logic**:
- Data calculations → `lib/calculations/`
- API integration → `lib/services/`
- Type definitions → `lib/types/`
- State management → `lib/store/`

**AI Chat System**:
- Chat orchestration → `lib/ai/chat-service.ts`
- Action execution → `lib/ai/chat-actions.ts`
- Prompts and context → `lib/ai/chat-prompts.ts`
- API endpoints → `app/api/gpt/`

**Database**:
- Schema → `supabase/migrations/`
- Client → `lib/supabase/client.ts`
- Types → `lib/supabase/types.ts`

**Documentation**:
- Getting started → `/README.md`
- Developer guide → `/CLAUDE.md`
- Team docs → `/docs/team/`
- Feature docs → `/docs/features/`

**Data Import**:
- CSV files → `data/csv-imports/`
- Import scripts → `scripts/`
- Demo data → `npm run import-demo-data`

---

## 📊 Directory Tree (Condensed)

```
ainavigator/
├── 📄 Essential Docs (README, CLAUDE, CONTRIBUTING, CHANGELOG)
├── 🎯 app/                      # Next.js App Router (pages, layouts, API routes)
├── 🧩 components/               # React components by feature
├── 📚 lib/                      # Business logic, services, utilities
├── 🎣 hooks/                    # Custom React hooks
├── 🗄️ supabase/                 # Database migrations and schema
├── 📊 data/                      # Data files, sources, and notebooks
│   ├── csv-imports/             # Import-ready CSV files
│   ├── source-documents/        # Source PDFs and extracts
│   └── notebooks/               # Analysis notebooks
├── 🛠️ scripts/                  # Data import and utility scripts
├── 📖 docs/                     # Comprehensive documentation
│   ├── team/                    # Team guides
│   ├── development/             # Dev documentation
│   ├── features/                # Feature docs
│   ├── guides/                  # How-to guides
│   └── archive/                 # Historical docs
├── 🎨 public/                   # Static assets
└── ⚙️ Config files              # TypeScript, Next.js, Tailwind, ESLint, etc.
```

---

## 🎯 Best Practices

### Adding New Code

1. **New component**: `components/{feature}/ComponentName.tsx`
2. **New business logic**: `lib/{domain}/function-name.ts`
3. **New API route**: `app/api/{endpoint}/route.ts`
4. **New database table**: Create migration in `supabase/migrations/`
5. **New types**: Add to `lib/types/models.ts` or `lib/types/assessment.ts`

### Adding Documentation

1. **Feature docs**: `docs/features/{feature-name}.md`
2. **Developer guides**: `docs/development/{guide-name}.md`
3. **Team guides**: `docs/team/{guide-name}.md`

### File Naming Conventions

- **Components**: PascalCase (e.g., `SentimentHeatmap.tsx`)
- **Utilities**: kebab-case (e.g., `sentiment-ranking.ts`)
- **Types**: kebab-case with .ts extension (e.g., `assessment.ts`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`)
- **Services**: kebab-case with .service.ts suffix (e.g., `logger.service.ts`)

---

## 🚫 What NOT to Put Where

### ❌ Don't Put in Root
- Status reports (use `docs/archive/status-reports/`)
- Work logs (use `docs/development/claude-sessions/`)
- Temporary files (delete after use)
- Test data (use `data-foundation/`)

### ❌ Don't Mix
- UI components in `lib/` (use `components/`)
- Business logic in `components/` (use `lib/`)
- Types in component files (use `lib/types/`)

---

## 🔄 Maintenance

### When to Update This Document

- New major directories are added
- Significant reorganization occurs
- New team members need onboarding
- Directory purposes change

### Related Documents

- `/CLAUDE.md` - Developer guide for Claude Code
- `/docs/team/QUICK_START.md` - Quick start for team members
- `/CONTRIBUTING.md` - Contribution guidelines
- `/docs/development/` - Development guides

---

**Questions?** Check `/docs/team/` or ask in the team chat.
