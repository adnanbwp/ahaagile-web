import { ThemeId, Mode } from './theme-context';

// Storage utilities
export const STORAGE_KEY = 'aha-agile-theme-preferences';

export interface ThemePreferences {
  theme: ThemeId;
  mode: Mode;
}

/**
 * Save theme preferences to localStorage
 */
export const saveThemePreferences = (theme: ThemeId, mode: Mode): boolean => {
  try {
    const preferences: ThemePreferences = { theme, mode };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.warn('Failed to save theme preferences to localStorage:', error);
    return false;
  }
};

/**
 * Load theme preferences from localStorage
 */
export const loadThemePreferences = (): ThemePreferences | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const preferences = JSON.parse(stored);
    
    // Validate the stored data
    if (
      preferences &&
      typeof preferences.theme === 'string' &&
      isValidTheme(preferences.theme) &&
      typeof preferences.mode === 'string' &&
      isValidMode(preferences.mode)
    ) {
      return {
        theme: preferences.theme as ThemeId,
        mode: preferences.mode as Mode
      };
    }
    
    // Invalid data, remove it
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (error) {
    console.warn('Failed to load theme preferences from localStorage:', error);
    // Clean up corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (cleanupError) {
      console.warn('Failed to clean up corrupted theme preferences:', cleanupError);
    }
    return null;
  }
};

/**
 * Clear theme preferences from localStorage
 */
export const clearThemePreferences = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('Failed to clear theme preferences from localStorage:', error);
    return false;
  }
};

// Validation utilities
export const isValidTheme = (theme: string): theme is ThemeId => {
  return ['ocean', 'sunset', 'forest'].includes(theme);
};

export const isValidMode = (mode: string): mode is Mode => {
  return ['light', 'dark'].includes(mode);
};

// CSS class management utilities
export const getThemeClassName = (theme: ThemeId): string => {
  return `theme-${theme}`;
};

export const getModeClassName = (mode: Mode): string => {
  return mode;
};

/**
 * Apply theme classes to the document element
 */
export const applyThemeToDocument = (theme: ThemeId, mode: Mode): void => {
  if (typeof document === 'undefined') {
    // SSR compatibility - no document available
    return;
  }

  const root = document.documentElement;
  
  // Remove all existing theme classes
  const themeClasses = ['theme-ocean', 'theme-sunset', 'theme-forest'];
  root.classList.remove(...themeClasses);
  
  // Remove existing mode classes
  root.classList.remove('light', 'dark');
  
  // Apply new theme and mode classes
  root.classList.add(getThemeClassName(theme));
  root.classList.add(getModeClassName(mode));
};

/**
 * Get the default theme preferences
 */
export const getDefaultThemePreferences = (): ThemePreferences => {
  return {
    theme: 'ocean',
    mode: 'light'
  };
};

/**
 * Check if localStorage is available (for SSR compatibility)
 */
export const isStorageAvailable = (): boolean => {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    // Test localStorage functionality
    const testKey = '__theme_storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get system preference for dark mode
 */
export const getSystemDarkModePreference = (): Mode => {
  if (typeof window === 'undefined') {
    return 'light'; // SSR default
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    console.warn('Failed to detect system dark mode preference:', error);
    return 'light';
  }
};

/**
 * Initialize theme preferences with system fallback
 */
export const initializeThemePreferences = (): ThemePreferences => {
  if (!isStorageAvailable()) {
    // Fallback to system preference for mode, default theme
    return {
      theme: 'ocean',
      mode: getSystemDarkModePreference()
    };
  }

  const stored = loadThemePreferences();
  if (stored) {
    return stored;
  }

  // No stored preferences, use defaults with system mode preference
  const systemMode = getSystemDarkModePreference();
  const preferences: ThemePreferences = {
    theme: 'ocean',
    mode: systemMode
  };

  // Save the initialized preferences
  saveThemePreferences(preferences.theme, preferences.mode);
  
  return preferences;
};