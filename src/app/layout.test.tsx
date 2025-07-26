import { render } from '@testing-library/react'
import RootLayout, { metadata } from './layout'

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}))

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )
    
    expect(container.querySelector('[data-testid="test-child"]')).toBeInTheDocument()
  })

  it('has correct html structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    const html = container.querySelector('html')
    const body = container.querySelector('body')
    
    expect(html).toHaveAttribute('lang', 'en')
    expect(body).toHaveClass('inter')
  })

  it('has correct metadata', () => {
    expect(metadata.title).toBe('Aha Agile')
    expect(metadata.description).toBe('Aha Agile Coming Soon')
  })
})