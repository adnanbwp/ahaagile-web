import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Menu, ArrowRight, Star, iconSizes, defaultIconProps } from './icons';

describe('Lucide React Icons Integration', () => {
  it('renders Menu icon correctly', () => {
    render(<Menu data-testid="menu-icon" />);
    
    const icon = screen.getByTestId('menu-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe('svg');
  });

  it('renders ArrowRight icon with custom props', () => {
    render(<ArrowRight data-testid="arrow-icon" size={32} className="text-blue-500" />);
    
    const icon = screen.getByTestId('arrow-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-blue-500');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('renders Star icon with default props', () => {
    render(<Star data-testid="star-icon" {...defaultIconProps} />);
    
    const icon = screen.getByTestId('star-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveAttribute('height', '20');
    expect(icon).toHaveAttribute('stroke-width', '2');
  });

  it('exports correct icon sizes', () => {
    expect(iconSizes.xs).toBe(12);
    expect(iconSizes.sm).toBe(16);
    expect(iconSizes.md).toBe(20);
    expect(iconSizes.lg).toBe(24);
    expect(iconSizes.xl).toBe(32);
    expect(iconSizes['2xl']).toBe(48);
  });

  it('has correct default icon props', () => {
    expect(defaultIconProps.size).toBe(20);
    expect(defaultIconProps.strokeWidth).toBe(2);
  });

  it('renders multiple icons in a component', () => {
    const TestComponent = () => (
      <div>
        <Menu data-testid="menu" />
        <ArrowRight data-testid="arrow" />
        <Star data-testid="star" />
      </div>
    );

    render(<TestComponent />);
    
    expect(screen.getByTestId('menu')).toBeInTheDocument();
    expect(screen.getByTestId('arrow')).toBeInTheDocument();
    expect(screen.getByTestId('star')).toBeInTheDocument();
  });

  it('renders icons with different sizes using iconSizes config', () => {
    render(
      <div>
        <Menu data-testid="small-icon" size={iconSizes.sm} />
        <ArrowRight data-testid="large-icon" size={iconSizes.xl} />
      </div>
    );

    const smallIcon = screen.getByTestId('small-icon');
    const largeIcon = screen.getByTestId('large-icon');

    expect(smallIcon).toHaveAttribute('width', '16');
    expect(smallIcon).toHaveAttribute('height', '16');
    expect(largeIcon).toHaveAttribute('width', '32');
    expect(largeIcon).toHaveAttribute('height', '32');
  });
});