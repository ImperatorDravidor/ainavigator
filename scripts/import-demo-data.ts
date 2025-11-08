/**
 * Import demo sentiment data from CSV to Supabase
 * Run with: npx tsx scripts/import-demo-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Use service role key

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface CsvRow {
  RespondentID: string
  Region: string
  Department: string
  Employment_type: string
  Age: string
  UserLanguage: string
  [key: string]: string // For Sentiment_1 through Sentiment_25
}

async function main() {
  console.log('🚀 Starting demo data import...\n')

  // Read CSV file
  const csvPath = path.join(process.cwd(), 'data', 'csv-imports', 'sentiment_demo.csv')
  console.log(`📁 Reading CSV from: ${csvPath}`)
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`)
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as CsvRow[]

  console.log(`✅ Parsed ${records.length} records from CSV\n`)

  // Get companies
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('id, name, display_name')
    .order('name')

  if (companiesError) {
    console.error('❌ Error fetching companies:', companiesError)
    process.exit(1)
  }

  if (!companies || companies.length === 0) {
    console.error('❌ No companies found. Run migration 001_demo_schema.sql first.')
    process.exit(1)
  }

  console.log(`📊 Found ${companies.length} companies:`)
  companies.forEach(c => console.log(`   - ${c.display_name} (${c.name})`))
  console.log()

  // Split records evenly among companies
  const recordsPerCompany = Math.ceil(records.length / companies.length)
  
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i]
    const startIdx = i * recordsPerCompany
    const endIdx = Math.min(startIdx + recordsPerCompany, records.length)
    const companyRecords = records.slice(startIdx, endIdx)

    console.log(`📥 Importing ${companyRecords.length} records for ${company.display_name}...`)

    // Transform CSV rows to DB format
    const respondents = companyRecords.map(row => ({
      company_id: company.id,
      respondent_id: row.RespondentID,
      region: row.Region,
      department: row.Department,
      employment_type: row.Employment_type,
      age: row.Age,
      user_language: row.UserLanguage,
      sentiment_1: parseFloat(row.Sentiment_1),
      sentiment_2: parseFloat(row.Sentiment_2),
      sentiment_3: parseFloat(row.Sentiment_3),
      sentiment_4: parseFloat(row.Sentiment_4),
      sentiment_5: parseFloat(row.Sentiment_5),
      sentiment_6: parseFloat(row.Sentiment_6),
      sentiment_7: parseFloat(row.Sentiment_7),
      sentiment_8: parseFloat(row.Sentiment_8),
      sentiment_9: parseFloat(row.Sentiment_9),
      sentiment_10: parseFloat(row.Sentiment_10),
      sentiment_11: parseFloat(row.Sentiment_11),
      sentiment_12: parseFloat(row.Sentiment_12),
      sentiment_13: parseFloat(row.Sentiment_13),
      sentiment_14: parseFloat(row.Sentiment_14),
      sentiment_15: parseFloat(row.Sentiment_15),
      sentiment_16: parseFloat(row.Sentiment_16),
      sentiment_17: parseFloat(row.Sentiment_17),
      sentiment_18: parseFloat(row.Sentiment_18),
      sentiment_19: parseFloat(row.Sentiment_19),
      sentiment_20: parseFloat(row.Sentiment_20),
      sentiment_21: parseFloat(row.Sentiment_21),
      sentiment_22: parseFloat(row.Sentiment_22),
      sentiment_23: parseFloat(row.Sentiment_23),
      sentiment_24: parseFloat(row.Sentiment_24),
      sentiment_25: parseFloat(row.Sentiment_25),
    }))

    // Insert in batches of 500 to avoid payload limits
    const batchSize = 500
    for (let j = 0; j < respondents.length; j += batchSize) {
      const batch = respondents.slice(j, j + batchSize)
      const { error } = await supabase.from('respondents').insert(batch)

      if (error) {
        console.error(`❌ Error inserting batch for ${company.display_name}:`, error)
        continue
      }

      process.stdout.write(`   Progress: ${Math.min(j + batchSize, respondents.length)}/${respondents.length}\r`)
    }

    console.log(`   ✅ Completed ${company.display_name}\n`)
  }

  // Verify import
  console.log('🔍 Verifying import...\n')
  
  const { data: stats, error: statsError } = await supabase
    .rpc('get_company_stats')
    .select('*')

  // If RPC doesn't exist, query directly
  for (const company of companies) {
    const { count, error } = await supabase
      .from('respondents')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', company.id)

    if (!error) {
      console.log(`   ${company.display_name}: ${count} respondents`)
    }
  }

  console.log('\n✅ Import complete!')
  console.log('\n📝 Demo login credentials:')
  const { data: users } = await supabase
    .from('demo_users')
    .select('email, full_name, companies(display_name)')
    .limit(10)

  if (users) {
    users.forEach(user => {
      console.log(`   ${(user as any).companies?.display_name}: ${user.email} / demo123`)
    })
  }
}

main().catch(console.error)


