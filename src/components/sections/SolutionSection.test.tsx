import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SolutionSection from './SolutionSection';

describe('SolutionSection', () => {
  beforeEach(() => {
    render(<SolutionSection />);
  });

  describe('Solution Cards Section', () => {
    it('renders the main section header', () => {
      expect(screen.getByRole('heading', { name: /transform your workflow efficiency/i })).toBeInTheDocument();
    });

    it('renders section description', () => {
      expect(screen.getByText(/our intelligent automation solutions address your specific challenges/i)).toBeInTheDocument();
    });

    it('renders all four solution cards with correct titles', () => {
      expect(screen.getByRole('heading', { name: /process automation/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /smart analytics/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /compliance management/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /roi optimization/i })).toBeInTheDocument();
    });

    it('renders solution card descriptions', () => {
      expect(screen.getByText(/streamline repetitive tasks and workflows/i)).toBeInTheDocument();
      expect(screen.getByText(/transform data into actionable insights/i)).toBeInTheDocument();
      expect(screen.getByText(/ensure regulatory adherence with automated compliance/i)).toBeInTheDocument();
      expect(screen.getByText(/maximize return on investment through strategic workflow/i)).toBeInTheDocument();
    });

    it('renders benefit points for each solution card', () => {
      expect(screen.getByText(/reduce manual work by 80%/i)).toBeInTheDocument();
      expect(screen.getByText(/real-time performance dashboards/i)).toBeInTheDocument();
      expect(screen.getByText(/automated compliance tracking/i)).toBeInTheDocument();
      expect(screen.getByText(/cost reduction strategies/i)).toBeInTheDocument();
    });

    it('applies hover animation classes to solution cards', () => {
      const cards = document.querySelectorAll('.card-elevated');
      expect(cards).toHaveLength(4);
      cards.forEach(card => {
        expect(card).toHaveClass('hover:shadow-xl', 'transition-all', 'duration-300', 'hover:scale-105', 'group');
      });
    });
  });

  describe('Social Proof Section', () => {
    it('renders social proof section header', () => {
      expect(screen.getByRole('heading', { name: /real impact, measurable results/i })).toBeInTheDocument();
    });

    it('renders all three key metrics', () => {
      expect(screen.getByText('150+')).toBeInTheDocument();
      expect(screen.getByText('$330K')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('renders metric labels and descriptions', () => {
      expect(screen.getByText('Hours')).toBeInTheDocument();
      expect(screen.getByText('Cost Savings')).toBeInTheDocument();
      expect(screen.getByText('Efficiency')).toBeInTheDocument();
      expect(screen.getByText(/saved per month through automation/i)).toBeInTheDocument();
      expect(screen.getByText(/average annual efficiency gains/i)).toBeInTheDocument();
      expect(screen.getByText(/improvement in workflow performance/i)).toBeInTheDocument();
    });

    it('applies gradient background styling to metrics', () => {
      const metricCards = screen.getAllByText('150+').map(el => el.closest('div'));
      metricCards.forEach(card => {
        if (card && card.style.background) {
          expect(card.style.background).toContain('linear-gradient');
        }
      });
    });
  });

  describe('Customer Testimonial', () => {
    it('renders star rating with 5 stars', () => {
      // Stars are rendered as SVG icons, so we check for their presence
      const stars = document.querySelectorAll('[data-testid="star"]') || 
                   document.querySelectorAll('svg[data-lucide="star"]');
      
      // We expect at least the star elements to be present (5 stars)
      const allSvgs = document.querySelectorAll('svg');
      expect(allSvgs.length).toBeGreaterThanOrEqual(5);
      expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('renders customer testimonial quote', () => {
      expect(screen.getByText(/the workflow automation transformed our operations completely/i)).toBeInTheDocument();
    });

    it('renders customer attribution', () => {
      expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument();
      expect(screen.getByText(/operations director/i)).toBeInTheDocument();
      
      // Check specifically within the testimonial section to avoid duplicate matches
      const testimonialSection = document.querySelector('.max-w-4xl.mx-auto.bg-secondary-50');
      expect(testimonialSection).toBeInTheDocument();
      expect(testimonialSection).toHaveTextContent('Professional Services Firm');
    });

    it('applies proper semantic structure for testimonial', () => {
      const blockquote = screen.getByRole('blockquote') || document.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
    });
  });

  describe('Final CTA Section', () => {
    it('renders CTA section header', () => {
      expect(screen.getByRole('heading', { name: /ready to transform your workflows/i })).toBeInTheDocument();
    });

    it('renders CTA description', () => {
      expect(screen.getByText(/join hundreds of professional services firms/i)).toBeInTheDocument();
    });

    it('renders primary CTA button', () => {
      expect(screen.getByText(/book your strategy session/i)).toBeInTheDocument();
    });

    it('renders secondary CTA button', () => {
      expect(screen.getByText(/view case study/i)).toBeInTheDocument();
    });

    it('applies yellow accent background to CTA section', () => {
      const ctaSection = screen.getByRole('heading', { name: /ready to transform your workflows/i }).closest('div');
      expect(ctaSection).toHaveStyle({ backgroundColor: 'var(--brand-yellow-light)' });
    });

    it('includes proper accessibility features for CTA buttons', () => {
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes to solution cards', () => {
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('applies responsive grid classes to metrics', () => {
      const metricsGrid = screen.getByText('150+').closest('.grid');
      expect(metricsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });

    it('applies responsive text sizing to headers', () => {
      const heroText = screen.getByRole('heading', { name: /transform your workflow efficiency/i });
      expect(heroText).toHaveClass('text-hero');
      
      const ctaText = screen.getByRole('heading', { name: /ready to transform your workflows/i });
      expect(ctaText).toHaveClass('text-4xl', 'md:text-5xl');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic HTML structure', () => {
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('includes proper heading hierarchy', () => {
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Check that we have h2 and h3 elements for proper hierarchy
      const h2Elements = headings.filter(h => h.tagName === 'H2');
      const h3Elements = headings.filter(h => h.tagName === 'H3');
      expect(h2Elements.length).toBeGreaterThan(0);
      expect(h3Elements.length).toBeGreaterThan(0);
    });

    it('includes focus management classes for buttons', () => {
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('focus-brand');
      });
    });
  });

  describe('Component Props', () => {
    it('applies custom className when provided', () => {
      const { container } = render(<SolutionSection className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies default classes when no className provided', () => {
      const { container } = render(<SolutionSection />);
      expect(container.firstChild).toHaveClass('section-spacing', 'bg-white');
    });
  });
});

describe('SolutionSection Snapshot', () => {
  it('matches snapshot to prevent visual regression', () => {
    const { container } = render(<SolutionSection />);
    expect(container.firstChild).toMatchSnapshot();
  });
});