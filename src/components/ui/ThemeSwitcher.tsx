'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme, AVAILABLE_THEMES, type ThemeId } from '@/lib/theme-context';
import { AVAILABLE_THEMES as THEME_CONFIG } from '@/styles/themes/index';
import { shouldShowThemeSwitcher } from '@/lib/theme-config';

interface ThemePreviewProps {
  theme: typeof AVAILABLE_THEMES[number];
  isActive: boolean;
  onClick: () => void;
}

const ThemePreview: React.FC<ThemePreviewProps> = React.memo(({ theme, isActive, onClick }) => {
  const themeConfig = THEME_CONFIG.find(config => config.id === theme.id);
  
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200
        hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-shadcn-primary focus:ring-offset-2
        ${isActive 
          ? 'border-shadcn-primary bg-shadcn-primary/10' 
          : 'border-border hover:border-border/80'
        }
      `}
      aria-pressed={isActive}
      aria-label={`Select ${theme.name} theme: ${theme.description}`}
    >
      {/* Color Preview Swatches */}
      <div className="flex space-x-1 mb-2">
        <div 
          className="w-4 h-4 rounded-full border border-border"
          style={{ backgroundColor: themeConfig?.colors.primary }}
          aria-hidden="true"
        />
        <div 
          className="w-4 h-4 rounded-full border border-border"
          style={{ backgroundColor: themeConfig?.colors.accent }}
          aria-hidden="true"
        />
        <div 
          className="w-4 h-4 rounded-full border border-border"
          style={{ backgroundColor: themeConfig?.colors.background }}
          aria-hidden="true"
        />
      </div>
      
      {/* Theme Name */}
      <span className="text-xs font-medium text-muted-foreground">
        {theme.name}
      </span>
      
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-shadcn-primary rounded-full border-2 border-card" />
      )}
    </button>
  );
});

ThemePreview.displayName = 'ThemePreview';

interface ModeToggleProps {
  currentMode: 'light' | 'dark';
  onToggle: () => void;
}

const ModeToggle: React.FC<ModeToggleProps> = React.memo(({ currentMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="
        flex items-center justify-center p-2 rounded-lg border-2 border-border 
        hover:border-border/80
        transition-all duration-200 hover:scale-105 focus:outline-none 
        focus:ring-2 focus:ring-shadcn-primary focus:ring-offset-2
      "
      aria-label={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}
    >
      {currentMode === 'light' ? (
        <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-shadcn-primary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
});

ModeToggle.displayName = 'ModeToggle';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, currentMode, setTheme, toggleMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check visibility based on current environment and configuration
  const isVisible = shouldShowThemeSwitcher();

  // Handle click outside to close expanded view
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isExpanded]);

  const handleThemeSelect = useCallback((themeId: ThemeId) => {
    setTheme(themeId);
    // Keep expanded on desktop, collapse on mobile for better UX
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  }, [setTheme]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`
        fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out
        ${isExpanded ? 'transform-none' : 'transform hover:scale-105'}
      `}
      role="region"
      aria-label="Theme switcher"
    >
      {/* Collapsed State - Floating Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="
            w-12 h-12 bg-card rounded-full shadow-lg border
            border-border hover:shadow-xl transition-all duration-200
            flex items-center justify-center group focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2
          "
          aria-label="Open theme switcher"
          aria-expanded="false"
        >
          <svg 
            className="w-5 h-5 text-muted-foreground group-hover:text-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </button>
      )}

      {/* Expanded State - Theme Selection Panel */}
      {isExpanded && (
        <div className="
          bg-card rounded-lg shadow-xl border border-border p-4 min-w-[280px] md:min-w-[320px]
        ">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">
              Theme Settings
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="
                p-1 rounded-full hover:bg-muted 
                transition-colors focus:outline-none focus:ring-2 focus:ring-shadcn-primary
              "
              aria-label="Close theme switcher"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Theme Selection */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Color Theme
            </label>
            <div 
              className="grid grid-cols-3 gap-2"
              role="radiogroup"
              aria-label="Theme selection"
            >
              {AVAILABLE_THEMES.map((theme) => (
                <ThemePreview
                  key={theme.id}
                  theme={theme}
                  isActive={currentTheme === theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                />
              ))}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Dark Mode
            </label>
            <ModeToggle currentMode={currentMode} onToggle={toggleMode} />
          </div>

          {/* Current Theme Info */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Active: <span className="font-medium">{AVAILABLE_THEMES.find(t => t.id === currentTheme)?.name}</span>
              {' • '}
              <span className="capitalize">{currentMode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;