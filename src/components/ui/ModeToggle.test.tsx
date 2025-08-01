import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from '@/lib/theme-context';
import { ModeToggle } from './ModeToggle';

// Mock the useTheme hook
const mockToggleMode = jest.fn();
jest.mock('@/lib/theme-context', () => ({
  useTheme: jest.fn(),
}));

describe('ModeToggle', () => {
  beforeEach(() => {
    mockToggleMode.mockClear();
    
    // Mock getElementById for status announcements
    const mockStatusElement = {
      textContent: ''
    };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockStatusElement as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Light Mode', () => {
    beforeEach(() => {
      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'light',
        toggleMode: mockToggleMode,
      });
    });

    it('renders light mode correctly', () => {
      render(<ModeToggle />);

      expect(screen.getByText('Light Mode')).toBeInTheDocument();
      
      const switchButton = screen.getByRole('switch', { name: /switch to dark mode/i });
      expect(switchButton).toBeInTheDocument();
      expect(switchButton).toHaveAttribute('aria-checked', 'false');
    });

    it('shows light mode icon as active', () => {
      render(<ModeToggle />);

      const lightIcon = screen.getByText('Light Mode').previousElementSibling;
      expect(lightIcon).toHaveClass('bg-primary/10', 'text-primary');
      
      const darkIcon = screen.getByText('Light Mode').parentElement?.nextElementSibling?.nextElementSibling;
      expect(darkIcon).toHaveClass('text-muted-foreground');
      expect(darkIcon).not.toHaveClass('bg-primary/10', 'text-primary');
    });

    it('positions toggle switch in light position', () => {
      render(<ModeToggle />);

      const toggleIndicator = screen.getByRole('switch').querySelector('span:last-child');
      expect(toggleIndicator).toHaveClass('translate-x-1');
      expect(toggleIndicator).not.toHaveClass('translate-x-6');
    });
  });

  describe('Dark Mode', () => {
    beforeEach(() => {
      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'dark',
        toggleMode: mockToggleMode,
      });
    });

    it('renders dark mode correctly', () => {
      render(<ModeToggle />);

      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
      
      const switchButton = screen.getByRole('switch', { name: /switch to light mode/i });
      expect(switchButton).toBeInTheDocument();
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
    });

    it('shows dark mode icon as active', () => {
      render(<ModeToggle />);

      const darkIcon = screen.getByText('Dark Mode').parentElement?.nextElementSibling?.nextElementSibling;
      expect(darkIcon).toHaveClass('bg-primary/10', 'text-primary');
      
      const lightIcon = screen.getByText('Dark Mode').previousElementSibling;
      expect(lightIcon).toHaveClass('text-muted-foreground');
      expect(lightIcon).not.toHaveClass('bg-primary/10', 'text-primary');
    });

    it('positions toggle switch in dark position', () => {
      render(<ModeToggle />);

      const toggleIndicator = screen.getByRole('switch').querySelector('span:last-child');
      expect(toggleIndicator).toHaveClass('translate-x-6');
      expect(toggleIndicator).not.toHaveClass('translate-x-1');
    });

    it('applies primary background color to switch', () => {
      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('bg-primary');
    });
  });

  describe('Interactions', () => {
    beforeEach(() => {
      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'light',
        toggleMode: mockToggleMode,
      });
    });

    it('calls toggleMode when clicked', async () => {
      const user = userEvent.setup();
      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch', { name: /switch to dark mode/i });
      await user.click(switchButton);

      expect(mockToggleMode).toHaveBeenCalledTimes(1);
    });

    it('calls toggleMode when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch', { name: /switch to dark mode/i });
      switchButton.focus();
      await user.keyboard('{Enter}');

      expect(mockToggleMode).toHaveBeenCalledTimes(1);
    });

    it('calls toggleMode when Space key is pressed', async () => {
      const user = userEvent.setup();
      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch', { name: /switch to dark mode/i });
      switchButton.focus();
      await user.keyboard(' ');

      expect(mockToggleMode).toHaveBeenCalledTimes(1);
    });

    it('does not call toggleMode for other keys', async () => {
      const user = userEvent.setup();
      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch', { name: /switch to dark mode/i });
      switchButton.focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Tab}');
      await user.keyboard('{Escape}');

      expect(mockToggleMode).not.toHaveBeenCalled();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('announces mode change to light mode', async () => {
      const user = userEvent.setup();
      const mockStatusElement = { textContent: '' };
      jest.spyOn(document, 'getElementById').mockReturnValue(mockStatusElement as any);

      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'dark',
        toggleMode: mockToggleMode,
      });

      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch');
      await user.click(switchButton);

      expect(document.getElementById).toHaveBeenCalledWith('theme-switcher-status');
      expect(mockStatusElement.textContent).toBe('Mode changed to light mode');
    });

    it('announces mode change to dark mode', async () => {
      const user = userEvent.setup();
      const mockStatusElement = { textContent: '' };
      jest.spyOn(document, 'getElementById').mockReturnValue(mockStatusElement as any);

      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'light',
        toggleMode: mockToggleMode,
      });

      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch');
      await user.click(switchButton);

      expect(document.getElementById).toHaveBeenCalledWith('theme-switcher-status');
      expect(mockStatusElement.textContent).toBe('Mode changed to dark mode');
    });

    it('handles missing status element gracefully', async () => {
      const user = userEvent.setup();
      jest.spyOn(document, 'getElementById').mockReturnValue(null);

      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'light',
        toggleMode: mockToggleMode,
      });

      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch');
      
      // Should not throw error when status element is missing
      expect(() => user.click(switchButton)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'light',
        toggleMode: mockToggleMode,
      });
    });

    it('has proper ARIA attributes', () => {
      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('role', 'switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'false');
      expect(switchButton).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('has screen reader only text', () => {
      render(<ModeToggle />);

      const srText = screen.getByText('Toggle dark mode');
      expect(srText).toHaveClass('sr-only');
    });

    it('has proper focus management', () => {
      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary', 'focus:ring-offset-2');
    });

    it('has minimum touch target size', () => {
      render(<ModeToggle />);

      // Check the main container has min height
      const mainContainer = screen.getByText('Light Mode').closest('div')?.parentElement;
      expect(mainContainer).toHaveClass('min-h-[44px]');

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });

    it('includes touch manipulation for mobile', () => {
      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('touch-manipulation', 'active:scale-95');
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'light',
        toggleMode: mockToggleMode,
      });
    });

    it('has responsive spacing classes', () => {
      render(<ModeToggle />);

      const iconsContainer = screen.getByText('Light Mode').closest('div');
      expect(iconsContainer).toHaveClass('space-x-2', 'sm:space-x-3');
    });

    it('has responsive icon sizes', () => {
      render(<ModeToggle />);

      const lightIcon = screen.getByText('Light Mode').previousElementSibling?.querySelector('svg');
      expect(lightIcon).toHaveClass('sm:w-[18px]', 'sm:h-[18px]');
    });

    it('has responsive padding for icons', () => {
      render(<ModeToggle />);

      const lightIcon = screen.getByText('Light Mode').previousElementSibling;
      expect(lightIcon).toHaveClass('p-1.5', 'sm:p-2');
    });
  });

  describe('Visual States', () => {
    it('applies correct background colors based on mode', () => {
      // Test light mode background
      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'light',
        toggleMode: mockToggleMode,
      });

      const { rerender } = render(<ModeToggle />);
      let switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('bg-gray-300', 'dark:bg-gray-600');
      expect(switchButton).not.toHaveClass('bg-primary');

      // Test dark mode background
      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'dark',
        toggleMode: mockToggleMode,
      });

      rerender(<ModeToggle />);
      switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('bg-primary');
    });

    it('shows proper transition classes', () => {
      (useTheme as jest.Mock).mockReturnValue({
        currentMode: 'light',
        toggleMode: mockToggleMode,
      });

      render(<ModeToggle />);

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('transition-colors', 'duration-200');

      const toggleIndicator = switchButton.querySelector('span:last-child');
      expect(toggleIndicator).toHaveClass('transition-transform', 'duration-200');
    });
  });
});