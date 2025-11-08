/**
 * Security Headers Component
 * Adds security-related meta tags and headers
 */

import SecurityUtils from '@/lib/utils/security'

export function SecurityHeaders() {
  const csp = SecurityUtils.generateCSP({
    allowInlineStyles: true, // Required for Tailwind
    trustedDomains: [
      'https://api.ainavigator.com',
      'https://analytics.google.com',
      'https://www.googletagmanager.com'
    ]
  })

  return (
    <>
      <meta httpEquiv="Content-Security-Policy" content={csp} />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />
    </>
  )
}


