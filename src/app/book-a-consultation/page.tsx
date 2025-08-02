import CalendlyWidget from '@/components/ui/CalendlyWidget'
import BookConsultationHeroSection from '@/components/sections/BookConsultationHeroSection'
import WhatToExpectSection from '@/components/sections/WhatToExpectSection'
import BenefitsSidebar from '@/components/sections/BenefitsSidebar'
import CTASection from '@/components/sections/CTASection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Consultation | Aha Agile',
  description: 'Schedule a consultation with our agile transformation experts. Book directly through our calendar.',
}

export default function BookConsultationPage() {
  return (
    <div>
      {/* Enhanced Hero Section */}
      <BookConsultationHeroSection />
      
      {/* What to Expect Section */}
      <WhatToExpectSection />
      
      {/* Enhanced Calendly Integration with Benefits Sidebar */}
      <div className="container mx-auto px-4 py-xl">
        <div className="max-w-7xl mx-auto">
          {/* Two-column layout: Calendly (left) + Benefits (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg lg:gap-xl">
            {/* Calendly Widget Column - Takes 2/3 width on desktop */}
            <div className="lg:col-span-2">
              <CalendlyWidget className="h-fit" id="calendly-widget" />
            </div>
            
            {/* Benefits Sidebar Column - Takes 1/3 width on desktop */}
            <div className="lg:col-span-1">
              <BenefitsSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="container mx-auto px-4 pb-xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl shadow-brand p-lg border border-border/20">
            {/* Gradient background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-card/30 to-accent/5 rounded-2xl pointer-events-none" />
            
            <div className="relative">
              <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">
                Ready to Get Started?
              </h3>
              <p className="text-secondary-700 font-serif leading-relaxed">
                Use the calendar above to book your free consultation. We&apos;re here to help you understand 
                how intelligent workflow automation can transform your organization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional CTA Section - Final call-to-action */}
      <CTASection />
    </div>
  )
}