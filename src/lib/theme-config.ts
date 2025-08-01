/**
 * Production configuration utilities for theme system
 * 
 * This module provides utilities for configuring the theme system in production environments,
 * including feature flags and removal processes.
 */

export type ThemeSystemConfig = {
  enabled: boolean;
  defaultTheme: 'ocean' | 'sunset' | 'forest';
  defaultMode: 'light' | 'dark';
  allowSwitching: boolean;
  forceTheme?: string;
  forceMode?: string;
};

/**
 * Get theme system configuration based on environment variables
 */
export function getThemeSystemConfig(): ThemeSystemConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isForceEnabled = process.env.NEXT_PUBLIC_FORCE_THEME_SWITCHER === 'true';
  const enableThemeSwitcher = process.env.NEXT_PUBLIC_ENABLE_THEME_SWITCHER === 'true';
  
  // Production theme selection (set via environment variables)
  const productionTheme = process.env.NEXT_PUBLIC_PRODUCTION_THEME as 'ocean' | 'sunset' | 'forest' || 'ocean';
  const productionMode = process.env.NEXT_PUBLIC_PRODUCTION_MODE as 'light' | 'dark' || 'light';
  
  const config: ThemeSystemConfig = {
    enabled: isDevelopment || isForceEnabled || enableThemeSwitcher,
    defaultTheme: productionTheme,
    defaultMode: productionMode,
    allowSwitching: isDevelopment || isForceEnabled || enableThemeSwitcher,
    forceTheme: process.env.NEXT_PUBLIC_FORCE_THEME,
    forceMode: process.env.NEXT_PUBLIC_FORCE_MODE,
  };
  
  return config;
}

/**
 * Check if theme switcher should be visible
 */
export function shouldShowThemeSwitcher(): boolean {
  const config = getThemeSystemConfig();
  return config.enabled && config.allowSwitching;
}

/**
 * Get the theme that should be used in production
 */
export function getProductionTheme(): { theme: string; mode: string } {
  const config = getThemeSystemConfig();
  
  return {
    theme: config.forceTheme || config.defaultTheme,
    mode: config.forceMode || config.defaultMode,
  };
}

/**
 * Generate CSS classes for static theme application
 * Used when theme system is disabled and we want to apply a fixed theme
 */
export function generateStaticThemeClasses(theme: string, mode: string): string[] {
  const themeClass = `theme-${theme}`;
  const modeClass = mode === 'dark' ? 'dark' : '';
  
  return [themeClass, modeClass].filter(Boolean);
}

/**
 * Configuration for theme system removal in production
 * This provides a checklist and utilities for removing the theme system
 */
export const THEME_REMOVAL_GUIDE = {
  steps: [
    {
      id: 'set-production-theme',
      title: 'Set Production Theme',
      description: 'Choose final theme and mode via environment variables',
      envVars: [
        'NEXT_PUBLIC_PRODUCTION_THEME=ocean|sunset|forest',
        'NEXT_PUBLIC_PRODUCTION_MODE=light|dark',
        'NEXT_PUBLIC_ENABLE_THEME_SWITCHER=false'
      ]
    },
    {
      id: 'remove-theme-switcher',
      title: 'Remove ThemeSwitcher Component',
      description: 'Remove ThemeSwitcher import and usage from layout.tsx',
      files: ['src/app/layout.tsx']
    },
    {
      id: 'apply-static-theme',
      title: 'Apply Static Theme Classes',
      description: 'Add static theme classes to html or body element',
      example: 'className={`theme-ocean ${mode === "dark" ? "dark" : ""}`}'
    },
    {
      id: 'remove-dynamic-loading',
      title: 'Remove Dynamic Theme Loading',
      description: 'Remove theme-loader.ts and related dynamic loading logic',
      files: ['src/lib/theme-loader.ts']
    },
    {
      id: 'cleanup-unused-themes',
      title: 'Clean Up Unused Theme CSS',
      description: 'Remove CSS for unused themes from styles/themes/',
      files: ['src/styles/themes/']
    },
    {
      id: 'remove-theme-context',
      title: 'Remove Theme Context (Optional)',
      description: 'If no dynamic theming needed, remove ThemeProvider and useTheme',
      files: ['src/lib/theme-context.tsx']
    }
  ],
  
  /**
   * Validate that all removal steps have been completed
   */
  validateRemoval(): { completed: string[]; remaining: string[] } {
    const completed: string[] = [];
    const remaining: string[] = [];
    
    // This would be implemented with actual file system checks in a build script
    // For now, it's a guide for manual validation
    
    return { completed, remaining };
  }
};

/**
 * Development utilities for theme testing
 */
export const THEME_DEV_UTILS = {
  /**
   * Test all theme combinations
   */
  getAllThemeCombinations() {
    const themes = ['ocean', 'sunset', 'forest'];
    const modes = ['light', 'dark'];
    
    return themes.flatMap(theme => 
      modes.map(mode => ({ theme, mode }))
    );
  },
  
  /**
   * Log current theme configuration
   */
  logThemeConfig() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const config = getThemeSystemConfig();
      console.group('🎨 Theme System Configuration');
      console.log('Enabled:', config.enabled);
      console.log('Allow Switching:', config.allowSwitching);
      console.log('Default Theme:', config.defaultTheme);
      console.log('Default Mode:', config.defaultMode);
      console.log('Force Theme:', config.forceTheme || 'None');
      console.log('Force Mode:', config.forceMode || 'None');
      console.groupEnd();
    }
  },
  
  /**
   * Simulate production environment
   */
  simulateProduction() {
    if (typeof window !== 'undefined') {
      console.warn('🚀 Simulating production environment - theme switcher will be hidden');
      (window as any).__THEME_SYSTEM_OVERRIDE = 'production';
    }
  }
};

/**
 * Environment-specific configuration presets
 */
export const THEME_PRESETS = {
  development: {
    enabled: true,
    allowSwitching: true,
    defaultTheme: 'ocean' as const,
    defaultMode: 'light' as const,
  },
  
  staging: {
    enabled: true,
    allowSwitching: true, // Allow testing in staging
    defaultTheme: 'ocean' as const,
    defaultMode: 'light' as const,
  },
  
  production: {
    enabled: false, // Disable by default in production
    allowSwitching: false,
    defaultTheme: 'ocean' as const, // Set chosen theme
    defaultMode: 'light' as const, // Set chosen mode
  }
};

/**
 * Get preset configuration for current environment
 */
export function getEnvironmentPreset() {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return THEME_PRESETS.production;
  } else if (env === 'staging' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    return THEME_PRESETS.staging;
  } else {
    return THEME_PRESETS.development;
  }
}