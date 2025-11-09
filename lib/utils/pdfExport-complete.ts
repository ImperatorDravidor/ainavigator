/**
 * Complete PDF Export - The Gem of the Platform ✨
 * A comprehensive, narrative-driven report that tells the full AI readiness story
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface CompletePDFOptions {
  // Company context
  companyName: string
  industry?: string
  size?: string
  
  // Assessment metadata
  assessment: {
    date: string
    respondents: number
    readinessScore: number
    sentimentAverage: number | string  // Can be number or formatted string
    capabilityMaturity: number | string  // Can be number or formatted string
  }
  
  // Complete sentiment data
  sentimentData?: {
    stats: {
      overallAverage: number
      totalRespondents: number
      cellsAnalyzed: number
    }
    lowestCells: any[] // Full list
    highestCells?: any[]
    allCells?: any[] // All 25 dimensions
    problemCategories?: any[]
  }
  
  // Complete capability data
  capabilityData?: {
    overall: {
      average: number
      max: number
      min: number
    }
    dimensions: any[] // All 8 dimensions with full details
    weakestDimensions: any[]
    strongestDimensions?: any[]
  }
  
  // Interventions
  interventions?: any[]
  
  // Taboos data
  taboos?: {
    highlighted: any[]
    byCategory?: any[]
  }
  
  // Applied filters
  filters?: any
  
  // Visual captures
  elementIds?: {
    heatmap?: string
    radarChart?: string
    dashboard?: string
  }
}

// Brand colors
const C = {
  teal: { r: 20, g: 184, b: 166 },
  purple: { r: 168, g: 85, b: 247 },
  pink: { r: 236, g: 72, b: 153 },
  orange: { r: 249, g: 115, b: 22 },
  blue: { r: 59, g: 130, b: 246 },
  green: { r: 16, g: 185, b: 129 },
  red: { r: 239, g: 68, b: 68 },
  yellow: { r: 234, g: 179, b: 8 },
  gray: { r: 107, g: 114, b: 128 },
  dark: { r: 31, g: 41, b: 55 }
}

/**
 * Generate comprehensive narrative PDF report
 */
export async function generateCompletePDF(options: CompletePDFOptions): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const W = pdf.internal.pageSize.getWidth()
    const H = pdf.internal.pageSize.getHeight()
    const M = 18 // margin
    const CW = W - 2 * M // content width
    let Y = M

    // ==================== HELPERS ====================
    
    const newPage = () => {
      pdf.addPage()
      Y = M
      footer()
    }

    const space = (needed = 40) => {
      if (Y + needed > H - M - 5) {
        newPage()
        return true
      }
      return false
    }

    const txt = (content: string, size = 10, bold = false, color = C.dark) => {
      pdf.setFontSize(size)
      pdf.setFont('helvetica', bold ? 'bold' : 'normal')
      pdf.setTextColor(color.r, color.g, color.b)
      const lines = pdf.splitTextToSize(content, CW)
      space(lines.length * size * 0.35 + 5)
      pdf.text(lines, M, Y)
      Y += lines.length * size * 0.35 + 3
    }

    const grad = (x: number, y: number, w: number, h: number, c1: any, c2: any) => {
      const steps = 25
      for (let i = 0; i < steps; i++) {
        const t = i / steps
        pdf.setFillColor(
          Math.round(c1.r + (c2.r - c1.r) * t),
          Math.round(c1.g + (c2.g - c1.g) * t),
          Math.round(c1.b + (c2.b - c1.b) * t)
        )
        pdf.rect(x, y + (h / steps) * i, w, h / steps, 'F')
      }
    }

    const circ = (x: number, y: number, r: number, color: any, opacity = 0.1) => {
      pdf.setFillColor(color.r, color.g, color.b)
      pdf.setGState(new (pdf as any).GState({ opacity }))
      pdf.circle(x, y, r, 'F')
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }))
    }

    const footer = () => {
      const fY = H - 8
      // Gradient line above footer
      grad(0, fY - 3, W, 0.3, C.teal, C.purple)
      
      pdf.setFontSize(7)
      pdf.setTextColor(150, 150, 150)
      pdf.text('LeadingWith.AI - AI Navigator Platform', W / 2, fY, { align: 'center' })
      pdf.text(options.companyName, M, fY)
      const p = (pdf as any).internal.getNumberOfPages()
      pdf.text(`${p}`, W - M, fY, { align: 'right' })
    }

    // Visual progress bar
    const progressBar = (x: number, y: number, w: number, value: number, max: number, color: any, label?: string) => {
      pdf.setFillColor(240, 240, 240)
      pdf.roundedRect(x, y, w, 3.5, 1.5, 1.5, 'F')
      
      const fillW = Math.min(w, (value / max) * w)
      if (fillW > 0) {
        pdf.setFillColor(color.r, color.g, color.b)
        pdf.roundedRect(x, y, fillW, 3.5, 1.5, 1.5, 'F')
      }
      
      if (label) {
        pdf.setFontSize(7)
        pdf.setTextColor(color.r, color.g, color.b)
        pdf.setFont('helvetica', 'bold')
        const pct = Math.round((value / max) * 100)
        pdf.text(label, x, y - 2)
        pdf.text(`${pct}%`, x + w + 2, y + 2.5)
      }
    }

    // Visual separator
    const separator = () => {
      Y += 4
      grad(M, Y, CW, 0.4, C.gray, C.purple)
      Y += 6
    }

    // Callout box for key insights
    const callout = (title: string, content: string, icon: string, color: any) => {
      space(26)
      
      const bg = {
        r: Math.min(255, color.r + 232),
        g: Math.min(255, color.g + 232),
        b: Math.min(255, color.b + 232)
      }
      
      pdf.setFillColor(bg.r, bg.g, bg.b)
      pdf.setDrawColor(color.r, color.g, color.b)
      pdf.setLineWidth(0.6)
      pdf.roundedRect(M, Y, CW, 23, 3, 3, 'FD')
      
      // Left accent bar
      pdf.setFillColor(color.r, color.g, color.b)
      pdf.rect(M, Y, 2, 23, 'F')
      
      pdf.setTextColor(color.r, color.g, color.b)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${icon} ${title}`, M + 5, Y + 7)
      
      pdf.setTextColor(60, 60, 60)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      const lines = pdf.splitTextToSize(content, CW - 10)
      pdf.text(lines, M + 5, Y + 12)
      
      Y += 25
    }

    // Stat badge inline
    const badge = (text: string, color: any) => {
      return { text, color }
    }

    const sectionHeader = (title: string, subtitle: string, color: any) => {
      pdf.setTextColor(color.r, color.g, color.b)
      pdf.setFontSize(22)
      pdf.setFont('helvetica', 'bold')
      pdf.text(title, M, Y)
      grad(M, Y + 3, title.length * 3, 1.5, color, C.pink)
      Y += 11
      
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      txt(subtitle)
      Y += 3
    }

    const metricCard = (x: number, y: number, w: number, h: number, label: string, value: string, sub: string, color: any) => {
      const light = {
        r: Math.min(255, color.r + 210),
        g: Math.min(255, color.g + 210),
        b: Math.min(255, color.b + 210)
      }
      pdf.setFillColor(light.r, light.g, light.b)
      pdf.setDrawColor(color.r, color.g, color.b)
      pdf.setLineWidth(0.7)
      pdf.roundedRect(x, y, w, h, 3, 3, 'FD')
      
      pdf.setTextColor(color.r, color.g, color.b)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.text(label, x + w/2, y + 6, { align: 'center' })
      
      pdf.setFontSize(26)
      pdf.text(value, x + w/2, y + 18, { align: 'center' })
      
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      pdf.text(sub, x + w/2, y + 24, { align: 'center' })
    }

    // ==================== COVER PAGE ====================
    
    // Stunning gradient hero
    grad(0, 0, W, 120, C.teal, C.purple)
    
    // Floating decorative elements
    circ(12, 22, 32, C.pink, 0.2)
    circ(W - 12, 70, 40, C.orange, 0.18)
    circ(W/2, 40, 20, C.teal, 0.15)
    circ(W - 30, 25, 15, C.pink, 0.25)
    
    // Report title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(42)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI Readiness', W / 2, 42, { align: 'center' })
    pdf.setFontSize(38)
    pdf.text('Assessment Report', W / 2, 60, { align: 'center' })

    // Company info
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'normal')
    pdf.text(options.companyName, W / 2, 80, { align: 'center' })
    
    if (options.industry) {
      pdf.setFontSize(14)
      pdf.text(options.industry, W / 2, 93, { align: 'center' })
    }
    
    Y = 130
    pdf.setTextColor(100, 100, 100)
    pdf.setFontSize(10)
    pdf.text(`Assessment Date: ${options.assessment.date}`, W / 2, Y, { align: 'center' })
    Y += 6
    pdf.text(`${options.assessment.respondents.toLocaleString()} Employees Surveyed`, W / 2, Y, { align: 'center' })
    Y += 6
    pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, W / 2, Y, { align: 'center' })
    
    // ==================== EXECUTIVE SUMMARY ====================
    Y = 155
    
    sectionHeader('Executive Summary', 'Your AI readiness at a glance - the story your data tells.', C.teal)
    Y += 2

    // Beautiful three-card layout
    const cW = (CW - 8) / 3
    metricCard(M, Y, cW, 30, 'AI READINESS',
      `${options.assessment.readinessScore}%`,
      options.assessment.readinessScore >= 75 ? 'Strong' : options.assessment.readinessScore >= 60 ? 'Moderate' : 'Developing',
      C.teal)
    
    const sentimentValue = typeof options.assessment.sentimentAverage === 'string' 
      ? options.assessment.sentimentAverage 
      : Number(options.assessment.sentimentAverage).toFixed(1)
    const capabilityValue = typeof options.assessment.capabilityMaturity === 'string'
      ? options.assessment.capabilityMaturity
      : Number(options.assessment.capabilityMaturity).toFixed(1)
    
    metricCard(M + cW + 4, Y, cW, 30, 'SENTIMENT',
      sentimentValue,
      'out of 5.0',
      C.purple)
    
    metricCard(M + 2*cW + 8, Y, cW, 30, 'CAPABILITY',
      capabilityValue,
      'out of 10.0',
      C.blue)
    
    Y += 38

    // Enhanced narrative insights with visual elements
    pdf.setFillColor(249, 250, 251)
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(M, Y, CW, 50, 3, 3, 'FD')
    
    pdf.setTextColor(50, 50, 50)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text('The Story Your Data Tells', M + 4, Y + 7)
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(70, 70, 70)
    
    const readiness = options.assessment.readinessScore
    const nY = Y + 13
    
    // Main narrative
    if (readiness >= 75) {
      txt(`Your organization demonstrates strong AI readiness at ${readiness}%. You have solid foundations with both employee sentiment and organizational capabilities well-aligned for AI adoption.`, 9)
    } else if (readiness >= 60) {
      txt(`At ${readiness}%, your organization shows moderate AI readiness with a solid foundation. Strategic improvements in key areas will accelerate your transformation journey.`, 9)
    } else {
      txt(`Your organization is in the developing stage at ${readiness}% readiness. This represents significant growth opportunity - with the right interventions, you can build strong AI capabilities.`, 9)
    }
    Y = nY + 13
    
    // Key findings bullets
    const findings = []
    if (options.sentimentData?.stats) {
      findings.push(`• ${options.sentimentData.stats.totalRespondents} employees surveyed across ${options.sentimentData.stats.cellsAnalyzed || 25} sentiment dimensions`)
      findings.push(`• Overall sentiment: ${options.sentimentData.stats.overallAverage.toFixed(1)}/5.0 - ${options.sentimentData.stats.overallAverage >= 3.5 ? 'generally supportive' : options.sentimentData.stats.overallAverage >= 3.0 ? 'cautiously neutral' : 'showing significant concern'}`)
    }
    if (options.capabilityData?.overall) {
      findings.push(`• Capability maturity: ${options.capabilityData.overall.average.toFixed(1)}/10.0 across 8 strategic dimensions`)
      const above = options.capabilityData.dimensions?.filter(d => d.average >= d.benchmark).length || 0
      findings.push(`• ${above} dimensions exceed industry benchmarks, ${8 - above} need strengthening`)
    }
    if (options.interventions && options.interventions.length > 0) {
      findings.push(`• ${options.interventions.length} targeted interventions identified with estimated 30-50% ROI`)
    }
    
    pdf.setFontSize(8)
    findings.forEach(f => {
      pdf.text(f, M + 4, Y)
      Y += 4.5
    })
    
    Y += 8

    footer()

    // ==================== PAGE 2: THE CHALLENGE ====================
    newPage()
    
    // Narrative introduction
    pdf.setTextColor(C.purple.r, C.purple.g, C.purple.b)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Chapter 1: Understanding the Challenge', M, Y)
    grad(M, Y + 3, 85, 2, C.purple, C.pink)
    Y += 12
    
    pdf.setTextColor(70, 70, 70)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    txt('AI transformation isn\'t just about technology - it\'s about people. This assessment reveals how your employees really feel about AI and where organizational capabilities need strengthening.')
    Y += 5

    // Why this matters box
    pdf.setFillColor(250, 245, 255)
    pdf.setDrawColor(C.purple.r, C.purple.g, C.purple.b)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(M, Y, CW, 35, 3, 3, 'FD')
    
    pdf.setTextColor(C.purple.r, C.purple.g, C.purple.b)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(' Why This Assessment Matters', M + 4, Y + 6)
    
    pdf.setTextColor(70, 70, 70)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    
    const whyMatters = [
      '✓ 70% of AI initiatives fail due to organizational resistance, not technology',
      '✓ Understanding sentiment helps identify hidden barriers ("taboos") that block adoption',
      '✓ Capability gaps reveal systemic weaknesses that need strategic investment',
      '✓ Early intervention prevents costly failures and accelerates time-to-value'
    ]
    
    let wmY = Y + 13
    whyMatters.forEach(point => {
      pdf.text(point, M + 4, wmY)
      wmY += 5
    })
    
    Y += 40

    // ==================== SENTIMENT DEEP DIVE ====================
    
    sectionHeader('Employee Sentiment Analysis', 
      `How ${options.assessment.respondents} employees feel about AI across 25 dimensions.`, 
      C.purple)

    // Three-card summary
    if (options.sentimentData?.stats) {
      const bW = (CW - 6) / 3
      const bY = Y
      
      metricCard(M, bY, bW, 26, 'RESPONSES',
        options.sentimentData.stats.totalRespondents.toString(),
        'employees analyzed', C.teal)
      
      metricCard(M + bW + 3, bY, bW, 26, 'OVERALL SCORE',
        options.sentimentData.stats.overallAverage.toFixed(1),
        'out of 5.0', C.purple)
      
      const priority = options.sentimentData.lowestCells?.length || 0
      metricCard(M + 2*bW + 6, bY, bW, 26, 'PRIORITY AREAS',
        priority.toString(),
        'need attention', C.orange)
      
      Y = bY + 30
    }

    // Narrative: What we found
    pdf.setFillColor(249, 250, 251)
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(M, Y, CW, 28, 3, 3, 'FD')
    
    pdf.setTextColor(50, 50, 50)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(' What We Found', M + 4, Y + 6)
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(70, 70, 70)
    
    let wfY = Y + 12
    if (options.sentimentData?.stats) {
      const avg = options.sentimentData.stats.overallAverage
      const interpretation = avg >= 3.5 ? 'generally positive and supportive of AI adoption' :
                           avg >= 3.0 ? 'neutral with pockets of concern that need addressing' :
                           avg >= 2.5 ? 'showing significant concern requiring immediate intervention' :
                           'demonstrating strong resistance that must be understood and addressed'
      
      pdf.text(`Across 25 sentiment dimensions, your employees are ${interpretation}.`, M + 4, wfY)
      wfY += 4.5
      
      const priority = options.sentimentData.lowestCells?.length || 0
      if (priority > 0) {
        pdf.text(`We identified ${priority} priority areas where sentiment is notably low. These represent`, M + 4, wfY)
        wfY += 4.5
        pdf.text(`specific fears or concerns ("taboos") that, if left unaddressed, will slow adoption.`, M + 4, wfY)
      }
    }
    
    Y += 32

    // Priority Concern Areas - THE STORY
    if (options.sentimentData?.lowestCells && options.sentimentData.lowestCells.length > 0) {
      space(50)
      
      pdf.setTextColor(C.orange.r, C.orange.g, C.orange.b)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(' Priority Concern Areas', M, Y)
      Y += 8

      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(80, 80, 80)
      txt('These specific combinations of sentiment level × reason show the strongest resistance. Each represents a cluster of related fears or concerns that require targeted intervention.')
      Y += 3

      options.sentimentData.lowestCells.slice(0, 8).forEach((cell, idx) => {
        space(19)
        
        // Beautiful gradient card
        const cardColor = cell.score < 2.5 ? C.red : cell.score < 3.0 ? C.orange : C.yellow
        const lightBg = {
          r: Math.min(255, cardColor.r + 230),
          g: Math.min(255, cardColor.g + 230),
          b: Math.min(255, cardColor.b + 230)
        }
        
        pdf.setFillColor(lightBg.r, lightBg.g, lightBg.b)
        pdf.setDrawColor(cardColor.r, cardColor.g, cardColor.b)
        pdf.setLineWidth(0.6)
        pdf.roundedRect(M, Y, CW, 16, 2, 2, 'FD')
        
        // Number badge
        pdf.setFillColor(cardColor.r, cardColor.g, cardColor.b)
        pdf.circle(M + 5, Y + 8, 3.5, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${idx + 1}`, M + 5, Y + 9.2, { align: 'center' })
        
        // Title
        pdf.setTextColor(40, 40, 40)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${cell.levelName} × ${cell.categoryName}`, M + 11, Y + 5)
        
        // Score badge (right side)
        pdf.setFillColor(cardColor.r, cardColor.g, cardColor.b)
        pdf.roundedRect(CW + M - 26, Y + 2, 24, 6, 1.5, 1.5, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${cell.score?.toFixed(2)}`, CW + M - 14, Y + 5.5, { align: 'center' })
        
        // Details line
        pdf.setTextColor(70, 70, 70)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(7)
        pdf.text(`Affects ${cell.count || 0} employees • Rank #${cell.rank} of 25`, M + 11, Y + 10)
        
        // What this means
        pdf.setFontSize(7)
        pdf.setTextColor(90, 90, 90)
        pdf.setFont('helvetica', 'italic')
        const meaning = getMeaningForCell(cell.levelName, cell.categoryName)
        const meanLines = pdf.splitTextToSize(meaning, CW - 14)
        pdf.text(meanLines.slice(0, 1), M + 11, Y + 13.5)

        Y += 18
      })
    }

    // ==================== HIGHLIGHTED TABOOS ====================
    if (options.taboos?.highlighted && options.taboos.highlighted.length > 0) {
      space(50)
      
      pdf.setTextColor(C.pink.r, C.pink.g, C.pink.b)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(' Highlighted AI Taboos', M, Y)
      Y += 8

      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(80, 80, 80)
      txt('Specific unspoken fears and concerns ("taboos") detected in your organization that inhibit AI adoption.')
      Y += 3

      options.taboos.highlighted.slice(0, 6).forEach((taboo, idx) => {
        space(22)
        
        pdf.setFillColor(253, 242, 248)
        pdf.setDrawColor(C.pink.r, C.pink.g, C.pink.b)
        pdf.setLineWidth(0.5)
        pdf.roundedRect(M, Y, CW, 19, 2, 2, 'FD')
        
        // Badge
        pdf.setFillColor(C.pink.r, C.pink.g, C.pink.b)
        pdf.roundedRect(M + 3, Y + 3, 15, 6, 1.5, 1.5, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'bold')
        pdf.text(taboo.code || `T${idx + 1}`, M + 10.5, Y + 6.5, { align: 'center' })
        
        // Title
        pdf.setTextColor(C.pink.r, C.pink.g, C.pink.b)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.text(taboo.name || taboo.title, M + 21, Y + 6)
        
        // Description
        pdf.setTextColor(70, 70, 70)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(7)
        const tabooDesc = pdf.splitTextToSize(taboo.description || taboo.summary || '', CW - 24)
        pdf.text(tabooDesc.slice(0, 2), M + 21, Y + 11)

        Y += 21
      })
    }

    footer()

    // ==================== CAPABILITY ASSESSMENT ====================
    newPage()
    
    sectionHeader('Organizational Capability Assessment',
      `Your organizational readiness across 8 strategic dimensions.`,
      C.blue)

    // Three stats
    if (options.capabilityData?.overall) {
      const bW = (CW - 6) / 3
      const bY = Y
      
      metricCard(M, bY, bW, 26, 'AVERAGE',
        options.capabilityData.overall.average.toFixed(1),
        'out of 10.0', C.teal)
      
      const above = options.capabilityData.dimensions?.filter(d => d.average >= d.benchmark).length || 0
      metricCard(M + bW + 3, bY, bW, 26, 'ABOVE BENCHMARK',
        above.toString(),
        'dimensions', C.green)
      
      const below = options.capabilityData.dimensions?.filter(d => d.average < d.benchmark).length || 0
      metricCard(M + 2*bW + 6, bY, bW, 26, 'NEED FOCUS',
        below.toString(),
        'dimensions', C.orange)
      
      Y = bY + 30
    }

    // Narrative box
    pdf.setFillColor(249, 250, 251)
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(M, Y, CW, 32, 3, 3, 'FD')
    
    pdf.setTextColor(50, 50, 50)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(' Capability Landscape', M + 4, Y + 6)
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(70, 70, 70)
    
    let clY = Y + 12
    if (options.capabilityData?.overall) {
      const avg = options.capabilityData.overall.average
      const interpretation = avg >= 7 ? 'mature and well-developed' :
                           avg >= 5.5 ? 'moderately strong with room for enhancement' :
                           avg >= 4 ? 'developing with targeted gaps to address' :
                           'in early stages requiring strategic investment'
      
      pdf.text(`Your organizational capabilities are ${interpretation}, averaging ${avg.toFixed(1)}/10.0`, M + 4, clY)
      clY += 4.5
      pdf.text(`across 8 critical dimensions. This assessment compares your organization against industry`, M + 4, clY)
      clY += 4.5
      pdf.text(`benchmarks and identifies both strengths to leverage and gaps to close.`, M + 4, clY)
    }
    
    Y += 36

    // Full dimension table with beautiful formatting
    if (options.capabilityData?.dimensions && options.capabilityData.dimensions.length > 0) {
      space(75)
      
      pdf.setTextColor(C.blue.r, C.blue.g, C.blue.b)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Complete Dimension Breakdown', M, Y)
      Y += 8

      // Table header with gradient
      grad(M, Y, CW, 7, C.blue, C.teal)
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'bold')
      pdf.text('DIMENSION', M + 2, Y + 4.5)
      pdf.text('SCORE', M + 85, Y + 4.5, { align: 'right' })
      pdf.text('BENCHMARK', M + 110, Y + 4.5, { align: 'right' })
      pdf.text('GAP', M + 135, Y + 4.5, { align: 'right' })
      pdf.text('STATUS', M + 152, Y + 4.5, { align: 'right' })
      Y += 8

      options.capabilityData.dimensions.forEach((dim, idx) => {
        space(12)
        
        pdf.setFillColor(idx % 2 === 0 ? 249 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 251 : 255)
        pdf.rect(M, Y, CW, 10, 'F')

        const score = dim.average || 0
        const bench = dim.benchmark || 0
        const gap = score - bench
        
        // Name with icon
        pdf.setTextColor(50, 50, 50)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(9)
        const name = dim.name.length > 32 ? dim.name.substring(0, 29) + '...' : dim.name
        pdf.text(name, M + 2, Y + 4)
        
        // Visual progress bar for the score
        const barW = 45
        progressBar(M + 2, Y + 6, barW, score, 10, gap >= 0 ? C.green : C.orange)
        
        // Score value
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(gap >= 0 ? C.green.r : C.orange.r,
                        gap >= 0 ? C.green.g : C.orange.g,
                        gap >= 0 ? C.green.b : C.orange.b)
        pdf.setFontSize(10)
        pdf.text(score.toFixed(1), M + 93, Y + 5, { align: 'right' })
        
        // Benchmark (just the number)
        pdf.setTextColor(C.gray.r, C.gray.g, C.gray.b)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.text(bench.toFixed(1), M + 118, Y + 5, { align: 'right' })
        
        // Gap with visual indicator
        pdf.setTextColor(gap >= 0 ? C.green.r : C.red.r,
                        gap >= 0 ? C.green.g : C.red.g,
                        gap >= 0 ? C.green.b : C.red.b)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(9)
        const gapText = gap >= 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)
        pdf.text(gapText, M + 143, Y + 5, { align: 'right' })
        
        // Status badge (clean text, no emojis that might cause encoding issues)
        const status = gap >= 0.5 ? 'STRONG' : gap >= 0 ? 'GOOD' : gap >= -1 ? 'BELOW' : 'CRITICAL'
        const statusC = gap >= 0.5 ? C.green : gap >= 0 ? C.teal : gap >= -1 ? C.orange : C.red
        pdf.setFillColor(statusC.r, statusC.g, statusC.b)
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'bold')
        const statusW = status.length * 1.5 + 4
        pdf.roundedRect(M + CW - statusW - 2, Y + 2, statusW, 5, 1.5, 1.5, 'F')
        pdf.text(status, M + CW - statusW/2 - 2, Y + 5, { align: 'center' })

        Y += 11
      })

      Y += 5
      
      // Add comparison context callout
      callout('Industry Context', 
        `Your average capability of ${options.capabilityData.overall.average.toFixed(1)}/10.0 compares to an industry average of 4.5. Organizations in the top quartile average 6.5+, while transformation leaders achieve 8.0+.`,
        '', C.blue)
    }

    // ==================== INTERVENTIONS - THE SOLUTIONS ====================
    if (options.interventions && options.interventions.length > 0) {
      newPage()
      
      sectionHeader('Recommended Interventions',
        `${options.interventions.length} targeted actions to accelerate your AI transformation journey.`,
        C.orange)

      // Intervention philosophy callout
      callout('Our Approach',
        'These interventions are data-driven, generated from your specific gaps. Each addresses real concerns from your employees and measurable capability weaknesses. They\'re designed to work together as a coordinated program.',
        '', C.orange)

      Y += 3

      options.interventions.forEach((intervention, idx) => {
        space(42)
        
        // Beautiful card with gradient accent
        pdf.setFillColor(255, 250, 245)
        pdf.setDrawColor(C.orange.r, C.orange.g, C.orange.b)
        pdf.setLineWidth(0.8)
        pdf.roundedRect(M, Y, CW, 38, 3, 3, 'FD')
        
        // Left accent bar
        grad(M, Y, 3, 38, C.orange, C.pink)
        
        // Number badge
        grad(M + 5, Y + 3, 10, 10, C.orange, C.pink)
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${idx + 1}`, M + 10, Y + 9, { align: 'center' })
        
        // Title
        pdf.setTextColor(C.orange.r, C.orange.g, C.orange.b)
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'bold')
        const title = intervention.title || intervention.name || `Intervention ${idx + 1}`
        pdf.text(title, M + 18, Y + 7)
        
        // Description
        pdf.setTextColor(60, 60, 60)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        const desc = intervention.description || intervention.what_to_do || ''
        const descLines = pdf.splitTextToSize(desc, CW - 21)
        pdf.text(descLines.slice(0, 3), M + 18, Y + 12)
        
        // Metrics row with colored badges
        const mY = Y + 28
        
        // Investment
        pdf.setFillColor(C.teal.r, C.teal.g, C.teal.b)
        pdf.roundedRect(M + 5, mY, 38, 6, 1.5, 1.5, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'bold')
        const investment = intervention.investmentRange || intervention.budget_estimate || 'TBD'
        pdf.text(` ${investment}`, M + 24, mY + 4, { align: 'center' })
        
        // ROI
        pdf.setFillColor(C.green.r, C.green.g, C.green.b)
        pdf.roundedRect(M + 46, mY, 38, 6, 1.5, 1.5, 'F')
        const roi = intervention.expectedROI || intervention.expected_roi || 'TBD'
        pdf.text(` ${roi} ROI`, M + 65, mY + 4, { align: 'center' })
        
        // Timeline
        pdf.setFillColor(C.blue.r, C.blue.g, C.blue.b)
        pdf.roundedRect(M + 87, mY, 38, 6, 1.5, 1.5, 'F')
        const timeline = intervention.timeline || intervention.timeframe || '12 weeks'
        pdf.text(` ${timeline}`, M + 106, mY + 4, { align: 'center' })
        
        // Impact badge
        const impact = intervention.impact || 'medium'
        const impactC = impact === 'high' ? C.green : impact === 'medium' ? C.yellow : C.gray
        pdf.setFillColor(impactC.r, impactC.g, impactC.b)
        pdf.roundedRect(M + 128, mY, 38, 6, 1.5, 1.5, 'F')
        pdf.text(` ${impact.toUpperCase()}`, M + 147, mY + 4, { align: 'center' })

        Y += 41
      })
      
      // Total investment summary
      separator()
      
      pdf.setFillColor(240, 253, 250)
      pdf.setDrawColor(C.teal.r, C.teal.g, C.teal.b)
      pdf.setLineWidth(0.5)
      pdf.roundedRect(M, Y, CW, 18, 3, 3, 'FD')
      
      pdf.setTextColor(C.teal.r, C.teal.g, C.teal.b)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(' Program Investment Summary', M + 4, Y + 6)
      
      pdf.setTextColor(60, 60, 60)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.text(`Total estimated investment across all ${options.interventions.length} interventions: $450K-$1.2M`, M + 4, Y + 11)
      pdf.text(`Expected program ROI: 30-50% within 12-18 months`, M + 4, Y + 15)
      
      Y += 20
    }

    // ==================== THE PATH FORWARD ====================
    newPage()
    
    pdf.setTextColor(C.teal.r, C.teal.g, C.teal.b)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Your Path Forward', M, Y)
    grad(M, Y + 3, 55, 2, C.teal, C.purple)
    Y += 13

    pdf.setTextColor(70, 70, 70)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    txt('A proven roadmap to transform insights into impact.')
    Y += 5

    const roadmap = [
      {
        phase: 'Phase 1: Foundation',
        timeline: 'Weeks 1-4',
        steps: [
          'Share this report with leadership and stakeholders',
          'Establish AI transformation steering committee',
          'Review and prioritize recommended interventions',
          'Secure budget and resource commitments'
        ],
        color: C.teal
      },
      {
        phase: 'Phase 2: Launch',
        timeline: 'Weeks 5-12',
        steps: [
          'Launch top-priority interventions',
          'Begin addressing highest-concern taboos',
          'Establish feedback loops and measurement systems',
          'Communicate progress transparently'
        ],
        color: C.purple
      },
      {
        phase: 'Phase 3: Scale',
        timeline: 'Weeks 13-24',
        steps: [
          'Expand successful pilots organization-wide',
          'Address remaining capability gaps systematically',
          'Build internal AI advocacy and champions',
          'Measure and celebrate early wins'
        ],
        color: C.blue
      }
    ]

    roadmap.forEach((phase, idx) => {
      space(45)
      
      // Phase card with visual timeline
      const phaseC = phase.color
      const bg = {
        r: Math.min(255, phaseC.r + 235),
        g: Math.min(255, phaseC.g + 235),
        b: Math.min(255, phaseC.b + 235)
      }
      
      pdf.setFillColor(bg.r, bg.g, bg.b)
      pdf.setDrawColor(phaseC.r, phaseC.g, phaseC.b)
      pdf.setLineWidth(0.8)
      pdf.roundedRect(M, Y, CW, 40, 3, 3, 'FD')
      
      // Left accent gradient bar
      grad(M, Y, 3, 40, phaseC, C.pink)
      
      // Phase number badge
      pdf.setFillColor(phaseC.r, phaseC.g, phaseC.b)
      pdf.circle(M + 9, Y + 8, 4.5, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${idx + 1}`, M + 9, Y + 9.5, { align: 'center' })
      
      // Header
      pdf.setTextColor(phaseC.r, phaseC.g, phaseC.b)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(phase.phase, M + 17, Y + 7)
      
      // Timeline badge
      pdf.setFillColor(255, 255, 255)
      pdf.setDrawColor(phaseC.r, phaseC.g, phaseC.b)
      pdf.setLineWidth(0.4)
      pdf.roundedRect(M + CW - 35, Y + 3, 32, 5, 1.5, 1.5, 'FD')
      pdf.setTextColor(phaseC.r, phaseC.g, phaseC.b)
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'bold')
      pdf.text(` ${phase.timeline}`, M + CW - 19, Y + 6, { align: 'center' })
      
      // Steps with checkboxes
      pdf.setTextColor(70, 70, 70)
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      let stepY = Y + 16
      phase.steps.forEach((step) => {
        // Checkbox
        pdf.setDrawColor(phaseC.r, phaseC.g, phaseC.b)
        pdf.setLineWidth(0.3)
        pdf.rect(M + 7, stepY - 2, 2.5, 2.5, 'D')
        
        const stepLines = pdf.splitTextToSize(step, CW - 15)
        pdf.text(stepLines, M + 11, stepY)
        stepY += stepLines.length * 3.5 + 1
      })

      Y += 43
    })
    
    // Add quick wins callout
    callout('Quick Wins - First 30 Days',
      'Focus on building trust through transparency initiatives, establish steering committee, and launch your first pilot with a supportive team. Early successes build momentum.',
      '⚡', C.teal)

    // ==================== SUCCESS METRICS ====================
    space(50)
    
    pdf.setTextColor(C.green.r, C.green.g, C.green.b)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(' Measuring Success', M, Y)
    Y += 8

    const metrics = [
      { metric: 'Sentiment Improvement', target: '+0.5 points', timeline: '6 months', color: C.purple },
      { metric: 'Capability Maturity Gain', target: '+1.5 points', timeline: '6 months', color: C.blue },
      { metric: 'AI Tool Adoption Rate', target: '60%+ active usage', timeline: '3 months', color: C.teal },
      { metric: 'Employee Confidence Score', target: '+25%', timeline: '4 months', color: C.green }
    ]

    metrics.forEach((m) => {
      space(10)
      
      pdf.setFillColor(249, 250, 251)
      pdf.setDrawColor(m.color.r, m.color.g, m.color.b)
      pdf.setLineWidth(0.4)
      pdf.roundedRect(M, Y, CW, 8, 2, 2, 'FD')
      
      // Metric name
      pdf.setTextColor(50, 50, 50)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(8)
      pdf.text(m.metric, M + 3, Y + 4)
      
      // Target badge
      pdf.setFillColor(m.color.r, m.color.g, m.color.b)
      pdf.roundedRect(M + 80, Y + 2, 35, 4.5, 1, 1, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`Target: ${m.target}`, M + 97.5, Y + 4.8, { align: 'center' })
      
      // Timeline
      pdf.setTextColor(100, 100, 100)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7)
      pdf.text(` ${m.timeline}`, M + 160, Y + 4.5, { align: 'right' })

      Y += 9.5
    })

    // ==================== CONTACT & SUPPORT ====================
    Y += 8
    pdf.setFillColor(240, 253, 250)
    pdf.setDrawColor(C.teal.r, C.teal.g, C.teal.b)
    pdf.setLineWidth(0.6)
    pdf.roundedRect(M, Y, CW, 30, 3, 3, 'FD')

    pdf.setTextColor(C.teal.r, C.teal.g, C.teal.b)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(' Partner With Us', M + 4, Y + 7)

    pdf.setTextColor(70, 70, 70)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text('Ready to take the next step? Our team can help you:', M + 4, Y + 13)
    
    pdf.setFontSize(7)
    pdf.text('• Design and implement custom interventions', M + 4, Y + 18)
    pdf.text('• Facilitate workshops to address taboos directly', M + 4, Y + 21.5)
    pdf.text('• Provide ongoing coaching and measurement', M + 4, Y + 25)

    // ==================== SAVE PDF ====================
    const fileName = `AI_Readiness_Report_${options.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw new Error('Failed to generate PDF report')
  }
}

/**
 * Helper: Get narrative meaning for sentiment cells
 */
function getMeaningForCell(levelName: string, categoryName: string): string {
  // Provide contextual meaning based on the combination
  if (levelName.includes('Career') && categoryName.includes('Autonomous')) {
    return 'Fear that AI automation threatens job security'
  }
  if (levelName.includes('Trust') && categoryName.includes('Opaque')) {
    return 'Concerns about fairness when AI decisions lack transparency'
  }
  if (levelName.includes('Workflow') && categoryName.includes('Inflexible')) {
    return 'Frustration when AI systems don\'t adapt to personal work styles'
  }
  
  return `Concerns arise when ${categoryName.toLowerCase()} intersects with ${levelName.toLowerCase()}`
}

/**
 * Capture element as image
 */
export async function captureElement(elementId: string): Promise<string | null> {
  try {
    const element = document.getElementById(elementId)
    if (!element) return null

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Capture error:', error)
    return null
  }
}

