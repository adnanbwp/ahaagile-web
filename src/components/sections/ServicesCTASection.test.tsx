import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesCTASection from './ServicesCTASection';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('ServicesCTASection', () => {
  beforeEach(() => {
    render(<ServicesCTASection />);
  });

  describe('Content Rendering', () => {
    it('renders the main headline correctly', () => {
      const headline = screen.getByRole('heading', { 
        name: /ready to transform your workflows\?/i 
      });
      expect(headline).toBeInTheDocument();
      expect(headline).toHaveClass('font-heading');
    });

    it('renders compelling copy with transformation messaging', () => {
      expect(screen.getByText(/stop losing revenue to inefficient processes/i)).toBeInTheDocument();
      expect(screen.getByText(/30-50% efficiency gains/i)).toBeInTheDocument();
      expect(screen.getByText(/measurable workflow improvements/i)).toBeInTheDocument();
    });

    it('renders trust indicator', () => {
      expect(screen.getByText(/trusted by 200\+ professional services firms/i)).toBeInTheDocument();
    });
  });

  describe('CTA Buttons', () => {
    it('renders primary CTA button with correct text and link', () => {
      const primaryCTA = screen.getByRole('link', { 
        name: /book your free process audit/i 
      });
      expect(primaryCTA).toBeInTheDocument();
      expect(primaryCTA).toHaveAttribute('href', '/book-a-consultation');
      expect(primaryCTA).toHaveClass('bg-accent-400');
    });

    it('renders secondary CTA button with correct text and link', () => {
      const secondaryCTA = screen.getByRole('link', { 
        name: /download case study/i 
      });
      expect(secondaryCTA).toBeInTheDocument();
      expect(secondaryCTA).toHaveAttribute('href', '/case-study');
      expect(secondaryCTA).toHaveClass('border-accent-400');
    });

    it('applies correct button hierarchy styling', () => {
      const primaryCTA = screen.getByRole('link', { 
        name: /book your free process audit/i 
      });
      const secondaryCTA = screen.getByRole('link', { 
        name: /download case study/i 
      });

      // Primary button should have solid background
      expect(primaryCTA).toHaveClass('bg-accent-400');
      
      // Secondary button should have outline style
      expect(secondaryCTA).toHaveClass('border-accent-400', 'bg-transparent');
    });
  });

  describe('Design System Integration', () => {
    it('uses correct brand colors from design system', () => {
      const section = document.querySelector('section');
      expect(section).toHaveClass('from-primary-800', 'via-primary-700', 'to-primary-900');
    });

    it('applies Inter font to headings', () => {
      const headline = screen.getByRole('heading', { 
        name: /ready to transform your workflows\?/i 
      });
      expect(headline).toHaveClass('font-heading');
    });

    it('applies Source Serif 4 font to body text', () => {
      const bodyText = screen.getByText(/stop losing revenue to inefficient processes/i);
      expect(bodyText.closest('div')).toHaveClass('font-serif');
    });
  });

  describe('Responsive Design', () => {
    it('has responsive text sizing classes', () => {
      const headline = screen.getByRole('heading', { 
        name: /ready to transform your workflows\?/i 
      });
      expect(headline).toHaveClass('text-4xl', 'md:text-5xl', 'lg:text-6xl');
    });

    it('has responsive button layout classes', () => {
      const buttonContainer = screen.getByRole('link', { 
        name: /book your free process audit/i 
      }).closest('div');
      expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
    });

    it('includes responsive spacing and padding', () => {
      const section = document.querySelector('section');
      expect(section).toHaveClass('py-20', 'px-4');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure with section element', () => {
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('provides meaningful link text for screen readers', () => {
      const primaryCTA = screen.getByRole('link', { 
        name: /book your free process audit/i 
      });
      const secondaryCTA = screen.getByRole('link', { 
        name: /download case study/i 
      });
      
      expect(primaryCTA).toHaveAccessibleName();
      expect(secondaryCTA).toHaveAccessibleName();
    });

    it('maintains proper heading hierarchy', () => {
      const heading = screen.getByRole('heading', { 
        name: /ready to transform your workflows\?/i 
      });
      expect(heading.tagName).toBe('H2');
    });
  });

  describe('Visual Feedback and Interactions', () => {
    it('includes hover effect classes on CTA buttons', () => {
      const primaryCTA = screen.getByRole('link', { 
        name: /book your free process audit/i 
      });
      const secondaryCTA = screen.getByRole('link', { 
        name: /download case study/i 
      });

      expect(primaryCTA).toHaveClass('hover:bg-accent-500', 'transform', 'hover:-translate-y-1');
      expect(secondaryCTA).toHaveClass('hover:bg-accent-400', 'transform', 'hover:-translate-y-1');
    });

    it('includes transition classes for smooth animations', () => {
      const primaryCTA = screen.getByRole('link', { 
        name: /book your free process audit/i 
      });
      expect(primaryCTA).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Professional Styling', () => {
    it('includes gradient background treatment', () => {
      const section = document.querySelector('section');
      const gradientOverlay = section?.querySelector('.absolute.inset-0');
      
      expect(section).toHaveClass('bg-gradient-to-br');
      expect(gradientOverlay).toHaveClass('bg-gradient-to-br', 'from-brand-navy');
    });

    it('includes shadow effects for professional appearance', () => {
      const primaryCTA = screen.getByRole('link', { 
        name: /book your free process audit/i 
      });
      expect(primaryCTA).toHaveClass('shadow-xl', 'hover:shadow-2xl');
    });

    it('includes decorative elements for visual appeal', () => {
      const section = document.querySelector('section');
      const decorativeElements = section?.querySelectorAll('.absolute.bg-accent-400.opacity-10');
      expect(decorativeElements).toHaveLength(2);
    });
  });
});