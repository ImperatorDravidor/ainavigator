/**
 * Professional Interventions Action Plan PDF Generator
 * Clean, readable, no broken characters - production ready
 */

import jsPDF from 'jspdf'

export interface InterventionData {
  code: string
  name: string
  level: string
  description: string
  outcomes: string[]
  steps: string[]
  timeline: string
  investment: string
  roi: string
  risk: 'Low' | 'Medium' | 'High'
}

export interface InterventionsPDFData {
  companyName: string
  industry: string
  date: string
  respondents: number
  interventions: InterventionData[]
  priorityGaps: Array<{
    dimension: string
    score: number
    benchmark: number
    gap: number
    status: string
  }>
}

// Safe color palette
const colors = {
  primary: [20, 184, 166],
  secondary: [168, 85, 247],
  dark: [30, 41, 59],
  gray: [100, 116, 139],
  lightGray: [226, 232, 240],
  green: [34, 197, 94],
  orange: [249, 115, 22],
  red: [239, 68, 68]
}

export async function generateInterventionsPDF(data: InterventionsPDFData) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPos = margin
  let pageNumber = 1

  // ============ HELPERS ============

  const addFooter = () => {
    pdf.setFontSize(8)
    pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2])
    pdf.text('LeadingWith.AI - Interventions Action Plan', margin, pageHeight - 10)
    pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
  }

  const newPage = () => {
    pdf.addPage()
    yPos = margin
    pageNumber++
    addFooter()
  }

  const checkSpace = (needed: number) => {
    if (yPos + needed > pageHeight - 20) {
      newPage()
      return true
    }
    return false
  }

  const addText = (text: string, fontSize: number, isBold: boolean, color: number[]) => {
    pdf.setFontSize(fontSize)
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
    pdf.setTextColor(color[0], color[1], color[2])
    const lines = pdf.splitTextToSize(text, contentWidth)
    checkSpace(lines.length * fontSize * 0.35 + 5)
    pdf.text(lines, margin, yPos)
    yPos += lines.length * fontSize * 0.35 + 3
  }

  const addBullet = (text: string) => {
    checkSpace(8)
    pdf.setFontSize(10)
    pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
    pdf.setFont('helvetica', 'normal')
    // Use simple bullet
    pdf.text('•', margin + 2, yPos)
    const lines = pdf.splitTextToSize(text, contentWidth - 8)
    pdf.text(lines, margin + 6, yPos)
    yPos += lines.length * 3.5 + 2
  }

  const addSectionHeader = (title: string) => {
    checkSpace(15)
    // Gradient background
    const steps = 20
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps
      const r = Math.round(colors.primary[0] + (colors.secondary[0] - colors.primary[0]) * ratio)
      const g = Math.round(colors.primary[1] + (colors.secondary[1] - colors.primary[1]) * ratio)
      const b = Math.round(colors.primary[2] + (colors.secondary[2] - colors.primary[2]) * ratio)
      pdf.setFillColor(r, g, b)
      pdf.rect(margin + (contentWidth / steps) * i, yPos, contentWidth / steps, 10, 'F')
    }
    
    pdf.setFontSize(14)
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, margin + 3, yPos + 6.5)
    yPos += 15
  }

  const addInfoBox = (title: string, content: string, bgColor: number[]) => {
    checkSpace(20)
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    pdf.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'F')
    pdf.setFontSize(9)
    pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
    pdf.setFont('helvetica', 'bold')
    pdf.text(title.toUpperCase(), margin + 3, yPos + 5)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    const lines = pdf.splitTextToSize(content, contentWidth - 6)
    pdf.text(lines, margin + 3, yPos + 10)
    yPos += 18
  }

  // ============ COVER PAGE ============

  // Header gradient
  const steps = 30
  for (let i = 0; i < steps; i++) {
    const ratio = i / steps
    const r = Math.round(colors.primary[0] + (colors.secondary[0] - colors.primary[0]) * ratio)
    const g = Math.round(colors.primary[1] + (colors.secondary[1] - colors.primary[1]) * ratio)
    const b = Math.round(colors.primary[2] + (colors.secondary[2] - colors.primary[2]) * ratio)
    pdf.setFillColor(r, g, b)
    pdf.rect(0, (pageHeight / 3 / steps) * i, pageWidth, pageHeight / 3 / steps, 'F')
  }

  // Title
  pdf.setFontSize(36)
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Interventions', pageWidth / 2, 50, { align: 'center' })
  pdf.setFontSize(28)
  pdf.text('Action Plan', pageWidth / 2, 65, { align: 'center' })

  // Company
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'normal')
  pdf.text(data.companyName, pageWidth / 2, 80, { align: 'center' })
  
  pdf.setFontSize(12)
  pdf.text(data.industry, pageWidth / 2, 90, { align: 'center' })

  // Date
  pdf.setFontSize(10)
  pdf.setTextColor(240, 240, 240)
  pdf.text(data.date, pageWidth / 2, 102, { align: 'center' })

  // Stats boxes
  yPos = 120
  const boxWidth = (contentWidth - 8) / 3
  
  const boxes = [
    { label: 'Respondents', value: data.respondents.toString() },
    { label: 'Interventions', value: data.interventions.length.toString() },
    { label: 'Priority Areas', value: data.priorityGaps.length.toString() }
  ]

  boxes.forEach((box, idx) => {
    const xPos = margin + idx * (boxWidth + 4)
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2])
    pdf.roundedRect(xPos, yPos, boxWidth, 20, 2, 2, 'F')
    pdf.setFontSize(18)
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.text(box.value, xPos + boxWidth / 2, yPos + 10, { align: 'center' })
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(box.label, xPos + boxWidth / 2, yPos + 16, { align: 'center' })
  })

  addFooter()
  newPage()

  // ============ EXECUTIVE SUMMARY ============

  addSectionHeader('Executive Summary')
  
  addText(
    `This action plan provides detailed intervention recommendations based on your AI readiness assessment. ` +
    `We analyzed responses from ${data.respondents} employees and identified ${data.interventions.length} strategic ` +
    `programs to accelerate AI adoption and reduce resistance.`,
    10, false, colors.dark
  )

  yPos += 5

  addInfoBox(
    'Purpose',
    'Transform assessment insights into concrete action. Each intervention addresses specific capability gaps and emotional barriers identified in your data.',
    colors.primary
  )

  yPos += 3

  // ============ PRIORITY GAPS ============

  addSectionHeader('Priority Capability Gaps')

  addText(
    'Based on your assessment, these dimensions require immediate attention:',
    10, false, colors.dark
  )

  yPos += 3

  data.priorityGaps.forEach((gap, idx) => {
    checkSpace(18)
    
    // Gap card
    pdf.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2])
    pdf.roundedRect(margin, yPos, contentWidth, 16, 2, 2, 'F')
    
    // Number badge
    const badgeColor = gap.gap < -1.5 ? colors.red : gap.gap < -0.5 ? colors.orange : colors.gray
    pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2])
    pdf.circle(margin + 7, yPos + 8, 5, 'F')
    pdf.setFontSize(11)
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.text((idx + 1).toString(), margin + 7, yPos + 9.5, { align: 'center' })
    
    // Dimension name
    pdf.setFontSize(11)
    pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
    pdf.setFont('helvetica', 'bold')
    pdf.text(gap.dimension, margin + 15, yPos + 6)
    
    // Metrics
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2])
    pdf.text(
      `Score: ${gap.score.toFixed(1)}/${gap.benchmark.toFixed(1)}  |  Gap: ${gap.gap.toFixed(1)}  |  ${gap.status}`,
      margin + 15,
      yPos + 11
    )
    
    yPos += 19
  })

  newPage()

  // ============ DETAILED INTERVENTIONS ============

  addSectionHeader('Recommended Interventions')

  addText(
    'Each intervention is designed to address specific gaps and maximize ROI:',
    10, false, colors.dark
  )

  yPos += 5

  data.interventions.forEach((intervention, idx) => {
    checkSpace(100) // Ensure full intervention fits on page
    
    // Intervention header
    pdf.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2])
    pdf.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F')
    
    // Code badge
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(margin + 3, yPos + 2, 18, 8, 1, 1, 'F')
    pdf.setFontSize(10)
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2])
    pdf.setFont('helvetica', 'bold')
    pdf.text(intervention.code, margin + 12, yPos + 7, { align: 'center' })
    
    // Intervention name
    pdf.setFontSize(13)
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.text(intervention.name, margin + 25, yPos + 7.5)
    
    yPos += 15

    // Level badge
    pdf.setFontSize(8)
    pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2])
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Level: ${intervention.level}`, margin + 2, yPos)
    yPos += 7

    // Description
    pdf.setFontSize(10)
    pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
    pdf.setFont('helvetica', 'normal')
    const descLines = pdf.splitTextToSize(intervention.description, contentWidth)
    pdf.text(descLines, margin + 2, yPos)
    yPos += descLines.length * 3.5 + 5

    // Expected Outcomes
    if (intervention.outcomes && intervention.outcomes.length > 0) {
      pdf.setFontSize(10)
      pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
      pdf.setFont('helvetica', 'bold')
      pdf.text('Expected Outcomes:', margin + 2, yPos)
      yPos += 6

      intervention.outcomes.forEach(outcome => {
        checkSpace(10)
        pdf.setFontSize(9)
        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
        pdf.setFont('helvetica', 'normal')
        pdf.text('•', margin + 4, yPos)
        const lines = pdf.splitTextToSize(outcome, contentWidth - 8)
        pdf.text(lines, margin + 8, yPos)
        yPos += lines.length * 3.2 + 2
      })
      
      yPos += 3
    }

    // Implementation Steps
    if (intervention.steps && intervention.steps.length > 0) {
      checkSpace(25)
      pdf.setFontSize(10)
      pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
      pdf.setFont('helvetica', 'bold')
      pdf.text('Implementation Steps:', margin + 2, yPos)
      yPos += 6

      intervention.steps.slice(0, 5).forEach((step, stepIdx) => {
        checkSpace(8)
        pdf.setFontSize(9)
        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
        pdf.setFont('helvetica', 'normal')
        pdf.text(`${stepIdx + 1}.`, margin + 4, yPos)
        const lines = pdf.splitTextToSize(step, contentWidth - 10)
        pdf.text(lines, margin + 10, yPos)
        yPos += lines.length * 3.2 + 2
      })
      
      yPos += 3
    }

    // Metrics row
    checkSpace(20)
    pdf.setFillColor(250, 250, 250)
    pdf.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'F')
    
    const metrics = [
      { label: 'Timeline', value: intervention.timeline },
      { label: 'Investment', value: intervention.investment },
      { label: 'ROI', value: intervention.roi },
      { label: 'Risk', value: intervention.risk }
    ]

    pdf.setFontSize(8)
    let xOffset = margin + 3
    metrics.forEach((metric, metricIdx) => {
      pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2])
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${metric.label}:`, xOffset, yPos + 5)
      pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
      pdf.setFont('helvetica', 'normal')
      pdf.text(metric.value, xOffset, yPos + 10)
      xOffset += contentWidth / 4
    })

    yPos += 20

    // Separator
    if (idx < data.interventions.length - 1) {
      pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2])
      pdf.setLineWidth(0.5)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 8
    }
  })

  // ============ IMPLEMENTATION ROADMAP ============

  newPage()
  addSectionHeader('Implementation Roadmap')

  addText(
    'A phased approach to maximize impact and minimize disruption:',
    10, false, colors.dark
  )

  yPos += 8

  const phases = [
    {
      name: 'Phase 1: Foundation (Weeks 1-4)',
      tasks: [
        'Share this report with leadership team',
        'Establish AI transformation steering committee',
        'Secure budget and resource commitments',
        'Prioritize top 3 interventions to launch'
      ]
    },
    {
      name: 'Phase 2: Launch (Weeks 5-12)',
      tasks: [
        'Begin top-priority interventions',
        'Establish feedback loops and measurement',
        'Address highest-concern areas first',
        'Communicate progress transparently to organization'
      ]
    },
    {
      name: 'Phase 3: Scale (Weeks 13-24)',
      tasks: [
        'Expand successful programs organization-wide',
        'Launch remaining interventions systematically',
        'Build internal AI advocacy and champions',
        'Measure results and celebrate wins'
      ]
    }
  ]

  phases.forEach((phase, idx) => {
    checkSpace(40)
    
    // Phase header
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2])
    pdf.roundedRect(margin, yPos, contentWidth, 8, 1, 1, 'F')
    pdf.setFontSize(11)
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.text(phase.name, margin + 3, yPos + 5.5)
    yPos += 11

    // Tasks
    phase.tasks.forEach(task => {
      addBullet(task)
    })

    yPos += 5
  })

  // ============ SUCCESS METRICS ============

  newPage()
  addSectionHeader('Measuring Success')

  addText(
    'Track these key performance indicators to measure intervention effectiveness:',
    10, false, colors.dark
  )

  yPos += 8

  const metrics = [
    { metric: 'Employee Sentiment Score', target: '+15-25% improvement', timeline: '6 months' },
    { metric: 'Capability Maturity Level', target: '+1.5-2.0 points', timeline: '12 months' },
    { metric: 'AI Tool Adoption Rate', target: '60-75% active users', timeline: '9 months' },
    { metric: 'Productivity Improvement', target: '15-30% efficiency gain', timeline: '12 months' },
    { metric: 'Employee Confidence', target: '+30-40% confidence score', timeline: '6 months' }
  ]

  metrics.forEach(m => {
    checkSpace(12)
    pdf.setFillColor(245, 245, 245)
    pdf.roundedRect(margin, yPos, contentWidth, 10, 1, 1, 'F')
    
    pdf.setFontSize(10)
    pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
    pdf.setFont('helvetica', 'bold')
    pdf.text(m.metric, margin + 2, yPos + 4)
    
    pdf.setFontSize(9)
    pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2])
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Target: ${m.target}`, margin + 2, yPos + 8)
    
    pdf.setFontSize(8)
    pdf.text(`Timeline: ${m.timeline}`, pageWidth - margin - 2, yPos + 6, { align: 'right' })
    
    yPos += 13
  })

  // ============ NEXT STEPS ============

  yPos += 10
  checkSpace(40)

  pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2], 0.1)
  pdf.roundedRect(margin, yPos, contentWidth, 30, 2, 2, 'F')
  
  pdf.setFontSize(12)
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
  pdf.setFont('helvetica', 'bold')
  pdf.text('Next Steps', margin + 3, yPos + 7)
  
  pdf.setFontSize(10)
  pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
  pdf.setFont('helvetica', 'normal')
  pdf.text('1. Review this action plan with your leadership team', margin + 3, yPos + 14)
  pdf.text('2. Schedule implementation planning session', margin + 3, yPos + 19)
  pdf.text('3. Contact us to discuss customization and support', margin + 3, yPos + 24)
  
  yPos += 33

  // Save
  const filename = `Interventions-Action-Plan-${data.companyName.replace(/\s+/g, '-')}.pdf`
  pdf.save(filename)
}

