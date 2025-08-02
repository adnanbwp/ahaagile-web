import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, DollarSign, AlertTriangle, Frown } from 'lucide-react';

interface ProblemSectionProps {
  className?: string;
}

export default function ProblemSection({ className = '' }: ProblemSectionProps): JSX.Element {
  const painPoints = [
    {
      icon: Clock,
      title: 'Time Drain',
      description: 'Manual processes consuming excessive employee hours and reducing productivity'
    },
    {
      icon: DollarSign,
      title: 'Hidden Costs',
      description: 'Invisible expenses from inefficient workflows and repeated manual tasks'
    },
    {
      icon: AlertTriangle,
      title: 'Error Prone',
      description: 'Human mistakes in manual processes leading to costly corrections and delays'
    },
    {
      icon: Frown,
      title: 'Employee Burnout',
      description: 'Repetitive manual work reducing job satisfaction and increasing turnover'
    }
  ];

  return (
    <section className={`section-spacing bg-muted ${className}`}>
      <div className="container-brand">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-hero text-foreground mb-8">
            The Hidden Cost of Manual Workflows
          </h2>
          
          {/* Financial Impact Callout */}
          <div className="inline-block px-8 py-6 rounded-2xl mb-8 bg-[var(--gradient-primary)]">
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-primary-foreground mb-2">
                $236K - $330K
              </h3>
              <p className="text-xl md:text-2xl font-inter text-primary-foreground/80">
                Annual Cost of Inefficiency
              </p>
            </div>
          </div>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {painPoints.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <Card 
                key={index}
                className="card-elevated hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-foreground" />
                  </div>
                  <h3 className="text-xl font-inter font-semibold text-foreground mb-3">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Transition CTA */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-foreground font-inter font-semibold">
            <span className="text-lg">Ready to reclaim your time and reduce costs?</span>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-foreground animate-bounce"></div>
          </div>
          <p className="text-muted-foreground mt-2">
            Discover how our intelligent automation solutions can transform your workflows below.
          </p>
        </div>
      </div>
    </section>
  );
}