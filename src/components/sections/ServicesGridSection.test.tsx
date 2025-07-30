import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesGridSection from './ServicesGridSection';

describe('ServicesGridSection', () => {
  beforeEach(() => {
    render(<ServicesGridSection />);
  });

  describe('Services Grid Section', () => {
    it('renders the main section heading', () => {
      expect(screen.getByText('Comprehensive Workflow Automation Solutions')).toBeInTheDocument();
    });

    it('renders section description', () => {
      expect(screen.getByText(/Transform your professional services firm with intelligent automation/)).toBeInTheDocument();
    });

    it('renders all six service cards with correct titles', () => {
      const expectedServices = [
        'Email Intelligence',
        'Document Management', 
        'Client Communication',
        'Performance Analytics',
        'Time Management',
        'Compliance & Security'
      ];

      expectedServices.forEach(service => {
        expect(screen.getByText(service)).toBeInTheDocument();
      });
    });

    it('renders service card features with checkmark icons', () => {
      // Test Email Intelligence features
      expect(screen.getByText('Intelligent email triage and categorization')).toBeInTheDocument();
      expect(screen.getByText('Automated response templates and routing')).toBeInTheDocument();
      
      // Test Document Management features
      expect(screen.getByText('Automated document generation from templates')).toBeInTheDocument();
      expect(screen.getByText('Workflow routing and approval processes')).toBeInTheDocument();
      
      // Test that checkmark icons are present (each feature should have one)
      const checkmarkIcons = document.querySelectorAll('svg[class*="lucide-check"]');
      expect(checkmarkIcons.length).toBeGreaterThan(0);
    });

    it('applies correct CSS classes for responsive grid layout', () => {
      const serviceGrid = screen.getByText('Email Intelligence').closest('.grid');
      expect(serviceGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('Business Analysis Section', () => {
    it('renders the business analysis heading', () => {
      expect(screen.getByText('Our Strategic Approach')).toBeInTheDocument();
    });

    it('renders all three business analysis cards', () => {
      const expectedAnalysis = [
        'Business-First Analysis',
        'Bespoke Solutions',
        'Measurable ROI'
      ];

      expectedAnalysis.forEach(analysis => {
        expect(screen.getByText(analysis)).toBeInTheDocument();
      });
    });

    it('renders business analysis descriptions', () => {
      expect(screen.getByText(/We start by understanding your firm's operational pain points/)).toBeInTheDocument();
      expect(screen.getByText(/Every solution is custom-tailored to your firm's specific workflows/)).toBeInTheDocument();
      expect(screen.getByText(/We deliver clear financial impact through detailed performance metrics/)).toBeInTheDocument();
    });

    it('applies correct responsive layout classes', () => {
      const businessAnalysisGrid = screen.getByText('Business-First Analysis').closest('.grid');
      expect(businessAnalysisGrid).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
    });
  });

  describe('Implementation Process Section', () => {
    it('renders the process section heading', () => {
      expect(screen.getByText('Proven Implementation Process')).toBeInTheDocument();
    });

    it('renders all four process steps with correct titles', () => {
      const expectedSteps = [
        'Discovery & Analysis',
        'Custom Design',
        'Phased Implementation', 
        'Optimization'
      ];

      expectedSteps.forEach(step => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it('renders numbered circles for each step', () => {
      // Check for numbered steps 1-4
      ['1', '2', '3', '4'].forEach(number => {
        expect(screen.getByText(number)).toBeInTheDocument();
      });
    });

    it('renders process step descriptions', () => {
      expect(screen.getByText(/Comprehensive workflow analysis, pain point mapping/)).toBeInTheDocument();
      expect(screen.getByText(/Development of custom automation architecture/)).toBeInTheDocument();
      expect(screen.getByText(/Agile implementation approach with weekly progress reviews/)).toBeInTheDocument();
      expect(screen.getByText(/Continuous improvement processes, ongoing performance monitoring/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure with sections', () => {
      const sections = document.querySelectorAll('section');
      expect(sections).toHaveLength(3); // Services Grid, Business Analysis, Implementation Process
    });

    it('has proper heading hierarchy', () => {
      const h2Headings = screen.getAllByRole('heading', { level: 2 });
      expect(h2Headings).toHaveLength(3);
      
      const h3Headings = screen.getAllByRole('heading', { level: 3 });
      expect(h3Headings.length).toBeGreaterThan(10); // Service cards + analysis cards + process steps
    });

    it('includes proper list structure for service features', () => {
      const lists = document.querySelectorAll('ul');
      expect(lists.length).toBeGreaterThanOrEqual(6); // One list per service card
    });
  });

  describe('Design System Integration', () => {
    it('applies brand navy color classes', () => {
      const headings = screen.getAllByRole('heading', { level: 2 });
      headings.forEach(heading => {
        expect(heading).toHaveClass('text-brand-navy');
      });
    });

    it('applies proper container and spacing classes', () => {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        expect(section).toHaveClass('section-spacing');
      });
      
      const containers = document.querySelectorAll('.container-brand');
      expect(containers.length).toBeGreaterThanOrEqual(3);
    });

    it('applies card styling classes', () => {
      const cards = document.querySelectorAll('.card-elevated');
      expect(cards.length).toBeGreaterThanOrEqual(6); // At least 6 service cards
    });
  });

  describe('Responsive Design', () => {
    it('applies mobile-first responsive classes', () => {
      // Service grid responsiveness
      const serviceGrid = screen.getByText('Email Intelligence').closest('.grid');
      expect(serviceGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
      
      // Business analysis responsiveness  
      const analysisGrid = screen.getByText('Business-First Analysis').closest('.grid');
      expect(analysisGrid).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
    });

    it('applies responsive typography classes', () => {
      const mainHeadings = screen.getAllByRole('heading', { level: 2 });
      mainHeadings.forEach(heading => {
        expect(heading).toHaveClass('text-3xl', 'lg:text-4xl');
      });
    });
  });

  describe('Content Accuracy', () => {
    it('includes all required service areas from specifications', () => {
      // Email Intelligence
      expect(screen.getByText('Email Intelligence')).toBeInTheDocument();
      expect(screen.getByText('Intelligent email triage and categorization')).toBeInTheDocument();
      
      // Document Management
      expect(screen.getByText('Document Management')).toBeInTheDocument();
      expect(screen.getByText('Automated document generation from templates')).toBeInTheDocument();
      
      // Client Communication
      expect(screen.getByText('Client Communication')).toBeInTheDocument();
      expect(screen.getByText('Automated client onboarding workflows')).toBeInTheDocument();
      
      // Performance Analytics
      expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
      expect(screen.getByText('ROI tracking and financial impact analysis')).toBeInTheDocument();
      
      // Time Management
      expect(screen.getByText('Time Management')).toBeInTheDocument();
      expect(screen.getByText('Automated time tracking and categorization')).toBeInTheDocument();
      
      // Compliance & Security
      expect(screen.getByText('Compliance & Security')).toBeInTheDocument();
      expect(screen.getByText('Regulatory compliance automation')).toBeInTheDocument();
    });

    it('includes all required business analysis columns', () => {
      expect(screen.getByText('Business-First Analysis')).toBeInTheDocument();
      expect(screen.getByText('Bespoke Solutions')).toBeInTheDocument();
      expect(screen.getByText('Measurable ROI')).toBeInTheDocument();
    });

    it('includes all required implementation process steps', () => {
      expect(screen.getByText('Discovery & Analysis')).toBeInTheDocument();
      expect(screen.getByText('Custom Design')).toBeInTheDocument();
      expect(screen.getByText('Phased Implementation')).toBeInTheDocument();
      expect(screen.getByText('Optimization')).toBeInTheDocument();
    });
  });

  describe('Professional Styling', () => {
    it('applies hover effects to service cards', () => {
      const serviceCards = document.querySelectorAll('.hover\\:card-brand');
      expect(serviceCards.length).toBeGreaterThanOrEqual(6);
    });

    it('applies transition classes for smooth interactions', () => {
      const transitionElements = document.querySelectorAll('.transition-all');
      expect(transitionElements.length).toBeGreaterThan(0);
    });

    it('includes gradient styling elements', () => {
      const gradientElements = document.querySelectorAll('.bg-gradient-accent');
      expect(gradientElements.length).toBeGreaterThan(0);
    });
  });
});

// Additional integration test for services page
describe('ServicesGridSection Integration', () => {
  it('integrates properly with custom className prop', () => {
    const { container } = render(<ServicesGridSection className="custom-test-class" />);
    expect(container.firstChild).toHaveClass('custom-test-class');
  });

  it('maintains consistent design system with existing components', () => {
    render(<ServicesGridSection />);
    
    // Check for consistent use of brand colors
    const brandNavyElements = document.querySelectorAll('.text-brand-navy');
    expect(brandNavyElements.length).toBeGreaterThan(0);
    
    // Check for consistent typography
    const fontHeadingElements = document.querySelectorAll('.font-heading');
    expect(fontHeadingElements.length).toBeGreaterThan(0);
    
    // Check for consistent container usage
    const containerBrandElements = document.querySelectorAll('.container-brand');
    expect(containerBrandElements.length).toBeGreaterThanOrEqual(3);
  });
});