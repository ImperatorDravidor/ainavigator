'use client'

import { motion } from 'framer-motion'
import { 
  FileText, Download, Share2, Presentation, FileSpreadsheet,
  CheckCircle, Clock, Users, BarChart3, Calendar, Mail, Target
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportsViewProps {
  companyName: string
  onExportPDF: () => void
}

export default function ReportsView({ companyName, onExportPDF }: ReportsViewProps) {

  const exportInterventionsReport = async () => {
    try {
      const { generateInterventionsPDF } = await import('@/lib/utils/pdfExport-interventions-v2')
      
      const interventionsData = {
        companyName: companyName,
        industry: 'Financial Services',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        respondents: 1000,
        interventions: [
          {
            code: 'A1',
            name: 'AI Transparency and Explainability Program',
            level: 'Strategy and Governance',
            description: 'Implement comprehensive transparency frameworks to build trust in AI systems. Establish clear communication protocols about how AI makes decisions, what data it uses, and how employees can question or appeal AI-driven outcomes.',
            outcomes: [
              'Increased trust in AI systems through clear explanations of decision-making processes',
              'Reduced anxiety about opaque AI by 40-50% based on follow-up sentiment surveys',
              'Established audit trails for all AI-driven decisions affecting employees',
              'Created plain-language documentation for all AI tools and their logic'
            ],
            steps: [
              'Conduct stakeholder workshops to identify transparency requirements',
              'Develop AI decision documentation templates and standards',
              'Train managers on explaining AI outputs to their teams',
              'Implement quarterly AI transparency audits',
              'Create employee-facing dashboard showing AI system logic'
            ],
            timeline: '12 weeks',
            investment: '$150,000 - $350,000',
            roi: '30-50% reduction in resistance',
            risk: 'Medium' as const
          },
          {
            code: 'B2',
            name: 'AI Literacy and Skills Development',
            level: 'Adoption and Behavior',
            description: 'Comprehensive training program to build practical AI skills across all employee levels. Includes hands-on workshops, certification paths, and peer learning networks to reduce competence anxiety and increase confidence.',
            outcomes: [
              '80% of employees complete foundational AI literacy training within 6 months',
              'AI champions identified and trained in each department',
              'Measurable 35-45% increase in AI tool adoption rates',
              'Reduction in support tickets and "fear of AI" complaints by 50%'
            ],
            steps: [
              'Assess current AI literacy levels across organization',
              'Design role-specific training curricula (technical vs. business users)',
              'Launch pilot training with early adopters and champions',
              'Roll out organization-wide learning programs with certification',
              'Establish ongoing learning resources and peer support networks'
            ],
            timeline: '16 weeks initial rollout, ongoing',
            investment: '$120,000 - $280,000',
            roi: '40-60% productivity improvement',
            risk: 'Low' as const
          },
          {
            code: 'C1',
            name: 'Rapid AI Prototyping Initiative',
            level: 'Implementation and Value Creation',
            description: 'Fast-track 3-5 high-impact AI use cases from concept to working prototype. Demonstrate tangible value quickly to build organizational confidence and momentum. Focus on quick wins that showcase AI capabilities.',
            outcomes: [
              'Working prototypes delivered in 6-8 weeks for 3-5 use cases',
              'Measurable business value demonstrated (cost savings or revenue impact)',
              'Team confidence in AI delivery capabilities increased significantly',
              'Reusable patterns and best practices documented for future projects'
            ],
            steps: [
              'Identify and prioritize 3-5 high-value, low-complexity use cases',
              'Assemble cross-functional prototype teams with clear ownership',
              'Sprint through rapid development cycles (2-week sprints)',
              'Pilot with friendly user groups and gather feedback',
              'Package successful prototypes for broader deployment'
            ],
            timeline: '8-10 weeks per prototype',
            investment: '$100,000 - $180,000',
            roi: '25-40% faster time-to-value',
            risk: 'Medium' as const
          },
          {
            code: 'B4',
            name: 'AI Ambassador Network',
            level: 'Adoption and Behavior',
            description: 'Build a network of AI champions across departments to drive grassroots adoption. Train ambassadors to provide peer support, answer questions, and model effective AI use in their daily work.',
            outcomes: [
              '25-30 trained AI ambassadors across all departments',
              'Peer-to-peer support reducing IT helpdesk load by 30%',
              'Organic adoption spreading through social influence',
              'Early identification of friction points and resistance patterns'
            ],
            steps: [
              'Nominate and recruit ambassadors from each team (self-nomination encouraged)',
              'Provide intensive training and certification for ambassadors',
              'Establish regular ambassador network meetings and knowledge sharing',
              'Create ambassador playbook with FAQs and troubleshooting guides',
              'Recognize and reward ambassador contributions publicly'
            ],
            timeline: '12 weeks to establish network',
            investment: '$60,000 - $120,000',
            roi: '35-50% adoption acceleration',
            risk: 'Low' as const
          },
          {
            code: 'A3',
            name: 'AI Governance and Ethics Framework',
            level: 'Strategy and Governance',
            description: 'Establish formal governance structures to ensure responsible, ethical AI deployment. Create clear policies, review processes, and accountability mechanisms that address fairness and bias concerns.',
            outcomes: [
              'Published AI ethics guidelines and governance policies',
              'AI review board established with cross-functional representation',
              'Regular ethical impact assessments for all AI deployments',
              'Reduced concerns about fairness and bias by 40-60%'
            ],
            steps: [
              'Form AI governance committee with diverse stakeholder representation',
              'Draft AI ethics principles and usage policies',
              'Implement mandatory ethics review for new AI projects',
              'Train review board members on ethical AI evaluation',
              'Publish policies and create transparency mechanisms'
            ],
            timeline: '10-12 weeks',
            investment: '$90,000 - $180,000',
            roi: '25-35% risk reduction',
            risk: 'Low' as const
          }
        ],
        priorityGaps: [
          { dimension: 'Strategy and Vision', score: 4.0, benchmark: 4.3, gap: -0.3, status: 'Below Benchmark' },
          { dimension: 'Data Infrastructure', score: 3.9, benchmark: 5.5, gap: -1.6, status: 'Critical Gap' },
          { dimension: 'Talent and Skills', score: 4.1, benchmark: 3.7, gap: +0.4, status: 'Above Benchmark' },
          { dimension: 'Ethics and Governance', score: 5.2, benchmark: 4.9, gap: +0.3, status: 'Strength' },
          { dimension: 'Technology Platform', score: 4.5, benchmark: 4.1, gap: +0.4, status: 'Above Benchmark' }
        ]
      }
      
      await generateInterventionsPDF(interventionsData)
    } catch (error) {
      console.error('Failed to generate interventions report:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const reportTypes = [
    {
      id: 'executive',
      icon: FileText,
      title: 'Executive Summary Report',
      description: 'Comprehensive PDF with all findings, insights, and recommendations',
      features: ['Sentiment analysis', 'Capability assessment', 'AI insights', 'Action plan', 'ROI estimates'],
      format: 'PDF',
      status: 'ready',
      action: onExportPDF
    },
    {
      id: 'interventions',
      icon: Target,
      title: 'Interventions Action Plan',
      description: 'Detailed intervention recommendations with implementation roadmap and ROI analysis',
      features: ['Recommended programs', 'Implementation steps', 'Resource requirements', 'Expected outcomes', 'ROI projections'],
      format: 'PDF',
      status: 'ready',
      action: () => exportInterventionsReport()
    },
    {
      id: 'detailed',
      icon: BarChart3,
      title: 'Detailed Analytics Report',
      description: 'In-depth statistical analysis with all data points, segmentations, and methodology',
      features: ['Full data set', 'Statistical breakdowns', 'Demographic segments', 'Methodology notes'],
      format: 'PDF',
      status: 'coming_soon',
      action: null
    },
    {
      id: 'data',
      icon: FileSpreadsheet,
      title: 'Raw Data Export',
      description: 'Complete dataset in CSV format for custom analysis and integration',
      features: ['All responses', 'Calculated scores', 'Demographics', 'Timestamps'],
      format: 'CSV',
      status: 'coming_soon',
      action: null
    }
  ]

  const shareOptions = [
    {
      id: 'email',
      icon: Mail,
      title: 'Email Report',
      description: 'Send report directly to stakeholders'
    },
    {
      id: 'link',
      icon: Share2,
      title: 'Shareable Link',
      description: 'Generate secure view-only link (7-day expiry)'
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: 'Schedule Presentation',
      description: 'Book follow-up session to review findings'
    }
  ]

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Reports & Export</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Generate professional reports and share findings with stakeholders
            </p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Analysis Complete</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500/10 to-purple-500/10 rounded-lg border border-teal-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-900 dark:text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">{companyName} - AI Readiness Assessment</h3>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>October 27, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>1,000 respondents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>33 data points analyzed</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onExportPDF}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-slate-900 dark:text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <Download className="w-5 h-5" />
              Quick Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Available Report Formats</h3>
        
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {reportTypes.map((report, index) => {
            const Icon = report.icon
            const isReady = report.status === 'ready'
            
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  isReady
                    ? "bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10 hover:border-white/20 cursor-pointer hover:shadow-lg"
                    : "bg-white/[0.03] border-white/5 opacity-60"
                )}
                onClick={isReady && report.action ? report.action : undefined}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      isReady
                        ? "bg-gradient-to-br from-blue-500 to-purple-500"
                        : "bg-white/10"
                    )}>
                      <Icon className="w-6 h-6 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-0.5">{report.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{report.format} Format</span>
                      </div>
                    </div>
                  </div>
                  {isReady ? (
                    <span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                      Ready
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-500 text-xs font-semibold">
                      Coming Soon
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-gray-400 mb-3 leading-relaxed">{report.description}</p>

                <div className="space-y-1 mb-4">
                  {report.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
                      <CheckCircle className="w-3 h-3 text-teal-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {isReady && report.action && (
                  <button
                    onClick={report.action}
                    className="w-full px-4 py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 hover:border-teal-400/50 text-teal-300 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Generate & Download
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Share Options */}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3 mt-6">Share & Distribute</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option, index) => {
            const Icon = option.icon
            
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 hover:border-white/20 p-4 text-center transition-all hover:shadow-lg opacity-60 cursor-not-allowed"
                disabled
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">{option.title}</h4>
                <p className="text-xs text-gray-500">{option.description}</p>
                <div className="mt-3 px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-600 text-[10px] font-semibold">
                  Coming Soon
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Help Text */}
      <div className="flex-shrink-0 px-4 py-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
        <p className="text-xs text-slate-600 dark:text-gray-400 flex items-start gap-2">
          <FileText className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <span>
            Reports include all assessment data, insights, and recommendations. 
            <span className="text-slate-900 dark:text-white font-medium"> For custom report formats or additional analyses, contact your account manager.</span>
          </span>
        </p>
      </div>
    </div>
  )
}
