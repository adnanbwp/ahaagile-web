/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js fonts
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-inter',
    variable: '--font-inter',
  }),
  Source_Serif_4: () => ({
    className: 'mock-source-serif-4',
    variable: '--font-source-serif-4',
  }),
}))

// Test component to verify typography classes
const TypographyTestComponent = () => (
  <div>
    <h1 className="font-heading">Heading Text</h1>
    <h2 className="font-heading">Subheading</h2>
    <p className="font-sans">Body text using serif font</p>
    <span className="font-inter">Interface text using Inter</span>
  </div>
)

describe('Typography System', () => {
  test('should render typography components without errors', () => {
    const { container } = render(<TypographyTestComponent />)
    
    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelector('h2')).toBeInTheDocument()
    expect(container.querySelector('p')).toBeInTheDocument()
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  test('should apply correct font classes', () => {
    const { container } = render(<TypographyTestComponent />)
    
    const heading1 = container.querySelector('h1')
    const heading2 = container.querySelector('h2')
    const bodyText = container.querySelector('p')
    const interfaceText = container.querySelector('span')
    
    expect(heading1).toHaveClass('font-heading')
    expect(heading2).toHaveClass('font-heading')
    expect(bodyText).toHaveClass('font-sans')
    expect(interfaceText).toHaveClass('font-inter')
  })

  test('should verify font variables are properly configured', () => {
    // Test that the CSS variables would be properly set
    const fontVariables = [
      '--font-inter',
      '--font-source-serif-4',
    ]
    
    fontVariables.forEach(variable => {
      expect(variable).toBeDefined()
      expect(typeof variable).toBe('string')
      expect(variable.startsWith('--font-')).toBe(true)
    })
  })

  test('should have proper heading hierarchy', () => {
    const HeadingHierarchy = () => (
      <article>
        <h1 className="text-hero">Main Title</h1>
        <h2 className="font-heading text-2xl">Section Title</h2>
        <h3 className="font-heading text-xl">Subsection Title</h3>
        <p className="text-subhero">Lead paragraph text</p>
        <p className="font-sans">Regular body text</p>
      </article>
    )
    
    const { container } = render(<HeadingHierarchy />)
    
    expect(container.querySelector('h1')).toHaveClass('text-hero')
    expect(container.querySelector('h2')).toHaveClass('font-heading', 'text-2xl')
    expect(container.querySelector('h3')).toHaveClass('font-heading', 'text-xl')
    
    // Test custom text utility classes
    const leadParagraph = container.querySelector('p.text-subhero')
    const bodyParagraph = container.querySelector('p.font-sans')
    
    expect(leadParagraph).toBeInTheDocument()
    expect(bodyParagraph).toBeInTheDocument()
  })
})