import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { ThemePreview } from './ThemePreview';

// Mock theme data
const mockTheme = {
  name: 'Ocean',
  id: 'ocean' as const,
  description: 'Deep blue ocean tones with excellent contrast',
  colors: {
    primary: 'hsl(200 100% 25%)',
    accent: 'hsl(180 100% 35%)',
    background: 'hsl(200 30% 98%)',
  }
};

const mockSetTheme = jest.fn();

// Mock the useTheme hook
jest.mock('@/lib/theme-context', () => ({
  ...jest.requireActual('@/lib/theme-context'),
  useTheme: jest.fn(),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

describe('ThemePreview', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      currentTheme: 'ocean',
      currentMode: 'light',
    });

    // Mock getElementById for status announcements
    const mockStatusElement = {
      textContent: ''
    };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockStatusElement as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders theme preview with correct information', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    expect(screen.getByRole('radio', { name: /ocean theme/i })).toBeInTheDocument();
    expect(screen.getByText('Ocean')).toBeInTheDocument();
    expect(screen.getByText('Deep blue ocean tones with excellent contrast')).toBeInTheDocument();
  });

  it('shows selected state correctly', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={true} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    expect(radio).toHaveAttribute('aria-checked', 'true');
    expect(radio).toHaveAttribute('tabindex', '-1');
    
    // Should show checkmark icon for selected state
    const checkmark = screen.getByRole('radio').querySelector('svg');
    expect(checkmark).toBeInTheDocument();
  });

  it('shows unselected state correctly', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    expect(radio).toHaveAttribute('aria-checked', 'false');
    expect(radio).toHaveAttribute('tabindex', '-1');
    
    // Should not show checkmark icon for unselected state
    const checkmark = screen.getByRole('radio').querySelector('svg');
    expect(checkmark).not.toBeInTheDocument();
  });

  it('displays color swatches with correct colors', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const colorSwatches = screen.getByRole('radio').querySelectorAll('[style*="background-color"]');
    
    expect(colorSwatches).toHaveLength(3);
    expect(colorSwatches[0]).toHaveStyle({ backgroundColor: 'hsl(200 100% 25%)' });
    expect(colorSwatches[1]).toHaveStyle({ backgroundColor: 'hsl(180 100% 35%)' });
    expect(colorSwatches[2]).toHaveStyle({ backgroundColor: 'hsl(200 30% 98%)' });
  });

  it('calls setTheme when clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    await user.click(radio);

    expect(mockSetTheme).toHaveBeenCalledWith('ocean');
  });

  it('calls setTheme when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    radio.focus();
    await user.keyboard('{Enter}');

    expect(mockSetTheme).toHaveBeenCalledWith('ocean');
  });

  it('calls setTheme when Space key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    radio.focus();
    await user.keyboard(' ');

    expect(mockSetTheme).toHaveBeenCalledWith('ocean');
  });

  it('does not call setTheme for arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    radio.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowUp}');

    expect(mockSetTheme).not.toHaveBeenCalled();
  });

  it('announces theme change to screen readers', async () => {
    const user = userEvent.setup();
    const mockStatusElement = { textContent: '' };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockStatusElement as any);

    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    await user.click(radio);

    expect(document.getElementById).toHaveBeenCalledWith('theme-switcher-status');
    expect(mockStatusElement.textContent).toBe('Theme changed to Ocean');
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={true} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    
    expect(radio).toHaveAttribute('role', 'radio');
    expect(radio).toHaveAttribute('aria-checked', 'true');
    expect(radio).toHaveAttribute('tabindex', '-1');
    expect(radio).toHaveAttribute('aria-label', expect.stringContaining('Ocean theme'));
    expect(radio).toHaveAttribute('aria-label', expect.stringContaining('Deep blue ocean tones'));
    expect(radio).toHaveAttribute('aria-label', expect.stringContaining('Currently selected'));
  });

  it('shows correct aria-label for unselected state', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    expect(radio).toHaveAttribute('aria-label', expect.stringContaining('Click to select'));
  });

  it('applies correct CSS classes for selected state', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={true} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('border-primary', 'bg-primary/5', 'shadow-sm');
    
    const themeName = screen.getByText('Ocean');
    expect(themeName).toHaveClass('text-primary');
  });

  it('applies correct CSS classes for unselected state', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('border-border');
    expect(radio).not.toHaveClass('border-primary', 'bg-primary/5', 'shadow-sm');
    
    const themeName = screen.getByText('Ocean');
    expect(themeName).toHaveClass('text-foreground');
  });

  it('has minimum touch target size for mobile accessibility', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('min-h-[44px]');
  });

  it('includes touch manipulation for better mobile experience', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('touch-manipulation', 'active:scale-[0.98]');
  });

  it('has color swatch tooltips with proper titles', () => {
    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const colorSwatches = screen.getByRole('radio').querySelectorAll('[title]');
    
    expect(colorSwatches[0]).toHaveAttribute('title', 'Primary color: hsl(200 100% 25%)');
    expect(colorSwatches[1]).toHaveAttribute('title', 'Accent color: hsl(180 100% 35%)');
    expect(colorSwatches[2]).toHaveAttribute('title', 'Background color: hsl(200 30% 98%)');
  });

  it('handles missing status element gracefully', async () => {
    const user = userEvent.setup();
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    render(
      <TestWrapper>
        <ThemePreview theme={mockTheme} isSelected={false} />
      </TestWrapper>
    );

    const radio = screen.getByRole('radio', { name: /ocean theme/i });
    
    // Should not throw error when status element is missing
    expect(() => user.click(radio)).not.toThrow();
  });
});