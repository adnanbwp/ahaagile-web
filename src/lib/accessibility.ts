/**
 * Accessibility enhancement utilities for WCAG 2.1 AA+ compliance
 */

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstFocusableElement = focusableElements[0] as HTMLElement
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  e: KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault()
      onEnter?.()
      break
    case 'Escape':
      e.preventDefault()
      onEscape?.()
      break
    case 'ArrowUp':
      e.preventDefault()
      onArrowUp?.()
      break
    case 'ArrowDown':
      e.preventDefault()
      onArrowDown?.()
      break
  }
}

// ARIA live region utilities
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Color contrast validation
export const validateColorContrast = (foreground: string, background: string): boolean => {
  // This is a simplified implementation
  // In a real-world scenario, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate relative luminance
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }
  
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  
  return contrast >= 4.5 // WCAG AA standard
}

// Skip links generator
export const createSkipLink = (target: string, text: string): HTMLElement => {
  const skipLink = document.createElement('a')
  skipLink.href = `#${target}`
  skipLink.textContent = text
  skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-brand-navy text-white p-2 z-50'
  
  return skipLink
}

// Heading hierarchy validation
export const validateHeadingHierarchy = (): string[] => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const errors: string[] = []
  let previousLevel = 0
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1))
    
    if (index === 0 && level !== 1) {
      errors.push('Page should start with h1')
    }
    
    if (level > previousLevel + 1) {
      errors.push(`Heading level jumps from h${previousLevel} to h${level}`)
    }
    
    previousLevel = level
  })
  
  return errors
}

// Form accessibility helpers
export const enhanceFormAccessibility = (form: HTMLFormElement) => {
  const inputs = form.querySelectorAll('input, select, textarea')
  
  inputs.forEach(input => {
    const label = form.querySelector(`label[for="${input.id}"]`)
    if (!label && !input.getAttribute('aria-label')) {
      console.warn('Input missing label:', input)
    }
    
    // Add error association
    const errorElement = form.querySelector(`[data-error-for="${input.id}"]`)
    if (errorElement) {
      input.setAttribute('aria-describedby', errorElement.id)
    }
  })
}

// Reduced motion utilities
export const respectsReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// High contrast mode detection
export const isHighContrastMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}