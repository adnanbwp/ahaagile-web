'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';
import { AVAILABLE_THEMES } from '@/styles/themes/index';
import { ThemePreview } from './ThemePreview';
import { ModeToggle } from './ModeToggle';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { currentTheme, currentMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation and escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isExpanded) return;

      switch (event.key) {
        case 'Escape':
          setIsExpanded(false);
          toggleButtonRef.current?.focus();
          break;
        case 'Tab':
          // Let browser handle tab navigation naturally within the panel
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          // Navigate between theme options
          event.preventDefault();
          const radioElements = containerRef.current?.querySelectorAll('[role="radio"]') as NodeListOf<HTMLElement>;
          if (radioElements && radioElements.length > 0) {
            const currentIndex = Array.from(radioElements).findIndex(el => el === document.activeElement);
            let nextIndex;
            
            if (event.key === 'ArrowDown') {
              nextIndex = currentIndex < radioElements.length - 1 ? currentIndex + 1 : 0;
            } else {
              nextIndex = currentIndex > 0 ? currentIndex - 1 : radioElements.length - 1;
            }
            
            radioElements[nextIndex]?.focus();
          }
          break;
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    
    // Focus management - move focus to first theme option when opening
    if (newExpanded) {
      setTimeout(() => {
        const firstRadio = containerRef.current?.querySelector('[role="radio"]') as HTMLElement;
        firstRadio?.focus();
      }, 100); // Small delay to ensure DOM is updated
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleExpanded();
    }
  };

  // Get current theme info
  const currentThemeInfo = AVAILABLE_THEMES.find(theme => theme.id === currentTheme);

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 ${className}`}
      role="region"
      aria-label="Theme switcher"
    >
      {/* Collapsed state - floating button */}
      <button
        ref={toggleButtonRef}
        onClick={handleToggleExpanded}
        onKeyDown={handleKeyDown}
        className={`
          flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg 
          bg-background border-2 border-border hover:border-primary/50
          transition-all duration-200 hover:scale-105 hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          touch-manipulation active:scale-95
          ${isExpanded ? 'scale-105 shadow-xl border-primary/50' : ''}
        `}
        aria-expanded={isExpanded}
        aria-label={`Theme switcher. Current theme: ${currentThemeInfo?.name}, ${currentMode} mode. Click to ${isExpanded ? 'collapse' : 'expand'} options.`}
        title={`Current: ${currentThemeInfo?.name} (${currentMode})`}
      >
        <div className="flex items-center justify-center">
          {/* Theme color indicator */}
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: currentThemeInfo?.colors.primary }}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Expanded state - theme selection panel */}
      {isExpanded && (
        <div
          className={`
            absolute bottom-14 right-0 w-80 max-w-[calc(100vw-2rem)]
            sm:bottom-16 sm:w-96 sm:max-w-sm
            bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl
            p-3 sm:p-4 transition-all duration-200 animate-in slide-in-from-bottom-2
          `}
          role="dialog"
          aria-label="Theme selection panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Theme Options
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-muted-foreground hover:text-foreground p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close theme switcher"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Theme previews */}
          <div className="space-y-3 mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Choose Theme
            </h4>
            <div 
              className="space-y-2"
              role="radiogroup"
              aria-label="Theme selection"
            >
              {AVAILABLE_THEMES.map((theme) => (
                <ThemePreview 
                  key={theme.id}
                  theme={theme}
                  isSelected={theme.id === currentTheme}
                />
              ))}
            </div>
          </div>

          {/* Mode toggle */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Appearance
            </h4>
            <ModeToggle />
          </div>

          {/* Live region for announcements */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            id="theme-switcher-status"
          >
            Current theme: {currentThemeInfo?.name} {currentMode} mode
          </div>
        </div>
      )}
    </div>
  );
};