import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/lib/theme-context';
import { ThemeSwitcher } from './ThemeSwitcher';

// Mock the theme data
jest.mock('@/styles/themes', () => ({
  AVAILABLE_THEMES: [
    {
      name: 'Ocean',
      id: 'ocean',
      description: 'Deep blue ocean tones with excellent contrast',
      colors: {
        primary: 'hsl(200 100% 25%)',
        accent: 'hsl(180 100% 35%)',
        background: 'hsl(200 30% 98%)',
      }
    },
    {
      name: 'Sunset',
      id: 'sunset',
      description: 'Warm sunset colors with cozy orange/red tones',
      colors: {
        primary: 'hsl(15 85% 50%)',
        accent: 'hsl(340 75% 55%)',
        background: 'hsl(30 40% 98%)',
      }
    },
    {
      name: 'Forest',
      id: 'forest',
      description: 'Natural green forest theme with earthy tones',
      colors: {
        primary: 'hsl(150 80% 25%)',
        accent: 'hsl(65 85% 45%)',
        background: 'hsl(120 20% 98%)',
      }
    }
  ]
}));

// Mock theme loader functions
jest.mock('@/lib/theme-loader', () => ({
  applyThemeWithTransition: jest.fn(),
  initializeThemeLoader: jest.fn(),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders collapsed theme switcher button', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows current theme in button aria-label', async () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    await waitFor(() => {
      const toggleButton = screen.getByRole('button', { name: /current theme: ocean/i });
      expect(toggleButton).toBeInTheDocument();
    });
  });

  it('expands theme panel when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: /theme selection panel/i })).toBeInTheDocument();
    expect(screen.getByText('Theme Options')).toBeInTheDocument();
  });

  it('shows all available themes in expanded panel', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);

    const radioGroup = screen.getByRole('radiogroup', { name: /theme selection/i });
    expect(radioGroup).toBeInTheDocument();

    expect(screen.getByRole('radio', { name: /ocean theme/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /sunset theme/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /forest theme/i })).toBeInTheDocument();
  });

  it('shows mode toggle in expanded panel', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);

    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('closes panel when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);

    const closeButton = screen.getByRole('button', { name: /close theme switcher/i });
    await user.click(closeButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes panel when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);

    await user.keyboard('{Escape}');

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes panel when clicking outside', async () => {
    render(
      <TestWrapper>
        <div>
          <ThemeSwitcher />
          <div data-testid="outside-element">Outside</div>
        </div>
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const outsideElement = screen.getByTestId('outside-element');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation with Enter and Space', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    
    // Test Enter key
    toggleButton.focus();
    await user.keyboard('{Enter}');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    await user.keyboard('{Escape}');
    
    // Test Space key
    await user.keyboard(' ');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports arrow key navigation between theme options', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);

    // Wait for the panel to open and focus to be set
    await waitFor(() => {
      const oceanOption = screen.getByRole('radio', { name: /ocean theme/i });
      expect(oceanOption).toHaveFocus();
    });

    // Arrow down should move focus to next theme
    await user.keyboard('{ArrowDown}');
    
    await waitFor(() => {
      const sunsetOption = screen.getByRole('radio', { name: /sunset theme/i });
      expect(sunsetOption).toHaveFocus();
    });

    // Arrow up should move back to previous theme
    await user.keyboard('{ArrowUp}');
    
    await waitFor(() => {
      const oceanOption = screen.getByRole('radio', { name: /ocean theme/i });
      expect(oceanOption).toHaveFocus();
    });
  });

  it('manages focus correctly when opening panel', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);

    // Focus should move to first theme option
    await waitFor(() => {
      const firstOption = screen.getByRole('radio', { name: /ocean theme/i });
      expect(firstOption).toHaveFocus();
    });
  });

  it('manages focus correctly when closing with Escape', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);
    await user.keyboard('{Escape}');

    // Focus should return to toggle button
    expect(toggleButton).toHaveFocus();
  });

  it('has proper ARIA attributes for accessibility', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const container = screen.getByRole('region', { name: /theme switcher/i });
    expect(container).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    await user.click(toggleButton);

    const dialog = screen.getByRole('dialog', { name: /theme selection panel/i });
    expect(dialog).toBeInTheDocument();

    const radioGroup = screen.getByRole('radiogroup', { name: /theme selection/i });
    expect(radioGroup).toBeInTheDocument();

    // Check for live region for announcements
    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeInTheDocument();
    expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    expect(statusRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('applies custom className prop', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher className="custom-class" />
      </TestWrapper>
    );

    const container = screen.getByRole('region', { name: /theme switcher/i });
    expect(container).toHaveClass('custom-class');
  });

  it('renders with proper responsive classes', () => {
    render(
      <TestWrapper>
        <ThemeSwitcher />
      </TestWrapper>
    );

    const container = screen.getByRole('region', { name: /theme switcher/i });
    expect(container).toHaveClass('bottom-4', 'right-4', 'sm:bottom-6', 'sm:right-6');

    const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
    expect(toggleButton).toHaveClass('w-12', 'h-12', 'sm:w-14', 'sm:h-14');
  });
});