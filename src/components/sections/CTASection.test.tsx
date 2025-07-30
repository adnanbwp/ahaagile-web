import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CTASection from './CTASection';

// Mock scrollIntoView since it's not available in JSDOM
const mockScrollIntoView = jest.fn();
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: mockScrollIntoView,
});

describe('CTASection', () => {
  beforeEach(() => {
    mockScrollIntoView.mockClear();
  });

  it('renders with correct headline and copy', () => {
    render(<CTASection />);
    
    // Test main headline
    expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    
    // Test reassuring copy content
    expect(screen.getByText(/Book your free consultation today/)).toBeInTheDocument();
    expect(screen.getByText(/Our expert team will analyze/)).toBeInTheDocument();
    expect(screen.getByText(/No commitment required/)).toBeInTheDocument();
  });

  it('renders primary CTA button with correct text and arrow icon', () => {
    render(<CTASection />);
    
    const primaryButton = screen.getByRole('button', { name: /Book your free consultation - scroll to scheduling widget/ });
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).toHaveTextContent('Book Consultation Now');
    
    // Check for arrow icon (Lucide React ArrowRight)
    const arrowIcon = primaryButton.querySelector('svg');
    expect(arrowIcon).toBeInTheDocument();
    expect(arrowIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders secondary CTA button with correct text and outline styling', () => {
    render(<CTASection />);
    
    const secondaryButton = screen.getByRole('link', { name: /Send email to info@ahaagile.com/ });
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveTextContent('Have Questions? Contact Us');
    expect(secondaryButton).toHaveAttribute('href', 'mailto:info@ahaagile.com');
  });

  it('handles primary button click to scroll to Calendly widget', () => {
    // Mock getElementById to return an element
    const mockCalendlyElement = document.createElement('div');
    mockCalendlyElement.id = 'calendly-widget';
    jest.spyOn(document, 'getElementById').mockReturnValue(mockCalendlyElement);
    
    render(<CTASection />);
    
    const primaryButton = screen.getByRole('button', { name: /Book your free consultation - scroll to scheduling widget/ });
    fireEvent.click(primaryButton);
    
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('handles primary button click when Calendly widget not found', () => {
    // Mock getElementById to return null
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    
    render(<CTASection />);
    
    const primaryButton = screen.getByRole('button', { name: /Book your free consultation - scroll to scheduling widget/ });
    fireEvent.click(primaryButton);
    
    // Should not throw error and should not call scrollIntoView
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('has proper semantic structure and accessibility features', () => {
    render(<CTASection />);
    
    // Test section element with proper ARIA attributes
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'cta-heading');
    
    // Test heading with proper ID
    const heading = screen.getByText('Ready to Get Started?');
    expect(heading).toHaveAttribute('id', 'cta-heading');
    expect(heading.tagName).toBe('H2');
    
    // Test button accessibility
    const primaryButton = screen.getByRole('button', { name: /Book your free consultation - scroll to scheduling widget/ });
    expect(primaryButton).toHaveAttribute('aria-label');
    
    const secondaryButton = screen.getByRole('link', { name: /Send email to info@ahaagile.com/ });
    expect(secondaryButton).toHaveAttribute('aria-label');
  });

  it('applies correct brand colors and styling classes', () => {
    render(<CTASection />);
    
    // Test section has gradient background
    const section = screen.getByRole('region');
    expect(section).toHaveClass('bg-gradient-to-br', 'from-primary-800', 'via-primary-700', 'to-primary-900');
    
    // Test primary button styling
    const primaryButton = screen.getByRole('button', { name: /Book your free consultation - scroll to scheduling widget/ });
    expect(primaryButton).toHaveClass('bg-accent-400', 'hover:bg-accent-500', 'text-primary-900');
    
    // Test secondary button styling
    const secondaryButton = screen.getByRole('link', { name: /Send email to info@ahaagile.com/ });
    expect(secondaryButton).toHaveClass('border-primary-100', 'text-primary-100');
  });

  it('includes hover animation classes for interactive elements', () => {
    render(<CTASection />);
    
    // Test primary button hover animations
    const primaryButton = screen.getByRole('button', { name: /Book your free consultation - scroll to scheduling widget/ });
    expect(primaryButton).toHaveClass('hover:scale-105', 'hover:-translate-y-1', 'transition-all', 'duration-300');
    
    // Test secondary button hover animations
    const secondaryButton = screen.getByRole('link', { name: /Send email to info@ahaagile.com/ });
    expect(secondaryButton).toHaveClass('hover:scale-105', 'hover:-translate-y-1', 'transition-all', 'duration-300');
    
    // Test arrow icon hover animation
    const arrowIcon = primaryButton.querySelector('svg');
    expect(arrowIcon).toHaveClass('group-hover:translate-x-1', 'transition-transform', 'duration-300');
  });

  it('uses correct typography classes for brand consistency', () => {
    render(<CTASection />);
    
    // Test heading uses Inter font family
    const heading = screen.getByText('Ready to Get Started?');
    expect(heading).toHaveClass('font-heading');
    
    // Test body text uses Source Serif 4 font family
    const bodyText = screen.getByText(/Book your free consultation today/);
    expect(bodyText.closest('div')).toHaveClass('font-serif');
  });

  it('has proper responsive layout classes', () => {
    render(<CTASection />);
    
    // Test button container responsive layout
    const buttonContainer = screen.getByRole('button', { name: /Book your free consultation - scroll to scheduling widget/ }).parentElement;
    expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-6');
    
    // Test responsive text sizing
    const heading = screen.getByText('Ready to Get Started?');
    expect(heading).toHaveClass('text-4xl', 'md:text-5xl', 'lg:text-6xl');
  });

  it('includes decorative elements with proper positioning', () => {
    const { container } = render(<CTASection />);
    
    // Test decorative gradient circles
    const decorativeElements = container.querySelectorAll('.bg-accent-400.opacity-10.rounded-full.blur-3xl');
    expect(decorativeElements).toHaveLength(2);
    
    // Test positioning classes
    expect(decorativeElements[0]).toHaveClass('absolute', 'top-0', 'right-0');
    expect(decorativeElements[1]).toHaveClass('absolute', 'bottom-0', 'left-0');
  });

  it('matches snapshot for visual regression testing', () => {
    const { container } = render(<CTASection />);
    expect(container.firstChild).toMatchSnapshot();
  });
});