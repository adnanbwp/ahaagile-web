import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProblemSection from './ProblemSection';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Clock: ({ className }: { className: string }) => <div data-testid="clock-icon" className={className} />,
  DollarSign: ({ className }: { className: string }) => <div data-testid="dollar-sign-icon" className={className} />,
  AlertTriangle: ({ className }: { className: string }) => <div data-testid="alert-triangle-icon" className={className} />,
  Frown: ({ className }: { className: string }) => <div data-testid="frown-icon" className={className} />,
}));

describe('ProblemSection', () => {
  beforeEach(() => {
    render(<ProblemSection />);
  });

  describe('Section Header and Financial Impact', () => {
    it('renders the correct section header', () => {
      expect(screen.getByRole('heading', { level: 2, name: 'The Hidden Cost of Manual Workflows' })).toBeInTheDocument();
    });

    it('displays the financial impact callout with correct text', () => {
      expect(screen.getByRole('heading', { level: 3, name: '$236K - $330K' })).toBeInTheDocument();
      expect(screen.getByText('Annual Cost of Inefficiency')).toBeInTheDocument();
    });

    it('applies proper typography classes to the header', () => {
      const header = screen.getByRole('heading', { level: 2, name: 'The Hidden Cost of Manual Workflows' });
      expect(header).toHaveClass('text-hero', 'text-brand-navy');
    });

    it('applies proper typography classes to the financial impact', () => {
      const financialImpact = screen.getByRole('heading', { level: 3, name: '$236K - $330K' });
      expect(financialImpact).toHaveClass('font-inter', 'font-bold', 'text-white');
    });
  });

  describe('Pain Points Cards', () => {
    it('renders all four pain point cards', () => {
      expect(screen.getByText('Time Drain')).toBeInTheDocument();
      expect(screen.getByText('Hidden Costs')).toBeInTheDocument();
      expect(screen.getByText('Error Prone')).toBeInTheDocument();
      expect(screen.getByText('Employee Burnout')).toBeInTheDocument();
    });

    it('displays correct descriptions for each pain point', () => {
      expect(screen.getByText('Manual processes consuming excessive employee hours and reducing productivity')).toBeInTheDocument();
      expect(screen.getByText('Invisible expenses from inefficient workflows and repeated manual tasks')).toBeInTheDocument();
      expect(screen.getByText('Human mistakes in manual processes leading to costly corrections and delays')).toBeInTheDocument();
      expect(screen.getByText('Repetitive manual work reducing job satisfaction and increasing turnover')).toBeInTheDocument();
    });

    it('renders appropriate icons for each pain point', () => {
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
      expect(screen.getByTestId('dollar-sign-icon')).toBeInTheDocument();
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('frown-icon')).toBeInTheDocument();
    });

    it('applies hover effects classes to cards', () => {
      const cards = document.querySelectorAll('.card-elevated');
      expect(cards).toHaveLength(4);
      cards.forEach(card => {
        expect(card).toHaveClass('hover:shadow-xl', 'transition-all', 'duration-300', 'hover:scale-105');
      });
    });
  });

  describe('Transition CTA', () => {
    it('renders the transition CTA text', () => {
      expect(screen.getByText('Ready to reclaim your time and reduce costs?')).toBeInTheDocument();
      expect(screen.getByText('Discover how our intelligent automation solutions can transform your workflows below.')).toBeInTheDocument();
    });

    it('applies proper styling to transition CTA', () => {
      const ctaText = screen.getByText('Ready to reclaim your time and reduce costs?');
      expect(ctaText).toHaveClass('text-lg');
      expect(ctaText.parentElement).toHaveClass('text-brand-navy', 'font-inter', 'font-semibold');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      const grid = document.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('applies responsive typography to financial impact', () => {
      const financialImpact = screen.getByRole('heading', { level: 3, name: '$236K - $330K' });
      expect(financialImpact).toHaveClass('text-4xl', 'md:text-5xl', 'lg:text-6xl');
    });
  });

  describe('Accessibility', () => {
    it('uses proper semantic HTML structure', () => {
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(screen.getAllByRole('heading')).toHaveLength(6); // h2 + h3 + 4 card titles
    });

    it('provides meaningful content for screen readers', () => {
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      
      // Check that all text content is accessible
      expect(screen.getByText('The Hidden Cost of Manual Workflows')).toBeInTheDocument();
      expect(screen.getByText('$236K - $330K')).toBeInTheDocument();
      expect(screen.getByText('Annual Cost of Inefficiency')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className when provided', () => {
      const { container } = render(<ProblemSection className="custom-class" />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
    });

    it('applies default background and spacing classes', () => {
      const section = document.querySelector('section');
      expect(section).toHaveClass('section-spacing', 'bg-secondary-50');
    });
  });
});

// Snapshot test to prevent visual regression
describe('ProblemSection Snapshots', () => {
  it('matches snapshot for visual regression prevention', () => {
    const { container } = render(<ProblemSection />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with custom className', () => {
    const { container } = render(<ProblemSection className="test-class" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});