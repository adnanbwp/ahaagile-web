import React from 'react';
import { 
  Mail, 
  FileText, 
  Users, 
  BarChart, 
  Clock, 
  Shield,
  Search,
  Settings,
  TrendingUp,
  Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServicesGridSectionProps {
  className?: string;
}

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  features: string[];
}

interface BusinessAnalysisProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface ProcessStepProps {
  stepNumber: number;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, features }) => (
  <Card className="card-elevated hover:card-brand group transition-all duration-300 h-full">
    <CardContent className="p-6">
      <div className="w-12 h-12 mb-4 bg-gradient-accent rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
        <Icon className="w-6 h-6 text-foreground group-hover:text-primary-foreground" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary-foreground mb-4 transition-colors duration-300">
        {title}
      </h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm text-muted-foreground group-hover:text-primary-foreground/90 transition-colors duration-300">
            <Check className="w-4 h-4 text-success group-hover:text-success mt-0.5 mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const BusinessAnalysisCard: React.FC<BusinessAnalysisProps> = ({ icon: Icon, title, description }) => (
  <Card className="card-elevated hover:shadow-xl transition-all duration-300 text-center h-full">
    <CardContent className="p-8">
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-accent rounded-full flex items-center justify-center">
        <Icon className="w-8 h-8 text-foreground" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </CardContent>
  </Card>
);

const ProcessStep: React.FC<ProcessStepProps> = ({ stepNumber, title, description }) => (
  <div className="flex flex-col items-center text-center lg:text-left lg:flex-row lg:items-start">
    <div className="flex flex-col items-center lg:items-start lg:mr-6 mb-4 lg:mb-0">
      <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center text-foreground font-bold text-lg mb-2">
        {stepNumber}
      </div>
      {stepNumber < 4 && (
        <div className="hidden lg:block w-0.5 h-16 bg-gradient-accent mt-2"></div>
      )}
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

export default function ServicesGridSection({ className = '' }: ServicesGridSectionProps): JSX.Element {
  const services: ServiceCardProps[] = [
    {
      icon: Mail,
      title: "Email Intelligence",
      features: [
        "Intelligent email triage and categorization",
        "Automated response templates and routing",
        "Client communication tracking and analytics",
        "Priority-based inbox management"
      ]
    },
    {
      icon: FileText,
      title: "Document Management",
      features: [
        "Automated document generation from templates",
        "Workflow routing and approval processes",
        "Compliance tracking and audit trails",
        "Integration with existing document systems"
      ]
    },
    {
      icon: Users,
      title: "Client Communication",
      features: [
        "Automated client onboarding workflows",
        "Progress updates and milestone notifications",
        "Deadline reminders and task assignments",
        "Centralized communication history"
      ]
    },
    {
      icon: BarChart,
      title: "Performance Analytics",
      features: [
        "ROI tracking and financial impact analysis",
        "Workflow optimization recommendations",
        "Business performance metrics dashboard",
        "Custom reporting and insights"
      ]
    },
    {
      icon: Clock,
      title: "Time Management",
      features: [
        "Automated time tracking and categorization",
        "Capacity planning and resource allocation",
        "Productivity optimization insights",
        "Billable hour maximization tools"
      ]
    },
    {
      icon: Shield,
      title: "Compliance & Security",
      features: [
        "Regulatory compliance automation",
        "Security protocol enforcement",
        "Automated audit trail generation",
        "Risk management and monitoring"
      ]
    }
  ];

  const businessAnalysis: BusinessAnalysisProps[] = [
    {
      icon: Search,
      title: "Business-First Analysis",
      description: "We start by understanding your firm's operational pain points, conducting thorough workflow assessments, developing ROI projections, and building a comprehensive business case for automation implementation."
    },
    {
      icon: Settings,
      title: "Bespoke Solutions",
      description: "Every solution is custom-tailored to your firm's specific workflows, seamlessly integrated with existing systems, built on scalable architecture, and designed to grow with your business needs."
    },
    {
      icon: TrendingUp,
      title: "Measurable ROI",
      description: "We deliver clear financial impact through detailed performance metrics, transparent reporting dashboards, and continuous optimization to ensure sustained productivity gains and profitability improvements."
    }
  ];

  const processSteps: ProcessStepProps[] = [
    {
      stepNumber: 1,
      title: "Discovery & Analysis",
      description: "Comprehensive workflow analysis, pain point mapping, stakeholder interviews, and detailed ROI projections to understand your firm's unique operational challenges and opportunities."
    },
    {
      stepNumber: 2,
      title: "Custom Design",
      description: "Development of custom automation architecture, integration planning with existing systems, user experience design, and thorough risk assessment to ensure seamless implementation."
    },
    {
      stepNumber: 3,
      title: "Phased Implementation",
      description: "Agile implementation approach with weekly progress reviews, comprehensive staff training programs, pilot testing phases, and gradual rollout to minimize disruption."
    },
    {
      stepNumber: 4,
      title: "Optimization",
      description: "Continuous improvement processes, ongoing performance monitoring, quarterly business reviews, and strategic scale planning to maximize long-term value and efficiency gains."
    }
  ];

  return (
    <div className={className}>
      {/* Services Grid Section */}
      <section className="section-spacing bg-background">
        <div className="container-brand">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
              Comprehensive Workflow Automation Solutions
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform your professional services firm with intelligent automation across six critical business areas. 
              Each solution is designed to integrate seamlessly with your existing workflows while delivering measurable productivity gains.
            </p>
          </div>

          {/* Six Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                features={service.features}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Business Analysis Section */}
      <section className="section-spacing bg-gradient-to-br from-muted to-background">
        <div className="container-brand">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
              Our Strategic Approach
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We combine deep business analysis with technical expertise to deliver automation solutions 
              that align with your firm&apos;s strategic objectives and operational realities.
            </p>
          </div>

          {/* Three Column Business Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {businessAnalysis.map((analysis, index) => (
              <BusinessAnalysisCard
                key={index}
                icon={analysis.icon}
                title={analysis.title}
                description={analysis.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="section-spacing bg-background">
        <div className="container-brand">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
              Proven Implementation Process
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our structured, four-phase approach ensures successful automation deployment with minimal 
              disruption to your daily operations while maximizing adoption and long-term value.
            </p>
          </div>

          {/* Four Step Process */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <ProcessStep
                  key={index}
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}