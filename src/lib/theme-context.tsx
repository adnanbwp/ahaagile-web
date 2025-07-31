'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Theme types
export type ThemeId = 'ocean' | 'sunset' | 'forest';
export type Mode = 'light' | 'dark';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
}

export interface ThemeContextValue {
  currentTheme: ThemeId;
  currentMode: Mode;
  setTheme: (theme: ThemeId) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

// Available themes configuration
export const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue ocean tones with excellent contrast'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and red sunset colors'
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green forest theme'
  }
];

// Default values
const DEFAULT_THEME: ThemeId = 'ocean';
const DEFAULT_MODE: Mode = 'light';
const STORAGE_KEY = 'aha-agile-theme-preferences';

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Utility functions for localStorage
const saveToStorage = (theme: ThemeId, mode: Mode): void => {
  try {
    const preferences = { theme, mode };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn('Failed to save theme preferences to localStorage:', error);
  }
};

const loadFromStorage = (): { theme: ThemeId; mode: Mode } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const preferences = JSON.parse(stored);
      // Validate the stored values
      if (
        preferences &&
        typeof preferences.theme === 'string' &&
        ['ocean', 'sunset', 'forest'].includes(preferences.theme) &&
        typeof preferences.mode === 'string' &&
        ['light', 'dark'].includes(preferences.mode)
      ) {
        return {
          theme: preferences.theme as ThemeId,
          mode: preferences.mode as Mode
        };
      }
    }
  } catch (error) {
    console.warn('Failed to load theme preferences from localStorage:', error);
  }
  
  // Return defaults if storage fails or invalid data
  return { theme: DEFAULT_THEME, mode: DEFAULT_MODE };
};

// CSS class management
const applyThemeClasses = (theme: ThemeId, mode: Mode): void => {
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest');
  
  // Remove existing mode classes
  root.classList.remove('light', 'dark');
  
  // Apply new theme and mode classes
  root.classList.add(`theme-${theme}`);
  root.classList.add(mode);
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [currentMode, setCurrentMode] = useState<Mode>(DEFAULT_MODE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const { theme, mode } = loadFromStorage();
    setCurrentTheme(theme);
    setCurrentMode(mode);
    setIsHydrated(true);
    
    // Apply classes after hydration
    applyThemeClasses(theme, mode);
  }, []);

  // Apply CSS classes when theme or mode changes
  useEffect(() => {
    if (isHydrated) {
      applyThemeClasses(currentTheme, currentMode);
      saveToStorage(currentTheme, currentMode);
    }
  }, [currentTheme, currentMode, isHydrated]);

  const setTheme = (theme: ThemeId): void => {
    setCurrentTheme(theme);
  };

  const setMode = (mode: Mode): void => {
    setCurrentMode(mode);
  };

  const toggleMode = (): void => {
    setCurrentMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const contextValue: ThemeContextValue = {
    currentTheme,
    currentMode,
    setTheme,
    setMode,
    toggleMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};