'use client'

import { useEffect, useState } from 'react'

interface CalendlyWidgetProps {
  className?: string
}

export default function CalendlyWidget({ 
  className = '' 
}: CalendlyWidgetProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
    
    if (existingScript) {
      setIsLoading(false)
      return
    }

    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    
    const handleLoad = () => {
      setIsLoading(false)
    }
    
    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
    }

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    document.head.appendChild(script)

    return () => {
      // Clean up event listeners
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Calendar Temporarily Unavailable
        </h3>
        <p className="text-red-700">
          We&apos;re experiencing technical difficulties with our scheduling system. 
          Please try refreshing the page or contact us directly.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="p-6 bg-primary-50 border-b">
        <h2 className="text-2xl font-bold text-primary-900 mb-2">
          Schedule Your Consultation
        </h2>
        <p className="text-primary-700">
          Choose a time that works best for you. Our consultation calls typically last 30-45 minutes.
        </p>
      </div>
      
      {isLoading && (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-secondary-600">Loading calendar...</p>
        </div>
      )}
      
      <div 
        className="calendly-inline-widget" 
        data-url="https://calendly.com/aha-agile/adnan-s-meeting-link?hide_event_type_details=1&hide_gdpr_banner=1"
        style={{ 
          minWidth: '320px', 
          height: '700px',
          display: isLoading ? 'none' : 'block'
        }}
      />
    </div>
  )
}