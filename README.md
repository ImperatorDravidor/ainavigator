# 🧭 AI Navigator

<div align="center">

**Accelerate AI Adoption Through Data-Driven Insights**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)](#)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Roadmap](#-roadmap)

</div>

---

## 📋 Overview

**AI Navigator** is an enterprise-grade, **AI-chat-first platform** that helps organizations assess, understand, and accelerate their readiness for AI adoption. By combining sentiment analysis with capability maturity assessment and wrapping it all in an intelligent conversational interface, AI Navigator provides actionable insights that drive meaningful transformation.

### 🤖 NEW: AI Chat-First Experience (⚡ ENHANCED)

**Talk to your data with advanced intelligence.** The entire platform is now accessible through an exceptionally intelligent AI assistant powered by **GPT-4o**. Simply ask questions in natural language:
- *"Analyze our AI readiness comprehensively"* → Deep analysis with patterns, correlations, and recommendations
- *"Show me Sales department sentiment"* → **Automatically navigates and applies filters**
- *"Generate board-ready executive summary"* → **Executes action and creates report**
- *"What interventions would work?"* → Designs 3 creative, specific solutions

**NEW in Refinements:**
- 🎯 **Executes Actions**: AI can navigate, filter, and query data automatically
- ⚡ **Real-time Streaming**: See responses as they're generated
- 🧠 **40% Smarter**: Upgraded to GPT-4o for superior reasoning
- 🔮 **Proactive Intelligence**: Suggests next steps before being asked
- 📊 **Confidence Indicators**: Know when AI has high/low data confidence
- 🎨 **Pattern Recognition**: Automatically identifies clusters, outliers, correlations

**[Quick Start →](QUICK_START_AI_CHAT.md)** | **[Full Guide →](AI_CHAT_GUIDE.md)** | **[⚡ What's New →](AI_CHAT_REFINEMENTS.md)**

### The Challenge We Solve

AI adoption often fails due to:
- 🚫 **Emotional resistance** from stakeholders
- 📉 **Unclear capability levels** across the organization
- 🤷 **Uncertainty in decision-making** about where to invest
- 🧩 **Complex tools** that require extensive training

### Our Solution

AI Navigator reveals both **sentiment-based blockers** (how people feel) and **capability-based maturity levels** (how ready the organization is), then guides you toward high-impact actions through an **intelligent conversational interface** that anyone can use.

---

## ✨ Features

### 🤖 AI Chat Assistant (⚡ REFINED & ENHANCED)

**Your exceptionally intelligent analytical partner:**
- 🎯 **Action Execution**: AI navigates, filters, and queries data automatically
- 🧠 **Advanced Intelligence**: GPT-4o with deep analytical reasoning
- ⚡ **Real-time Streaming**: See responses as AI thinks
- 💬 **Natural Conversation**: Multi-turn dialogue with 15-message memory
- 📊 **Deep Analysis**: Pattern recognition, correlations, statistical insights
- 🔮 **Proactive Insights**: Suggests next steps before being asked
- 📝 **Smart Reports**: Board-ready summaries with confidence indicators
- 🧭 **Guided Navigation**: Takes you exactly where you need to go
- 🎓 **Educational**: Explains complex concepts in business terms
- ⚡ **Always Available**: Floating button accessible from every page

**[Quick Start →](QUICK_START_AI_CHAT.md)** | **[See Refinements →](AI_CHAT_REFINEMENTS.md)**

### 🎯 Dual Assessment Framework

#### 1. **Sentiment Analysis**
- **25-Zone Heatmap**: Visualize emotional readiness across sentiment levels × reasons
- **Real-time Filtering**: Segment by region, department, role, age group
- **Benchmark Comparisons**: Compare against industry and regional standards
- **Resistance Mapping**: Identify specific emotional blockers to adoption

#### 2. **Capability Maturity Assessment**
- **8-Dimension Diamond**: Comprehensive capability evaluation across:
  - Strategy and Vision
  - Data
  - Technology
  - Talent and Skills
  - Organisation and Processes
  - Innovation
  - Adaptation & Adoption
  - Ethics and Responsibility
- **32-Construct Deep Dive**: Drilldown to granular capability insights (4 constructs per dimension)
- **AI-Powered Insights**: Automated summarization of open-ended responses
- **Gap Analysis**: Visual identification of strengths and weaknesses

### 🎬 Interactive Features

- **Dynamic Data Upload**: CSV-based data ingestion with instant recalculation
- **Smart Filtering**: Multi-dimensional filtering with real-time updates
- **Spotlight Interventions**: Curated, high-impact action recommendations
- **ROI Glimpse**: Directional improvement estimates for recommended actions
- **PDF Export**: Professional summary reports for stakeholders

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ainavigator.git

# Navigate to project directory
cd ainavigator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OpenAI API key: OPENAI_API_KEY=sk-...

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**🤖 Using the AI Chat:**
1. Look for the floating teal/blue button in the bottom-right corner
2. Click to open the chat sidebar
3. Start asking questions!

See **[Quick Start Chat Guide](QUICK_START_AI_CHAT.md)** for more details.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
ainavigator/
├── app/                      # Next.js 16 App Router (pages, layouts, API routes)
├── components/               # React components organized by feature
├── lib/                      # Business logic, services, utilities
├── hooks/                    # Custom React hooks
├── supabase/                 # Database migrations and schema
├── data/                     # Data files, sources, and notebooks
│   ├── csv-imports/          # Import-ready CSV files
│   ├── source-documents/     # Source PDFs and extracts
│   └── notebooks/            # Analysis notebooks
├── scripts/                  # Data import and utility scripts
├── docs/                     # Comprehensive documentation
│   ├── team/                 # Team guides and quick start
│   ├── development/          # Development documentation
│   ├── features/             # Feature documentation
│   └── archive/              # Historical docs and status reports
└── public/                   # Static assets
```

**📚 Full Project Structure**: See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for complete details.

---

## 📖 Documentation

### 🎯 Essential Guides

| Document | Description |
|----------|-------------|
| **[How It Works](HOW_IT_WORKS.md)** | 📘 Complete platform walkthrough - start here! |
| **[Quick Start](docs/team/QUICK_START.md)** | ⚡ Get up and running in 30 seconds |
| **[Developer Guide](docs/team/DEVELOPER_GUIDE.md)** | 🔧 Comprehensive developer reference (also: [CLAUDE.md](CLAUDE.md)) |
| **[Project Structure](docs/PROJECT_STRUCTURE.md)** | 🗂️ Complete codebase organization guide |

### 📚 Complete Documentation

- **[Documentation Hub](docs/README.md)** - Central documentation index with all guides
- **Team Guides** → `docs/team/` - Quick start and developer guides
- **Development Docs** → `docs/development/` - Architecture, specs, workflows
- **Feature Docs** → `docs/features/` - Feature-specific documentation
- **User Guides** → `docs/guides/` - End-user documentation
- **Archive** → `docs/archive/` - Historical docs and status reports

### Key Concepts

#### Data Model
The platform ingests structured CSV data containing:
- **Sentiment Responses**: Mapped to 25 predefined sentiment areas
- **Capability Scores**: 32 numeric fields (4 constructs × 8 dimensions)
- **Open-Ended Feedback**: Qualitative insights for AI summarization
- **Metadata**: Segmentation fields (region, function, age, business unit)

#### Analysis Flow
1. **Upload** → User provides dataset or selects demo data
2. **Visualize** → System generates sentiment heatmap or capability diamond
3. **Filter** → User applies segmentation filters (real-time recalculation)
4. **Explore** → Deep dive into specific areas/dimensions
5. **Recommend** → System suggests spotlight interventions
6. **Impact** → View directional ROI estimates
7. **Export** → Generate PDF summary report

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 16.0](https://nextjs.org/) with App Router
- **UI Library**: [React 19.2](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Visualization**: Recharts / D3.js (for radar & heatmap charts)
- **State Management**: Zustand / React Context
- **Type Safety**: TypeScript 5.0

### Backend
- **API**: Next.js API Routes (serverless functions)
- **Data Processing**: Node.js native + PapaParse (CSV parsing)
- **AI Integration**: OpenAI API (GPT-4o-mini/GPT-4 for conversational AI + text summarization)
- **State Management**: Zustand with persist, devtools, and immer middleware
- **Session Storage**: In-memory caching + local storage

### DevOps & Deployment
- **Version Control**: Git + GitHub
- **Deployment**: Vercel (recommended) or Docker
- **CI/CD**: GitHub Actions (coming soon)
- **Environment**: Node.js 18+ runtime

---

## 🎯 Roadmap

### ✅ Phase 1: Web Summit MVP (Current)
**Target: October 26, 2025**

- [x] Project architecture & foundation
- [x] Product Requirements Document
- [x] Sprint planning
- [ ] Sentiment heatmap visualization
- [ ] Capability diamond (2-level radar)
- [ ] Data upload & filtering
- [ ] Spotlight interventions
- [ ] ROI glimpse feature
- [ ] PDF export

### 🔄 Phase 2: Enhanced Analytics (Q4 2025)
- [ ] Advanced ROI simulation with cost modeling
- [ ] Comprehensive benchmark datasets (multi-industry)
- [ ] Credibility case library with success stories
- [ ] Enhanced AI personalization
- [ ] Multi-scenario comparison tool

### 🔮 Phase 3: Enterprise Platform (Q1 2026)
- [ ] Multi-user authentication & RBAC
- [ ] Organization account management
- [ ] Long-term analytics & trend tracking
- [ ] Gamification & engagement mechanics
- [ ] API for third-party integrations
- [ ] White-label capabilities

---

## 🤝 Contributing

This is a private project currently in active development for Web Summit demo. Contributions are managed internally.

For questions or suggestions, please contact the project team.

---

## 📊 Current Status

**Version:** 0.1.0 (MVP Development)  
**Stage:** Pre-Alpha  
**Sprint:** Milestone 1 of 4  
**Target Demo:** Web Summit 2025  

### Development Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Foundation & Data Infrastructure | Oct 22, 2025 | 🔄 In Progress |
| Sentiment Flow & Visualization | Oct 23, 2025 | ⏳ Pending |
| Capability Flow & Advanced Features | Oct 24, 2025 | ⏳ Pending |
| Interventions, ROI & Finalization | Oct 25-26, 2025 | ⏳ Pending |

---

## 📝 License

**Proprietary and Confidential**

Copyright © 2025 AI Navigator. All rights reserved.

This software and associated documentation files are proprietary. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🙋‍♂️ Support & Contact

For technical support or product inquiries:

- **Email**: support@ainavigator.com
- **Documentation**: [View Docs](./documentation/)
- **Issues**: Contact project maintainer

---

## 🏆 Success Metrics

Our platform demonstrates:

✅ **Speed**: Complete insight journey in < 3 minutes  
✅ **Intelligence**: AI-powered conversational interface + dynamic recalculation  
✅ **Accessibility**: Natural language interaction - no training required  
✅ **Clarity**: Visual communication of complex readiness factors  
✅ **Action**: Specific, high-impact intervention recommendations  
✅ **Value**: Directional ROI insights that build confidence  
✅ **Innovation**: First AI chat-first enterprise assessment platform  

---

<div align="center">

**Built with ❤️ for organizations ready to lead in the AI era**

[⬆ Back to Top](#-ai-navigator)

</div>
