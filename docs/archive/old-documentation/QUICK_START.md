# 🚀 Quick Start Guide - AI Navigator

**Get up and running with AI Navigator in 5 minutes**

---

## Prerequisites Check

Before starting, verify you have:

- ✅ **Node.js 18+** installed → Check with `node --version`
- ✅ **npm or yarn** → Check with `npm --version`
- ✅ **Git** → Check with `git --version`
- ✅ **Modern browser** (Chrome, Firefox, Safari, Edge)

---

## Installation (2 minutes)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/ainavigator.git
cd ainavigator
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 16.0
- React 19.2
- TypeScript 5.0
- Tailwind CSS 4.0
- All required dependencies

### Step 3: Environment Setup (Optional)

If API keys are needed:

```bash
# Create .env.local file
cp .env.example .env.local

# Edit with your credentials
# OPENAI_API_KEY=your_key_here
```

---

## Run Development Server (30 seconds)

```bash
npm run dev
```

✅ **Success!** Open [http://localhost:3000](http://localhost:3000)

You should see the AI Navigator landing page.

---

## Understanding the Demo (2 minutes)

### What You'll See

1. **Landing Page**
   - Option to upload CSV data
   - Option to use demo dataset
   - Choice between Sentiment or Capability flow

2. **Sentiment Flow** (Coming in Milestone 2)
   - 25-zone heatmap visualization
   - Filter by region, department, role
   - Click cells for details
   - View recommended interventions

3. **Capability Flow** (Coming in Milestone 3)
   - 8-dimension radar chart
   - Drilldown to 4-construct views
   - Benchmark comparisons
   - AI-generated insights

### Demo Data

Sample datasets are located in:
```
documentation/Database info/
├── AICapability_load_db/          # Capability assessment data
├── SentimentScan_load_db/         # Sentiment survey data
├── OECD_load_db/                  # Benchmark data
└── EUROSTAT_load_db/              # Economic indicators
```

---

## Available Commands

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

---

## Project Structure Overview

```
ainavigator/
├── app/                    # Next.js pages & routes
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── documentation/          # All docs & data
│   ├── prd.md             # Product requirements
│   ├── sprint-plan.md     # Development plan
│   └── Database info/     # Sample datasets
│
├── public/                 # Static assets
└── package.json           # Dependencies
```

---

## Current Development Status

**Version:** 0.1.0  
**Sprint:** Day 1 of 4  
**Milestone:** Foundation & Data Infrastructure

### ✅ Completed
- Project setup
- Documentation (PRD, Sprint Plan)
- Repository structure

### 🔄 In Progress (Today - Oct 22)
- Data upload module
- CSV parsing & validation
- Type definitions
- Aggregation logic

### ⏳ Coming Next
- Sentiment heatmap (Oct 23)
- Capability diamond (Oct 24)
- Interventions & ROI (Oct 25-26)

---

## Key Documentation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [README.md](../README.md) | Project overview & features | Start here |
| [PRD](./prd.md) | Complete product specification | Understanding requirements |
| [Sprint Plan](./sprint-plan.md) | Development roadmap | Planning & tracking |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Development guidelines | Before coding |

---

## Development Workflow

### Daily Routine

```bash
# 1. Pull latest changes
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Start dev server
npm run dev

# 4. Make changes & test
# ... code code code ...

# 5. Commit changes
git add .
git commit -m "feat: your feature description"

# 6. Push & create PR
git push origin feature/your-feature
```

### Before Each Commit

```bash
# Run linter
npm run lint

# Test build
npm run build

# Manual testing
npm run dev
```

---

## Testing Your Changes

### Manual Test Checklist

When you add a feature, verify:

1. **Functionality**
   - [ ] Feature works as expected
   - [ ] No console errors
   - [ ] Edge cases handled

2. **Visual**
   - [ ] Looks good in Chrome
   - [ ] Responsive (try mobile view)
   - [ ] Smooth interactions

3. **Data**
   - [ ] Handles empty data
   - [ ] Handles large datasets
   - [ ] Filters work correctly

---

## Common Issues & Solutions

### Port 3000 Already in Use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

```bash
# Check Node version
node --version  # Should be 18+

# Clean and rebuild
rm -rf .next
npm run build
```

---

## Next Steps

1. **Review Documentation**
   - Read [PRD.md](./prd.md) for product details
   - Check [Sprint Plan](./sprint-plan.md) for current tasks

2. **Set Up Development Environment**
   - Install VS Code extensions (ESLint, Prettier, Tailwind IntelliSense)
   - Configure Git user info

3. **Start Contributing**
   - Pick a task from current milestone
   - Create feature branch
   - Start coding!

---

## Need Help?

- 📚 **Documentation**: Check `/documentation` folder
- 🐛 **Bug Found**: Create issue with bug template
- 💡 **Feature Idea**: Create issue with feature template
- ❓ **Questions**: Contact project team

---

## Demo Checklist (For Presentations)

Before demoing to clients:

- [ ] Latest code pulled and built
- [ ] Demo dataset loaded
- [ ] All features tested
- [ ] No console errors
- [ ] Browser window sized properly
- [ ] Demo script prepared
- [ ] Backup plan ready (screenshots/video)

---

**🎉 You're ready to start developing!**

For detailed development guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md)

**Current Sprint Focus:** Milestone 1 - Foundation & Data Infrastructure (Due: Oct 22 EOD)


