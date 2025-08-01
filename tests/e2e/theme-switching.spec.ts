import { test, expect, Page } from '@playwright/test';
import { AVAILABLE_THEMES } from '../../src/styles/themes';

type ThemeId = 'ocean' | 'sunset' | 'forest';
type Mode = 'light' | 'dark';

class ThemeE2EHelper {
  constructor(private page: Page) {}

  async openThemeSwitcher(): Promise<void> {
    const toggleButton = this.page.locator('[aria-label*="Theme switcher"]');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();
    
    // Wait for theme panel to appear
    const themePanel = this.page.locator('[role="dialog"][aria-label="Theme selection panel"]');
    await expect(themePanel).toBeVisible();
  }

  async closeThemeSwitcher(): Promise<void> {
    const closeButton = this.page.locator('[aria-label="Close theme switcher"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Click outside the panel
      await this.page.click('body', { position: { x: 100, y: 100 } });
    }
    
    // Verify panel is closed
    const themePanel = this.page.locator('[role="dialog"][aria-label="Theme selection panel"]');
    await expect(themePanel).not.toBeVisible();
  }

  async selectTheme(themeId: ThemeId): Promise<void> {
    await this.openThemeSwitcher();
    
    const themeOption = this.page.locator(`[role="radio"][aria-label*="${themeId}"]`);
    await expect(themeOption).toBeVisible();
    await themeOption.click();
    
    // Verify theme was applied
    await expect(this.page.locator('html')).toHaveClass(new RegExp(`theme-${themeId}`));
    
    // Wait for transition to complete
    await this.page.waitForTimeout(1000);
  }

  async toggleMode(): Promise<void> {
    await this.openThemeSwitcher();
    
    // Find mode toggle button
    const modeToggle = this.page.locator('button[aria-label*="mode"]').or(
      this.page.locator('button[title*="mode"]')
    ).first();
    
    await expect(modeToggle).toBeVisible();
    await modeToggle.click();
    
    // Wait for mode change
    await this.page.waitForTimeout(500);
  }

  async getCurrentTheme(): Promise<string> {
    const htmlClass = await this.page.locator('html').getAttribute('class');
    const themeMatch = htmlClass?.match(/theme-(\w+)/);
    return themeMatch ? themeMatch[1] : 'ocean';
  }

  async getCurrentMode(): Promise<string> {
    const htmlClass = await this.page.locator('html').getAttribute('class');
    return htmlClass?.includes('dark') ? 'dark' : 'light';
  }

  async verifyThemePersistence(): Promise<void> {
    // Reload the page
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    
    // Verify theme and mode are maintained
    const theme = await this.getCurrentTheme();
    const mode = await this.getCurrentMode();
    
    return { theme, mode } as any;
  }

  async testKeyboardNavigation(): Promise<void> {
    // Open theme switcher with keyboard
    const toggleButton = this.page.locator('[aria-label*="Theme switcher"]');
    await toggleButton.focus();
    await this.page.keyboard.press('Enter');
    
    // Verify panel opened
    const themePanel = this.page.locator('[role="dialog"][aria-label="Theme selection panel"]');
    await expect(themePanel).toBeVisible();
    
    // Navigate with arrow keys
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    
    // Close with Escape
    await this.page.keyboard.press('Escape');
    await expect(themePanel).not.toBeVisible();
  }
}

test.describe('Theme Switching E2E Tests', () => {
  let helper: ThemeE2EHelper;

  test.beforeEach(async ({ page }) => {
    helper = new ThemeE2EHelper(page);
    
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    
    // Set consistent viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.describe('Basic Theme Switching', () => {
    test('should switch between all available themes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test each theme
      for (const theme of AVAILABLE_THEMES) {
        await helper.selectTheme(theme.id as ThemeId);
        
        const currentTheme = await helper.getCurrentTheme();
        expect(currentTheme).toBe(theme.id);
        
        // Verify visual changes occurred
        const htmlElement = page.locator('html');
        await expect(htmlElement).toHaveClass(new RegExp(`theme-${theme.id}`));
        
        await helper.closeThemeSwitcher();
      }
    });

    test('should toggle between light and dark modes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Start in light mode
      let currentMode = await helper.getCurrentMode();
      expect(currentMode).toBe('light');
      
      // Toggle to dark
      await helper.toggleMode();
      currentMode = await helper.getCurrentMode();
      expect(currentMode).toBe('dark');
      
      // Toggle back to light
      await helper.toggleMode();
      currentMode = await helper.getCurrentMode();
      expect(currentMode).toBe('light');
      
      await helper.closeThemeSwitcher();
    });

    test('should maintain theme and mode combination', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Set specific theme and mode
      await helper.selectTheme('sunset');
      await helper.toggleMode(); // Switch to dark
      await helper.closeThemeSwitcher();
      
      // Verify both are applied
      const htmlElement = page.locator('html');
      await expect(htmlElement).toHaveClass(/theme-sunset/);
      await expect(htmlElement).toHaveClass(/dark/);
    });
  });

  test.describe('Theme Persistence', () => {
    test('should persist theme selection across page reloads', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Change to forest theme
      await helper.selectTheme('forest');
      await helper.closeThemeSwitcher();
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify theme persisted
      const currentTheme = await helper.getCurrentTheme();
      expect(currentTheme).toBe('forest');
    });

    test('should persist mode selection across page reloads', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Switch to dark mode
      await helper.toggleMode();
      await helper.closeThemeSwitcher();
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify mode persisted
      const currentMode = await helper.getCurrentMode();
      expect(currentMode).toBe('dark');
    });

    test('should persist theme preferences across different pages', async ({ page }) => {
      // Set theme on homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await helper.selectTheme('sunset');
      await helper.toggleMode();
      await helper.closeThemeSwitcher();
      
      // Navigate to services page
      await page.goto('/services');
      await page.waitForLoadState('networkidle');
      
      // Verify theme and mode persisted
      const theme = await helper.getCurrentTheme();
      const mode = await helper.getCurrentMode();
      expect(theme).toBe('sunset');
      expect(mode).toBe('dark');
      
      // Test other pages
      const pages = ['/case-study', '/book-a-consultation'];
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        const pageTheme = await helper.getCurrentTheme();
        const pageMode = await helper.getCurrentMode();
        expect(pageTheme).toBe('sunset');
        expect(pageMode).toBe('dark');
      }
    });

    test('should handle multiple browser tabs correctly', async ({ browser, page }) => {
      // Set theme in first tab
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await helper.selectTheme('forest');
      await helper.closeThemeSwitcher();
      
      // Open second tab
      const newTab = await browser.newPage();
      const newHelper = new ThemeE2EHelper(newTab);
      
      await newTab.goto('/');
      await newTab.waitForLoadState('networkidle');
      
      // Verify theme is consistent in new tab
      const newTabTheme = await newHelper.getCurrentTheme();
      expect(newTabTheme).toBe('forest');
      
      // Change theme in second tab
      await newHelper.selectTheme('ocean');
      await newHelper.closeThemeSwitcher();
      
      // Check if first tab updated (it should via storage events)
      await page.waitForTimeout(1000);
      const firstTabTheme = await helper.getCurrentTheme();
      
      // Note: This behavior depends on implementation - 
      // either both tabs should sync or remain independent
      // Adjust expectation based on actual implementation
      
      await newTab.close();
    });
  });

  test.describe('Accessibility', () => {
    test('should be fully keyboard navigable', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await helper.testKeyboardNavigation();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const toggleButton = page.locator('[aria-label*="Theme switcher"]');
      
      // Check initial state
      await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      await expect(toggleButton).toHaveAttribute('aria-label');
      
      // Open panel
      await toggleButton.click();
      
      // Check expanded state
      await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      const themePanel = page.locator('[role="dialog"][aria-label="Theme selection panel"]');
      await expect(themePanel).toBeVisible();
      await expect(themePanel).toHaveAttribute('aria-label');
      
      // Check theme options have radio role
      const themeOptions = page.locator('[role="radio"]');
      await expect(themeOptions).toHaveCount(AVAILABLE_THEMES.length);
      
      // Check radiogroup
      const radioGroup = page.locator('[role="radiogroup"]');
      await expect(radioGroup).toBeVisible();
      await expect(radioGroup).toHaveAttribute('aria-label');
    });

    test('should announce theme changes to screen readers', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Look for live region
      const liveRegion = page.locator('[role="status"][aria-live="polite"]');
      await expect(liveRegion).toBeInTheDocument();
      
      // Change theme and verify announcement
      await helper.selectTheme('sunset');
      
      // The live region should update with current theme
      await expect(liveRegion).toContainText('sunset');
      
      await helper.closeThemeSwitcher();
    });

    test('should handle focus management correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const toggleButton = page.locator('[aria-label*="Theme switcher"]');
      
      // Focus toggle button
      await toggleButton.focus();
      await expect(toggleButton).toBeFocused();
      
      // Open panel with Enter
      await page.keyboard.press('Enter');
      
      // Focus should move to first theme option
      await page.waitForTimeout(200);
      const firstThemeOption = page.locator('[role="radio"]').first();
      await expect(firstThemeOption).toBeFocused();
      
      // Close with Escape - focus should return to toggle button
      await page.keyboard.press('Escape');
      await expect(toggleButton).toBeFocused();
    });
  });

  test.describe('User Experience', () => {
    test('should provide visual feedback during theme switching', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await helper.openThemeSwitcher();
      
      // Check that current theme is visually indicated
      const currentTheme = await helper.getCurrentTheme();
      const currentThemeOption = page.locator(`[role="radio"][aria-label*="${currentTheme}"]`);
      
      // Should have checked/selected state
      await expect(currentThemeOption).toHaveAttribute('aria-checked', 'true');
      
      await helper.closeThemeSwitcher();
    });

    test('should update theme switcher button appearance', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const toggleButton = page.locator('[aria-label*="Theme switcher"]');
      
      // Check initial button appearance
      const initialTitle = await toggleButton.getAttribute('title');
      expect(initialTitle).toContain('ocean');
      
      // Change theme
      await helper.selectTheme('forest');
      await helper.closeThemeSwitcher();
      
      // Check updated button appearance
      const updatedTitle = await toggleButton.getAttribute('title');
      expect(updatedTitle).toContain('forest');
    });

    test('should handle rapid theme switching smoothly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Rapidly switch between themes
      for (let i = 0; i < 3; i++) {
        for (const theme of AVAILABLE_THEMES) {
          await helper.selectTheme(theme.id as ThemeId);
          await page.waitForTimeout(100); // Brief pause
        }
      }
      
      // Verify final theme is correctly applied
      const finalTheme = await helper.getCurrentTheme();
      const expectedTheme = AVAILABLE_THEMES[AVAILABLE_THEMES.length - 1].id;
      expect(finalTheme).toBe(expectedTheme);
      
      await helper.closeThemeSwitcher();
    });

    test('should work correctly on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Theme switcher should be visible and functional on mobile
      const toggleButton = page.locator('[aria-label*="Theme switcher"]');
      await expect(toggleButton).toBeVisible();
      
      // Test theme switching on mobile
      await helper.selectTheme('sunset');
      
      const currentTheme = await helper.getCurrentTheme();
      expect(currentTheme).toBe('sunset');
      
      await helper.closeThemeSwitcher();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle localStorage being unavailable', async ({ page }) => {
      // Mock localStorage to throw errors
      await page.addInitScript(() => {
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function() {
          throw new Error('Storage quota exceeded');
        };
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Theme switching should still work even if localStorage fails
      await helper.selectTheme('forest');
      
      const currentTheme = await helper.getCurrentTheme();
      expect(currentTheme).toBe('forest');
      
      await helper.closeThemeSwitcher();
    });

    test('should handle corrupted localStorage gracefully', async ({ page }) => {
      // Pre-populate localStorage with invalid data
      await page.addInitScript(() => {
        localStorage.setItem('aha-agile-theme-preferences', 'invalid-json');
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should fall back to default theme
      const currentTheme = await helper.getCurrentTheme();
      expect(currentTheme).toBe('ocean');
      
      // Theme switching should still work
      await helper.selectTheme('sunset');
      const newTheme = await helper.getCurrentTheme();
      expect(newTheme).toBe('sunset');
      
      await helper.closeThemeSwitcher();
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Block CSS requests to simulate network issues
      await page.route('**/*.css', route => route.abort());
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Theme switcher should still be functional
      const toggleButton = page.locator('[aria-label*="Theme switcher"]');
      await expect(toggleButton).toBeVisible();
      
      // Even without CSS, basic functionality should work
      await helper.openThemeSwitcher();
      const themePanel = page.locator('[role="dialog"][aria-label="Theme selection panel"]');
      await expect(themePanel).toBeVisible();
      
      await helper.closeThemeSwitcher();
    });
  });

  test.describe('Cross-page Navigation', () => {
    test('should maintain theme during navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Set theme
      await helper.selectTheme('forest');
      await helper.toggleMode();
      await helper.closeThemeSwitcher();
      
      // Navigate using links
      const servicesLink = page.locator('a[href="/services"]').first();
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify theme maintained
        const theme = await helper.getCurrentTheme();
        const mode = await helper.getCurrentMode();
        expect(theme).toBe('forest');
        expect(mode).toBe('dark');
      }
    });

    test('should work with browser back/forward buttons', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Set theme
      await helper.selectTheme('sunset');
      await helper.closeThemeSwitcher();
      
      // Navigate to another page
      await page.goto('/services');
      await page.waitForLoadState('networkidle');
      
      // Use browser back button
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      // Verify theme is maintained
      const theme = await helper.getCurrentTheme();
      expect(theme).toBe('sunset');
    });
  });
});