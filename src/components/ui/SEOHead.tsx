import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    image?: string
    type?: string
  }
}

export default function SEOHead({ title, description, canonical, openGraph }: SEOHeadProps) {
  const siteTitle = 'Aha Agile - Intelligent Workflow Automation'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      
      {/* Preload critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      
      {/* Open Graph */}
      <meta property="og:title" content={openGraph?.title || fullTitle} />
      <meta property="og:description" content={openGraph?.description || description} />
      <meta property="og:type" content={openGraph?.type || 'website'} />
      {openGraph?.image && <meta property="og:image" content={openGraph.image} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={openGraph?.title || fullTitle} />
      <meta name="twitter:description" content={openGraph?.description || description} />
      {openGraph?.image && <meta name="twitter:image" content={openGraph.image} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//assets.calendly.com" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Theme and Color Scheme */}
      <meta name="theme-color" content="#1e293b" />
      <meta name="color-scheme" content="light dark" />
    </Head>
  )
}