/**
 * PDF Export Utility - The Gem of the Platform ✨
 * Generates stunning, professional PDF reports with real data
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFExportOptions {
  companyName: string
  industry?: string
  assessment: {
    date: string
    respondents: number
    readinessScore: number
    sentimentAverage: number
    capabilityMaturity: number
  }
  sentimentData?: {
    heatmap: any
    problemCategories?: any[]
    lowestCells: any[]
    stats?: {
      overallAverage: number
      totalRespondents: number
      highestScoring?: any[]
      lowestScoring?: any[]
    }
  }
  capabilityData?: {
    dimensions: any[]
    weakestDimensions: any[]
    benchmarkComparison: any
    overall?: {
      average: number
      max: number
      min: number
    }
  }
  interventions?: any[]
  filters?: any
  selectedFlow: 'sentiment' | 'capability' | 'both'
  elementIds?: {
    heatmap?: string
    radarChart?: string
  }
}

// Brand colors for PDF
const BRAND_COLORS = {
  teal: { r: 20, g: 184, b: 166 },
  purple: { r: 168, g: 85, b: 247 },
  pink: { r: 236, g: 72, b: 153 },
  orange: { r: 249, g: 115, b: 22 },
  blue: { r: 59, g: 130, b: 246 },
  green: { r: 16, g: 185, b: 129 },
  red: { r: 239, g: 68, b: 68 },
  gray: { r: 107, g: 114, b: 128 }
}

/**
 * Generate a stunning, professional PDF report - The Gem of the Platform ✨
 */
export async function generatePDF(options: PDFExportOptions): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    let currentY = margin

    // ==================== HELPER FUNCTIONS ====================
    
    // Add page if needed
    const checkAddPage = (requiredSpace: number = 40) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        pdf.addPage()
        addPageFooter()
        currentY = margin
        return true
      }
      return false
    }

    // Add text with wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color?: { r: number, g: number, b: number }) => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
      if (color) pdf.setTextColor(color.r, color.g, color.b)
      const lines = pdf.splitTextToSize(text, contentWidth)
      checkAddPage(lines.length * fontSize * 0.35)
      pdf.text(lines, margin, currentY)
      currentY += lines.length * fontSize * 0.35 + 3
    }

    // Add gradient box (simulated with overlapping rects)
    const addGradientBox = (x: number, y: number, w: number, h: number, color1: any, color2: any) => {
      const steps = 20
      for (let i = 0; i < steps; i++) {
        const ratio = i / steps
        const r = Math.round(color1.r + (color2.r - color1.r) * ratio)
        const g = Math.round(color1.g + (color2.g - color1.g) * ratio)
        const b = Math.round(color1.b + (color2.b - color1.b) * ratio)
        pdf.setFillColor(r, g, b)
        pdf.rect(x, y + (h / steps) * i, w, h / steps, 'F')
      }
    }

    // Add decorative element
    const addDecorativeCircle = (x: number, y: number, radius: number, color: any, opacity: number = 0.1) => {
      pdf.setFillColor(color.r, color.g, color.b)
      pdf.setGState(new (pdf as any).GState({ opacity }))
      pdf.circle(x, y, radius, 'F')
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }))
    }

    // Add page footer
    const addPageFooter = () => {
      const footerY = pageHeight - 10
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text('LeadingWith.AI - AI Navigator Platform', pageWidth / 2, footerY, { align: 'center' })
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, footerY)
      const pageNumber = (pdf as any).internal.getNumberOfPages()
      pdf.text(`Page ${pageNumber}`, pageWidth - margin, footerY, { align: 'right' })
    }

    // ==================== PAGE 1: STUNNING COVER ====================
    
    // Gradient background (teal to purple)
    addGradientBox(0, 0, pageWidth, 100, BRAND_COLORS.teal, BRAND_COLORS.purple)
    
    // Decorative circles
    addDecorativeCircle(20, 30, 40, BRAND_COLORS.pink, 0.15)
    addDecorativeCircle(pageWidth - 20, 70, 50, BRAND_COLORS.purple, 0.2)
    
    // White title text with shadow effect
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(36)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI Readiness', pageWidth / 2, 40, { align: 'center' })
    pdf.setFontSize(32)
    pdf.text('Assessment Report', pageWidth / 2, 55, { align: 'center' })

    // Company name in elegant box
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'normal')
    pdf.text(options.companyName, pageWidth / 2, 75, { align: 'center' })

    // Subtitle
    pdf.setFontSize(12)
    pdf.text(options.industry || 'Enterprise', pageWidth / 2, 85, { align: 'center' })
    
    // Date and metadata in elegant cards
    currentY = 110
    pdf.setTextColor(100, 100, 100)
    pdf.setFontSize(10)
    pdf.text(`Assessment Date: ${options.assessment.date}`, pageWidth / 2, currentY, { align: 'center' })
    currentY += 6
    pdf.text(`${options.assessment.respondents.toLocaleString()} Employees Surveyed`, pageWidth / 2, currentY, { align: 'center' })
    
    // ==================== EXECUTIVE SUMMARY SECTION ====================
    currentY = 130
    
    // Section header with gradient underline
    pdf.setTextColor(BRAND_COLORS.teal.r, BRAND_COLORS.teal.g, BRAND_COLORS.teal.b)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Executive Summary', margin, currentY)
    
    // Gradient underline
    addGradientBox(margin, currentY + 2, 60, 1.5, BRAND_COLORS.teal, BRAND_COLORS.purple)
    currentY += 12

    // Three beautiful metric cards
    const cardWidth = (contentWidth - 8) / 3
    const cardHeight = 35
    const cardY = currentY
    
    // Card 1: Readiness Score (Teal)
    pdf.setFillColor(240, 253, 250) // Teal light
    pdf.setDrawColor(BRAND_COLORS.teal.r, BRAND_COLORS.teal.g, BRAND_COLORS.teal.b)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(margin, cardY, cardWidth, cardHeight, 3, 3, 'FD')
    
    pdf.setTextColor(BRAND_COLORS.teal.r, BRAND_COLORS.teal.g, BRAND_COLORS.teal.b)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI READINESS', margin + cardWidth/2, cardY + 8, { align: 'center' })
    
    pdf.setFontSize(32)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${options.assessment.readinessScore}%`, margin + cardWidth/2, cardY + 22, { align: 'center' })
    
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    const readinessLabel = options.assessment.readinessScore >= 75 ? 'Strong' : 
                          options.assessment.readinessScore >= 60 ? 'Moderate' : 'Developing'
    pdf.text(readinessLabel, margin + cardWidth/2, cardY + 30, { align: 'center' })
    
    // Card 2: Sentiment (Purple)
    const card2X = margin + cardWidth + 4
    pdf.setFillColor(250, 245, 255) // Purple light
    pdf.setDrawColor(BRAND_COLORS.purple.r, BRAND_COLORS.purple.g, BRAND_COLORS.purple.b)
    pdf.roundedRect(card2X, cardY, cardWidth, cardHeight, 3, 3, 'FD')
    
    pdf.setTextColor(BRAND_COLORS.purple.r, BRAND_COLORS.purple.g, BRAND_COLORS.purple.b)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('SENTIMENT', card2X + cardWidth/2, cardY + 8, { align: 'center' })
    
    pdf.setFontSize(32)
    pdf.text(`${Number(options.assessment.sentimentAverage).toFixed(1)}`, card2X + cardWidth/2, cardY + 22, { align: 'center' })
    
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('out of 5.0', card2X + cardWidth/2, cardY + 30, { align: 'center' })
    
    // Card 3: Capability (Blue)
    const card3X = margin + 2 * cardWidth + 8
    pdf.setFillColor(239, 246, 255) // Blue light
    pdf.setDrawColor(BRAND_COLORS.blue.r, BRAND_COLORS.blue.g, BRAND_COLORS.blue.b)
    pdf.roundedRect(card3X, cardY, cardWidth, cardHeight, 3, 3, 'FD')
    
    pdf.setTextColor(BRAND_COLORS.blue.r, BRAND_COLORS.blue.g, BRAND_COLORS.blue.b)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CAPABILITY', card3X + cardWidth/2, cardY + 8, { align: 'center' })
    
    pdf.setFontSize(32)
    pdf.text(`${Number(options.assessment.capabilityMaturity).toFixed(1)}`, card3X + cardWidth/2, cardY + 22, { align: 'center' })
    
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('out of 10.0', card3X + cardWidth/2, cardY + 30, { align: 'center' })
    
    currentY = cardY + cardHeight + 15

    // Key Insights Box
    pdf.setFillColor(249, 250, 251)
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(margin, currentY, contentWidth, 45, 3, 3, 'FD')
    
    pdf.setTextColor(50, 50, 50)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text('📊 Key Insights', margin + 5, currentY + 8)
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(70, 70, 70)
    
    const insights = []
    if (options.sentimentData?.stats) {
      insights.push(`• ${options.assessment.respondents} employees analyzed across 25 sentiment dimensions`)
      insights.push(`• Overall sentiment: ${options.sentimentData.stats.overallAverage.toFixed(2)}/5.0`)
    }
    if (options.capabilityData?.overall) {
      insights.push(`• 8 organizational capabilities assessed vs. industry benchmarks`)
      insights.push(`• Average capability maturity: ${options.capabilityData.overall.average.toFixed(1)}/10.0`)
    }
    
    let insightY = currentY + 16
    insights.forEach(insight => {
      pdf.text(insight, margin + 5, insightY)
      insightY += 6
    })
    
    currentY += 52

    // Page footer
    addPageFooter()

    // ==================== PAGE 2: SENTIMENT ANALYSIS ====================
    if (options.selectedFlow === 'sentiment' || options.selectedFlow === 'both') {
      pdf.addPage()
      currentY = margin

      pdf.setFontSize(20)
      pdf.setTextColor(20, 184, 166)
      pdf.setFont('helvetica', 'bold')
      addText('Sentiment Analysis', 20, true)
      
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      addText('How employees feel about AI adoption across 5 sentiment levels and 5 characteristic categories.')

      currentY += 5

      // Sentiment Heatmap Summary
      if (options.sentimentData?.lowestCells && options.sentimentData.lowestCells.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(14)
        addText('Priority Concern Areas', 14, true)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        addText('The following heatmap cells show the strongest resistance or concern (lowest scores):', 10)

        // Table header
        pdf.setFillColor(239, 68, 68) // Red
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F')
        pdf.text('Rank', margin + 2, currentY + 5)
        pdf.text('Sentiment Level', margin + 15, currentY + 5)
        pdf.text('Category', margin + 70, currentY + 5)
        pdf.text('Score', margin + 130, currentY + 5)
        pdf.text('Respondents', margin + 152, currentY + 5)
        currentY += 10

        options.sentimentData.lowestCells.slice(0, 8).forEach((cell, idx) => {
          checkAddPage(8)

          // Alternate row colors
          if (idx % 2 === 0) {
            pdf.setFillColor(254, 226, 226)
          } else {
            pdf.setFillColor(255, 245, 245)
          }
          pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F')

          pdf.setTextColor(50, 50, 50)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(9)
          pdf.text(`#${cell.rank || idx + 1}`, margin + 2, currentY + 5)

          pdf.setFont('helvetica', 'normal')
          pdf.text(cell.level || '', margin + 15, currentY + 5)
          pdf.text(cell.reason || cell.category || '', margin + 70, currentY + 5)

          // Score with color coding
          const score = cell.score || 0
          if (score < 2.0) {
            pdf.setTextColor(185, 28, 28)
          } else if (score < 3.0) {
            pdf.setTextColor(234, 88, 12)
          } else {
            pdf.setTextColor(100, 100, 100)
          }
          pdf.setFont('helvetica', 'bold')
          pdf.text(score.toFixed(2), margin + 130, currentY + 5)

          pdf.setTextColor(80, 80, 80)
          pdf.setFont('helvetica', 'normal')
          pdf.text(`${cell.count || 0}`, margin + 152, currentY + 5)

          currentY += 8
        })

        currentY += 5
      }

      // Problem Categories
      if (options.sentimentData?.problemCategories && options.sentimentData.problemCategories.length > 0) {
        checkAddPage(30)
        currentY += 5
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(14)
        addText('AI-Generated Problem Categories', 14, true)

        options.sentimentData.problemCategories.forEach((category, idx) => {
          checkAddPage(25)
          
          pdf.setDrawColor(200, 200, 200)
          pdf.setFillColor(249, 250, 251)
          pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 20, 2, 2, 'FD')

          pdf.setTextColor(234, 88, 12) // Orange
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(11)
          pdf.text(`${category.category_name}`, margin + 3, currentY + 5)

          pdf.setTextColor(70, 70, 70)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(9)
          const desc = pdf.splitTextToSize(category.description || '', pageWidth - 2 * margin - 6)
          pdf.text(desc.slice(0, 2), margin + 3, currentY + 10)

          currentY += 23
        })
      }
    }

    // ==================== PAGE 3: CAPABILITY ANALYSIS ====================
    if (options.selectedFlow === 'capability' || options.selectedFlow === 'both') {
      pdf.addPage()
      currentY = margin

      pdf.setFontSize(20)
      pdf.setTextColor(147, 51, 234) // Purple
      pdf.setFont('helvetica', 'bold')
      addText('Capability Assessment', 20, true)

      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      addText('Organizational readiness across 8 capability dimensions compared to industry benchmarks.')

      currentY += 5

      // Dimensions Table
      if (options.capabilityData?.dimensions && options.capabilityData.dimensions.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        addText('Dimension Scores', 12, true)

        // Table header
        pdf.setFillColor(147, 51, 234)
        pdf.setTextColor(255, 255, 255)
        pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F')
        pdf.setFontSize(9)
        pdf.text('Dimension', margin + 2, currentY + 5)
        pdf.text('Score', margin + 100, currentY + 5)
        pdf.text('Benchmark', margin + 125, currentY + 5)
        pdf.text('Gap', margin + 155, currentY + 5)
        currentY += 10

        // Table rows
        options.capabilityData.dimensions.forEach((dim, idx) => {
          checkAddPage(8)
          if (idx % 2 === 0) {
            pdf.setFillColor(249, 250, 251)
          } else {
            pdf.setFillColor(255, 255, 255)
          }
          pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F')

          pdf.setTextColor(50, 50, 50)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(9)
          pdf.text(dim.name || '', margin + 2, currentY + 5)
          pdf.text((dim.average || 0).toFixed(1), margin + 100, currentY + 5)
          pdf.text((dim.benchmark || 0).toFixed(1), margin + 125, currentY + 5)
          
          const gap = (dim.average || 0) - (dim.benchmark || 0)
          if (gap >= 0) {
            pdf.setTextColor(34, 197, 94)
          } else {
            pdf.setTextColor(239, 68, 68)
          }
          pdf.text(gap.toFixed(1), margin + 155, currentY + 5)

          currentY += 8
        })
      }

      // Weakest Dimensions
      if (options.capabilityData?.weakestDimensions && options.capabilityData.weakestDimensions.length > 0) {
        currentY += 10
        checkAddPage(30)
        pdf.setTextColor(80, 80, 80)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        addText('Priority Areas for Improvement', 12, true)

        options.capabilityData.weakestDimensions.slice(0, 3).forEach((dim, idx) => {
          checkAddPage(12)
          pdf.setFillColor(254, 243, 199) // Light yellow
          pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 10, 2, 2, 'F')

          pdf.setTextColor(50, 50, 50)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(10)
          pdf.text(`${idx + 1}. ${dim.name}`, margin + 3, currentY + 4)
          pdf.setFont('helvetica', 'normal')
          pdf.text(`Score: ${dim.average?.toFixed(1)} (Benchmark: ${dim.benchmark?.toFixed(1)})`, margin + 3, currentY + 8)

          currentY += 12
        })
      }
    }

    // ==================== PAGE 4: INTERVENTIONS ====================
    if (options.interventions && options.interventions.length > 0) {
      pdf.addPage()
      currentY = margin

      pdf.setFontSize(20)
      pdf.setTextColor(20, 184, 166)
      pdf.setFont('helvetica', 'bold')
      addText('Recommended Strategic Interventions', 20, true)

      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      addText('Prioritized actions to improve AI readiness based on identified gaps.')

      currentY += 5

      // Helper to get level colors and names
      const getLevelInfo = (code: string) => {
        const level = code?.charAt(0) || 'A'
        const levelMap: Record<string, { color: [number, number, number], name: string }> = {
          'A': { color: [147, 51, 234], name: 'Strategy & Governance' },   // Purple
          'B': { color: [59, 130, 246], name: 'Adoption & Behaviour' },    // Blue
          'C': { color: [20, 184, 166], name: 'Innovation & Value' }       // Teal
        }
        return levelMap[level] || levelMap['A']
      }

      options.interventions.slice(0, 10).forEach((intervention, idx) => {
        checkAddPage(40)

        const levelInfo = getLevelInfo(intervention.code)

        // Level badge and title
        pdf.setFillColor(...levelInfo.color)
        pdf.roundedRect(margin, currentY, 15, 8, 2, 2, 'F')

        pdf.setTextColor(255, 255, 255)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10)
        pdf.text(intervention.code || `I${idx + 1}`, margin + 7.5, currentY + 5.5, { align: 'center' })

        // Intervention title with level category
        pdf.setTextColor(...levelInfo.color)
        pdf.setFontSize(12)
        pdf.text(intervention.name || intervention.title, margin + 18, currentY + 6)

        currentY += 10

        // Level category label
        pdf.setTextColor(100, 100, 100)
        pdf.setFont('helvetica', 'italic')
        pdf.setFontSize(8)
        pdf.text(levelInfo.name, margin, currentY)
        currentY += 5

        // Description box
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.3)
        pdf.setFillColor(250, 250, 250)
        pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 20, 2, 2, 'FD')

        pdf.setTextColor(60, 60, 60)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        const desc = pdf.splitTextToSize(intervention.description || '', pageWidth - 2 * margin - 6)
        pdf.text(desc.slice(0, 3), margin + 3, currentY + 4)

        currentY += 22

        // Metrics row
        pdf.setFontSize(8)
        pdf.setTextColor(80, 80, 80)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Investment:', margin, currentY)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(100, 100, 100)
        pdf.text(intervention.investment_range || 'TBD', margin + 20, currentY)

        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(80, 80, 80)
        pdf.text('Timeline:', margin + 65, currentY)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(100, 100, 100)
        pdf.text(intervention.duration || intervention.timeline || '12 weeks', margin + 82, currentY)

        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(80, 80, 80)
        pdf.text('Effort:', margin + 130, currentY)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(100, 100, 100)
        pdf.text(intervention.estimated_effort || 'Medium', margin + 144, currentY)

        currentY += 8
      })

      // Add two-tier explanation
      if (currentY < pageHeight - 60) {
        currentY += 10
        pdf.setDrawColor(20, 184, 166)
        pdf.setLineWidth(0.5)
        pdf.setFillColor(240, 253, 250)
        pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 25, 3, 3, 'FD')

        pdf.setTextColor(20, 184, 166)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10)
        pdf.text('Two-Tier Intervention System', margin + 3, currentY + 5)

        pdf.setTextColor(60, 60, 60)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        const explanationLines = [
          'Strategic Catalogue: 10 comprehensive interventions (A1-A3, B1-B5, C1-C2) forming the foundation of organizational AI transformation.',
          'Cell-Specific: Each of the 25 sentiment heatmap cells maps to 3 targeted interventions (75 total), addressing specific emotional blockers.'
        ]
        let explY = currentY + 10
        explanationLines.forEach(line => {
          const wrapped = pdf.splitTextToSize(line, pageWidth - 2 * margin - 6)
          pdf.text(wrapped, margin + 3, explY)
          explY += wrapped.length * 3
        })
      }
    }

    // ==================== FINAL PAGE: NEXT STEPS ====================
    pdf.addPage()
    currentY = margin

    pdf.setFontSize(20)
    pdf.setTextColor(20, 184, 166)
    pdf.setFont('helvetica', 'bold')
    addText('Next Steps', 20, true)

    pdf.setTextColor(80, 80, 80)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)

    const nextSteps = [
      '1. Review this assessment with your leadership team',
      '2. Prioritize interventions based on business impact and feasibility',
      '3. Develop a detailed implementation roadmap',
      '4. Secure necessary resources and stakeholder buy-in',
      '5. Launch pilot programs for highest-priority interventions',
      '6. Monitor progress and adjust strategy as needed'
    ]

    nextSteps.forEach(step => {
      addText(step, 11)
    })

    currentY += 10
    pdf.setFont('helvetica', 'bold')
    addText('Contact Information', 12, true)
    pdf.setFont('helvetica', 'normal')
    addText('For questions or to discuss implementation, contact:', 10)
    addText('LeadingWith.AI', 10)
    addText('Email: info@leadingwithai.com', 10)

    // Save PDF
    const fileName = `AI_Readiness_Assessment_${options.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw new Error('Failed to generate PDF report')
  }
}

/**
 * Capture a DOM element as an image and add to PDF
 */
export async function captureElementToPDF(
  elementId: string,
  pdf: jsPDF,
  x: number,
  y: number,
  width: number
): Promise<number> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.warn(`Element ${elementId} not found`)
      return 0
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const imgHeight = (canvas.height * width) / canvas.width

    pdf.addImage(imgData, 'PNG', x, y, width, imgHeight)
    return imgHeight
  } catch (error) {
    console.error('Element capture error:', error)
    return 0
  }
}

