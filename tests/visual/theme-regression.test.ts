import { test, expect, Page, BrowserContext } from '@playwright/test';
import { AVAILABLE_THEMES } from '../../src/styles/themes';

type ThemeId = 'ocean' | 'sunset' | 'forest';
type Mode = 'light' | 'dark';

// Test configuration
const TEST_PAGES = [
  { path: '/', name: 'homepage' },
  { path: '/services', name: 'services' },
  { path: '/case-study', name: 'case-study' },
  { path: '/book-a-consultation', name: 'consultation' },
];

const VIEWPORT_SIZES = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 375, height: 667, name: 'mobile' },
];

class ThemeTestHelper {
  constructor(private page: Page) {}

  async switchTheme(themeId: ThemeId): Promise<void> {
    // Click the theme switcher button
    await this.page.locator('[aria-label*="Theme switcher"]').click();
    
    // Wait for the theme panel to appear
    await this.page.locator('[role="dialog"][aria-label="Theme selection panel"]').waitFor();
    
    // Click the specific theme option
    await this.page.locator(`[role="radio"][aria-label*="${themeId}"]`).click();
    
    // Wait for theme transition to complete
    await this.page.waitForTimeout(1000);
    
    // Verify theme was applied
    await expect(this.page.locator('html')).toHaveClass(new RegExp(`theme-${themeId}`));
  }

  async switchMode(mode: Mode): Promise<void> {
    // Open theme switcher if not already open
    const themePanel = this.page.locator('[role="dialog"][aria-label="Theme selection panel"]');
    const isVisible = await themePanel.isVisible();
    
    if (!isVisible) {
      await this.page.locator('[aria-label*="Theme switcher"]').click();
      await themePanel.waitFor();
    }
    
    // Find and click the mode toggle
    const modeToggle = this.page.locator('button[aria-label*="mode"]').or(
      this.page.locator('button[title*="mode"]')
    );
    
    if (await modeToggle.count() > 0) {
      await modeToggle.click();
      await this.page.waitForTimeout(500);
    }
    
    // Verify mode was applied
    if (mode === 'dark') {
      await expect(this.page.locator('html')).toHaveClass(/dark/);
    } else {
      await expect(this.page.locator('html')).not.toHaveClass(/dark/);
    }
  }

  async closeThemeSwitcher(): Promise<void> {
    const closeButton = this.page.locator('[aria-label="Close theme switcher"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async waitForThemeTransition(): Promise<void> {
    // Wait for CSS transitions to complete
    await this.page.waitForTimeout(1000);
    
    // Wait for any pending animations
    await this.page.evaluate(() => {
      return Promise.all(
        document.getAnimations().map(animation => animation.finished)
      );
    });
  }
}

test.describe('Visual Regression Tests - Theme System', () => {
  let helper: ThemeTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new ThemeTestHelper(page);
    
    // Set default viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Reduce animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
        }
      `
    });
  });

  for (const testPage of TEST_PAGES) {
    test.describe(`${testPage.name} page`, () => {
      for (const viewport of VIEWPORT_SIZES) {
        test.describe(`${viewport.name} viewport`, () => {
          for (const theme of AVAILABLE_THEMES) {
            for (const mode of ['light', 'dark'] as Mode[]) {
              test(`${theme.id} theme - ${mode} mode`, async ({ page }) => {
                // Set viewport
                await page.setViewportSize({ 
                  width: viewport.width, 
                  height: viewport.height 
                });

                // Navigate to page
                await page.goto(testPage.path);
                
                // Wait for page to load completely
                await page.waitForLoadState('networkidle');
                
                // Switch to the specified theme
                await helper.switchTheme(theme.id as ThemeId);
                
                // Switch to the specified mode
                await helper.switchMode(mode);
                
                // Close theme switcher
                await helper.closeThemeSwitcher();
                
                // Wait for theme transitions to complete
                await helper.waitForThemeTransition();
                
                // Take full page screenshot
                const screenshotName = `${testPage.name}-${viewport.name}-${theme.id}-${mode}`;
                await expect(page).toHaveScreenshot(`${screenshotName}.png`, {
                  fullPage: true,
                  threshold: 0.2, // Allow minor differences
                  maxDiffPixels: 1000,
                });
              });
            }
          }
        });
      }
    });
  }

  test.describe('Component-specific visual tests', () => {
    test('Header component across all themes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      for (const theme of AVAILABLE_THEMES) {
        for (const mode of ['light', 'dark'] as Mode[]) {
          await helper.switchTheme(theme.id as ThemeId);
          await helper.switchMode(mode);
          await helper.closeThemeSwitcher();
          await helper.waitForThemeTransition();

          // Screenshot just the header
          const header = page.locator('header');
          await expect(header).toHaveScreenshot(
            `header-${theme.id}-${mode}.png`,
            { threshold: 0.1 }
          );
        }
      }
    });

    test('Footer component across all themes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      for (const theme of AVAILABLE_THEMES) {
        for (const mode of ['light', 'dark'] as Mode[]) {
          await helper.switchTheme(theme.id as ThemeId);
          await helper.switchMode(mode);
          await helper.closeThemeSwitcher();
          await helper.waitForThemeTransition();

          // Screenshot just the footer
          const footer = page.locator('footer');
          await expect(footer).toHaveScreenshot(
            `footer-${theme.id}-${mode}.png`,
            { threshold: 0.1 }
          );
        }
      }
    });

    test('Theme switcher component states', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Collapsed state
      await expect(page.locator('[aria-label*="Theme switcher"]')).toHaveScreenshot(
        'theme-switcher-collapsed.png'
      );

      // Expanded state
      await page.locator('[aria-label*="Theme switcher"]').click();
      await page.locator('[role="dialog"][aria-label="Theme selection panel"]').waitFor();
      
      await expect(page.locator('[role="dialog"][aria-label="Theme selection panel"]')).toHaveScreenshot(
        'theme-switcher-expanded.png',
        { threshold: 0.1 }
      );
    });

    test('Button components visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find primary buttons on the page
      const buttons = page.locator('button, .btn, [role="button"]').first();
      
      for (const theme of AVAILABLE_THEMES) {
        for (const mode of ['light', 'dark'] as Mode[]) {
          await helper.switchTheme(theme.id as ThemeId);
          await helper.switchMode(mode);
          await helper.closeThemeSwitcher();
          await helper.waitForThemeTransition();

          await expect(buttons).toHaveScreenshot(
            `button-${theme.id}-${mode}.png`,
            { threshold: 0.1 }
          );
        }
      }
    });
  });

  test.describe('Theme transition visual tests', () => {
    test('Theme switching visual smoothness', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Enable transitions for this test
      await page.addStyleTag({
        content: `
          * {
            animation-duration: 0.3s !important;
            transition-duration: 0.3s !important;
          }
        `
      });

      // Take screenshot before theme change
      await expect(page).toHaveScreenshot('theme-transition-before.png', {
        fullPage: true,
        threshold: 0.1
      });

      // Switch theme
      await helper.switchTheme('sunset');
      
      // Take screenshot after theme change
      await expect(page).toHaveScreenshot('theme-transition-after.png', {
        fullPage: true,
        threshold: 0.1
      });
    });

    test('Mode toggle visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test light to dark transition
      await expect(page).toHaveScreenshot('mode-light.png', {
        fullPage: true,
        threshold: 0.1
      });

      await helper.switchMode('dark');
      await helper.closeThemeSwitcher();
      
      await expect(page).toHaveScreenshot('mode-dark.png', {
        fullPage: true,
        threshold: 0.1
      });
    });
  });

  test.describe('Cross-browser compatibility', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`Theme rendering consistency - ${browserName}`, async ({ page }) => {
        // This test would need to be run with different browser configurations
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await helper.switchTheme('ocean');
        await helper.closeThemeSwitcher();
        await helper.waitForThemeTransition();

        await expect(page).toHaveScreenshot(`cross-browser-${browserName}.png`, {
          fullPage: true,
          threshold: 0.3 // Allow more variation for cross-browser differences
        });
      });
    });
  });

  test.describe('Responsive design validation', () => {
    test('Theme consistency across breakpoints', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const breakpoints = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 375, height: 667, name: 'mobile-medium' },
        { width: 414, height: 896, name: 'mobile-large' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1024, height: 768, name: 'tablet-landscape' },
        { width: 1280, height: 720, name: 'desktop-small' },
        { width: 1920, height: 1080, name: 'desktop-large' },
      ];

      for (const breakpoint of breakpoints) {
        await page.setViewportSize({
          width: breakpoint.width,
          height: breakpoint.height
        });

        await helper.switchTheme('ocean');
        await helper.closeThemeSwitcher();
        await helper.waitForThemeTransition();

        await expect(page).toHaveScreenshot(`responsive-${breakpoint.name}.png`, {
          fullPage: true,
          threshold: 0.2
        });
      }
    });
  });
});