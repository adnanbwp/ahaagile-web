import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComponentShowcase } from './component-showcase';

describe('ComponentShowcase', () => {
  it('renders the main heading', () => {
    render(<ComponentShowcase />);
    
    const heading = screen.getByRole('heading', { name: /component library showcase/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-hero');
  });

  it('renders the subtitle with design tokens', () => {
    render(<ComponentShowcase />);
    
    const subtitle = screen.getByText(/demonstrating shadcn\/ui components integrated with loveable design tokens/i);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass('text-subhero');
  });

  it('renders the featured card with proper components', () => {
    render(<ComponentShowcase />);
    
    // Check for card title with icon
    const cardTitle = screen.getByRole('heading', { name: /intelligent automation/i });
    expect(cardTitle).toBeInTheDocument();
    
    // Check for badge
    const badge = screen.getByText('Featured');
    expect(badge).toBeInTheDocument();
    
    // Check for card description
    const description = screen.getByText(/transform your workflow with cutting-edge automation solutions/i);
    expect(description).toBeInTheDocument();
  });

  it('renders key features list', () => {
    render(<ComponentShowcase />);
    
    expect(screen.getByText(/process optimization and analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/custom workflow automation/i)).toBeInTheDocument();
    expect(screen.getByText(/real-time performance monitoring/i)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<ComponentShowcase />);
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    const learnMoreButton = screen.getByRole('button', { name: /learn more/i });
    
    expect(getStartedButton).toBeInTheDocument();
    expect(learnMoreButton).toBeInTheDocument();
  });

  it('renders contact form elements', () => {
    render(<ComponentShowcase />);
    
    // Check for form inputs
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    
    // Check for form labels
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('renders service badges', () => {
    render(<ComponentShowcase />);
    
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Automation')).toBeInTheDocument();
    expect(screen.getByText('Consulting')).toBeInTheDocument();
  });

  it('renders button variants demo', () => {
    render(<ComponentShowcase />);
    
    // Check for button variants section
    const buttonTitle = screen.getByRole('heading', { name: /button component variants/i });
    expect(buttonTitle).toBeInTheDocument();
    
    // Check for different button variants
    expect(screen.getByRole('button', { name: /primary button/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /secondary button/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /outline button/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ghost button/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /link button/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /destructive button/i })).toBeInTheDocument();
  });

  it('renders button size variants', () => {
    render(<ComponentShowcase />);
    
    expect(screen.getByRole('button', { name: /^small$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^default$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^large$/i })).toBeInTheDocument();
  });

  it('renders with proper design system classes', () => {
    const { container } = render(<ComponentShowcase />);
    
    const mainContainer = container.querySelector('.container-brand.section-spacing');
    expect(mainContainer).toBeInTheDocument();
  });

  it('has accessible form structure', () => {
    render(<ComponentShowcase />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    
    expect(nameInput).toHaveAttribute('placeholder', 'Enter your full name');
    expect(emailInput).toHaveAttribute('placeholder', 'your.email@company.com');
    
    // Check that labels are properly associated
    expect(nameInput).toHaveAttribute('id');
    expect(emailInput).toHaveAttribute('id');
  });

  it('renders icons with proper accessibility', () => {
    render(<ComponentShowcase />);
    
    // Icons should be present in the DOM (they render as SVG elements)
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });
});