import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ProvidersWithChat } from "./providers-with-chat"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: "AI Navigator | Enterprise AI Readiness Platform",
  description: "Join 500+ leading enterprises using data-driven insights to navigate AI transformation. Assess readiness, identify gaps, and accelerate adoption with confidence.",
  keywords: ["AI readiness", "AI transformation", "enterprise AI", "AI adoption", "digital transformation", "AI assessment", "organizational readiness"],
  authors: [{ name: "AI Navigator" }],
  openGraph: {
    title: "AI Navigator | Enterprise AI Readiness Platform",
    description: "Transform your AI journey with data-driven insights and comprehensive readiness assessments",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Navigator | Enterprise AI Readiness Platform",
    description: "Transform your AI journey with data-driven insights",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen transition-colors duration-300`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <ProvidersWithChat>
          {children}
        </ProvidersWithChat>
      </body>
    </html>
  )
}
