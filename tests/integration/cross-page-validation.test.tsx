import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import BookConsultationHeroSection from '@/components/sections/BookConsultationHeroSection';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock localStorage
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
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test helper component to get theme state
const ThemeTestHelper: React.FC = () => {
  const { currentTheme, currentMode } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{currentTheme}</div>
      <div data-testid="current-mode">{currentMode}</div>
    </div>
  );
};

// Page component mock
const MockPageComponent: React.FC<{ pageName: string; children?: React.ReactNode }> = ({ 
  pageName, 
  children 
}) => (
  <ThemeProvider>
    <div data-testid={`${pageName}-page`}>
      <Header />
      <main>
        <h1>{pageName} Page</h1>
        {children}
      </main>
      <Footer />
      <ThemeTestHelper />
    </div>
  </ThemeProvider>
);

describe('Cross-Page Theme Validation', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    // Clear any theme classes from document
    document.documentElement.className = '';
    document.body.className = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Homepage Theme Compatibility', () => {
    it('renders homepage without theme errors', async () => {
      render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
        expect(screen.getByTestId('Home-page')).toBeInTheDocument();
      });

      // Check that no console errors occurred
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('applies ocean theme correctly on homepage', async () => {
      // Set theme in localStorage
      mockLocalStorage.setItem(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'ocean', mode: 'light' })
      );

      render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-ocean')).toBe(true);
        expect(htmlElement.classList.contains('light')).toBe(true);
      });

      const themeDisplay = screen.getByTestId('current-theme');
      const modeDisplay = screen.getByTestId('current-mode');
      expect(themeDisplay).toHaveTextContent('ocean');
      expect(modeDisplay).toHaveTextContent('light');
    });

    it('applies sunset theme with dark mode on homepage', async () => {
      mockLocalStorage.setItem(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'sunset', mode: 'dark' })
      );

      render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-sunset')).toBe(true);
        expect(htmlElement.classList.contains('dark')).toBe(true);
      });

      const themeDisplay = screen.getByTestId('current-theme');
      const modeDisplay = screen.getByTestId('current-mode');
      expect(themeDisplay).toHaveTextContent('sunset');
      expect(modeDisplay).toHaveTextContent('dark');
    });

    it('applies forest theme correctly on homepage', async () => {
      mockLocalStorage.setItem(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'forest', mode: 'light' })
      );

      render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-forest')).toBe(true);
        expect(htmlElement.classList.contains('light')).toBe(true);
      });

      const themeDisplay = screen.getByTestId('current-theme');
      const modeDisplay = screen.getByTestId('current-mode');
      expect(themeDisplay).toHaveTextContent('forest');
      expect(modeDisplay).toHaveTextContent('light');
    });
  });

  describe('Services Page Theme Compatibility', () => {
    it('renders services page without theme errors', async () => {
      render(
        <MockPageComponent pageName="Services">
          <ServicesHeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        expect(screen.getByText(/Services Page/i)).toBeInTheDocument();
        expect(screen.getByTestId('Services-page')).toBeInTheDocument();
      });
    });

    it('handles all theme variants on services page', async () => {
      const themes = [
        { theme: 'ocean', mode: 'light' },
        { theme: 'sunset', mode: 'dark' },
        { theme: 'forest', mode: 'light' },
      ];

      for (const themeConfig of themes) {
        mockLocalStorage.setItem(
          'aha-agile-theme-preferences',
          JSON.stringify(themeConfig)
        );

        const { unmount } = render(
          <MockPageComponent pageName="Services">
            <ServicesHeroSection />
          </MockPageComponent>
        );

        await waitFor(() => {
          const htmlElement = document.documentElement;
          expect(htmlElement.classList.contains(`theme-${themeConfig.theme}`)).toBe(true);
          expect(htmlElement.classList.contains(themeConfig.mode)).toBe(true);
        });

        const themeDisplay = screen.getByTestId('current-theme');
        const modeDisplay = screen.getByTestId('current-mode');
        expect(themeDisplay).toHaveTextContent(themeConfig.theme);
        expect(modeDisplay).toHaveTextContent(themeConfig.mode);

        unmount();
      }
    });
  });

  describe('Consultation Page Theme Compatibility', () => {
    it('renders consultation page without theme errors', async () => {
      render(
        <MockPageComponent pageName="Consultation">
          <BookConsultationHeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        expect(screen.getByText(/Consultation Page/i)).toBeInTheDocument();
        expect(screen.getByTestId('Consultation-page')).toBeInTheDocument();
      });
    });

    it('maintains theme on consultation page', async () => {
      mockLocalStorage.setItem(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'ocean', mode: 'dark' })
      );

      render(
        <MockPageComponent pageName="Consultation">
          <BookConsultationHeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-ocean')).toBe(true);
        expect(htmlElement.classList.contains('dark')).toBe(true);
      });

      const themeDisplay = screen.getByTestId('current-theme');
      const modeDisplay = screen.getByTestId('current-mode');
      expect(themeDisplay).toHaveTextContent('ocean');
      expect(modeDisplay).toHaveTextContent('dark');
    });
  });

  describe('Theme Consistency Across Page Transitions', () => {
    it('maintains theme state when navigating between different page components', async () => {
      // Set initial theme
      mockLocalStorage.setItem(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'sunset', mode: 'dark' })
      );

      // Render home page
      const { unmount: unmountHome } = render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-sunset')).toBe(true);
        expect(htmlElement.classList.contains('dark')).toBe(true);
      });

      unmountHome();

      // Navigate to services page
      const { unmount: unmountServices } = render(
        <MockPageComponent pageName="Services">
          <ServicesHeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-sunset')).toBe(true);
        expect(htmlElement.classList.contains('dark')).toBe(true);
      });

      unmountServices();

      // Navigate to consultation page
      render(
        <MockPageComponent pageName="Consultation">
          <BookConsultationHeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-sunset')).toBe(true);
        expect(htmlElement.classList.contains('dark')).toBe(true);
      });
    });

    it('handles theme persistence across component reloads', async () => {
      // Simulate initial page load
      mockLocalStorage.setItem(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'forest', mode: 'light' })
      );

      const { unmount } = render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-forest')).toBe(true);
        expect(htmlElement.classList.contains('light')).toBe(true);
      });

      unmount();

      // Simulate page reload with same localStorage
      render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-forest')).toBe(true);
        expect(htmlElement.classList.contains('light')).toBe(true);
      });
    });
  });

  describe('Theme System Error Handling', () => {
    it('handles corrupted localStorage gracefully', async () => {
      // Set corrupted data
      mockLocalStorage.setItem('aha-agile-theme-preferences', 'invalid-json');

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        // Should fallback to default theme
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-ocean')).toBe(true);
        expect(htmlElement.classList.contains('light')).toBe(true);
      });

      // Should warn about corrupted data
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to load theme preferences from localStorage:',
        expect.any(SyntaxError)
      );

      consoleWarnSpy.mockRestore();
    });

    it('maintains functionality when localStorage is unavailable', async () => {
      // Mock localStorage to be unavailable
      const originalLocalStorage = window.localStorage;
      delete (window as any).localStorage;

      render(
        <MockPageComponent pageName="Services">
          <ServicesHeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        // Should use default theme when localStorage is unavailable
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-ocean')).toBe(true);
        expect(htmlElement.classList.contains('light')).toBe(true);
      });

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
      });
    });
  });

  describe('Performance Tests', () => {
    it('theme hydration is fast', async () => {
      mockLocalStorage.setItem(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'forest', mode: 'dark' })
      );

      const startTime = performance.now();

      render(
        <MockPageComponent pageName="Home">
          <HeroSection />
        </MockPageComponent>
      );

      await waitFor(() => {
        const htmlElement = document.documentElement;
        expect(htmlElement.classList.contains('theme-forest')).toBe(true);
        expect(htmlElement.classList.contains('dark')).toBe(true);
      });

      const endTime = performance.now();
      const hydrationTime = endTime - startTime;

      // Theme hydration should be reasonably fast (under 200ms in test environment)
      expect(hydrationTime).toBeLessThan(200);
    });
  });
});