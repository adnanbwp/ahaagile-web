import { test, expect, Page } from '@playwright/test';
import { AVAILABLE_THEMES } from '../../src/styles/themes';

type ThemeId = 'ocean' | 'sunset' | 'forest';
type Mode = 'light' | 'dark';

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

interface ThemeSwitchMetrics {
  switchDuration: number;
  cssLoadTime: number;
  renderTime: number;
  layoutShifts: number;
}

class PerformanceTestHelper {
  constructor(private page: Page) {}

  async getWebVitals(): Promise<PerformanceMetrics> {
    return await this.page.evaluate(() => {
      return new Promise<PerformanceMetrics>((resolve) => {
        const metrics: Partial<PerformanceMetrics> = {};
        
        // Get FCP and LCP
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = (entry as any).startTime;
            }
          }
        }).observe({ type: 'paint', buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            metrics.lcp = (entry as any).startTime;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Get CLS
        new PerformanceObserver((list) => {
          let cls = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          metrics.cls = cls;
        }).observe({ type: 'layout-shift', buffered: true });

        // Get FID (approximated with first-input timing)
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            metrics.fid = (entry as any).processingStart - entry.startTime;
          }
        }).observe({ type: 'first-input', buffered: true });

        // Get Navigation Timing for TTFB
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navEntry) {
          metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
        }

        // Return metrics after a short delay to ensure all observers have fired
        setTimeout(() => {
          resolve({
            lcp: metrics.lcp || 0,
            fid: metrics.fid || 0,
            cls: metrics.cls || 0,
            fcp: metrics.fcp || 0,
            ttfb: metrics.ttfb || 0,
          });
        }, 2000);
      });
    });
  }

  async measureThemeSwitch(themeId: ThemeId): Promise<ThemeSwitchMetrics> {
    const startTime = Date.now();
    
    // Start performance observation
    await this.page.evaluate(() => {
      (window as any).layoutShiftCount = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            (window as any).layoutShiftCount += (entry as any).value;
          }
        }
      }).observe({ type: 'layout-shift' });
    });

    // Click theme switcher
    await this.page.locator('[aria-label*="Theme switcher"]').click();
    
    // Wait for panel to appear
    await this.page.locator('[role="dialog"][aria-label="Theme selection panel"]').waitFor();
    
    const cssLoadStartTime = Date.now();
    
    // Click the theme option
    await this.page.locator(`[role="radio"][aria-label*="${themeId}"]`).click();
    
    // Wait for theme class to be applied
    await this.page.waitForSelector(`html.theme-${themeId}`, { timeout: 5000 });
    
    const renderStartTime = Date.now();
    
    // Wait for transitions to complete
    await this.page.evaluate(() => {
      return Promise.all(
        document.getAnimations().map(animation => animation.finished)
      );
    });
    
    const endTime = Date.now();
    
    // Get layout shift count
    const layoutShifts = await this.page.evaluate(() => (window as any).layoutShiftCount || 0);
    
    return {
      switchDuration: endTime - startTime,
      cssLoadTime: renderStartTime - cssLoadStartTime,
      renderTime: endTime - renderStartTime,
      layoutShifts,
    };
  }

  async measurePageLoad(): Promise<PerformanceMetrics> {
    const performanceEntries = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        ttfb: entries.responseStart - entries.requestStart,
        domContentLoaded: entries.domContentLoadedEventEnd - entries.navigationStart,
        loadComplete: entries.loadEventEnd - entries.navigationStart,
      };
    });

    const webVitals = await this.getWebVitals();
    
    return {
      ...webVitals,
      ttfb: performanceEntries.ttfb,
    };
  }
}

test.describe('Theme System Performance Tests', () => {
  let helper: PerformanceTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new PerformanceTestHelper(page);
    
    // Set consistent viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.describe('Core Web Vitals with Theme System', () => {
    for (const testPage of [
      { path: '/', name: 'homepage' },
      { path: '/services', name: 'services' },
      { path: '/case-study', name: 'case-study' },
      { path: '/book-a-consultation', name: 'consultation' },
    ]) {
      test(`${testPage.name} - Core Web Vitals baseline`, async ({ page }) => {
        await page.goto(testPage.path);
        await page.waitForLoadState('networkidle');
        
        const metrics = await helper.measurePageLoad();
        
        console.log(`${testPage.name} Performance Metrics:`, metrics);
        
        // Assert Core Web Vitals thresholds
        expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
        expect(metrics.fid).toBeLessThan(100);  // FID < 100ms
        expect(metrics.cls).toBeLessThan(0.1);  // CLS < 0.1
        expect(metrics.ttfb).toBeLessThan(600); // TTFB < 600ms
      });

      test(`${testPage.name} - Performance with theme switching`, async ({ page }) => {
        await page.goto(testPage.path);
        await page.waitForLoadState('networkidle');
        
        // Get baseline metrics
        const baselineMetrics = await helper.measurePageLoad();
        
        // Switch themes and measure impact
        for (const theme of AVAILABLE_THEMES) {
          const switchMetrics = await helper.measureThemeSwitch(theme.id as ThemeId);
          
          console.log(`${testPage.name} - ${theme.id} Switch Metrics:`, switchMetrics);
          
          // Assert theme switch performance
          expect(switchMetrics.switchDuration).toBeLessThan(1000); // Theme switch < 1s
          expect(switchMetrics.cssLoadTime).toBeLessThan(500);     // CSS load < 500ms
          expect(switchMetrics.renderTime).toBeLessThan(300);       // Render < 300ms
          expect(switchMetrics.layoutShifts).toBeLessThan(0.1);     // Minimal layout shift
        }
        
        // Measure final metrics after theme changes
        const finalMetrics = await helper.getWebVitals();
        
        // Ensure Core Web Vitals haven't degraded significantly
        expect(finalMetrics.cls).toBeLessThan(baselineMetrics.cls + 0.05);
      });
    }
  });

  test.describe('Theme Switch Performance Benchmarks', () => {
    test('Theme switching speed benchmarks', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const results: Record<string, ThemeSwitchMetrics[]> = {};
      
      // Measure each theme switch multiple times for consistency
      for (const theme of AVAILABLE_THEMES) {
        results[theme.id] = [];
        
        for (let i = 0; i < 3; i++) {
          const metrics = await helper.measureThemeSwitch(theme.id as ThemeId);
          results[theme.id].push(metrics);
          
          // Reset to ocean theme for consistent starting point
          if (theme.id !== 'ocean') {
            await helper.measureThemeSwitch('ocean');
          }
        }
      }
      
      // Calculate averages and assert performance
      for (const [themeId, measurements] of Object.entries(results)) {
        const avgSwitchDuration = measurements.reduce((sum, m) => sum + m.switchDuration, 0) / measurements.length;
        const avgCssLoadTime = measurements.reduce((sum, m) => sum + m.cssLoadTime, 0) / measurements.length;
        const avgRenderTime = measurements.reduce((sum, m) => sum + m.renderTime, 0) / measurements.length;
        
        console.log(`${themeId} Average Performance:`, {
          switchDuration: avgSwitchDuration,
          cssLoadTime: avgCssLoadTime,
          renderTime: avgRenderTime,
        });
        
        // Performance assertions
        expect(avgSwitchDuration).toBeLessThan(800);  // Average switch < 800ms
        expect(avgCssLoadTime).toBeLessThan(400);     // Average CSS load < 400ms
        expect(avgRenderTime).toBeLessThan(250);      // Average render < 250ms
      }
    });

    test('Memory usage during theme switching', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        } : { usedJSHeapSize: 0, totalJSHeapSize: 0 };
      });
      
      console.log('Initial Memory:', initialMemory);
      
      // Switch through all themes
      for (const theme of AVAILABLE_THEMES) {
        await helper.measureThemeSwitch(theme.id as ThemeId);
        
        // Measure memory after each switch
        const currentMemory = await page.evaluate(() => {
          return (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          } : { usedJSHeapSize: 0, totalJSHeapSize: 0 };
        });
        
        console.log(`Memory after ${theme.id}:`, currentMemory);
        
        // Check for memory leaks (heap shouldn't grow excessively)
        if (initialMemory.usedJSHeapSize > 0) {
          const memoryGrowth = currentMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
          const growthPercentage = (memoryGrowth / initialMemory.usedJSHeapSize) * 100;
          
          // Memory growth should be reasonable (< 50% increase)
          expect(growthPercentage).toBeLessThan(50);
        }
      }
    });
  });

  test.describe('Performance under load', () => {
    test('Theme switching performance with multiple rapid switches', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const rapidSwitchTimes: number[] = [];
      
      // Perform rapid theme switches
      for (let i = 0; i < 10; i++) {
        const themeIndex = i % AVAILABLE_THEMES.length;
        const theme = AVAILABLE_THEMES[themeIndex];
        
        const startTime = Date.now();
        await helper.measureThemeSwitch(theme.id as ThemeId);
        const endTime = Date.now();
        
        rapidSwitchTimes.push(endTime - startTime);
      }
      
      // Calculate performance statistics
      const avgTime = rapidSwitchTimes.reduce((sum, time) => sum + time, 0) / rapidSwitchTimes.length;
      const maxTime = Math.max(...rapidSwitchTimes);
      const minTime = Math.min(...rapidSwitchTimes);
      
      console.log('Rapid Switch Performance:', {
        average: avgTime,
        maximum: maxTime,
        minimum: minTime,
        times: rapidSwitchTimes,
      });
      
      // Performance shouldn't degrade significantly with rapid switches
      expect(avgTime).toBeLessThan(1200);  // Average still reasonable
      expect(maxTime).toBeLessThan(2000);  // No switch should take > 2s
      
      // Performance consistency - max shouldn't be more than 3x average
      expect(maxTime).toBeLessThan(avgTime * 3);
    });

    test('Performance on low-end device simulation', async ({ page }) => {
      // Simulate low-end device with CPU throttling
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 }); // 4x slower CPU
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const throttledMetrics = await helper.measureThemeSwitch('sunset');
      
      console.log('Throttled Device Performance:', throttledMetrics);
      
      // Performance should still be acceptable on low-end devices
      expect(throttledMetrics.switchDuration).toBeLessThan(3000); // 3s max on slow device
      expect(throttledMetrics.renderTime).toBeLessThan(1000);     // 1s render max
      expect(throttledMetrics.layoutShifts).toBeLessThan(0.15);   // Slightly higher CLS allowed
      
      // Disable throttling
      await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    });
  });

  test.describe('Animation and transition performance', () => {
    test('CSS transition performance', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Enable transitions for this test
      await page.addStyleTag({
        content: `
          :root {
            --theme-transition-duration: 0.3s;
          }
          * {
            transition: color var(--theme-transition-duration) ease-in-out,
                       background-color var(--theme-transition-duration) ease-in-out,
                       border-color var(--theme-transition-duration) ease-in-out,
                       box-shadow var(--theme-transition-duration) ease-in-out;
          }
        `
      });
      
      // Start recording performance
      await page.evaluate(() => {
        (window as any).animationFrames = [];
        const startTime = performance.now();
        
        function recordFrame() {
          const currentTime = performance.now();
          (window as any).animationFrames.push(currentTime - startTime);
          if ((window as any).recording) {
            requestAnimationFrame(recordFrame);
          }
        }
        
        (window as any).recording = true;
        requestAnimationFrame(recordFrame);
      });
      
      // Perform theme switch with transitions
      await helper.measureThemeSwitch('forest');
      
      // Stop recording and analyze
      const frameData = await page.evaluate(() => {
        (window as any).recording = false;
        return (window as any).animationFrames || [];
      });
      
      // Calculate frame rate
      if (frameData.length > 1) {
        const totalDuration = frameData[frameData.length - 1];
        const frameCount = frameData.length;
        const avgFps = (frameCount / totalDuration) * 1000;
        
        console.log('Animation Performance:', {
          totalDuration,
          frameCount,
          averageFps: avgFps,
        });
        
        // Should maintain at least 30 FPS during transitions
        expect(avgFps).toBeGreaterThan(30);
      }
    });
  });

  test.describe('Network performance impact', () => {
    test('CSS loading performance', async ({ page }) => {
      // Monitor network requests
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('.css') || request.url().includes('theme')) {
          requests.push(request.url());
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      console.log('Initial CSS requests:', requests);
      const initialRequestCount = requests.length;
      
      // Switch themes and monitor additional requests
      for (const theme of AVAILABLE_THEMES) {
        await helper.measureThemeSwitch(theme.id as ThemeId);
      }
      
      const finalRequestCount = requests.length;
      const additionalRequests = finalRequestCount - initialRequestCount;
      
      console.log('Additional CSS requests after theme switches:', additionalRequests);
      console.log('All requests:', requests);
      
      // Theme switching shouldn't cause excessive network requests
      expect(additionalRequests).toBeLessThan(10); // Reasonable limit for dynamic loading
    });
  });
});