import { test, expect, type Page } from '@playwright/test';

// Helper functions for theme testing
async function openThemeSwitcher(page: Page) {
  await page.click('[aria-label="Open theme switcher"]');
  await page.waitForSelector('text=Theme Settings', { timeout: 5000 });
}

async function selectTheme(page: Page, themeName: string) {
  await page.click(`[aria-label*="Select ${themeName} theme"]`);
  await page.waitForTimeout(300); // Allow for theme transition
}

async function toggleMode(page: Page) {
  const modeButton = page.locator('[aria-label*="Switch to"]').first();
  await modeButton.click();
  await page.waitForTimeout(300); // Allow for mode transition
}

async function closeThemeSwitcher(page: Page) {
  await page.click('body');
  await page.waitForTimeout(200);
}

test.describe('End-to-End Theme Switching Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Theme Switcher Visibility and Access', () => {
    test('should show theme switcher in development environment', async ({ page }) => {
      // Theme switcher should be visible by default in development
      await expect(page.locator('[aria-label="Open theme switcher"]')).toBeVisible();
    });

    test('should open and close theme switcher', async ({ page }) => {
      // Open theme switcher
      await openThemeSwitcher(page);
      await expect(page.locator('text=Theme Settings')).toBeVisible();
      
      // Close theme switcher
      await closeThemeSwitcher(page);
      await expect(page.locator('text=Theme Settings')).not.toBeVisible();
    });

    test('should close theme switcher with escape key', async ({ page }) => {
      await openThemeSwitcher(page);
      await expect(page.locator('text=Theme Settings')).toBeVisible();
      
      // Press escape to close
      await page.keyboard.press('Escape');
      await expect(page.locator('text=Theme Settings')).not.toBeVisible();
    });
  });

  test.describe('Theme Selection Workflow', () => {
    test('should switch to Ocean theme', async ({ page }) => {
      await openThemeSwitcher(page);
      await selectTheme(page, 'Ocean');
      
      // Verify Ocean theme is selected
      const oceanButton = page.locator('[aria-label*="Select Ocean theme"]');
      await expect(oceanButton).toHaveAttribute('aria-pressed', 'true');
      
      // Verify theme info shows Ocean
      await expect(page.locator('text=Active:')).toContainText('Ocean');
    });

    test('should switch to Sunset theme', async ({ page }) => {
      await openThemeSwitcher(page);
      await selectTheme(page, 'Sunset');
      
      // Verify Sunset theme is selected
      const sunsetButton = page.locator('[aria-label*="Select Sunset theme"]');
      await expect(sunsetButton).toHaveAttribute('aria-pressed', 'true');
      
      // Verify theme info shows Sunset
      await expect(page.locator('text=Active:')).toContainText('Sunset');
    });

    test('should switch to Forest theme', async ({ page }) => {
      await openThemeSwitcher(page);
      await selectTheme(page, 'Forest');
      
      // Verify Forest theme is selected
      const forestButton = page.locator('[aria-label*="Select Forest theme"]');
      await expect(forestButton).toHaveAttribute('aria-pressed', 'true');
      
      // Verify theme info shows Forest
      await expect(page.locator('text=Active:')).toContainText('Forest');
    });

    test('should switch between multiple themes in sequence', async ({ page }) => {
      const themes = ['Ocean', 'Sunset', 'Forest'];
      
      for (const theme of themes) {
        await openThemeSwitcher(page);
        await selectTheme(page, theme);
        
        // Verify theme is active
        const themeButton = page.locator(`[aria-label*="Select ${theme} theme"]`);
        await expect(themeButton).toHaveAttribute('aria-pressed', 'true');
        
        await closeThemeSwitcher(page);
      }
    });
  });

  test.describe('Light/Dark Mode Toggle', () => {
    test('should toggle from light to dark mode', async ({ page }) => {
      await openThemeSwitcher(page);
      
      // Initially should be in light mode
      await expect(page.locator('[aria-label="Switch to dark mode"]')).toBeVisible();
      
      // Toggle to dark mode
      await toggleMode(page);
      
      // Should now show switch to light mode option
      await expect(page.locator('[aria-label="Switch to light mode"]')).toBeVisible();
      
      // Verify mode info shows dark
      await expect(page.locator('text=Active:')).toContainText('dark');
    });

    test('should toggle back from dark to light mode', async ({ page }) => {
      await openThemeSwitcher(page);
      
      // Switch to dark mode first
      await toggleMode(page);
      await expect(page.locator('[aria-label="Switch to light mode"]')).toBeVisible();
      
      // Switch back to light mode
      await toggleMode(page);
      await expect(page.locator('[aria-label="Switch to dark mode"]')).toBeVisible();
      
      // Verify mode info shows light
      await expect(page.locator('text=Active:')).toContainText('light');
    });

    test('should combine theme and mode selection', async ({ page }) => {
      await openThemeSwitcher(page);
      
      // Select Forest theme
      await selectTheme(page, 'Forest');
      
      // Switch to dark mode
      await toggleMode(page);
      
      // Verify both selections
      await expect(page.locator('[aria-label*="Select Forest theme"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('[aria-label="Switch to light mode"]')).toBeVisible();
      await expect(page.locator('text=Active:')).toContainText('Forest');
      await expect(page.locator('text=Active:')).toContainText('dark');
    });
  });

  test.describe('Theme Persistence Across Sessions', () => {
    test('should persist theme selection across page reloads', async ({ page }) => {
      // Select Sunset theme
      await openThemeSwitcher(page);
      await selectTheme(page, 'Sunset');
      await closeThemeSwitcher(page);
      
      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check that Sunset theme is still active
      await openThemeSwitcher(page);
      const sunsetButton = page.locator('[aria-label*="Select Sunset theme"]');
      await expect(sunsetButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('should persist mode selection across page reloads', async ({ page }) => {
      // Switch to dark mode
      await openThemeSwitcher(page);
      await toggleMode(page);
      await closeThemeSwitcher(page);
      
      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check that dark mode is still active
      await openThemeSwitcher(page);
      await expect(page.locator('[aria-label="Switch to light mode"]')).toBeVisible();
    });

    test('should persist both theme and mode across navigation', async ({ page }) => {
      // Set Forest theme and dark mode
      await openThemeSwitcher(page);
      await selectTheme(page, 'Forest');
      await toggleMode(page);
      await closeThemeSwitcher(page);
      
      // Navigate to different pages
      const pages = ['/services', '/case-study', '/book-a-consultation', '/'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        // Check theme and mode are still active
        await openThemeSwitcher(page);
        await expect(page.locator('[aria-label*="Select Forest theme"]')).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('[aria-label="Switch to light mode"]')).toBeVisible();
        await closeThemeSwitcher(page);
      }
    });
  });

  test.describe('Cross-Page Theme Functionality', () => {
    test('should work on services page', async ({ page }) => {
      await page.goto('/services');
      await page.waitForLoadState('networkidle');
      
      // Theme switcher should be available and functional
      await openThemeSwitcher(page);
      await selectTheme(page, 'Ocean');
      
      const oceanButton = page.locator('[aria-label*="Select Ocean theme"]');
      await expect(oceanButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('should work on case study page', async ({ page }) => {
      await page.goto('/case-study');
      await page.waitForLoadState('networkidle');
      
      // Theme switcher should be available and functional
      await openThemeSwitcher(page);
      await selectTheme(page, 'Sunset');
      
      const sunsetButton = page.locator('[aria-label*="Select Sunset theme"]');
      await expect(sunsetButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('should work on consultation page', async ({ page }) => {
      await page.goto('/book-a-consultation');
      await page.waitForLoadState('networkidle');
      
      // Theme switcher should be available and functional
      await openThemeSwitcher(page);
      await selectTheme(page, 'Forest');
      await toggleMode(page);
      
      const forestButton = page.locator('[aria-label*="Select Forest theme"]');
      await expect(forestButton).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('[aria-label="Switch to light mode"]')).toBeVisible();
    });
  });

  test.describe('Responsive Theme Switcher', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      // Theme switcher should be visible and clickable on mobile
      await expect(page.locator('[aria-label="Open theme switcher"]')).toBeVisible();
      
      await openThemeSwitcher(page);
      await selectTheme(page, 'Sunset');
      
      // On mobile, theme switcher should collapse after selection
      await page.waitForTimeout(500);
      await expect(page.locator('text=Theme Settings')).not.toBeVisible();
      
      // But selection should be persisted
      await openThemeSwitcher(page);
      const sunsetButton = page.locator('[aria-label*="Select Sunset theme"]');
      await expect(sunsetButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      
      await openThemeSwitcher(page);
      await selectTheme(page, 'Forest');
      
      const forestButton = page.locator('[aria-label*="Select Forest theme"]');
      await expect(forestButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation through theme options', async ({ page }) => {
      await openThemeSwitcher(page);
      
      // Tab to first theme option
      await page.keyboard.press('Tab');
      
      // Should be able to use Enter to select theme
      await page.keyboard.press('Enter');
      
      // A theme should become active
      const activeThemes = await page.locator('[aria-pressed="true"]').count();
      expect(activeThemes).toBeGreaterThan(0);
    });

    test('should support space key for theme selection', async ({ page }) => {
      await openThemeSwitcher(page);
      
      // Focus on a theme button
      const oceanButton = page.locator('[aria-label*="Select Ocean theme"]');
      await oceanButton.focus();
      
      // Use space to select
      await page.keyboard.press(' ');
      
      // Ocean theme should be selected
      await expect(oceanButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle corrupted localStorage gracefully', async ({ page }) => {
      // Inject corrupted localStorage data
      await page.evaluate(() => {
        localStorage.setItem('aha-agile-theme-preferences', 'invalid-json-data');
      });
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Theme switcher should still work
      await openThemeSwitcher(page);
      await selectTheme(page, 'Ocean');
      
      const oceanButton = page.locator('[aria-label*="Select Ocean theme"]');
      await expect(oceanButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('should work when localStorage is disabled', async ({ page }) => {
      // Disable localStorage
      await page.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: () => null,
            setItem: () => { throw new Error('Storage disabled'); },
            removeItem: () => {},
            clear: () => {},
          },
          writable: false
        });
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Theme switcher should still function (just not persist)
      await openThemeSwitcher(page);
      await selectTheme(page, 'Sunset');
      
      const sunsetButton = page.locator('[aria-label*="Select Sunset theme"]');
      await expect(sunsetButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Visual Feedback and Transitions', () => {
    test('should show visual feedback when switching themes', async ({ page }) => {
      await openThemeSwitcher(page);
      
      // Get initial state
      const initialTheme = await page.locator('[aria-pressed="true"]').first().getAttribute('aria-label');
      
      // Switch to different theme
      await selectTheme(page, 'Forest');
      
      // Should show active state
      const forestButton = page.locator('[aria-label*="Select Forest theme"]');
      await expect(forestButton).toHaveAttribute('aria-pressed', 'true');
      
      // Should show visual indicator (active dot)
      const activeIndicator = forestButton.locator('.absolute.-top-1.-right-1');
      await expect(activeIndicator).toBeVisible();
    });

    test('should show hover states on theme options', async ({ page }) => {
      await openThemeSwitcher(page);
      
      // Hover over theme option
      const sunsetButton = page.locator('[aria-label*="Select Sunset theme"]');
      await sunsetButton.hover();
      
      // Should have hover styling (check for hover class or styling changes)
      await expect(sunsetButton).toHaveClass(/hover:scale-105/);
    });
  });
});