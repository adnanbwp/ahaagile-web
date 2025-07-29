import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, BarChart3, Shield, TrendingUp, Star } from 'lucide-react';

interface SolutionSectionProps {
  className?: string;
}

interface MetricProps {
  value: string;
  label: string;
  description: string;
}

interface SolutionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
  index: number;
}

// Sub-component for individual metric display
function MetricCard({ value, label, description }: MetricProps): JSX.Element {
  return (
    <div 
      className="text-center p-8 rounded-2xl"
      style={{ background: 'var(--gradient-navy-light)' }}
    >
      <div className="text-5xl md:text-6xl font-inter font-bold text-white mb-2">
        {value}
      </div>
      <div className="text-xl font-inter font-semibold text-brand-yellow mb-1">
        {label}
      </div>
      <div className="text-gray-200 text-sm">
        {description}
      </div>
    </div>
  );
}

// Sub-component for individual solution card
function SolutionCard({ icon: IconComponent, title, description, benefits, index }: SolutionCardProps): JSX.Element {
  return (
    <Card 
      key={index}
      className="card-elevated hover:shadow-xl transition-all duration-300 hover:scale-105 group"
    >
      <CardContent className="p-6 text-center h-full flex flex-col">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-8 h-8 text-brand-navy" />
        </div>
        <h3 className="text-xl font-inter font-semibold text-brand-navy mb-3">
          {title}
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4 flex-grow">
          {description}
        </p>
        <ul className="text-sm text-secondary-700 space-y-1">
          {benefits.map((benefit, benefitIndex) => (
            <li key={benefitIndex} className="flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full mr-2"></span>
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function SolutionSection({ className = '' }: SolutionSectionProps): JSX.Element {
  const solutions = [
    {
      icon: Zap,
      title: 'Process Automation',
      description: 'Streamline repetitive tasks and workflows to eliminate manual bottlenecks and increase efficiency',
      benefits: [
        'Reduce manual work by 80%',
        'Eliminate process bottlenecks',
        'Increase team productivity'
      ]
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Transform data into actionable insights with intelligent reporting and performance tracking',
      benefits: [
        'Real-time performance dashboards',
        'Predictive insights & trends',
        'Data-driven decision making'
      ]
    },
    {
      icon: Shield,
      title: 'Compliance Management',
      description: 'Ensure regulatory adherence with automated compliance monitoring and reporting systems',
      benefits: [
        'Automated compliance tracking',
        'Risk mitigation protocols',
        'Audit-ready documentation'
      ]
    },
    {
      icon: TrendingUp,
      title: 'ROI Optimization',
      description: 'Maximize return on investment through strategic workflow improvements and cost reduction initiatives',
      benefits: [
        'Cost reduction strategies',
        'Performance optimization',
        'Measurable ROI improvements'
      ]
    }
  ];

  const metrics = [
    {
      value: '150+',
      label: 'Hours',
      description: 'Saved per month through automation'
    },
    {
      value: '$330K',
      label: 'Cost Savings',
      description: 'Average annual efficiency gains'
    },
    {
      value: '85%',
      label: 'Efficiency',
      description: 'Improvement in workflow performance'
    }
  ];

  return (
    <section className={`section-spacing bg-white ${className}`}>
      <div className="container-brand">
        {/* Solution Cards Section */}
        <div className="text-center mb-16">
          <h2 className="text-hero text-brand-navy mb-8">
            Transform Your Workflow Efficiency
          </h2>
          <p className="text-subhero max-w-3xl mx-auto">
            Our intelligent automation solutions address your specific challenges with proven methodologies 
            that deliver measurable results and sustainable growth.
          </p>
        </div>

        {/* Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={index}
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
              benefits={solution.benefits}
              index={index}
            />
          ))}
        </div>

        {/* Social Proof Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold text-brand-navy mb-12">
            Real Impact, Measurable Results
          </h2>
          
          {/* Metrics Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                value={metric.value}
                label={metric.label}
                description={metric.description}
              />
            ))}
          </div>

          {/* Customer Testimonial */}
          <div className="max-w-4xl mx-auto bg-secondary-50 rounded-2xl p-8 md:p-12">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-brand-yellow fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-serif text-brand-navy mb-6 leading-relaxed">
              &ldquo;The workflow automation transformed our operations completely. We&rsquo;ve eliminated countless hours of manual work and our team can now focus on high-value strategic initiatives that drive real business growth.&rdquo;
            </blockquote>
            <div className="text-lg font-inter font-semibold text-secondary-700">
              Sarah Johnson, Operations Director
            </div>
            <div className="text-secondary-600">
              Professional Services Firm
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div 
          className="text-center py-16 px-8 rounded-2xl"
          style={{ backgroundColor: 'var(--brand-yellow-light)' }}
        >
          <h2 className="text-4xl md:text-5xl font-inter font-bold text-brand-navy mb-6">
            Ready to Transform Your Workflows?
          </h2>
          <p className="text-xl text-brand-navy mb-8 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of professional services firms who&rsquo;ve already eliminated inefficiencies 
            and unlocked their team&rsquo;s full potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="btn-primary px-8 py-4 text-lg font-semibold focus-brand"
              aria-label="Book a consultation to discuss your workflow automation needs"
            >
              Book Your Strategy Session
            </Button>
            <Button 
              variant="outline"
              className="btn-secondary px-8 py-4 text-lg font-semibold focus-brand"
              aria-label="View case study to see real results from workflow automation"
            >
              View Case Study
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}