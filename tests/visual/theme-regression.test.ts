import { test, expect, type Page } from '@playwright/test';

// Theme configurations for testing
const THEMES = [
  { id: 'ocean', name: 'Ocean' },
  { id: 'sunset', name: 'Sunset' },
  { id: 'forest', name: 'Forest' }
] as const;

const MODES = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' }
] as const;

// Helper function to switch theme
async function switchTheme(page: Page, themeName: string) {
  // Open theme switcher
  await page.click('[aria-label="Open theme switcher"]');
  
  // Wait for theme switcher to be visible
  await page.waitForSelector('text=Theme Settings');
  
  // Click on the desired theme
  await page.click(`[aria-label*="Select ${themeName} theme"]`);
  
  // Wait for theme to be applied
  await page.waitForTimeout(500);
}

// Helper function to toggle mode
async function toggleMode(page: Page, modeName: string) {
  // Open theme switcher if not already open
  const themeSwitcherOpen = await page.isVisible('text=Theme Settings');
  if (!themeSwitcherOpen) {
    await page.click('[aria-label="Open theme switcher"]');
    await page.waitForSelector('text=Theme Settings');
  }
  
  // Click mode toggle to switch to desired mode
  const currentModeButton = await page.locator('[aria-label*="Switch to"]').first();
  const currentModeText = await currentModeButton.getAttribute('aria-label');
  
  if (
    (modeName === 'dark' && currentModeText?.includes('dark')) ||
    (modeName === 'light' && currentModeText?.includes('light'))
  ) {
    await currentModeButton.click();
    await page.waitForTimeout(500);
  }
}

test.describe('Theme Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test.describe('Homepage Visual Tests', () => {
    THEMES.forEach(theme => {
      MODES.forEach(mode => {
        test(`should render homepage with ${theme.name} theme in ${mode.name} mode`, async ({ page }) => {
          await switchTheme(page, theme.name);
          await toggleMode(page, mode.name);
          
          // Close theme switcher for clean screenshot
          await page.click('body');
          await page.waitForTimeout(300);
          
          // Take full page screenshot
          await expect(page).toHaveScreenshot(
            `homepage-${theme.id}-${mode.id}.png`,
            { 
              fullPage: true,
              animations: 'disabled'
            }
          );
        });
      });
    });

    test('should capture hero section across all themes', async ({ page }) => {
      const heroSection = page.locator('[data-testid="hero-section"]').first();
      
      for (const theme of THEMES) {
        await switchTheme(page, theme.name);
        
        // Close theme switcher
        await page.click('body');
        await page.waitForTimeout(300);
        
        // Screenshot hero section
        await expect(heroSection).toHaveScreenshot(
          `hero-section-${theme.id}.png`,
          { animations: 'disabled' }
        );
      }
    });
  });

  test.describe('Services Page Visual Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/services');
      await page.waitForLoadState('networkidle');
    });

    THEMES.forEach(theme => {
      test(`should render services page with ${theme.name} theme`, async ({ page }) => {
        await switchTheme(page, theme.name);
        
        // Close theme switcher
        await page.click('body');
        await page.waitForTimeout(300);
        
        await expect(page).toHaveScreenshot(
          `services-${theme.id}.png`,
          { 
            fullPage: true,
            animations: 'disabled'
          }
        );
      });
    });
  });

  test.describe('Component Visual Tests', () => {
    test('should capture header component with all themes', async ({ page }) => {
      const header = page.locator('header[role="banner"]');
      
      for (const theme of THEMES) {
        await switchTheme(page, theme.name);
        
        // Close theme switcher
        await page.click('body');
        await page.waitForTimeout(300);
        
        await expect(header).toHaveScreenshot(
          `header-${theme.id}.png`,
          { animations: 'disabled' }
        );
      }
    });

    test('should capture footer component with all themes', async ({ page }) => {
      const footer = page.locator('footer[role="contentinfo"]');
      
      for (const theme of THEMES) {
        await switchTheme(page, theme.name);
        
        // Close theme switcher
        await page.click('body');
        await page.waitForTimeout(300);
        
        await expect(footer).toHaveScreenshot(
          `footer-${theme.id}.png`,
          { animations: 'disabled' }
        );
      }
    });
  });

  test.describe('Theme Switcher Visual Tests', () => {
    test('should capture theme switcher collapsed state', async ({ page }) => {
      const themeSwitcher = page.locator('[aria-label="Open theme switcher"]');
      
      await expect(themeSwitcher).toHaveScreenshot(
        'theme-switcher-collapsed.png',
        { animations: 'disabled' }
      );
    });

    test('should capture theme switcher expanded state', async ({ page }) => {
      // Open theme switcher
      await page.click('[aria-label="Open theme switcher"]');
      await page.waitForSelector('text=Theme Settings');
      
      const expandedSwitcher = page.locator('text=Theme Settings').locator('..');
      
      await expect(expandedSwitcher).toHaveScreenshot(
        'theme-switcher-expanded.png',
        { animations: 'disabled' }
      );
    });

    test('should capture theme preview colors', async ({ page }) => {
      await page.click('[aria-label="Open theme switcher"]');
      await page.waitForSelector('text=Theme Settings');
      
      const themePreviewGrid = page.locator('[role="radiogroup"][aria-label="Theme selection"]');
      
      await expect(themePreviewGrid).toHaveScreenshot(
        'theme-previews.png',
        { animations: 'disabled' }
      );
    });
  });

  test.describe('Responsive Visual Tests', () => {
    test('should capture mobile view with themes', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      
      for (const theme of THEMES) {
        await switchTheme(page, theme.name);
        
        // Close theme switcher
        await page.click('body');
        await page.waitForTimeout(300);
        
        await expect(page).toHaveScreenshot(
          `mobile-${theme.id}.png`,
          { 
            fullPage: true,
            animations: 'disabled'
          }
        );
      }
    });

    test('should capture tablet view with themes', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
      
      for (const theme of THEMES) {
        await switchTheme(page, theme.name);
        
        // Close theme switcher
        await page.click('body');
        await page.waitForTimeout(300);
        
        await expect(page).toHaveScreenshot(
          `tablet-${theme.id}.png`,
          { 
            fullPage: true,
            animations: 'disabled'
          }
        );
      }
    });
  });

  test.describe('Interaction Visual Tests', () => {
    test('should capture hover states with different themes', async ({ page }) => {
      // Test button hover states
      const ctaButton = page.locator('a[href*="consultation"]').first();
      
      for (const theme of THEMES) {
        await switchTheme(page, theme.name);
        
        // Close theme switcher
        await page.click('body');
        await page.waitForTimeout(300);
        
        // Hover over CTA button
        await ctaButton.hover();
        await page.waitForTimeout(100);
        
        await expect(ctaButton).toHaveScreenshot(
          `cta-hover-${theme.id}.png`,
          { animations: 'disabled' }
        );
      }
    });

    test('should capture focus states with different themes', async ({ page }) => {
      const navigationLinks = page.locator('nav a').first();
      
      for (const theme of THEMES) {
        await switchTheme(page, theme.name);
        
        // Close theme switcher
        await page.click('body');
        await page.waitForTimeout(300);
        
        // Focus on navigation link
        await navigationLinks.focus();
        await page.waitForTimeout(100);
        
        await expect(navigationLinks).toHaveScreenshot(
          `nav-focus-${theme.id}.png`,
          { animations: 'disabled' }
        );
      }
    });
  });

  test.describe('Animation and Transition Tests', () => {
    test('should capture theme switching transition', async ({ page }) => {
      // Enable animations for this test
      await page.click('[aria-label="Open theme switcher"]');
      await page.waitForSelector('text=Theme Settings');
      
      // Start with Ocean theme
      await page.click('[aria-label*="Select Ocean theme"]');
      await page.waitForTimeout(200);
      
      // Capture mid-transition to Sunset theme
      await page.click('[aria-label*="Select Sunset theme"]');
      await page.waitForTimeout(100); // Capture during transition
      
      await expect(page).toHaveScreenshot(
        'theme-transition-mid.png',
        { 
          fullPage: true,
          threshold: 0.5 // Allow more variance due to transition
        }
      );
    });
  });
});

test.describe('Theme Consistency Tests', () => {
  test('should maintain visual consistency across page navigation', async ({ page }) => {
    // Set Sunset theme
    await page.goto('/');
    await switchTheme(page, 'Sunset');
    
    // Navigate to different pages and ensure theme persists
    const pages = ['/services', '/case-study', '/book-a-consultation'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Close theme switcher if visible
      await page.click('body');
      await page.waitForTimeout(300);
      
      const pageName = pagePath.replace('/', '').replace('-', '_') || 'home';
      
      await expect(page).toHaveScreenshot(
        `consistency-sunset-${pageName}.png`,
        { 
          fullPage: true,
          animations: 'disabled'
        }
      );
    }
  });
});