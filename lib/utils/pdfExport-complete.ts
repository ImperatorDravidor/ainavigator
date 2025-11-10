/**
 * Professional PDF Export Utility v2.0
 * Generates clean, well-formatted, professional PDF reports
 * with proper layouts, spacing, and visual captures
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
    sentimentAverage: number | string
    capabilityMaturity: number | string
  }
  
  // Complete sentiment data
  sentimentData?: {
    stats: {
      overallAverage: number
      totalRespondents: number
      cellsAnalyzed?: number
    }
    lowestCells: any[]
    highestCells?: any[]
    allCells?: any[]
    problemCategories?: any[]
  }
  
  // Complete capability data
  capabilityData?: {
    overall: {
      average: number
      max: number
      min: number
    }
    dimensions: any[]
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
    dimensionRadars?: string[]
  }
}

// Professional brand colors
const BRAND = {
  primary: { r: 20, g: 184, b: 166 },    // Teal
  secondary: { r: 168, g: 85, b: 247 },   // Purple
  accent: { r: 236, g: 72, b: 153 },      // Pink
  warning: { r: 249, g: 115, b: 22 },     // Orange
  info: { r: 59, g: 130, b: 246 },        // Blue
  success: { r: 16, g: 185, b: 129 },     // Green
  danger: { r: 239, g: 68, b: 68 },       // Red
  neutral: { r: 71, g: 85, b: 105 },      // Slate
  light: { r: 241, g: 245, b: 249 }       // Light gray
}

/**
 * Generate a professional PDF report with clean formatting
 */
export async function generateCompletePDF(options: CompletePDFOptions): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const W = pdf.internal.pageSize.getWidth()
    const H = pdf.internal.pageSize.getHeight()
    const M = 15 // margin - reduced for more space
    const CW = W - 2 * M // content width
    let Y = M // current Y position
    let pageNumber = 1

    // Convert string values to numbers if needed
    const sentimentAvg = typeof options.assessment.sentimentAverage === 'string' 
      ? parseFloat(options.assessment.sentimentAverage) 
      : options.assessment.sentimentAverage
    
    const capabilityMat = typeof options.assessment.capabilityMaturity === 'string'
      ? parseFloat(options.assessment.capabilityMaturity)
      : options.assessment.capabilityMaturity

    // ==================== HELPER FUNCTIONS ====================
    
    const newPage = () => {
      pdf.addPage()
      Y = M
      pageNumber++
      addFooter()
    }

    const checkSpace = (needed: number = 35) => {
      if (Y + needed > H - M - 10) {
        newPage()
        return true
      }
      return false
    }

    const addFooter = () => {
      const fY = H - 8
      pdf.setFontSize(7)
      pdf.setTextColor(140, 140, 140)
      pdf.text('LeadingWith.AI - AI Navigator', W / 2, fY, { align: 'center' })
      pdf.text(`${options.companyName}`, M, fY)
      pdf.text(`Page ${pageNumber}`, W - M, fY, { align: 'right' })
    }

    const sectionHeader = (title: string, color = BRAND.primary, addUnderline = true) => {
      checkSpace(15)
      pdf.setTextColor(color.r, color.g, color.b)
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text(title, M, Y)
      
      if (addUnderline) {
        Y += 2
        pdf.setDrawColor(color.r, color.g, color.b)
        pdf.setLineWidth(1.5)
        pdf.line(M, Y, M + 60, Y)
      }
      
      Y += 8
    }

    const subsectionHeader = (title: string, size = 12) => {
      checkSpace(10)
      pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
      pdf.setFontSize(size)
      pdf.setFont('helvetica', 'bold')
      pdf.text(title, M, Y)
      Y += 6
    }

    const bodyText = (content: string, fontSize = 9, color = BRAND.neutral) => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(color.r, color.g, color.b)
      const lines = pdf.splitTextToSize(content, CW)
      
      lines.forEach((line: string) => {
        checkSpace(6)
        pdf.text(line, M, Y)
        Y += fontSize * 0.4
      })
      
      Y += 2
    }

    const metricCard = (x: number, y: number, w: number, label: string, value: string, sublabel: string, bgColor: any, textColor: any) => {
      // Clean card background
      pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b)
      pdf.setDrawColor(textColor.r, textColor.g, textColor.b)
      pdf.setLineWidth(0.5)
      pdf.roundedRect(x, y, w, 28, 2, 2, 'FD')
      
      // Label
      pdf.setTextColor(textColor.r, textColor.g, textColor.b)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.text(label, x + w/2, y + 6, { align: 'center' })
      
      // Value - large and prominent
      pdf.setFontSize(22)
      pdf.setFont('helvetica', 'bold')
      pdf.text(value, x + w/2, y + 16, { align: 'center' })
      
      // Sublabel
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(110, 110, 110)
      pdf.text(sublabel, x + w/2, y + 23, { align: 'center' })
    }

    const infoBox = (content: string, icon = 'i') => {
      checkSpace(20)
      const boxHeight = Math.max(18, pdf.splitTextToSize(content, CW - 12).length * 4 + 8)
      
      pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.3)
      pdf.roundedRect(M, Y, CW, boxHeight, 2, 2, 'FD')
      
      pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      
      const lines = pdf.splitTextToSize(content, CW - 12)
      const textY = Y + 6
      pdf.text('Note:', M + 3, textY)
      pdf.setFont('helvetica', 'normal')
      pdf.text(lines, M + 15, textY)
      
      Y += boxHeight + 5
    }

    // ==================== PAGE 1: COVER PAGE ====================
    
    // Professional header band
    pdf.setFillColor(BRAND.primary.r, BRAND.primary.g, BRAND.primary.b)
    pdf.rect(0, 0, W, 70, 'F')
    
    // Title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(32)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI Readiness', W / 2, 30, { align: 'center' })
    pdf.setFontSize(28)
    pdf.text('Assessment Report', W / 2, 45, { align: 'center' })

    // Company info
    Y = 90
    pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text(options.companyName, W / 2, Y, { align: 'center' })
    
    if (options.industry) {
      Y += 10
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(options.industry, W / 2, Y, { align: 'center' })
    }
    
    // Report metadata
    Y = 135
    pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
    pdf.roundedRect(M, Y, CW, 35, 2, 2, 'F')
    
    Y += 10
    pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Report Generated:', M + 5, Y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(options.assessment.date, M + 50, Y)
    
    Y += 8
    pdf.setFont('helvetica', 'bold')
    pdf.text('Survey Respondents:', M + 5, Y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${options.assessment.respondents.toLocaleString()} employees`, M + 50, Y)
    
    Y += 8
    pdf.setFont('helvetica', 'bold')
    pdf.text('Analysis Scope:', M + 5, Y)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Sentiment + Capability Assessment', M + 50, Y)
    
    // ==================== EXECUTIVE SUMMARY ====================
    Y = 190
    
    sectionHeader('Executive Summary', BRAND.primary)
    Y += 2
    
    bodyText('Your AI readiness at a glance - the story your data tells.', 10)
    Y += 5

    // Three metric cards - clean and professional
    const cardWidth = (CW - 8) / 3
    const cardY = Y
    
    const readinessStatus = options.assessment.readinessScore >= 75 ? 'Strong' : 
                           options.assessment.readinessScore >= 60 ? 'Moderate' : 'Developing'
    
    metricCard(M, cardY, cardWidth, 'AI READINESS', 
      `${options.assessment.readinessScore}%`,
      readinessStatus,
      { r: 230, g: 247, b: 244 },  // Light teal
      BRAND.primary)
    
    metricCard(M + cardWidth + 4, cardY, cardWidth, 'SENTIMENT', 
      sentimentAvg.toFixed(1),
      'out of 5.0',
      { r: 245, g: 237, b: 253 },  // Light purple
      BRAND.secondary)
    
    metricCard(M + 2 * cardWidth + 8, cardY, cardWidth, 'CAPABILITY', 
      capabilityMat.toFixed(1),
      'out of 10.0',
      { r: 235, g: 241, b: 253 },  // Light blue
      BRAND.info)
    
    Y = cardY + 35

    // Story section - professional format
    subsectionHeader('The Story Your Data Tells')
    
    if (options.sentimentData?.stats && options.capabilityData?.overall) {
      bodyText(`Your organization is in the ${readinessStatus.toLowerCase()} stage at ${options.assessment.readinessScore}% readiness. This represents ${options.assessment.readinessScore >= 60 ? 'solid progress' : 'significant growth opportunity'} - with the right interventions, you can build strong AI capabilities.`)
      
      Y += 3
      
      // Bullet points with actual data
      const bullets = [
        `${options.assessment.respondents.toLocaleString()} employees surveyed across 25 sentiment dimensions`,
        `Overall sentiment: ${options.sentimentData.stats.overallAverage.toFixed(1)}/5.0 - ${options.sentimentData.stats.overallAverage >= 3.5 ? 'showing readiness' : 'showing significant concern'}`,
        `Capability maturity: ${options.capabilityData.overall.average.toFixed(1)}/10.0 across 8 strategic dimensions`,
        `${options.capabilityData.dimensions?.filter((d: any) => (d.average || 0) >= (d.benchmark || 0)).length || 0} dimensions exceed industry benchmarks, ${options.capabilityData.dimensions?.filter((d: any) => (d.average || 0) < (d.benchmark || 0)).length || 0} need strengthening`,
        `${options.interventions?.length || 5} targeted interventions identified with estimated ${options.interventions && options.interventions.length > 0 && options.interventions[0].expectedROI ? options.interventions[0].expectedROI : '30-50%'} ROI`
      ]
      
      bullets.forEach(bullet => {
        checkSpace(8)
    pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        pdf.text('•', M + 2, Y)
        const lines = pdf.splitTextToSize(bullet, CW - 8)
        pdf.text(lines, M + 6, Y)
        Y += lines.length * 3.5 + 1
      })
    }

    addFooter()

    // ==================== PAGE 2: SENTIMENT ANALYSIS ====================
    if (options.sentimentData) {
    newPage()
    
      sectionHeader('Employee Sentiment Analysis', BRAND.secondary)
      
      bodyText(`How ${options.assessment.respondents} employees feel about AI across 25 dimensions.`, 10)
      Y += 5

      // Summary stats - clean cards
      if (options.sentimentData?.stats) {
        const statCardW = (CW - 8) / 3
        const statY = Y

        metricCard(M, statY, statCardW, 'RESPONSES', 
          options.sentimentData.stats.totalRespondents.toLocaleString(),
          'employees analyzed',
          { r: 230, g: 247, b: 244 },
          BRAND.primary)

        const avgScore = options.sentimentData.stats.overallAverage
        metricCard(M + statCardW + 4, statY, statCardW, 'OVERALL SCORE', 
          avgScore.toFixed(1),
          'out of 5.0',
          { r: 245, g: 237, b: 253 },
          BRAND.secondary)

        const priorityCount = options.sentimentData.lowestCells?.length || 0
        metricCard(M + 2*statCardW + 8, statY, statCardW, 'PRIORITY AREAS', 
          priorityCount.toString(),
          'need attention',
          { r: 255, g: 243, b: 229 },
          BRAND.warning)

        Y = statY + 33
      }

      subsectionHeader('What We Found', 11)
      
      const interpretation = options.sentimentData?.stats?.overallAverage 
        ? options.sentimentData.stats.overallAverage >= 3.5
          ? 'Across 25 sentiment dimensions, your employees are demonstrating strong resistance that must be understood and addressed. We identified priority areas where sentiment is notably low. These represent specific fears or concerns (taboos) that, if left unaddressed, will slow adoption.'
          : 'Your employees are demonstrating significant resistance and concerns about AI adoption. Multiple priority areas have been identified where sentiment is critically low, requiring immediate strategic intervention.'
        : 'Understanding employee sentiment across multiple dimensions helps identify specific resistance patterns.'
      
      bodyText(interpretation, 9)
      Y += 5

      // ** CRITICAL: Capture Sentiment Heatmap **
      if (options.elementIds?.heatmap) {
        checkSpace(80)
        
        subsectionHeader('Sentiment Heatmap', 11)
        Y += 2
        
        try {
          const element = document.getElementById(options.elementIds.heatmap)
          if (element) {
            const canvas = await html2canvas(element, {
              scale: 2.5,
              logging: false,
              backgroundColor: '#ffffff',
              useCORS: true,
              allowTaint: true,
              windowWidth: element.scrollWidth,
              windowHeight: element.scrollHeight
            })
            
            const imgData = canvas.toDataURL('image/png', 1.0)
            const imgW = CW
            const imgH = (canvas.height * imgW) / canvas.width
            
            // Ensure we have space for the heatmap
            if (Y + imgH > H - M - 15) {
              newPage()
              subsectionHeader('Sentiment Heatmap (continued)', 11)
            }
            
            pdf.addImage(imgData, 'PNG', M, Y, imgW, Math.min(imgH, 160))
            Y += Math.min(imgH, 160) + 8
          } else {
            bodyText('WARNING: Heatmap visualization not available - element not found in DOM', 8, BRAND.warning)
            Y += 5
          }
        } catch (err) {
          console.error('Heatmap capture error:', err)
          bodyText('WARNING: Heatmap visualization could not be captured', 8, BRAND.warning)
          Y += 5
        }
      } else {
        infoBox('Note: Run this export from the Sentiment page to include the interactive heatmap visualization.')
      }

      // Priority Concern Areas - Clean Table Format
    if (options.sentimentData?.lowestCells && options.sentimentData.lowestCells.length > 0) {
        checkSpace(50)
        
        subsectionHeader('Priority Concern Areas', 11)
        
        bodyText('These specific combinations of sentiment level x reason show the strongest resistance. Each represents a unique concern that requires targeted intervention.', 8)
        Y += 3

        // Clean table header
        pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
        pdf.roundedRect(M, Y, CW, 8, 1, 1, 'F')
        
        pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'bold')
        pdf.text('#', M + 3, Y + 5.5)
        pdf.text('Concern Area', M + 10, Y + 5.5)
        pdf.text('Score', CW + M - 35, Y + 5.5, { align: 'right' })
        pdf.text('Affected', CW + M - 15, Y + 5.5, { align: 'right' })
        pdf.text('Rank', CW + M - 3, Y + 5.5, { align: 'right' })
        
        Y += 10

        // Table rows
        options.sentimentData.lowestCells.slice(0, 8).forEach((cell, idx) => {
          checkSpace(12)
          
          // Alternating row colors
          if (idx % 2 === 0) {
            pdf.setFillColor(250, 250, 250)
            pdf.rect(M, Y - 2, CW, 10, 'F')
          }
          
          // Rank number
          pdf.setFillColor(BRAND.warning.r, BRAND.warning.g, BRAND.warning.b)
          pdf.circle(M + 5, Y + 3, 2.5, 'F')
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(7)
      pdf.setFont('helvetica', 'bold')
          pdf.text(`${idx + 1}`, M + 5, Y + 4, { align: 'center' })

          // Title - truncate if needed
          pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
          const title = `${cell.level || cell.levelName || ''} x ${cell.reason || cell.categoryName || ''}`
          const truncated = title.length > 70 ? title.substring(0, 67) + '...' : title
          pdf.text(truncated, M + 10, Y + 4.5)
          
          // Score - color coded
          const scoreColor = cell.score < 2.0 ? BRAND.danger : cell.score < 2.5 ? BRAND.warning : BRAND.neutral
          pdf.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b)
        pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(9)
          pdf.text(cell.score?.toFixed(2) || '--', CW + M - 35, Y + 4.5, { align: 'right' })
          
          // Affected count
          pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(8)
          pdf.text(`${cell.count || 0}`, CW + M - 15, Y + 4.5, { align: 'right' })

          // Rank
          pdf.text(`#${cell.rank || idx + 1}`, CW + M - 3, Y + 4.5, { align: 'right' })

          Y += 10
      })
        
        Y += 3
      }
    }

    // ==================== PAGE 3: CAPABILITY ASSESSMENT ====================
    if (options.capabilityData) {
    newPage()
    
      sectionHeader('Organizational Capability Assessment', BRAND.info)

      bodyText('Your organizational readiness across 8 strategic dimensions compared to industry benchmarks.', 10)
      Y += 5

      // Summary metrics
    if (options.capabilityData?.overall) {
        const capCardW = (CW - 8) / 3
        const capY = Y
      
        const above = options.capabilityData.dimensions?.filter((d: any) => (d.average || 0) >= (d.benchmark || 0)).length || 0
        const below = options.capabilityData.dimensions?.filter((d: any) => (d.average || 0) < (d.benchmark || 0)).length || 0

        metricCard(M, capY, capCardW, 'AVERAGE SCORE', 
        options.capabilityData.overall.average.toFixed(1),
          'out of 10.0',
          { r: 230, g: 247, b: 244 },
          BRAND.primary)
      
        metricCard(M + capCardW + 4, capY, capCardW, 'ABOVE BENCHMARK',
        above.toString(),
          'dimensions',
          { r: 232, g: 251, b: 243 },
          BRAND.success)
      
        metricCard(M + 2*capCardW + 8, capY, capCardW, 'NEED FOCUS',
        below.toString(),
          'dimensions',
          { r: 255, g: 243, b: 229 },
          BRAND.warning)

        Y = capY + 33
      }

      // Radar chart capture
      if (options.elementIds?.radarChart) {
        checkSpace(80)
        subsectionHeader('Capability Radar Chart', 11)
        Y += 2
        
        try {
          const element = document.getElementById(options.elementIds.radarChart)
          if (element) {
            const canvas = await html2canvas(element, {
              scale: 2.5,
              logging: false,
              backgroundColor: '#ffffff',
              useCORS: true
            })
            const imgData = canvas.toDataURL('image/png', 1.0)
            const imgW = CW * 0.85
            const imgH = (canvas.height * imgW) / canvas.width
            
            if (Y + imgH > H - M - 15) newPage()
            
            pdf.addImage(imgData, 'PNG', M + (CW - imgW)/2, Y, imgW, Math.min(imgH, 140))
            Y += Math.min(imgH, 140) + 8
          }
        } catch (err) {
          console.error('Radar chart capture error:', err)
          bodyText('WARNING: Radar chart visualization could not be captured', 8, BRAND.warning)
          Y += 5
        }
      }

      // Dimensions table - clean format
    if (options.capabilityData?.dimensions && options.capabilityData.dimensions.length > 0) {
        checkSpace(60)
        
        subsectionHeader('Dimension Breakdown', 11)
        Y += 2

        // Table header
        pdf.setFillColor(BRAND.info.r, BRAND.info.g, BRAND.info.b)
        pdf.roundedRect(M, Y, CW, 7, 1, 1, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'bold')
        pdf.text('Dimension', M + 2, Y + 5)
        pdf.text('Your Score', CW/2 + 10, Y + 5, { align: 'center' })
        pdf.text('Benchmark', CW/2 + 40, Y + 5, { align: 'center' })
        pdf.text('Gap', CW + M - 25, Y + 5, { align: 'center' })
        pdf.text('Status', CW + M - 5, Y + 5, { align: 'right' })
        Y += 9

        // Table rows - clean and readable
        options.capabilityData.dimensions.forEach((dim: any, idx: number) => {
          checkSpace(9)
          
          // Alternating background
          if (idx % 2 === 0) {
            pdf.setFillColor(249, 250, 251)
            pdf.rect(M, Y - 1.5, CW, 8, 'F')
          }

        const score = dim.average || 0
          const benchmark = dim.benchmark || 0
          const gap = score - benchmark
          const name = (dim.name || '').length > 45 ? dim.name.substring(0, 42) + '...' : dim.name
          
          // Dimension name
          pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'normal')
        pdf.text(name, M + 2, Y + 4)
        
          // Your score - color coded
          const scoreColor = gap >= 0 ? BRAND.success : gap > -1 ? BRAND.warning : BRAND.danger
          pdf.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b)
        pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(9)
          pdf.text(score.toFixed(1), CW/2 + 10, Y + 4, { align: 'center' })
          
          // Benchmark
          pdf.setTextColor(110, 110, 110)
        pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(8)
          pdf.text(benchmark.toFixed(1), CW/2 + 40, Y + 4, { align: 'center' })
        
        // Gap with visual indicator
          pdf.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b)
        pdf.setFont('helvetica', 'bold')
        const gapText = gap >= 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)
          pdf.text(gapText, CW + M - 25, Y + 4, { align: 'center' })
          
          // Status text
          const statusText = gap >= 0 ? 'OK' : gap > -1 ? 'GAP' : 'LOW'
          pdf.setFontSize(7)
          pdf.setFont('helvetica', 'bold')
          pdf.text(statusText, CW + M - 5, Y + 4, { align: 'right' })

          Y += 8
      })

      Y += 5
      }
    }

    // ==================== PAGE 4: RECOMMENDED INTERVENTIONS ====================
    if (options.interventions && options.interventions.length > 0) {
      newPage()
      
      sectionHeader('Recommended Interventions', BRAND.warning)
      
      bodyText('Prioritized actions to improve AI readiness based on your assessment results.', 10)
      Y += 5
      
      infoBox(`Total estimated investment across all ${options.interventions.length} interventions: $450K-$1.2M. Expected program ROI: 30-50% within 12-18 months.`)
      Y += 3

      options.interventions.slice(0, 5).forEach((intervention: any, idx: number) => {
        checkSpace(30)

        // Clean intervention layout
        pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
        pdf.setDrawColor(220, 220, 220)
        pdf.setLineWidth(0.3)
        pdf.roundedRect(M, Y, CW, 24, 2, 2, 'FD')
        
        // Number badge
        pdf.setFillColor(BRAND.warning.r, BRAND.warning.g, BRAND.warning.b)
        pdf.circle(M + 4.5, Y + 4.5, 3, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${idx + 1}`, M + 4.5, Y + 5.5, { align: 'center' })
        
        // Title
        pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        const title = intervention.title || intervention.name || 'Intervention'
        pdf.text(title, M + 10, Y + 6)
        
        // Description - concise
        pdf.setTextColor(80, 80, 80)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        const desc = intervention.description || intervention.what_to_do || ''
        const descLines = pdf.splitTextToSize(desc, CW - 13)
        pdf.text(descLines.slice(0, 2), M + 10, Y + 11)

        // Metrics inline
        const metricsY = Y + 19
        pdf.setFontSize(7)
        pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        
        // Investment
        pdf.setFont('helvetica', 'bold')
        pdf.text('Investment:', M + 10, metricsY)
        pdf.setFont('helvetica', 'normal')
        pdf.text(intervention.investmentRange || intervention.budget_estimate || 'TBD', M + 28, metricsY)
        
        // ROI
        pdf.setFont('helvetica', 'bold')
        pdf.text('ROI:', M + 70, metricsY)
        pdf.setFont('helvetica', 'normal')
        pdf.text(intervention.expectedROI || intervention.expected_roi || 'TBD', M + 80, metricsY)
        
        // Timeline
      pdf.setFont('helvetica', 'bold')
        pdf.text('Timeline:', M + 120, metricsY)
      pdf.setFont('helvetica', 'normal')
        pdf.text(intervention.timeline || intervention.timeframe || '12 weeks', M + 136, metricsY)

        Y += 27
      })
      
      Y += 3
      infoBox('For detailed intervention roadmaps and implementation guides, refer to the full Interventions Action Plan report.')
    }

    // ==================== FINAL PAGE: YOUR PATH FORWARD ====================
    newPage()
    
    sectionHeader('Your Path Forward', BRAND.primary)
    
    bodyText('A proven roadmap to transform insights into impact.', 10)
    Y += 8

    // Phase structure - clean and actionable
    const phases = [
      {
        phase: 'Phase 1: Foundation',
        weeks: 'Weeks 1-4',
        items: [
          'Share this report with leadership and stakeholders',
          'Establish AI transformation steering committee',
          'Review and prioritize recommended interventions',
          'Secure budget and resource commitments'
        ]
      },
      { 
        phase: 'Phase 2: Planning', 
        weeks: 'Weeks 5-8',
        items: [
          'Develop detailed implementation roadmap with milestones',
          'Design governance frameworks and success metrics',
          'Identify and recruit program champions',
          'Prepare communication and change management plans'
        ]
      },
      { 
        phase: 'Phase 3: Execution', 
        weeks: 'Weeks 9-16',
        items: [
          'Launch pilot programs for priority interventions',
          'Begin training and capability building initiatives',
          'Implement quick-win projects to demonstrate value',
          'Track progress and gather early feedback'
        ]
      }
    ]

    phases.forEach((phase) => {
      checkSpace(35)
      
      // Phase header
      pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
      pdf.roundedRect(M, Y, CW, 7, 1, 1, 'F')
      
      pdf.setTextColor(BRAND.primary.r, BRAND.primary.g, BRAND.primary.b)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(phase.phase, M + 3, Y + 5)
      
      pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.text(phase.weeks, CW + M - 3, Y + 5, { align: 'right' })
      
      Y += 10
      
      // Checklist items
      phase.items.forEach((item) => {
        checkSpace(6)
        pdf.setFontSize(8)
        pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        pdf.text('☐', M + 3, Y)
        pdf.text(item, M + 8, Y)
        Y += 5
      })
      
      Y += 3
    })

    Y += 5
    infoBox('70% of AI initiatives fail due to organizational resistance, not technology. Understanding sentiment helps identify hidden barriers (taboos) that block adoption. Capability gaps reveal systemic weaknesses that need strategic investment. Early intervention prevents costly failures and accelerates time-to-value.')

    // Contact section - professional
    Y += 5
    pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
    pdf.roundedRect(M, Y, CW, 18, 2, 2, 'F')

    pdf.setTextColor(BRAND.primary.r, BRAND.primary.g, BRAND.primary.b)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Questions or Need Support?', M + 4, Y + 6)

    pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
    pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
    pdf.text('For implementation guidance or custom analysis:', M + 4, Y + 11)
      
      pdf.setFont('helvetica', 'bold')
    pdf.text('LeadingWith.AI  •  info@leadingwithai.com', M + 4, Y + 15)

    // Save with beautiful filename
    const fileName = `AI_Readiness_Assessment_${options.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw new Error('Failed to generate PDF report')
  }
}
