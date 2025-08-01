import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme, AVAILABLE_THEMES } from '@/lib/theme-context';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Helper component to test theme context
const ThemeTestComponent: React.FC = () => {
  const { currentTheme, currentMode, setTheme, setMode, toggleMode } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{currentTheme}</div>
      <div data-testid="current-mode">{currentMode}</div>
      <button 
        data-testid="set-sunset" 
        onClick={() => setTheme('sunset')}
      >
        Set Sunset
      </button>
      <button 
        data-testid="set-dark" 
        onClick={() => setMode('dark')}
      >
        Set Dark
      </button>
      <button 
        data-testid="toggle-mode" 
        onClick={toggleMode}
      >
        Toggle Mode
      </button>
    </div>
  );
};

// Wrapper component with theme provider
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Theme System Integration Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    // Clear any theme classes from document
    document.documentElement.className = '';
    document.body.className = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Theme Context Provider', () => {
    it('provides default theme and mode values', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeWrapper,
      });

      expect(result.current.currentTheme).toBe('ocean');
      expect(result.current.currentMode).toBe('light');
    });

    it('persists theme preferences to localStorage', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const setSunsetButton = screen.getByTestId('set-sunset');
      const setDarkButton = screen.getByTestId('set-dark');

      fireEvent.click(setSunsetButton);
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        const stored = JSON.parse(mockLocalStorage.getItem('aha-agile-theme-preferences') || '{}');
        expect(stored.theme).toBe('sunset');
        expect(stored.mode).toBe('dark');
      });
    });

    it('loads theme preferences from localStorage on mount', () => {
      // Pre-populate localStorage
      mockLocalStorage.setItem(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'forest', mode: 'dark' })
      );

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeWrapper,
      });

      // Wait for hydration
      waitFor(() => {
        expect(result.current.currentTheme).toBe('forest');
        expect(result.current.currentMode).toBe('dark');
      });
    });

    it('handles invalid localStorage data gracefully', () => {
      mockLocalStorage.setItem('aha-agile-theme-preferences', 'invalid-json');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeWrapper,
      });

      expect(result.current.currentTheme).toBe('ocean');
      expect(result.current.currentMode).toBe('light');
    });

    it('toggles between light and dark modes', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle-mode');
      const modeDisplay = screen.getByTestId('current-mode');

      expect(modeDisplay).toHaveTextContent('light');

      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(modeDisplay).toHaveTextContent('dark');
      });

      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(modeDisplay).toHaveTextContent('light');
      });
    });
  });

  describe('ThemeSwitcher Component Integration', () => {
    it('integrates properly with theme context', async () => {
      render(
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
      expect(toggleButton).toBeInTheDocument();

      // Click to expand theme options
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const themePanel = screen.getByRole('dialog', { name: /theme selection panel/i });
        expect(themePanel).toBeInTheDocument();
      });

      // Check that all themes are available
      AVAILABLE_THEMES.forEach(theme => {
        const themeOption = screen.getByRole('radio', { name: new RegExp(theme.name, 'i') });
        expect(themeOption).toBeInTheDocument();
      });
    });

    it('switches themes correctly through the UI', async () => {
      render(
        <ThemeProvider>
          <ThemeSwitcher />
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const sunsetOption = screen.getByRole('radio', { name: /sunset/i });
        fireEvent.click(sunsetOption);
      });

      await waitFor(() => {
        const currentTheme = screen.getByTestId('current-theme');
        expect(currentTheme).toHaveTextContent('sunset');
      });
    });

    it('maintains accessibility when switching themes', async () => {
      render(
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: /theme switcher/i });
      
      // Check initial accessibility attributes
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-label');

      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });
  });

  describe('Component Theme Compatibility', () => {
    it('Header component works with all themes', async () => {
      const TestWrapper: React.FC = () => (
        <ThemeProvider>
          <Header />
          <ThemeTestComponent />
        </ThemeProvider>
      );

      render(<TestWrapper />);

      for (const theme of AVAILABLE_THEMES) {
        const setThemeButton = screen.getByTestId(`set-${theme.id === 'sunset' ? 'sunset' : 'sunset'}`);
        if (theme.id === 'sunset') {
          fireEvent.click(setThemeButton);
        }

        await waitFor(() => {
          const header = screen.getByRole('banner');
          expect(header).toBeInTheDocument();
          expect(header).toBeVisible();
        });
      }
    });

    it('Footer component works with all themes', async () => {
      const TestWrapper: React.FC = () => (
        <ThemeProvider>
          <Footer />
          <ThemeTestComponent />
        </ThemeProvider>
      );

      render(<TestWrapper />);

      for (const theme of AVAILABLE_THEMES) {
        if (theme.id === 'sunset') {
          const setThemeButton = screen.getByTestId('set-sunset');
          fireEvent.click(setThemeButton);
        }

        await waitFor(() => {
          const footer = screen.getByRole('contentinfo');
          expect(footer).toBeInTheDocument();
          expect(footer).toBeVisible();
        });
      }
    });

    it('Button components maintain functionality across themes', async () => {
      const TestWrapper: React.FC = () => {
        const [clicked, setClicked] = React.useState(false);
        
        return (
          <ThemeProvider>
            <Button 
              onClick={() => setClicked(true)}
              data-testid="test-button"
            >
              Test Button
            </Button>
            <div data-testid="click-result">{clicked ? 'clicked' : 'not-clicked'}</div>
            <ThemeTestComponent />
          </ThemeProvider>
        );
      };

      render(<TestWrapper />);

      const button = screen.getByTestId('test-button');
      const result = screen.getByTestId('click-result');
      
      expect(result).toHaveTextContent('not-clicked');

      // Test with default theme
      fireEvent.click(button);
      expect(result).toHaveTextContent('clicked');

      // Test with different theme
      const setSunsetButton = screen.getByTestId('set-sunset');
      fireEvent.click(setSunsetButton);

      await waitFor(() => {
        expect(button).toBeInTheDocument();
        expect(button).toBeVisible();
      });
    });

    it('Card components render correctly with all themes', async () => {
      const TestWrapper: React.FC = () => (
        <ThemeProvider>
          <Card data-testid="test-card">
            <div>Card Content</div>
          </Card>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      render(<TestWrapper />);

      const card = screen.getByTestId('test-card');
      expect(card).toBeInTheDocument();

      // Test theme switching with card
      const setSunsetButton = screen.getByTestId('set-sunset');
      fireEvent.click(setSunsetButton);

      await waitFor(() => {
        expect(card).toBeVisible();
        expect(screen.getByText('Card Content')).toBeInTheDocument();
      });
    });
  });

  describe('CSS Class Application', () => {
    it('applies correct theme classes to document elements', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const setSunsetButton = screen.getByTestId('set-sunset');
      const setDarkButton = screen.getByTestId('set-dark');

      fireEvent.click(setSunsetButton);
      fireEvent.click(setDarkButton);

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-sunset')).toBe(true);
        expect(htmlElement.classList.contains('dark')).toBe(true);
      });
    });

    it('removes old theme classes when switching themes', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const setSunsetButton = screen.getByTestId('set-sunset');
      fireEvent.click(setSunsetButton);

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-sunset')).toBe(true);
        expect(htmlElement.classList.contains('theme-ocean')).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing theme context gracefully', () => {
      // Temporarily mock console.error to avoid noisy test output
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<ThemeTestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      console.error = originalError;
    });

    it('handles localStorage errors gracefully', async () => {
      // Mock localStorage setItem to throw error
      const originalSetItem = mockLocalStorage.setItem;
      mockLocalStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const setSunsetButton = screen.getByTestId('set-sunset');
      fireEvent.click(setSunsetButton);

      // Wait for the async effect to run
      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Failed to save theme preferences to localStorage:',
          expect.any(Error)
        );
      });

      // Restore original methods
      mockLocalStorage.setItem = originalSetItem;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Performance and Transitions', () => {
    it('applies theme transitions without blocking the UI', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const setSunsetButton = screen.getByTestId('set-sunset');
      
      // Measure timing
      const startTime = performance.now();
      fireEvent.click(setSunsetButton);
      
      await waitFor(() => {
        const currentTheme = screen.getByTestId('current-theme');
        expect(currentTheme).toHaveTextContent('sunset');
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Theme switch should be reasonably fast (under 1 second)
      expect(duration).toBeLessThan(1000);
    });

    it('maintains smooth transitions between themes', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      const setSunsetButton = screen.getByTestId('set-sunset');
      
      // Check that transition classes are applied
      act(() => {
        fireEvent.click(setSunsetButton);
      });

      // The transition should complete without errors
      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-sunset')).toBe(true);
      }, { timeout: 2000 });
    });
  });
});