-- =============================================
-- Migration: Update Demo Company to Acme Wealth Advisors
-- =============================================
-- This script migrates existing demo data to use Acme Wealth Advisors
-- as the single demo company with updated user accounts

BEGIN;

-- Step 1: Get the ID of the first company (we'll reuse this)
DO $$
DECLARE
    acme_wealth_id uuid;
BEGIN
    -- Get or create the acme-wealth company
    SELECT id INTO acme_wealth_id FROM companies WHERE name = 'acme-corp' LIMIT 1;

    IF acme_wealth_id IS NULL THEN
        -- If no company exists, create one
        INSERT INTO companies (name, display_name, logo_url)
        VALUES ('acme-wealth', 'Acme Wealth Advisors', null)
        RETURNING id INTO acme_wealth_id;
    ELSE
        -- Update existing company
        UPDATE companies
        SET name = 'acme-wealth',
            display_name = 'Acme Wealth Advisors',
            updated_at = NOW()
        WHERE id = acme_wealth_id;
    END IF;

    -- Step 2: Update all respondents to point to acme-wealth company
    UPDATE respondents
    SET company_id = acme_wealth_id
    WHERE company_id IN (
        SELECT id FROM companies
        WHERE name IN ('acme-corp', 'tech-innovations', 'global-solutions')
    );

    -- Step 3: Update demo users with new emails and details
    -- Update first user (was demo@acme-corp.com)
    UPDATE demo_users
    SET email = 'demo@acmewealth.com',
        company_id = acme_wealth_id,
        full_name = 'Sarah Morgan',
        role = 'Chief Innovation Officer',
        updated_at = NOW()
    WHERE email = 'demo@acme-corp.com';

    -- Update second user (was demo@tech-innovations.com)
    UPDATE demo_users
    SET email = 'analyst@acmewealth.com',
        company_id = acme_wealth_id,
        full_name = 'Michael Chen',
        role = 'Senior Analyst',
        updated_at = NOW()
    WHERE email = 'demo@tech-innovations.com';

    -- Update third user (was demo@global-solutions.com)
    UPDATE demo_users
    SET email = 'executive@acmewealth.com',
        company_id = acme_wealth_id,
        full_name = 'Emma Rodriguez',
        role = 'Chief Strategy Officer',
        updated_at = NOW()
    WHERE email = 'demo@global-solutions.com';

    -- Step 4: Delete old companies (if any remain)
    DELETE FROM companies
    WHERE name IN ('tech-innovations', 'global-solutions')
    AND id != acme_wealth_id;

    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Company ID: %', acme_wealth_id;
    RAISE NOTICE 'Demo users updated: demo@acmewealth.com, analyst@acmewealth.com, executive@acmewealth.com';
END $$;

COMMIT;

-- Verification queries
SELECT 'Companies:' as info;
SELECT id, name, display_name FROM companies;

SELECT 'Demo Users:' as info;
SELECT email, full_name, role, company_id FROM demo_users;

SELECT 'Respondents Count by Company:' as info;
SELECT c.display_name, COUNT(r.id) as respondent_count
FROM companies c
LEFT JOIN respondents r ON c.id = r.company_id
GROUP BY c.id, c.display_name;
