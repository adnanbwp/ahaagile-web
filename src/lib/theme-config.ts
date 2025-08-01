/**
 * Theme Configuration and Production Management
 * 
 * This module provides utilities for managing the theme system in different environments,
 * including the ability to disable the theme switcher for production builds.
 */

import { ThemeId, Mode } from './theme-context';

// Environment configuration
interface ThemeEnvironmentConfig {
  enableThemeSwitcher: boolean;
  defaultTheme: ThemeId;
  defaultMode: Mode;
  enableTransitions: boolean;
  enableLocalStorage: boolean;
  debug: boolean;
}

// Default configuration
const DEFAULT_CONFIG: ThemeEnvironmentConfig = {
  enableThemeSwitcher: false, // Disabled by default for production
  defaultTheme: 'ocean',
  defaultMode: 'light',
  enableTransitions: true,
  enableLocalStorage: true,
  debug: false,
};

/**
 * Get theme configuration based on environment variables
 */
export function getThemeConfig(): ThemeEnvironmentConfig {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return DEFAULT_CONFIG;
  }

  const config: ThemeEnvironmentConfig = {
    // Enable theme switcher in development or when explicitly enabled
    enableThemeSwitcher: 
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_ENABLE_THEME_SWITCHER === 'true' ||
      localStorage.getItem('force-enable-theme-switcher') === 'true',
    
    // Allow override of default theme
    defaultTheme: (process.env.NEXT_PUBLIC_DEFAULT_THEME as ThemeId) || DEFAULT_CONFIG.defaultTheme,
    
    // Allow override of default mode
    defaultMode: (process.env.NEXT_PUBLIC_DEFAULT_MODE as Mode) || DEFAULT_CONFIG.defaultMode,
    
    // Enable/disable transitions
    enableTransitions: process.env.NEXT_PUBLIC_DISABLE_THEME_TRANSITIONS !== 'true',
    
    // Enable/disable localStorage
    enableLocalStorage: process.env.NEXT_PUBLIC_DISABLE_THEME_STORAGE !== 'true',
    
    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_THEME_DEBUG === 'true',
  };

  if (config.debug) {
    console.log('Theme Configuration:', config);
  }

  return config;
}

/**
 * Check if theme switcher should be rendered
 */
export function shouldRenderThemeSwitcher(): boolean {
  const config = getThemeConfig();
  return config.enableThemeSwitcher;
}

/**
 * Get the theme to use in production builds
 */
export function getProductionTheme(): { theme: ThemeId; mode: Mode } {
  const config = getThemeConfig();
  
  // In production, use environment-specified theme or fallback to default
  return {
    theme: config.defaultTheme,
    mode: config.defaultMode,
  };
}

/**
 * Production Theme Utilities
 * Functions to help with theme system removal for production builds
 */
export class ProductionThemeManager {
  private static instance: ProductionThemeManager;
  private config: ThemeEnvironmentConfig;

  private constructor() {
    this.config = getThemeConfig();
  }

  public static getInstance(): ProductionThemeManager {
    if (!ProductionThemeManager.instance) {
      ProductionThemeManager.instance = new ProductionThemeManager();
    }
    return ProductionThemeManager.instance;
  }

  /**
   * Apply static theme for production builds
   */
  public applyProductionTheme(): void {
    if (typeof document === 'undefined') return;

    const { theme, mode } = getProductionTheme();
    
    // Remove any existing theme classes
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, '')
      .replace(/\b(light|dark)\b/g, '');
    
    // Apply production theme
    document.documentElement.classList.add(`theme-${theme}`, mode);
    
    if (this.config.debug) {
      console.log(`Applied production theme: ${theme} (${mode})`);
    }
  }

  /**
   * Check if theme system should be initialized
   */
  public shouldInitializeThemeSystem(): boolean {
    return this.config.enableThemeSwitcher;
  }

  /**
   * Get CSS class string for static theme application
   */
  public getStaticThemeClasses(): string {
    const { theme, mode } = getProductionTheme();
    return `theme-${theme} ${mode}`;
  }

  /**
   * Remove theme system artifacts for production
   */
  public cleanupThemeSystem(): void {
    if (typeof window === 'undefined') return;

    // Remove theme preferences from localStorage if disabled
    if (!this.config.enableLocalStorage) {
      try {
        localStorage.removeItem('aha-agile-theme-preferences');
      } catch (error) {
        if (this.config.debug) {
          console.warn('Failed to clean up theme preferences:', error);
        }
      }
    }

    // Remove theme-related event listeners
    // This would be called during theme system shutdown
    if (this.config.debug) {
      console.log('Theme system cleanup completed');
    }
  }
}

/**
 * Feature flag utilities
 */
export const ThemeFeatureFlags = {
  /**
   * Check if dynamic theme loading is enabled
   */
  isDynamicThemeLoadingEnabled(): boolean {
    const config = getThemeConfig();
    return config.enableThemeSwitcher;
  },

  /**
   * Check if theme persistence is enabled
   */
  isThemePersistenceEnabled(): boolean {
    const config = getThemeConfig();
    return config.enableLocalStorage && config.enableThemeSwitcher;
  },

  /**
   * Check if theme transitions are enabled
   */
  areThemeTransitionsEnabled(): boolean {
    const config = getThemeConfig();
    return config.enableTransitions;
  },

  /**
   * Check if theme debugging is enabled
   */
  isThemeDebuggingEnabled(): boolean {
    const config = getThemeConfig();
    return config.debug;
  },
};

/**
 * Theme System Removal Guide
 * 
 * To remove the theme system for production:
 * 
 * 1. Set environment variables:
 *    - NEXT_PUBLIC_ENABLE_THEME_SWITCHER=false
 *    - NEXT_PUBLIC_DEFAULT_THEME=ocean (or your chosen theme)
 *    - NEXT_PUBLIC_DEFAULT_MODE=light (or dark)
 * 
 * 2. Use ProductionThemeManager to apply static theme:
 *    ```typescript
 *    const manager = ProductionThemeManager.getInstance();
 *    manager.applyProductionTheme();
 *    ```
 * 
 * 3. Remove ThemeSwitcher component from layout:
 *    ```typescript
 *    // In layout.tsx, conditionally render:
 *    {shouldRenderThemeSwitcher() && <ThemeSwitcher />}
 *    ```
 * 
 * 4. Optional: Remove unused theme CSS files from build
 * 5. Optional: Remove theme-related dependencies if no longer needed
 */

/**
 * Development utilities
 */
export const ThemeDevUtils = {
  /**
   * Force enable theme switcher (useful for testing production builds)
   */
  forceEnableThemeSwitcher(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('force-enable-theme-switcher', 'true');
      window.location.reload();
    }
  },

  /**
   * Disable forced theme switcher
   */
  disableForceThemeSwitcher(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('force-enable-theme-switcher');
      window.location.reload();
    }
  },

  /**
   * Log current theme configuration
   */
  logThemeConfig(): void {
    console.log('Current Theme Configuration:', getThemeConfig());
  },

  /**
   * Test all theme combinations
   */
  testAllThemes(): void {
    const themes: ThemeId[] = ['ocean', 'sunset', 'forest'];
    const modes: Mode[] = ['light', 'dark'];
    
    let index = 0;
    const interval = setInterval(() => {
      const theme = themes[Math.floor(index / 2) % themes.length];
      const mode = modes[index % 2];
      
      document.documentElement.className = document.documentElement.className
        .replace(/theme-\w+/g, '')
        .replace(/\b(light|dark)\b/g, '');
      
      document.documentElement.classList.add(`theme-${theme}`, mode);
      
      console.log(`Testing: ${theme} (${mode})`);
      
      index++;
      if (index >= themes.length * modes.length) {
        clearInterval(interval);
        console.log('Theme testing completed');
      }
    }, 2000);
  },
};

// Export singleton instance for convenience
export const themeManager = ProductionThemeManager.getInstance();