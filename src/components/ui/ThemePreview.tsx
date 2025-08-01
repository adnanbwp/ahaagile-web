'use client';

import React from 'react';
import { useTheme } from '@/lib/theme-context';
import type { ThemeId } from '@/lib/theme-context';

interface ThemeData {
  name: string;
  id: ThemeId;
  description: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
}

interface ThemePreviewProps {
  theme: ThemeData;
  isSelected: boolean;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, isSelected }) => {
  const { setTheme } = useTheme();

  const handleThemeSelect = () => {
    setTheme(theme.id);
    
    // Announce the change to screen readers
    const statusElement = document.getElementById('theme-switcher-status');
    if (statusElement) {
      statusElement.textContent = `Theme changed to ${theme.name}`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleThemeSelect();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        // Let the parent ThemeSwitcher handle arrow key navigation
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={-1}
      onClick={handleThemeSelect}
      onKeyDown={handleKeyDown}
      className={`
        group relative flex items-center p-3 sm:p-4 rounded-lg border-2 cursor-pointer
        min-h-[44px] transition-all duration-200 hover:shadow-md 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
        touch-manipulation active:scale-[0.98]
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-border hover:border-primary/50 hover:bg-accent/5'
        }
      `}
      aria-label={`${theme.name} theme. ${theme.description}. ${isSelected ? 'Currently selected' : 'Click to select'}`}
    >
      {/* Color swatches */}
      <div className="flex items-center space-x-2 mr-3">
        <div
          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: theme.colors.primary }}
          aria-hidden="true"
          title={`Primary color: ${theme.colors.primary}`}
        />
        <div
          className="w-4 h-4 rounded-full border border-white shadow-sm"
          style={{ backgroundColor: theme.colors.accent }}
          aria-hidden="true"
          title={`Accent color: ${theme.colors.accent}`}
        />
        <div
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: theme.colors.background }}
          aria-hidden="true"
          title={`Background color: ${theme.colors.background}`}
        />
      </div>

      {/* Theme info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h5 className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
            {theme.name}
          </h5>
          {isSelected && (
            <div className="text-primary" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {theme.description}
        </p>
      </div>

      {/* Hover effect overlay */}
      <div 
        className={`
          absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity duration-200
          ${isSelected ? 'bg-primary' : 'bg-foreground'}
        `}
        aria-hidden="true"
      />
    </div>
  );
};