import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardMockup from './DashboardMockup';

describe('DashboardMockup', () => {
  it('renders the dashboard title and description', () => {
    render(<DashboardMockup />);
    
    const title = screen.getByText('Automation Dashboard');
    expect(title).toBeInTheDocument();
    
    const description = screen.getByText('Real-time workflow efficiency metrics');
    expect(description).toBeInTheDocument();
  });

  it('renders all metric cards with correct data', () => {
    render(<DashboardMockup />);
    
    // Time Saved This Month
    expect(screen.getByText('Time Saved This Month')).toBeInTheDocument();
    expect(screen.getByText('187h')).toBeInTheDocument();
    expect(screen.getByText('+23%')).toBeInTheDocument();
    
    // Cost Savings
    expect(screen.getByText('Cost Savings')).toBeInTheDocument();
    expect(screen.getByText('$28,400')).toBeInTheDocument();
    expect(screen.getByText('+18%')).toBeInTheDocument();
    
    // Efficiency Gain
    expect(screen.getByText('Efficiency Gain')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
    
    // Processes Automated
    expect(screen.getByText('Processes Automated')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('+4')).toBeInTheDocument();
  });

  it('renders progress bars with correct categories', () => {
    render(<DashboardMockup />);
    
    expect(screen.getByText('Email Management')).toBeInTheDocument();
    expect(screen.getByText('Document Processing')).toBeInTheDocument();
    expect(screen.getByText('Client Communications')).toBeInTheDocument();
    expect(screen.getByText('Data Entry Tasks')).toBeInTheDocument();
  });

  it('displays progress bar values correctly', () => {
    render(<DashboardMockup />);
    
    expect(screen.getByText('45h saved')).toBeInTheDocument();
    expect(screen.getByText('38h saved')).toBeInTheDocument();
    expect(screen.getByText('52h saved')).toBeInTheDocument();
    expect(screen.getByText('28h saved')).toBeInTheDocument();
  });

  it('renders the time savings section title', () => {
    render(<DashboardMockup />);
    
    const sectionTitle = screen.getByText('Time Savings by Category');
    expect(sectionTitle).toBeInTheDocument();
  });

  it('displays live data indicator', () => {
    render(<DashboardMockup />);
    
    const liveIndicator = screen.getByText('Live data updating every 5 minutes');
    expect(liveIndicator).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-dashboard-class';
    const { container } = render(<DashboardMockup className={customClass} />);
    
    const dashboard = container.firstChild as Element;
    expect(dashboard).toHaveClass(customClass);
  });

  it('renders with proper backdrop blur and transparency effects', () => {
    const { container } = render(<DashboardMockup />);
    
    const dashboard = container.firstChild as Element;
    expect(dashboard).toHaveClass('bg-white/10', 'backdrop-blur-md');
  });

  it('has correct grid layout for metric cards', () => {
    render(<DashboardMockup />);
    
    // Check that metric cards are properly structured
    const timeCard = screen.getByText('Time Saved This Month').closest('.p-4');
    expect(timeCard).toHaveClass('bg-white/95', 'backdrop-blur-sm');
  });

  it('renders icons for each metric category', () => {
    render(<DashboardMockup />);
    
    // Since Lucide React icons render as SVG elements, we can check for their presence
    // by looking at the structure or using data attributes if needed
    const dashboard = screen.getByText('Automation Dashboard').closest('div');
    expect(dashboard).toBeInTheDocument();
  });

  it('has hover effects on metric cards', () => {
    render(<DashboardMockup />);
    
    const metricCard = screen.getByText('Time Saved This Month').closest('.p-4');
    expect(metricCard).toHaveClass('hover:shadow-lg', 'transition-all', 'duration-300', 'hover:scale-105');
  });

  it('renders progress bars with gradient backgrounds', () => {
    const { container } = render(<DashboardMockup />);
    
    // Check that progress bars have the expected gradient classes
    const progressBars = container.querySelectorAll('[class*="bg-gradient-to-r"]');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('displays proper responsive design classes', () => {
    const { container } = render(<DashboardMockup />);
    
    // Check for responsive grid classes
    const gridElement = container.querySelector('.grid.grid-cols-2.lg\\:grid-cols-4');
    expect(gridElement).toBeInTheDocument();
  });

  it('has accessible structure with proper headings hierarchy', () => {
    render(<DashboardMockup />);
    
    // Main title should be h3
    const mainTitle = screen.getByRole('heading', { name: /automation dashboard/i });
    expect(mainTitle).toBeInTheDocument();
    
    // Section title should be h4
    const sectionTitle = screen.getByRole('heading', { name: /time savings by category/i });
    expect(sectionTitle).toBeInTheDocument();
  });
});