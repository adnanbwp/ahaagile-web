import React from 'react';
import { Clock, DollarSign, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServicesHeroSectionProps {
  className?: string;
}

interface ProblemAreaProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const ProblemArea: React.FC<ProblemAreaProps> = ({ icon: Icon, title, description }) => (
  <Card className="card-elevated hover:card-brand group transition-all duration-300">
    <CardContent className="p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
        <Icon className="w-6 h-6 text-foreground group-hover:text-primary-foreground" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary-foreground mb-2 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/90 transition-colors duration-300">
        {description}
      </p>
    </CardContent>
  </Card>
);

export default function ServicesHeroSection({ className = '' }: ServicesHeroSectionProps): JSX.Element {
  const problemAreas: ProblemAreaProps[] = [
    {
      icon: Clock,
      title: "Time Drain",
      description: "Partners and senior staff spending 25+ hours weekly on email management and administrative tasks instead of billable client work."
    },
    {
      icon: DollarSign,
      title: "Billing Inefficiency", 
      description: "High-value professionals doing low-value work, reducing billable hour capacity and directly impacting revenue potential."
    },
    {
      icon: Users,
      title: "Client Frustration",
      description: "Delayed responses and communication gaps leading to client dissatisfaction and potential account losses."
    },
    {
      icon: Zap,
      title: "Work Interruption",
      description: "Constant context switching disrupting deep work and reducing overall productivity and quality of deliverables."
    }
  ];

  return (
    <div className={className}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-24 bg-[var(--gradient-primary)]">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1"></div>
        </div>
        
        <div className="container-brand relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Professional Services Badge */}
            <div className="mb-6">
              <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20 text-sm font-medium px-4 py-2">
                Professional Services Focus
              </Badge>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-hero mb-6 text-primary-foreground">
              Intelligent Workflow Automation for Professional Services
            </h1>
            
            {/* Subheading */}
            <p className="text-subhero mb-8 text-foreground/80 max-w-3xl mx-auto">
              Reclaim 150+ Hours Per Employee Annually Through Intelligent Email Automation
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="section-spacing bg-gradient-to-br from-muted to-background">
        <div className="container-brand">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
              The Hidden Cost of Email-Driven Workflows
            </h2>
            
            {/* Financial Impact Callout */}
            <div className="bg-gradient-accent rounded-xl p-8 mb-8 text-center">
              <div className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                $236,000 to $330,000
              </div>
              <p className="text-lg font-medium text-foreground">
                Annual productivity loss for a typical 3-accountant professional services firm
              </p>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Email-driven workflows are silently draining your firm&apos;s profitability. While your team 
              juggles client communications, document management, and administrative tasks through 
              scattered email threads, valuable billable hours disappear into operational inefficiency.
            </p>
          </div>

          {/* Four Problem Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {problemAreas.map((area, index) => (
              <ProblemArea
                key={index}
                icon={area.icon}
                title={area.title}
                description={area.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}