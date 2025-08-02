'use client';

import React from 'react';
import { useTheme } from '@/lib/theme-context';

export const ModeToggle: React.FC = () => {
  const { currentMode, toggleMode } = useTheme();

  const handleToggle = () => {
    toggleMode();
    
    // Announce the change to screen readers
    const statusElement = document.getElementById('theme-switcher-status');
    if (statusElement) {
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      statusElement.textContent = `Mode changed to ${newMode} mode`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="flex items-center justify-between min-h-[44px]">
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Light mode icon */}
        <div className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentMode === 'light' ? 'bg-shadcn-primary/10 text-shadcn-primary' : 'text-muted-foreground'}`}>
          <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>

        <span className="text-sm font-medium text-foreground">
          {currentMode === 'light' ? 'Light' : 'Dark'} Mode
        </span>
      </div>

      {/* Toggle switch */}
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={currentMode === 'dark'}
        aria-label={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-shadcn-primary focus:ring-offset-2
          touch-manipulation active:scale-95 min-h-[44px] min-w-[44px] justify-center
          ${currentMode === 'dark' ? 'bg-shadcn-primary' : 'bg-neutral-300'}
        `}
      >
        <span className="sr-only">
          Toggle {currentMode === 'light' ? 'dark' : 'light'} mode
        </span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200
            ${currentMode === 'dark' ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>

      {/* Dark mode icon */}
      <div className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentMode === 'dark' ? 'bg-shadcn-primary/10 text-shadcn-primary' : 'text-muted-foreground'}`}>
        <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </div>
  );
};