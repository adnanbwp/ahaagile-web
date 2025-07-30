'use client'

import { Check, Star } from 'lucide-react'

interface BenefitsSidebarProps {
  className?: string
}

interface BenefitItem {
  title: string
  description: string
}

const benefits: BenefitItem[] = [
  {
    title: "Personalized Assessment",
    description: "Tailored analysis of your specific workflow challenges and automation opportunities"
  },
  {
    title: "Expert Guidance", 
    description: "15+ years of experience helping businesses optimize workflows and increase efficiency"
  },
  {
    title: "Custom Roadmap",
    description: "Strategic implementation plan designed specifically for your business needs and goals"
  },
  {
    title: "No Commitment",
    description: "Free 30-45 minute consultation with zero obligation to proceed further"
  }
]

export default function BenefitsSidebar({ className = '' }: BenefitsSidebarProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Benefits Section */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-brand p-6 border border-white/20">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white/30 to-accent-50/30 rounded-2xl pointer-events-none" />
        
        <div className="relative">
          <h3 className="text-2xl font-bold text-primary-900 mb-6 font-inter">
            Why Book a Consultation?
          </h3>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-accent-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 font-inter mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-primary-700 font-source-serif-4 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof Card */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-accent p-6 border border-white/20">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-50/50 via-white/30 to-primary-50/30 rounded-2xl pointer-events-none" />
        
        <div className="relative">
          {/* Star Rating */}
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < 4 || (i === 4 && 0.9 >= 0.5) 
                    ? 'text-accent-500 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-semibold text-primary-900 font-inter">
              4.9/5
            </span>
          </div>
          
          <p className="text-xs text-primary-600 mb-4 font-source-serif-4">
            Based on 150+ consultations
          </p>
          
          {/* Testimonial */}
          <blockquote className="mb-3">
            <p className="text-primary-800 font-source-serif-4 text-sm leading-relaxed italic">
              &ldquo;Aha Agile transformed our workflows and saved us 20+ hours per week. The consultation was incredibly valuable.&rdquo;
            </p>
          </blockquote>
          
          <cite className="text-xs text-primary-600 font-inter not-italic">
            - Sarah M., Operations Director
          </cite>
        </div>
      </div>
    </div>
  )
}