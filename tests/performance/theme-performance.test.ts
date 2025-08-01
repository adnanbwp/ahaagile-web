import { test, expect, type Page } from '@playwright/test';

// Performance thresholds based on Core Web Vitals standards
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint - 2.5s
  FID: 100,  // First Input Delay - 100ms
  CLS: 0.1,  // Cumulative Layout Shift - 0.1
  TTFB: 600, // Time to First Byte - 600ms
  THEME_SWITCH_TIME: 300, // Custom threshold for theme switching - 300ms
};

// Helper function to measure theme switching performance
async function measureThemeSwitchTime(page: Page, themeName: string): Promise<number> {
  const startTime = Date.now();
  
  // Open theme switcher
  await page.click('[aria-label="Open theme switcher"]');
  await page.waitForSelector('text=Theme Settings');
  
  // Click theme and measure time until visual change
  await page.click(`[aria-label*="Select ${themeName} theme"]`);
  
  // Wait for CSS transition to complete
  await page.waitForTimeout(200);
  
  const endTime = Date.now();
  return endTime - startTime;
}

// Helper function to get Core Web Vitals
async function getCoreWebVitals(page: Page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics: any = {};
      
      // Get LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.LCP = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Get FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.FID = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });
      
      // Get CLS
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
      
      // Get TTFB
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
      }
      
      // Resolve after a short delay to collect metrics
      setTimeout(() => resolve(metrics), 1000);
    });
  });
}

test.describe('Theme System Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Core Web Vitals with Theme System', () => {
    test('should maintain LCP under 2.5s with default theme', async ({ page }) => {
      const metrics = await getCoreWebVitals(page);
      
      expect(metrics.LCP).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP);
      console.log(`LCP with default theme: ${metrics.LCP}ms`);
    });

    test('should maintain TTFB under 600ms', async ({ page }) => {
      const metrics = await getCoreWebVitals(page);
      
      expect(metrics.TTFB).toBeLessThan(PERFORMANCE_THRESHOLDS.TTFB);
      console.log(`TTFB: ${metrics.TTFB}ms`);
    });

    test('should maintain CLS under 0.1 during theme switches', async ({ page }) => {
      // Measure CLS before theme switch
      const initialMetrics = await getCoreWebVitals(page);
      
      // Switch theme
      await measureThemeSwitchTime(page, 'Sunset');
      
      // Measure CLS after theme switch
      const finalMetrics = await getCoreWebVitals(page);
      
      expect(finalMetrics.CLS).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS);
      console.log(`CLS after theme switch: ${finalMetrics.CLS}`);
    });
  });

  test.describe('Theme Switching Performance', () => {
    const themes = ['Ocean', 'Sunset', 'Forest'];

    themes.forEach(theme => {
      test(`should switch to ${theme} theme within performance threshold`, async ({ page }) => {
        const switchTime = await measureThemeSwitchTime(page, theme);
        
        expect(switchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME);
        console.log(`${theme} theme switch time: ${switchTime}ms`);
      });
    });

    test('should handle rapid theme switching without performance degradation', async ({ page }) => {
      const switchTimes: number[] = [];
      
      // Rapidly switch between themes
      for (const theme of themes) {
        const switchTime = await measureThemeSwitchTime(page, theme);
        switchTimes.push(switchTime);
        
        // Small delay between switches to simulate user behavior
        await page.waitForTimeout(100);
      }
      
      // Check that performance doesn't degrade with rapid switching
      const averageSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
      const maxSwitchTime = Math.max(...switchTimes);
      
      expect(averageSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME);
      expect(maxSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME * 1.5);
      
      console.log(`Average switch time: ${averageSwitchTime}ms`);
      console.log(`Max switch time: ${maxSwitchTime}ms`);
    });
  });

  test.describe('Mode Toggle Performance', () => {
    test('should toggle between light and dark modes efficiently', async ({ page }) => {
      await page.click('[aria-label="Open theme switcher"]');
      await page.waitForSelector('text=Theme Settings');
      
      // Measure dark mode switch
      const darkModeStart = Date.now();
      await page.click('[aria-label*="Switch to dark mode"]');
      await page.waitForTimeout(200);
      const darkModeSwitchTime = Date.now() - darkModeStart;
      
      // Measure light mode switch
      const lightModeStart = Date.now();
      await page.click('[aria-label*="Switch to light mode"]');
      await page.waitForTimeout(200);
      const lightModeSwitchTime = Date.now() - lightModeStart;
      
      expect(darkModeSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME);
      expect(lightModeSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME);
      
      console.log(`Dark mode switch: ${darkModeSwitchTime}ms`);
      console.log(`Light mode switch: ${lightModeSwitchTime}ms`);
    });
  });

  test.describe('Memory Usage and Resource Impact', () => {
    test('should not cause memory leaks during theme switching', async ({ page }) => {
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });
      
      // Perform multiple theme switches
      const themes = ['Ocean', 'Sunset', 'Forest'];
      for (let i = 0; i < 10; i++) {
        for (const theme of themes) {
          await measureThemeSwitchTime(page, theme);
          await page.waitForTimeout(50);
        }
      }
      
      // Force garbage collection if available
      await page.evaluate(() => {
        if ('gc' in window) {
          (window as any).gc();
        }
      });
      
      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });
      
      // Memory should not increase significantly (allow 50% increase)
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = (finalMemory - initialMemory) / initialMemory;
        expect(memoryIncrease).toBeLessThan(0.5);
        
        console.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Memory increase: ${(memoryIncrease * 100).toFixed(2)}%`);
      }
    });

    test('should efficiently load theme CSS resources', async ({ page }) => {
      // Monitor network requests
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('.css') || request.url().includes('theme')) {
          requests.push(request.url());
        }
      });
      
      // Switch to different themes
      await measureThemeSwitchTime(page, 'Sunset');
      await measureThemeSwitchTime(page, 'Forest');
      await measureThemeSwitchTime(page, 'Ocean');
      
      // Check that we're not making excessive CSS requests
      const cssRequests = requests.filter(url => url.includes('.css'));
      console.log(`CSS requests during theme switching: ${cssRequests.length}`);
      console.log('CSS requests:', cssRequests);
      
      // Should not load new CSS files for theme switching (themes should be in existing CSS)
      expect(cssRequests.length).toBeLessThan(5);
    });
  });

  test.describe('Device-Specific Performance', () => {
    test('should perform well on mobile devices', async ({ page }) => {
      // Simulate mobile device performance
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test theme switching on mobile
      const mobileSwitchTime = await measureThemeSwitchTime(page, 'Forest');
      
      // Mobile should still be within threshold (allow slightly more time)
      expect(mobileSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME * 1.5);
      console.log(`Mobile theme switch time: ${mobileSwitchTime}ms`);
    });

    test('should respect reduced motion preferences', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Theme switching should still work but potentially faster due to reduced animations
      const reducedMotionSwitchTime = await measureThemeSwitchTime(page, 'Sunset');
      
      expect(reducedMotionSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME);
      console.log(`Reduced motion switch time: ${reducedMotionSwitchTime}ms`);
    });
  });

  test.describe('Concurrent User Interactions', () => {
    test('should handle theme switching during page interactions', async ({ page }) => {
      // Start a page interaction (scrolling)
      const scrollPromise = page.evaluate(() => {
        return new Promise((resolve) => {
          let scrollCount = 0;
          const scrollInterval = setInterval(() => {
            window.scrollBy(0, 100);
            scrollCount++;
            if (scrollCount >= 10) {
              clearInterval(scrollInterval);
              resolve(scrollCount);
            }
          }, 50);
        });
      });
      
      // Switch theme while scrolling
      await page.waitForTimeout(100);
      const switchTime = await measureThemeSwitchTime(page, 'Ocean');
      
      // Wait for scrolling to complete
      await scrollPromise;
      
      // Theme switch should still be performant
      expect(switchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME * 2);
      console.log(`Theme switch during scrolling: ${switchTime}ms`);
    });
  });
});

test.describe('Performance Monitoring and Alerts', () => {
  test('should log performance metrics for monitoring', async ({ page }) => {
    const performanceLog: any[] = [];
    
    // Monitor console messages for performance data
    page.on('console', (msg) => {
      if (msg.text().includes('performance') || msg.text().includes('theme')) {
        performanceLog.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: Date.now()
        });
      }
    });
    
    // Perform theme operations
    await measureThemeSwitchTime(page, 'Sunset');
    await measureThemeSwitchTime(page, 'Forest');
    
    // Log collected performance data
    console.log('Performance log entries:', performanceLog.length);
    performanceLog.forEach(entry => {
      console.log(`[${entry.type}] ${entry.text}`);
    });
  });
});