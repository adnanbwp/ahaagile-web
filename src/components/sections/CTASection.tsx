'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/lib/icons';

interface CTASectionProps {}

export default function CTASection(): JSX.Element {
  const handleScrollToCalendly = () => {
    const calendlyElement = document.getElementById('calendly-widget');
    if (calendlyElement) {
      calendlyElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative py-20 px-4 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 overflow-hidden"
      aria-labelledby="cta-heading"
      role="region"
    >
      {/* Background gradient overlay - using design system colors properly */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800/95 via-primary-700/95 to-primary-900/95"></div>
      
      {/* Content container */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <h2 
            id="cta-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-heading leading-tight"
          >
            Ready to Get Started?
          </h2>
          
          {/* Reassuring copy */}
          <div className="text-xl md:text-2xl text-primary-100 mb-12 font-serif leading-relaxed space-y-6">
            <p>
              Book your free consultation today and discover how intelligent workflow automation can transform your business operations.
            </p>
            <p className="text-lg md:text-xl text-primary-200">
              Our expert team will analyze your current processes and provide actionable recommendations tailored to your specific needs.
            </p>
            <p className="text-base md:text-lg text-primary-300">
              No commitment required - just valuable insights to help you make informed decisions about your workflow optimization journey.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Primary CTA - Book Consultation Now */}
            <Button 
              onClick={handleScrollToCalendly}
              size="lg"
              className="bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold px-8 py-4 h-auto text-lg font-heading shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group focus:ring-2 focus:ring-accent-300 focus:outline-none"
              aria-label="Book your free consultation - scroll to scheduling widget"
            >
              Book Consultation Now
              <ArrowRight 
                className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" 
                aria-hidden="true"
              />
            </Button>
            
            {/* Secondary CTA - Have Questions? Contact Us */}
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary-100 text-primary-100 hover:bg-primary-100 hover:text-primary-900 font-semibold px-8 py-4 h-auto text-lg font-heading shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 bg-transparent focus:ring-2 focus:ring-primary-200 focus:outline-none"
            >
              <a 
                href="mailto:info@ahaagile.com"
                aria-label="Send email to info@ahaagile.com for questions about our services"
              >
                Have Questions? Contact Us
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400 opacity-10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400 opacity-10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
    </section>
  );
}