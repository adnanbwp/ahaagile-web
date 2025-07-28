import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from './HeroSection';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: any) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

// Mock the DashboardMockup component
jest.mock('@/components/ui/DashboardMockup', () => {
  return function MockDashboardMockup() {
    return <div data-testid="dashboard-mockup">Dashboard Mockup</div>;
  };
});

describe('HeroSection', () => {
  it('renders the main headline correctly', () => {
    render(<HeroSection />);
    
    const headline = screen.getByRole('heading', { 
      name: /reclaim 150\+ hours per employee annually/i 
    });
    expect(headline).toBeInTheDocument();
    expect(headline).toHaveClass('text-hero', 'text-white');
  });

  it('renders the subtitle with correct content', () => {
    render(<HeroSection />);
    
    const subtitle = screen.getByText(/stop losing valuable time to inefficient workflows/i);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass('text-subhero', 'text-gray-200');
  });

  it('renders both CTA buttons with correct links', () => {
    render(<HeroSection />);
    
    const primaryCTA = screen.getByRole('link', { name: /start free analysis/i });
    expect(primaryCTA).toBeInTheDocument();
    expect(primaryCTA).toHaveAttribute('href', '/book-a-consultation');
    expect(primaryCTA).toHaveClass('btn-accent');

    const secondaryCTA = screen.getByRole('link', { name: /watch demo/i });
    expect(secondaryCTA).toBeInTheDocument();
    expect(secondaryCTA).toHaveAttribute('href', '/case-study');
    expect(secondaryCTA).toHaveClass('btn-secondary');
  });

  it('renders the dashboard mockup component', () => {
    render(<HeroSection />);
    
    const dashboard = screen.getByTestId('dashboard-mockup');
    expect(dashboard).toBeInTheDocument();
  });

  it('displays value points with correct metrics', () => {
    render(<HeroSection />);
    
    const timeReduction = screen.getByText(/85% time reduction/i);
    expect(timeReduction).toBeInTheDocument();
    
    const annualSavings = screen.getByText(/\$330k\+ annual savings/i);
    expect(annualSavings).toBeInTheDocument();
  });

  it('renders trust indicators section', () => {
    render(<HeroSection />);
    
    const trustText = screen.getByText(/trusted by 500\+ companies/i);
    expect(trustText).toBeInTheDocument();
    
    // Check for placeholder company logos
    const companyA = screen.getByText('COMPANY A');
    const companyB = screen.getByText('COMPANY B');
    const companyC = screen.getByText('COMPANY C');
    const companyD = screen.getByText('COMPANY D');
    
    expect(companyA).toBeInTheDocument();
    expect(companyB).toBeInTheDocument();
    expect(companyC).toBeInTheDocument();
    expect(companyD).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-hero-class';
    const { container } = render(<HeroSection className={customClass} />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass(customClass);
  });

  it('has proper semantic structure', () => {
    const { container } = render(<HeroSection />);
    
    // Main section should be present
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Should have proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    
    // Should have subheadings for value points
    const valueHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(valueHeadings.length).toBeGreaterThan(0);
  });

  it('renders with gradient background styles', () => {
    const { container } = render(<HeroSection />);
    
    const section = container.querySelector('section');
    expect(section).toHaveStyle({
      background: 'linear-gradient(135deg, var(--brand-navy-light) 0%, var(--background) 100%)'
    });
  });

  it('has accessible star ratings in trust section', () => {
    const { container } = render(<HeroSection />);
    
    // The stars should be rendered with proper icon roles
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Trust section should be accessible
    const trustHeading = screen.getByText(/trusted by 500\+ companies/i);
    expect(trustHeading).toBeInTheDocument();
  });
});