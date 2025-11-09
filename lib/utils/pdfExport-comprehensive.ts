/**
 * Comprehensive PDF Export - Rebuilt for Quality
 * Clean, professional report with proper spacing and real data only
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface ComprehensivePDFOptions {
  companyName: string
  industry?: string
  size?: string
  assessment: {
    date: string
    respondents: number
    readinessScore: number
    sentimentAverage: number | string
    capabilityMaturity: number | string
  }
  sentimentData?: {
    stats: {
      overallAverage: number
      totalRespondents: number
    }
    lowestCells: any[]
    allCells?: any[]
  }
  capabilityData?: {
    overall: {
      average: number
      max: number
      min: number
    }
    dimensions: any[]
  }
  interventions?: any[]
  elementIds?: {
    heatmap?: string
    radarChart?: string
  }
}

const BRAND = {
  primary: { r: 20, g: 184, b: 166 },
  secondary: { r: 168, g: 85, b: 247 },
  warning: { r: 249, g: 115, b: 22 },
  info: { r: 59, g: 130, b: 246 },
  success: { r: 16, g: 185, b: 129 },
  danger: { r: 239, g: 68, b: 68 },
  neutral: { r: 71, g: 85, b: 105 },
  light: { r: 248, g: 250, b: 252 }
}

export async function generateComprehensivePDF(options: ComprehensivePDFOptions): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const W = pdf.internal.pageSize.getWidth()
    const H = pdf.internal.pageSize.getHeight()
    const M = 20  // margins
    const CW = W - 2 * M  // content width
    let Y = M
    let pageNum = 1

    // Parse values
    const sentimentAvg = typeof options.assessment.sentimentAverage === 'string' 
      ? parseFloat(options.assessment.sentimentAverage) 
      : options.assessment.sentimentAverage
    
    const capabilityMat = typeof options.assessment.capabilityMaturity === 'string'
      ? parseFloat(options.assessment.capabilityMaturity)
      : options.assessment.capabilityMaturity

    // ==================== HELPERS ====================
    
    const addPage = () => {
      pdf.addPage()
      Y = M
      pageNum++
      addFooter()
    }

    const addFooter = () => {
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`${options.companyName} - AI Readiness Assessment`, W / 2, H - 10, { align: 'center' })
      pdf.text(`Page ${pageNum}`, W - M, H - 10, { align: 'right' })
    }

    const space = (amount: number) => {
      Y += amount
      if (Y > H - M - 20) {
        addPage()
      }
    }

    const heading = (text: string, color = BRAND.primary) => {
      if (Y > H - M - 30) addPage()
      
      pdf.setTextColor(color.r, color.g, color.b)
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text(text, M, Y)
      Y += 3
      
      pdf.setLineWidth(1)
      pdf.setDrawColor(color.r, color.g, color.b)
      pdf.line(M, Y, M + 50, Y)
      Y += 10
    }

    const subheading = (text: string) => {
      if (Y > H - M - 20) addPage()
      
      pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(text, M, Y)
      Y += 7
    }

    const paragraph = (text: string, size = 10) => {
      pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
      pdf.setFontSize(size)
      pdf.setFont('helvetica', 'normal')
      
      const lines = pdf.splitTextToSize(text, CW)
      lines.forEach((line: string) => {
        if (Y > H - M - 10) addPage()
        pdf.text(line, M, Y)
        Y += size * 0.45
      })
      Y += 3
    }

    const bullet = (text: string, size = 9) => {
      if (Y > H - M - 10) addPage()
      
      pdf.setFontSize(size)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
      pdf.text('•', M + 2, Y)
      
      const lines = pdf.splitTextToSize(text, CW - 6)
      pdf.text(lines, M + 6, Y)
      Y += lines.length * (size * 0.45) + 2
    }

    const infoBox = (text: string) => {
      if (Y > H - M - 25) addPage()
      
      const lines = pdf.splitTextToSize(text, CW - 8)
      const boxH = lines.length * 4 + 10
      
      pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.3)
      pdf.roundedRect(M, Y, CW, boxH, 2, 2, 'FD')
      
      pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.text('💡', M + 3, Y + 6)
      pdf.text(lines, M + 10, Y + 6)
      Y += boxH + 5
    }

    const captureChart = async (elementId: string): Promise<boolean> => {
      try {
        const el = document.getElementById(elementId)
        if (!el) {
          console.warn(`Element ${elementId} not found`)
          return false
        }

        const canvas = await html2canvas(el, {
          scale: 2,
          logging: false,
          backgroundColor: '#ffffff'
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgW = CW
        const imgH = (canvas.height * imgW) / canvas.width
        
        if (Y + imgH > H - M - 15) addPage()
        
        pdf.addImage(imgData, 'PNG', M, Y, imgW, imgH)
        Y += imgH + 8
        return true
      } catch (err) {
        console.error(`Chart capture failed for ${elementId}:`, err)
        return false
      }
    }

    // ==================== PAGE 1: COVER ====================
    
    pdf.setFillColor(BRAND.primary.r, BRAND.primary.g, BRAND.primary.b)
    pdf.rect(0, 0, W, 80, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(36)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI Readiness Assessment', W / 2, 35, { align: 'center' })
    pdf.setFontSize(24)
    pdf.text(options.companyName, W / 2, 55, { align: 'center' })

    Y = 100
    pdf.setFontSize(11)
    pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
    pdf.setFont('helvetica', 'normal')
    if (options.industry) {
      pdf.text(options.industry, W / 2, Y, { align: 'center' })
      Y += 6
    }
    pdf.text(`${options.assessment.date}`, W / 2, Y, { align: 'center' })
    
    Y = 140
    pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
    pdf.roundedRect(M, Y, CW, 45, 3, 3, 'F')
    
    Y += 12
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
    pdf.text('REPORT SUMMARY', M + 5, Y)
    Y += 8
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`Respondents: ${options.assessment.respondents.toLocaleString()} employees`, M + 5, Y)
    Y += 6
    pdf.text('Analysis: 25 sentiment dimensions + 8 capability dimensions', M + 5, Y)
    Y += 6
    pdf.text(`Overall Readiness: ${options.assessment.readinessScore}%`, M + 5, Y)
    Y += 6
    pdf.text(`Generated by: LeadingWith.AI Navigator Platform`, M + 5, Y)

    addFooter()

    // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
    addPage()
    
    heading('Executive Summary')
    
    paragraph('This assessment analyzes your organization\'s readiness for AI transformation based on actual employee responses and organizational capabilities.')
    space(5)

    // Metric boxes
    const boxW = (CW - 10) / 3
    const boxY = Y

    // AI Readiness
    pdf.setFillColor(230, 247, 244)
    pdf.setDrawColor(BRAND.primary.r, BRAND.primary.g, BRAND.primary.b)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(M, boxY, boxW, 30, 2, 2, 'FD')
    pdf.setTextColor(BRAND.primary.r, BRAND.primary.g, BRAND.primary.b)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI READINESS', M + boxW/2, boxY + 8, { align: 'center' })
    pdf.setFontSize(24)
    pdf.text(`${options.assessment.readinessScore}%`, M + boxW/2, boxY + 20, { align: 'center' })

    // Sentiment
    pdf.setFillColor(245, 237, 253)
    pdf.setDrawColor(BRAND.secondary.r, BRAND.secondary.g, BRAND.secondary.b)
    pdf.roundedRect(M + boxW + 5, boxY, boxW, 30, 2, 2, 'FD')
    pdf.setTextColor(BRAND.secondary.r, BRAND.secondary.g, BRAND.secondary.b)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.text('SENTIMENT', M + boxW + 5 + boxW/2, boxY + 8, { align: 'center' })
    pdf.setFontSize(24)
    pdf.text(sentimentAvg.toFixed(1), M + boxW + 5 + boxW/2, boxY + 20, { align: 'center' })
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('out of 4.0', M + boxW + 5 + boxW/2, boxY + 26, { align: 'center' })

    // Capability
    pdf.setFillColor(235, 241, 253)
    pdf.setDrawColor(BRAND.info.r, BRAND.info.g, BRAND.info.b)
    pdf.roundedRect(M + 2*boxW + 10, boxY, boxW, 30, 2, 2, 'FD')
    pdf.setTextColor(BRAND.info.r, BRAND.info.g, BRAND.info.b)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CAPABILITY', M + 2*boxW + 10 + boxW/2, boxY + 8, { align: 'center' })
    pdf.setFontSize(24)
    pdf.text(capabilityMat.toFixed(1), M + 2*boxW + 10 + boxW/2, boxY + 20, { align: 'center' })
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('out of 7.0', M + 2*boxW + 10 + boxW/2, boxY + 26, { align: 'center' })

    Y = boxY + 38

    subheading('Key Findings')
    
    if (options.sentimentData?.stats && options.capabilityData?.overall) {
      bullet(`${options.assessment.respondents.toLocaleString()} employees surveyed across 25 sentiment dimensions`)
      bullet(`Overall sentiment: ${options.sentimentData.stats.overallAverage.toFixed(2)}/4.0`)
      bullet(`Capability maturity: ${options.capabilityData.overall.average.toFixed(2)}/7.0 across 8 dimensions`)
      
      const above = options.capabilityData.dimensions?.filter((d: any) => (d.average || 0) >= (d.benchmark || 0)).length || 0
      const below = options.capabilityData.dimensions?.filter((d: any) => (d.average || 0) < (d.benchmark || 0)).length || 0
      
      bullet(`${above} dimensions above benchmark, ${below} need improvement`)
      bullet(`${options.sentimentData.lowestCells?.length || 0} priority concern areas identified`)
    }

    space(5)
    infoBox('This report uses only real data from your assessment - every score and metric reflects actual employee responses.')

    // ==================== PAGE 3: SENTIMENT ANALYSIS ====================
    addPage()
    
    heading('Employee Sentiment Analysis', BRAND.secondary)
    
    paragraph('Understanding how your employees feel about AI across 25 dimensions.')
    space(5)

    if (options.sentimentData?.stats) {
      subheading('Results')
      paragraph(`Analyzed ${options.sentimentData.stats.totalRespondents.toLocaleString()} responses. Overall score: ${options.sentimentData.stats.overallAverage.toFixed(2)}/4.0`)
      space(5)
    }

    // Try to capture heatmap
    if (options.elementIds?.heatmap) {
      subheading('Sentiment Heatmap')
      paragraph('5 concern levels × 5 perception categories. Green = low resistance, Red = high resistance.', 9)
      space(3)
      
      const captured = await captureChart(options.elementIds.heatmap)
      if (!captured) {
        infoBox('Heatmap not available. Navigate to Sentiment page before exporting.')
        space(3)
      }
    }

    // Priority areas
    if (options.sentimentData?.lowestCells && options.sentimentData.lowestCells.length > 0) {
      if (Y > H - 80) addPage()
      
      subheading('Top Priority Areas')
      space(3)

      const maxShow = Math.min(8, options.sentimentData.lowestCells.length)
      for (let i = 0; i < maxShow; i++) {
        const cell = options.sentimentData.lowestCells[i]
        if (Y > H - M - 15) addPage()
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(BRAND.warning.r, BRAND.warning.g, BRAND.warning.b)
        pdf.text(`${i + 1}.`, M, Y)
        
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        
        const title = `${cell.level || cell.levelName || ''} × ${cell.reason || cell.categoryName || ''}`
        const titleLines = pdf.splitTextToSize(title, CW - 30)
        pdf.text(titleLines, M + 6, Y)
        
        pdf.setFont('helvetica', 'bold')
        const scoreColor = cell.score < 2.0 ? BRAND.danger : BRAND.warning
        pdf.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b)
        pdf.text(cell.score?.toFixed(2) || '--', CW + M - 15, Y, { align: 'right' })
        
        Y += titleLines.length * 4 + 3
      }
    }

    // ==================== PAGE 4: CAPABILITY ASSESSMENT ====================
    addPage()
    
    heading('Capability Assessment', BRAND.info)
    
    paragraph('Your organizational readiness across 8 strategic dimensions, benchmarked against industry standards.')
    space(5)

    if (options.capabilityData?.overall) {
      subheading('Performance Overview')
      paragraph(`Average: ${options.capabilityData.overall.average.toFixed(2)}/7.0 | Range: ${options.capabilityData.overall.min.toFixed(1)} to ${options.capabilityData.overall.max.toFixed(1)}`)
      space(5)
    }

    // Capture radar
    if (options.elementIds?.radarChart) {
      subheading('Capability Radar Chart')
      paragraph('Visual comparison across all 8 dimensions.', 9)
      space(3)
      
      const captured = await captureChart(options.elementIds.radarChart)
      if (!captured) {
        infoBox('Radar chart not available. Navigate to Capability page before exporting.')
        space(3)
      }
    }

    // Dimensions table
    if (options.capabilityData?.dimensions && options.capabilityData.dimensions.length > 0) {
      if (Y > H - 90) addPage()
      
      subheading('Dimension Scores')
      space(3)

      options.capabilityData.dimensions.forEach((dim: any) => {
        if (Y > H - M - 12) addPage()
        
        const score = dim.average || 0
        const benchmark = dim.benchmark || 0
        const gap = score - benchmark
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        pdf.text(dim.name, M, Y)
        
        pdf.setFont('helvetica', 'bold')
        const gapColor = gap >= 0 ? BRAND.success : BRAND.danger
        pdf.setTextColor(gapColor.r, gapColor.g, gapColor.b)
        pdf.text(`${score.toFixed(2)}`, CW/2 + M, Y, { align: 'center' })
        
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(100, 100, 100)
        pdf.text(`(vs ${benchmark.toFixed(1)})`, CW/2 + M + 15, Y)
        
        const icon = gap >= 0 ? '✓' : '!'
        pdf.setFont('helvetica', 'bold')
        pdf.text(icon, CW + M, Y, { align: 'right' })
        
        Y += 6
      })
    }

    // ==================== PAGE 5: INTERVENTIONS ====================
    if (options.interventions && options.interventions.length > 0) {
      addPage()
      
      heading('Recommended Interventions', BRAND.warning)
      
      paragraph('Priority actions based on your assessment gaps.')
      space(5)

      options.interventions.slice(0, 5).forEach((int: any, idx: number) => {
        if (Y > H - M - 30) addPage()
        
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
        pdf.text(`${idx + 1}. ${int.title || int.name || 'Intervention'}`, M, Y)
        Y += 7
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        const desc = int.description || int.what_to_do || ''
        const descLines = pdf.splitTextToSize(desc, CW)
        pdf.text(descLines.slice(0, 3), M, Y)
        Y += descLines.slice(0, 3).length * 4 + 5
        
        pdf.setFontSize(8)
        pdf.text(`Investment: ${int.investmentRange || 'TBD'} | ROI: ${int.expectedROI || 'TBD'} | Timeline: ${int.timeline || 'TBD'}`, M, Y)
        Y += 8
      })
    }

    // ==================== PAGE 6: NEXT STEPS ====================
    addPage()
    
    heading('Your Path Forward', BRAND.primary)
    
    paragraph('Recommended implementation approach:')
    space(5)

    subheading('Phase 1: Foundation (Weeks 1-4)')
    bullet('Share this report with leadership')
    bullet('Form steering committee')
    bullet('Prioritize interventions')
    bullet('Secure budget')
    space(5)

    subheading('Phase 2: Planning (Weeks 5-8)')
    bullet('Develop detailed roadmap')
    bullet('Design success metrics')
    bullet('Recruit champions')
    space(5)

    subheading('Phase 3: Execution (Weeks 9-16)')
    bullet('Launch pilot programs')
    bullet('Begin training')
    bullet('Track progress')
    space(10)

    pdf.setFillColor(BRAND.light.r, BRAND.light.g, BRAND.light.b)
    pdf.roundedRect(M, Y, CW, 20, 2, 2, 'F')
    Y += 8
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(BRAND.primary.r, BRAND.primary.g, BRAND.primary.b)
    pdf.text('Questions?', M + 5, Y)
    Y += 6
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(BRAND.neutral.r, BRAND.neutral.g, BRAND.neutral.b)
    pdf.text('LeadingWith.AI  •  info@leadingwithai.com', M + 5, Y)

    // Save
    const fileName = `AI_Assessment_${options.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('PDF Error:', error)
    throw error
  }
}

export const generateCompletePDF = generateComprehensivePDF
