import { ThemeId, Mode } from './theme-context';

/**
 * Dynamic theme loader utilities for CSS class management and transitions
 */

/**
 * Apply theme classes with smooth transitions
 */
export const applyThemeWithTransition = (theme: ThemeId, mode: Mode): void => {
  if (typeof document === 'undefined') {
    return; // SSR compatibility
  }

  const root = document.documentElement;
  
  // Add transition class for smooth animation
  root.classList.add('theme-transitioning');
  
  // Remove existing theme classes
  root.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest');
  root.classList.remove('light', 'dark');
  
  // Apply new theme and mode classes
  root.classList.add(`theme-${theme}`);
  root.classList.add(mode);
  
  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove('theme-transitioning');
  }, 200); // Slightly longer than CSS transition duration
};

/**
 * Get current theme from document classes
 */
export const getCurrentThemeFromDOM = (): { theme: ThemeId | null; mode: Mode | null } => {
  if (typeof document === 'undefined') {
    return { theme: null, mode: null };
  }

  const root = document.documentElement;
  const classList = root.classList;
  
  let theme: ThemeId | null = null;
  let mode: Mode | null = null;
  
  // Check for theme classes
  if (classList.contains('theme-ocean')) theme = 'ocean';
  else if (classList.contains('theme-sunset')) theme = 'sunset';
  else if (classList.contains('theme-forest')) theme = 'forest';
  
  // Check for mode classes  
  if (classList.contains('light')) mode = 'light';
  else if (classList.contains('dark')) mode = 'dark';
  
  return { theme, mode };
};

/**
 * Validate theme compatibility with existing components
 */
export const validateThemeIntegrity = (theme: ThemeId): boolean => {
  if (typeof document === 'undefined') {
    return true; // SSR - assume valid
  }

  try {
    // Check if CSS custom properties are being applied correctly
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      color: hsl(var(--foreground));
      background-color: hsl(var(--background));
      border-color: hsl(var(--border));
    `;
    
    document.body.appendChild(testElement);
    const computedStyle = window.getComputedStyle(testElement);
    
    // Check if CSS variables are resolved
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    const borderColor = computedStyle.borderColor;
    
    document.body.removeChild(testElement);
    
    // Validate that colors are not default values
    return (
      color !== 'rgba(0, 0, 0, 0)' && 
      backgroundColor !== 'rgba(0, 0, 0, 0)' && 
      borderColor !== 'rgba(0, 0, 0, 0)'
    );
  } catch (error) {
    console.warn('Theme validation failed:', error);
    return false;
  }
};

/**
 * Initialize theme loading system
 */
export const initializeThemeLoader = (): void => {
  if (typeof document === 'undefined') {
    return; // SSR compatibility
  }

  // Ensure smooth transitions are available
  if (!document.querySelector('#theme-loader-styles')) {
    const style = document.createElement('style');
    style.id = 'theme-loader-styles';
    style.textContent = `
      /* Ensure theme classes take precedence */
      .theme-ocean { --theme-loaded: 1; }
      .theme-sunset { --theme-loaded: 1; }
      .theme-forest { --theme-loaded: 1; }
      
      /* Prevent flash of unstyled content */
      html:not([class*="theme-"]) {
        visibility: hidden;
      }
      
      html[class*="theme-"] {
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Check for layout shifts during theme transitions
 */
export const measureLayoutStability = (): Promise<number> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      resolve(0);
      return;
    }

    let cumulativeLayoutShift = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          cumulativeLayoutShift += (entry as any).value;
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Stop observing after 1 second
      setTimeout(() => {
        observer.disconnect();
        resolve(cumulativeLayoutShift);
      }, 1000);
    } catch (error) {
      observer.disconnect();
      resolve(0);
    }
  });
};

/**
 * Optimize theme switching performance
 */
export const optimizeThemeSwitch = (callback: () => void): void => {
  if (typeof window === 'undefined') {
    callback();
    return;
  }

  // Use requestIdleCallback if available for better performance
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout: 100 });
  } else {
    // Fallback to requestAnimationFrame
    requestAnimationFrame(callback);
  }
};

/**
 * Clean up theme loader resources
 */
export const cleanupThemeLoader = (): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const loaderStyles = document.querySelector('#theme-loader-styles');
  if (loaderStyles) {
    document.head.removeChild(loaderStyles);
  }
};

/**
 * Verify Tailwind CSS integration
 */
export const verifyTailwindIntegration = (): boolean => {
  if (typeof document === 'undefined') {
    return true; // SSR - assume valid
  }

  try {
    const testElement = document.createElement('div');
    testElement.className = 'bg-background text-foreground border-border';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const hasValidStyles = (
      computedStyle.backgroundColor !== '' &&
      computedStyle.color !== '' &&
      computedStyle.borderColor !== ''
    );
    
    document.body.removeChild(testElement);
    return hasValidStyles;
  } catch (error) {
    console.warn('Tailwind integration verification failed:', error);
    return false;
  }
};