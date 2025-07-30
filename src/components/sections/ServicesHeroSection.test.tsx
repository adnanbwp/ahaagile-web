import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesHeroSection from './ServicesHeroSection';

describe('ServicesHeroSection', () => {
  beforeEach(() => {
    // Mock window.matchMedia for responsive tests
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('Hero Section Rendering', () => {
    it('renders the main heading correctly', () => {
      render(<ServicesHeroSection />);
      
      expect(screen.getByRole('heading', { 
        name: /intelligent workflow automation for professional services/i 
      })).toBeInTheDocument();
    });

    it('renders the subheading with time savings', () => {
      render(<ServicesHeroSection />);
      
      expect(screen.getByText(/reclaim 150\+ hours per employee annually through intelligent email automation/i))
        .toBeInTheDocument();
    });

    it('displays professional services badge', () => {
      render(<ServicesHeroSection />);
      
      expect(screen.getByText(/professional services focus/i)).toBeInTheDocument();
    });

    it('applies gradient background styling', () => {
      render(<ServicesHeroSection />);
      
      const heroSection = screen.getByRole('heading', { 
        name: /intelligent workflow automation for professional services/i 
      }).closest('section');
      
      expect(heroSection).toHaveStyle({
        background: 'linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-light) 100%)'
      });
    });
  });

  describe('Problem Statement Section', () => {
    it('renders the problem statement header', () => {
      render(<ServicesHeroSection />);
      
      expect(screen.getByRole('heading', { 
        name: /the hidden cost of email-driven workflows/i 
      })).toBeInTheDocument();
    });

    it('displays financial impact callout with correct amounts', () => {
      render(<ServicesHeroSection />);
      
      expect(screen.getByText(/\$236,000 to \$330,000/)).toBeInTheDocument();
      expect(screen.getByText(/annual productivity loss for a typical 3-accountant professional services firm/i))
        .toBeInTheDocument();
    });

    it('shows problem description text', () => {
      render(<ServicesHeroSection />);
      
      expect(screen.getByText(/email-driven workflows are silently draining your firm's profitability/i))
        .toBeInTheDocument();
    });
  });

  describe('Four Problem Areas Grid', () => {
    it('renders all four problem area cards', () => {
      render(<ServicesHeroSection />);
      
      expect(screen.getByText('Time Drain')).toBeInTheDocument();
      expect(screen.getByText('Billing Inefficiency')).toBeInTheDocument();
      expect(screen.getByText('Client Frustration')).toBeInTheDocument();
      expect(screen.getByText('Work Interruption')).toBeInTheDocument();
    });

    it('displays correct descriptions for each problem area', () => {
      render(<ServicesHeroSection />);
      
      expect(screen.getByText(/partners and senior staff spending 25\+ hours weekly/i)).toBeInTheDocument();
      expect(screen.getByText(/high-value professionals doing low-value work/i)).toBeInTheDocument();
      expect(screen.getByText(/delayed responses and communication gaps/i)).toBeInTheDocument();
      expect(screen.getByText(/constant context switching disrupting deep work/i)).toBeInTheDocument();
    });

    it('has proper card structure with icons', () => {
      render(<ServicesHeroSection />);
      
      // Check that cards have the expected structure
      const problemCards = screen.getAllByRole('heading', { level: 3 });
      expect(problemCards).toHaveLength(4);
      
      // Each problem card should have an icon container (circular divs for icons)
      const iconContainers = document.querySelectorAll('.w-12.h-12.mx-auto.mb-4');
      expect(iconContainers).toHaveLength(4);
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      render(<ServicesHeroSection />);
      
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-4');
    });

    it('applies responsive typography classes', () => {
      render(<ServicesHeroSection />);
      
      const mainHeading = screen.getByRole('heading', { 
        name: /intelligent workflow automation for professional services/i 
      });
      expect(mainHeading).toHaveClass('text-hero');
      
      const subheading = screen.getByText(/reclaim 150\+ hours per employee annually/i);
      expect(subheading).toHaveClass('text-subhero');
    });
  });

  describe('Styling and Theme Integration', () => {
    it('applies brand design system classes', () => {
      render(<ServicesHeroSection />);
      
      const mainHeading = screen.getByRole('heading', { 
        name: /intelligent workflow automation for professional services/i 
      });
      expect(mainHeading).toHaveClass('text-white');
      
      const problemHeading = screen.getByRole('heading', { 
        name: /the hidden cost of email-driven workflows/i 
      });
      expect(problemHeading).toHaveClass('text-brand-navy');
    });

    it('applies container and spacing utilities', () => {
      render(<ServicesHeroSection />);
      
      const containerElements = document.querySelectorAll('.container-brand');
      expect(containerElements.length).toBeGreaterThan(0);
      
      const sectionSpacing = document.querySelector('.section-spacing');
      expect(sectionSpacing).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<ServicesHeroSection />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      expect(h3Elements).toHaveLength(4);
    });

    it('provides meaningful text content for screen readers', () => {
      render(<ServicesHeroSection />);
      
      // Check that all text content is meaningful and descriptive
      expect(screen.getByText(/intelligent workflow automation for professional services/i))
        .toBeInTheDocument();
      expect(screen.getByText(/professional services focus/i)).toBeInTheDocument();
      expect(screen.getByText(/the hidden cost of email-driven workflows/i)).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      render(<ServicesHeroSection />);
      
      const sections = document.querySelectorAll('section');
      expect(sections).toHaveLength(2); // Hero section and problem statement section
    });
  });

  describe('Custom className prop', () => {
    it('applies custom className when provided', () => {
      render(<ServicesHeroSection className="custom-test-class" />);
      
      const component = document.querySelector('.custom-test-class');
      expect(component).toBeInTheDocument();
    });

    it('works without className prop', () => {
      render(<ServicesHeroSection />);
      
      // Should render without errors
      expect(screen.getByRole('heading', { 
        name: /intelligent workflow automation for professional services/i 
      })).toBeInTheDocument();
    });
  });

  describe('Integration with Design System', () => {
    it('uses Inter font for headings via font-heading class', () => {
      render(<ServicesHeroSection />);
      
      // Check specific headings that should have font-heading class
      const problemHeading = screen.getByRole('heading', { 
        name: /the hidden cost of email-driven workflows/i 
      });
      expect(problemHeading).toHaveClass('font-heading');
      
      const problemCardHeadings = screen.getAllByRole('heading', { level: 3 });
      problemCardHeadings.forEach(heading => {
        expect(heading).toHaveClass('font-heading');
      });
    });

    it('applies brand color variables correctly', () => {
      render(<ServicesHeroSection />);
      
      // Check the financial callout container has gradient background
      const financialCallout = screen.getByText(/\$236,000 to \$330,000/).closest('div');
      expect(financialCallout?.parentElement).toHaveClass('bg-gradient-accent');
    });
  });
});

describe('ServicesHeroSection Snapshot', () => {
  it('matches snapshot for visual regression testing', () => {
    const { container } = render(<ServicesHeroSection />);
    expect(container.firstChild).toMatchSnapshot();
  });
});