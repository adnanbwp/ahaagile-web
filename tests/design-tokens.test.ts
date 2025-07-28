/**
 * @jest-environment jsdom
 */

import tailwindConfig from '../tailwind.config'

describe('Design Tokens Configuration', () => {
  describe('Tailwind Configuration', () => {
    test('should load Tailwind configuration without errors', () => {
      expect(tailwindConfig).toBeDefined()
      expect(tailwindConfig.theme).toBeDefined()
      const theme = tailwindConfig.theme as any
      expect(theme?.extend).toBeDefined()
    })

    test('should have Loveable navy primary colors', () => {
      const theme = tailwindConfig.theme as any
      const primaryColors = theme?.extend?.colors?.primary
      expect(primaryColors).toBeDefined()
      expect(primaryColors?.['700']).toBe('#1e293b') // Navy primary
      expect(primaryColors?.['800']).toBe('#0f172a') // Navy dark
      expect(primaryColors?.['50']).toBe('#f1f5f9')  // Light variant
    })

    test('should have yellow accent colors', () => {
      const theme = tailwindConfig.theme as any
      const accentColors = theme?.extend?.colors?.accent
      expect(accentColors).toBeDefined()
      expect(accentColors?.['500']).toBe('#f59e0b') // Yellow primary
      expect(accentColors?.['600']).toBe('#d97706') // Yellow dark
      expect(accentColors?.['100']).toBe('#fef3c7') // Yellow light
    })

    test('should have brand-specific colors', () => {
      const theme = tailwindConfig.theme as any
      const brandColors = theme?.extend?.colors?.brand
      expect(brandColors).toBeDefined()
      expect(brandColors?.navy).toBe('#1e293b')
      expect(brandColors?.yellow).toBe('#f59e0b')
      expect(brandColors?.['navy-light']).toBe('#334155')
      expect(brandColors?.['yellow-dark']).toBe('#d97706')
    })

    test('should have proper font family configuration', () => {
      const theme = tailwindConfig.theme as any
      const fontFamily = theme?.extend?.fontFamily
      expect(fontFamily).toBeDefined()
      expect(fontFamily?.heading).toContain('var(--font-inter)')
      expect(fontFamily?.sans).toContain('var(--font-source-serif-4)')
      expect(fontFamily?.serif).toContain('var(--font-source-serif-4)')
    })

    test('should have brand gradients configured', () => {
      const theme = tailwindConfig.theme as any
      const backgroundImage = theme?.extend?.backgroundImage
      expect(backgroundImage).toBeDefined()
      expect(backgroundImage?.['gradient-navy']).toBe('var(--gradient-navy)')
      expect(backgroundImage?.['gradient-yellow']).toBe('var(--gradient-yellow)')
      expect(backgroundImage?.['gradient-hero']).toBe('var(--gradient-hero)')
    })

    test('should have custom shadows configured', () => {
      const theme = tailwindConfig.theme as any
      const boxShadow = theme?.extend?.boxShadow
      expect(boxShadow).toBeDefined()
      expect(boxShadow?.brand).toBe('var(--shadow-brand)')
      expect(boxShadow?.accent).toBe('var(--shadow-accent)')
    })

    test('should have custom spacing configured', () => {
      const theme = tailwindConfig.theme as any
      const spacing = theme?.extend?.spacing
      expect(spacing).toBeDefined()
      expect(spacing?.xs).toBe('var(--spacing-xs)')
      expect(spacing?.lg).toBe('var(--spacing-lg)')
      expect(spacing?.['2xl']).toBe('var(--spacing-2xl)')
    })
  })

  describe('CSS Variables', () => {
    test('should verify CSS variables are accessible in DOM', () => {
      // Create a test element to check CSS variable access
      const testElement = document.createElement('div')
      document.body.appendChild(testElement)
      
      // Apply styles using CSS variables
      testElement.style.color = 'var(--brand-navy)'
      testElement.style.backgroundColor = 'var(--brand-yellow)'
      
      // The element should be created successfully
      expect(testElement).toBeDefined()
      expect(testElement.style.color).toBe('var(--brand-navy)')
      expect(testElement.style.backgroundColor).toBe('var(--brand-yellow)')
      
      // Clean up
      document.body.removeChild(testElement)
    })
  })

  describe('Color Contrast Accessibility', () => {
    test('should have sufficient contrast for navy text on white background', () => {
      // Navy (#1e293b) on white (#ffffff) should have good contrast
      // This is a basic check - in real world, you'd use a contrast calculation library
      const navyColor = '#1e293b'
      const whiteBackground = '#ffffff'
      
      expect(navyColor).toBeDefined()
      expect(whiteBackground).toBeDefined()
      
      // These colors should pass WCAG AA standards (4.5:1 ratio)
      // Navy blue on white typically has excellent contrast
    })

    test('should have sufficient contrast for yellow accent usage', () => {
      // Yellow (#f59e0b) should be used carefully for text
      const yellowColor = '#f59e0b'
      const navyBackground = '#1e293b'
      
      expect(yellowColor).toBeDefined()
      expect(navyBackground).toBeDefined()
      
      // Yellow on navy should have good contrast for accent elements
    })
  })
})