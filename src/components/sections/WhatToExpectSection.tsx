import { Card } from '@/components/ui/card'
import { Search, Target, ArrowRight } from '@/lib/icons'

interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const BenefitCard = ({ icon: Icon, title, description }: BenefitCardProps) => (
  <Card className="group relative bg-white border-gray-200 shadow-brand hover:shadow-accent transition-all duration-300 hover:scale-105 transform-gpu">
    <div className="p-8 text-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Icon Container with Gradient Background */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-white" />
          </div>
          {/* Backdrop blur effect on hover */}
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-xl text-primary-800 group-hover:text-primary-900 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-secondary-600 leading-relaxed font-serif text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  </Card>
)

export default function WhatToExpectSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-secondary-50 via-white to-primary-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent-400/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary-600/5 rounded-full blur-2xl"></div>
      
      <div className="relative container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary-800 mb-6">
              What to Expect in Your Consultation
            </h2>
            <p className="text-lg text-secondary-600 font-serif max-w-2xl mx-auto leading-relaxed">
              Our structured approach ensures you get maximum value from every consultation session
            </p>
          </div>
          
          {/* Benefit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <BenefitCard
              icon={Search}
              title="Comprehensive Assessment"
              description="Analysis of current workflows and identification of automation opportunities tailored to your specific business needs"
            />
            <BenefitCard
              icon={Target}
              title="Custom Strategy"
              description="Development of tailored automation roadmap based on your specific requirements and organizational goals"
            />
            <BenefitCard
              icon={ArrowRight}
              title="Clear Next Steps"
              description="Actionable implementation plan and ongoing support guidance to ensure successful automation deployment"
            />
          </div>
        </div>
      </div>
    </section>
  )
}