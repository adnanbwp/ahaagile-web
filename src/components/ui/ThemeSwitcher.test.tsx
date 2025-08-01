/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/lib/theme-context';
import { ThemeSwitcher } from './ThemeSwitcher';

// Mock theme-loader module
jest.mock('@/lib/theme-loader', () => ({
  applyThemeWithTransition: jest.fn(),
  initializeThemeLoader: jest.fn(),
}));

// Mock environment variables
const originalEnv = process.env;

// Helper function to render ThemeSwitcher with ThemeProvider
const renderWithThemeProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    // Reset environment variables
    jest.resetModules();
    
    // Clear localStorage
    localStorage.clear();
    
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('Visibility Control', () => {
    it('should be visible in development environment', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'development';
      
      renderWithThemeProvider(<ThemeSwitcher />);
      
      expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      
      (process.env as any).NODE_ENV = originalNodeEnv;
    });

    it('should be hidden in production environment by default', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'production';
      
      renderWithThemeProvider(<ThemeSwitcher />);
      
      expect(screen.queryByLabelText('Open theme switcher')).not.toBeInTheDocument();
      
      (process.env as any).NODE_ENV = originalNodeEnv;
    });

    it('should be visible in production when force-enabled', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalForceSwitch = process.env.NEXT_PUBLIC_FORCE_THEME_SWITCHER;
      
      (process.env as any).NODE_ENV = 'production';
      (process.env as any).NEXT_PUBLIC_FORCE_THEME_SWITCHER = 'true';
      
      renderWithThemeProvider(<ThemeSwitcher />);
      
      expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      
      (process.env as any).NODE_ENV = originalNodeEnv;
      (process.env as any).NEXT_PUBLIC_FORCE_THEME_SWITCHER = originalForceSwitch;
    });
  });

  describe('Collapsed State', () => {
    beforeEach(() => {
      (process.env as any).NODE_ENV = 'development';
    });

    it('should render collapsed state by default', () => {
      renderWithThemeProvider(<ThemeSwitcher />);
      
      expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      expect(screen.queryByText('Theme Settings')).not.toBeInTheDocument();
    });

    it('should expand when clicked', async () => {
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await user.click(screen.getByLabelText('Open theme switcher'));
      
      expect(screen.getByText('Theme Settings')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes in collapsed state', () => {
      renderWithThemeProvider(<ThemeSwitcher />);
      
      const button = screen.getByLabelText('Open theme switcher');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-label', 'Open theme switcher');
    });
  });

  describe('Expanded State', () => {
    beforeEach(async () => {
      (process.env as any).NODE_ENV = 'development';
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await user.click(screen.getByLabelText('Open theme switcher'));
    });

    it('should display all theme options', () => {
      expect(screen.getByLabelText(/Select Ocean theme/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Select Sunset theme/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Select Forest theme/)).toBeInTheDocument();
    });

    it('should display mode toggle', () => {
      expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
    });

    it('should show current theme info', () => {
      expect(screen.getByText(/Active:/)).toBeInTheDocument();
      // Check that current theme info div is present
      const activeInfo = document.querySelector('.text-xs.text-gray-500');
      expect(activeInfo).toBeInTheDocument();
      expect(screen.getByText(/light/i)).toBeInTheDocument();
    });

    it('should close when close button is clicked', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByLabelText('Close theme switcher'));
      
      await waitFor(() => {
        expect(screen.queryByText('Theme Settings')).not.toBeInTheDocument();
      });
    });

    it('should close when clicking outside', async () => {
      // Click outside the component
      fireEvent.mouseDown(document.body);
      
      await waitFor(() => {
        expect(screen.queryByText('Theme Settings')).not.toBeInTheDocument();
      });
    });

    it('should close when pressing Escape key', async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Theme Settings')).not.toBeInTheDocument();
      });
    });
  });

  describe('Theme Selection', () => {
    beforeEach(async () => {
      (process.env as any).NODE_ENV = 'development';
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await user.click(screen.getByLabelText('Open theme switcher'));
    });

    it('should highlight the active theme', () => {
      // Check that one of the theme buttons has aria-pressed="true"
      const themeButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('Select') && 
        button.getAttribute('aria-label')?.includes('theme')
      );
      const activeButton = themeButtons.find(button => 
        button.getAttribute('aria-pressed') === 'true'
      );
      expect(activeButton).toBeInTheDocument();
    });

    it('should switch themes when theme button is clicked', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByLabelText(/Select Sunset theme/));
      
      await waitFor(() => {
        const sunsetButton = screen.getByLabelText(/Select Sunset theme/);
        expect(sunsetButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should provide proper ARIA labels for theme buttons', () => {
      const oceanButton = screen.getByLabelText(/Select Ocean theme: Deep blue ocean tones/);
      const sunsetButton = screen.getByLabelText(/Select Sunset theme: Warm orange and red sunset colors/);
      const forestButton = screen.getByLabelText(/Select Forest theme: Natural green forest theme/);
      
      expect(oceanButton).toBeInTheDocument();
      expect(sunsetButton).toBeInTheDocument();
      expect(forestButton).toBeInTheDocument();
    });

    it('should have radiogroup role for theme selection', () => {
      const themeGroup = screen.getByRole('radiogroup', { name: 'Theme selection' });
      expect(themeGroup).toBeInTheDocument();
    });
  });

  describe('Mode Toggle', () => {
    beforeEach(async () => {
      (process.env as any).NODE_ENV = 'development';
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await user.click(screen.getByLabelText('Open theme switcher'));
    });

    it('should toggle between light and dark mode', async () => {
      const user = userEvent.setup();
      
      // Initially in light mode
      expect(screen.getByText(/light/i)).toBeInTheDocument();
      
      // Click to switch to dark mode
      await user.click(screen.getByLabelText('Switch to dark mode'));
      
      await waitFor(() => {
        expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
      });
    });

    it('should show appropriate icons for light/dark mode', async () => {
      const user = userEvent.setup();
      
      // Light mode should show sun icon
      const modeButton = screen.getByLabelText('Switch to dark mode');
      const sunIcon = modeButton.querySelector('svg');
      expect(sunIcon).toHaveClass('text-yellow-500');
      
      // Switch to dark mode
      await user.click(modeButton);
      
      await waitFor(() => {
        const darkModeButton = screen.getByLabelText('Switch to light mode');
        const moonIcon = darkModeButton.querySelector('svg');
        expect(moonIcon).toHaveClass('text-blue-400');
      });
    });
  });

  describe('Responsive Behavior', () => {
    beforeEach(() => {
      (process.env as any).NODE_ENV = 'development';
    });

    it('should collapse on mobile when theme is selected', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
      
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      });
      
      // Expand the switcher
      await user.click(screen.getByLabelText('Open theme switcher'));
      expect(screen.getByText('Theme Settings')).toBeInTheDocument();
      
      // Select a theme
      await user.click(screen.getByLabelText(/Select Sunset theme/));
      
      // Should collapse on mobile
      await waitFor(() => {
        expect(screen.queryByText('Theme Settings')).not.toBeInTheDocument();
      });
    });

    it('should stay expanded on desktop when theme is selected', async () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      });
      
      // Expand the switcher
      await user.click(screen.getByLabelText('Open theme switcher'));
      expect(screen.getByText('Theme Settings')).toBeInTheDocument();
      
      // Select a theme
      await user.click(screen.getByLabelText(/Select Sunset theme/));
      
      // Should remain expanded on desktop
      expect(screen.getByText('Theme Settings')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(async () => {
      (process.env as any).NODE_ENV = 'development';
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await user.click(screen.getByLabelText('Open theme switcher'));
    });

    it('should support tab navigation through theme options', async () => {
      const user = userEvent.setup();
      
      // Get theme buttons
      const oceanButton = screen.getByLabelText(/Select Ocean theme/);
      const sunsetButton = screen.getByLabelText(/Select Sunset theme/);
      const forestButton = screen.getByLabelText(/Select Forest theme/);
      
      // Focus first button and navigate
      oceanButton.focus();
      expect(oceanButton).toHaveFocus();
      
      await user.tab();
      expect(sunsetButton).toHaveFocus();
      
      await user.tab();
      expect(forestButton).toHaveFocus();
    });

    it('should support Enter key to select themes', async () => {
      const user = userEvent.setup();
      
      // Focus on Sunset theme button
      const sunsetButton = screen.getByLabelText(/Select Sunset theme/);
      sunsetButton.focus();
      
      // Press Enter to select
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        const sunsetButton = screen.getByLabelText(/Select Sunset theme/);
        expect(sunsetButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should support Space key to select themes', async () => {
      const user = userEvent.setup();
      
      // Focus on Forest theme button
      const forestButton = screen.getByLabelText(/Select Forest theme/);
      forestButton.focus();
      
      // Press Space to select
      await user.keyboard(' ');
      
      await waitFor(() => {
        const forestButton = screen.getByLabelText(/Select Forest theme/);
        expect(forestButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      (process.env as any).NODE_ENV = 'development';
    });

    it('should have proper region role and label', async () => {
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await waitFor(() => {
        const region = screen.getByRole('region', { name: 'Theme switcher' });
        expect(region).toBeInTheDocument();
      });
    });

    it('should have focus indicators on interactive elements', async () => {
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      });
      
      const openButton = screen.getByLabelText('Open theme switcher');
      await user.tab();
      
      expect(openButton).toHaveFocus();
      expect(openButton).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });

    it('should provide color swatches with aria-hidden', async () => {
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      });
      
      await user.click(screen.getByLabelText('Open theme switcher'));
      
      // Color swatches should be hidden from screen readers
      const colorSwatches = document.querySelectorAll('[aria-hidden="true"]');
      expect(colorSwatches.length).toBeGreaterThan(0);
    });

    it('should announce theme changes to screen readers', async () => {
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      });
      
      await user.click(screen.getByLabelText('Open theme switcher'));
      
      // Current theme info should be available to screen readers
      expect(screen.getByText(/Active:/)).toBeInTheDocument();
    });
  });

  describe('Theme Persistence', () => {
    beforeEach(() => {
      (process.env as any).NODE_ENV = 'development';
    });

    it('should persist theme selection to localStorage', async () => {
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      });
      
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Sunset theme/));
      
      await waitFor(() => {
        const stored = localStorage.getItem('aha-agile-theme-preferences');
        expect(stored).toBeTruthy();
        
        const preferences = JSON.parse(stored!);
        expect(preferences.theme).toBe('sunset');
      });
    });

    it('should persist mode toggle to localStorage', async () => {
      const user = userEvent.setup();
      renderWithThemeProvider(<ThemeSwitcher />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
      });
      
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText('Switch to dark mode'));
      
      await waitFor(() => {
        const stored = localStorage.getItem('aha-agile-theme-preferences');
        expect(stored).toBeTruthy();
        
        const preferences = JSON.parse(stored!);
        expect(preferences.mode).toBe('dark');
      });
    });
  });
});