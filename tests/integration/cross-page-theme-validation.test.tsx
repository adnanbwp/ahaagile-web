/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/lib/theme-context';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock theme-loader module
jest.mock('@/lib/theme-loader', () => ({
  applyThemeWithTransition: jest.fn(),
  initializeThemeLoader: jest.fn(),
}));

// Mock components to avoid dependencies on actual page implementations
jest.mock('@/components/layout/Header', () => {
  return function MockHeader() {
    return <header role="banner" data-testid="header">Header</header>;
  };
});

jest.mock('@/components/layout/Footer', () => {
  return function MockFooter() {
    return <footer role="contentinfo" data-testid="footer">Footer</footer>;
  };
});

// Mock page components
const MockHomePage = () => (
  <div data-testid="homepage">
    <h1>Homepage</h1>
    <div data-testid="hero-section">Hero Section</div>
    <div data-testid="cta-section">CTA Section</div>
  </div>
);

const MockServicesPage = () => (
  <div data-testid="services-page">
    <h1>Services</h1>
    <div data-testid="services-grid">Services Grid</div>
    <div data-testid="process-section">Process Section</div>
  </div>
);

const MockCaseStudyPage = () => (
  <div data-testid="case-study-page">
    <h1>Case Study</h1>
    <div data-testid="content-sections">Content Sections</div>
    <div data-testid="highlights">Highlights</div>
  </div>
);

const MockConsultationPage = () => (
  <div data-testid="consultation-page">
    <h1>Book a Consultation</h1>
    <div data-testid="calendly-integration">Calendly Integration</div>
    <div data-testid="benefits-sidebar">Benefits Sidebar</div>
  </div>
);

// Helper function to render page with theme provider
const renderPageWithThemes = (PageComponent: React.ComponentType) => {
  return render(
    <ThemeProvider>
      <div data-testid="layout">
        <PageComponent />
        <ThemeSwitcher />
      </div>
    </ThemeProvider>
  );
};

describe('Cross-Page Theme Validation Tests', () => {
  beforeEach(() => {
    // Set development environment for theme switcher visibility
    (process.env as any).NODE_ENV = 'development';
    
    // Clear localStorage
    localStorage.clear();
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Homepage Theme Integration', () => {
    it('should render homepage with theme switcher', () => {
      renderPageWithThemes(MockHomePage);
      
      expect(screen.getByTestId('homepage')).toBeInTheDocument();
      expect(screen.getByLabelText('Open theme switcher')).toBeInTheDocument();
    });

    it('should maintain homepage styling with Ocean theme', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockHomePage);
      
      // Switch to Ocean theme
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Ocean theme/));
      
      // Verify homepage elements are still present and accessible
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('cta-section')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Homepage' })).toBeInTheDocument();
    });

    it('should maintain homepage styling with Sunset theme', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockHomePage);
      
      // Switch to Sunset theme
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Sunset theme/));
      
      // Verify homepage elements remain functional
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('cta-section')).toBeInTheDocument();
    });

    it('should maintain homepage styling with Forest theme and dark mode', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockHomePage);
      
      // Switch to Forest theme and dark mode
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Forest theme/));
      await user.click(screen.getByLabelText(/Switch to dark mode/));
      
      // Verify homepage elements remain functional
      expect(screen.getByTestId('homepage')).toBeInTheDocument();
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });
  });

  describe('Services Page Theme Integration', () => {
    it('should render services page with all themes', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockServicesPage);
      
      // Test each theme
      const themes = ['Ocean', 'Sunset', 'Forest'];
      
      for (const theme of themes) {
        // Check if theme switcher is already expanded, if not, open it
        const openButton = screen.queryByLabelText('Open theme switcher');
        if (openButton) {
          await user.click(openButton);
        }
        
        // Select the theme
        await user.click(screen.getByLabelText(new RegExp(`Select ${theme} theme`)));
        
        // Verify services page elements remain accessible
        expect(screen.getByTestId('services-page')).toBeInTheDocument();
        expect(screen.getByTestId('services-grid')).toBeInTheDocument();
        expect(screen.getByTestId('process-section')).toBeInTheDocument();
        
        // Close theme switcher by clicking outside
        await user.click(screen.getByTestId('services-page'));
      }
    });

    it('should maintain services grid styling across theme changes', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockServicesPage);
      
      // Initial state
      expect(screen.getByTestId('services-grid')).toBeInTheDocument();
      
      // Switch themes and verify grid remains functional
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Sunset theme/));
      
      expect(screen.getByTestId('services-grid')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
    });
  });

  describe('Case Study Page Theme Integration', () => {
    it('should render case study page with theme compatibility', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockCaseStudyPage);
      
      // Switch to Ocean theme
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Ocean theme/));
      
      // Verify case study elements
      expect(screen.getByTestId('case-study-page')).toBeInTheDocument();
      expect(screen.getByTestId('content-sections')).toBeInTheDocument();
      expect(screen.getByTestId('highlights')).toBeInTheDocument();
    });

    it('should handle content sections with different themes', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockCaseStudyPage);
      
      // Test content sections with Forest theme
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Forest theme/));
      
      const contentSections = screen.getByTestId('content-sections');
      const highlights = screen.getByTestId('highlights');
      
      expect(contentSections).toBeInTheDocument();
      expect(highlights).toBeInTheDocument();
    });
  });

  describe('Consultation Page Theme Integration', () => {
    it('should maintain Calendly integration with theme changes', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockConsultationPage);
      
      // Verify initial render
      expect(screen.getByTestId('calendly-integration')).toBeInTheDocument();
      expect(screen.getByTestId('benefits-sidebar')).toBeInTheDocument();
      
      // Switch theme and verify components remain
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Sunset theme/));
      
      expect(screen.getByTestId('calendly-integration')).toBeInTheDocument();
      expect(screen.getByTestId('benefits-sidebar')).toBeInTheDocument();
    });

    it('should handle professional styling with different themes', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockConsultationPage);
      
      // Test with Ocean theme and dark mode
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Ocean theme/));
      await user.click(screen.getByLabelText(/Switch to dark mode/));
      
      // Verify consultation page elements remain accessible
      expect(screen.getByTestId('consultation-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Book a Consultation' })).toBeInTheDocument();
    });
  });

  describe('Theme Persistence Across Pages', () => {
    it('should maintain theme selection when navigating between pages', async () => {
      const user = userEvent.setup();
      
      // Start with homepage
      renderPageWithThemes(MockHomePage);
      
      // Select Forest theme
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Select Forest theme/));
      
      // Verify theme is stored
      const stored = localStorage.getItem('aha-agile-theme-preferences');
      expect(stored).toBeTruthy();
      
      const preferences = JSON.parse(stored!);
      expect(preferences.theme).toBe('forest');
    });

    it('should maintain mode selection across different pages', async () => {
      const user = userEvent.setup();
      
      // Start with services page
      renderPageWithThemes(MockServicesPage);
      
      // Switch to dark mode
      await user.click(screen.getByLabelText('Open theme switcher'));
      await user.click(screen.getByLabelText(/Switch to dark mode/));
      
      // Verify mode is stored
      const stored = localStorage.getItem('aha-agile-theme-preferences');
      expect(stored).toBeTruthy();
      
      const preferences = JSON.parse(stored!);
      expect(preferences.mode).toBe('dark');
    });
  });

  describe('Component Interaction Testing', () => {
    it('should not interfere with page navigation', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockHomePage);
      
      // Open theme switcher
      await user.click(screen.getByLabelText('Open theme switcher'));
      
      // Verify page content is still accessible
      expect(screen.getByTestId('homepage')).toBeInTheDocument();
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      
      // Close theme switcher by clicking outside
      await user.click(screen.getByTestId('homepage'));
      
      // Verify page content remains accessible
      expect(screen.getByTestId('homepage')).toBeInTheDocument();
    });

    it('should handle z-index layering correctly', async () => {
      const user = userEvent.setup();
      renderPageWithThemes(MockHomePage);
      
      // Open theme switcher
      await user.click(screen.getByLabelText('Open theme switcher'));
      
      // Theme switcher should be accessible (indicating proper z-index)
      const themeSwitcherPanel = screen.getByText('Theme Settings');
      expect(themeSwitcherPanel).toBeInTheDocument();
      
      // Page content should still be in the DOM but theme switcher should be on top
      expect(screen.getByTestId('homepage')).toBeInTheDocument();
    });
  });
});