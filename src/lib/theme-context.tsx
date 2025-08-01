'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { applyThemeWithTransition, initializeThemeLoader } from './theme-loader';
import { saveThemePreferences, initializeThemePreferences } from './theme-utils';

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

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);


// CSS class management with smooth transitions
const applyThemeClasses = (theme: ThemeId, mode: Mode): void => {
  applyThemeWithTransition(theme, mode);
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [currentMode, setCurrentMode] = useState<Mode>(DEFAULT_MODE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize theme loader and hydrate from localStorage on mount
  useEffect(() => {
    // Initialize the theme loading system
    initializeThemeLoader();
    
    const { theme, mode } = initializeThemePreferences();
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
      saveThemePreferences(currentTheme, currentMode);
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