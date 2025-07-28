import { render } from '@testing-library/react'
import RootLayout, { metadata } from './layout'

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Inter: () => ({ 
    className: 'mock-inter',
    variable: '--font-inter'
  }),
  Source_Serif_4: () => ({ 
    className: 'mock-source-serif-4',
    variable: '--font-source-serif-4'
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/'),
}))

// Suppress DOM nesting warnings for layout tests (expected when testing full HTML structure)
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('validateDOMNesting')) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )
    
    expect(getByTestId('test-child')).toBeInTheDocument()
    expect(getByTestId('test-child')).toHaveTextContent('Test Content')
  })

  it('applies font variable classes to body', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    const body = container.querySelector('body')
    expect(body).toHaveClass('--font-inter')
    expect(body).toHaveClass('--font-source-serif-4')
    expect(body).toHaveClass('font-sans')
  })

  it('sets correct html lang attribute', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    const html = container.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
  })

  it('has correct metadata exported', () => {
    expect(metadata.title).toBe('Aha Agile')
    expect(metadata.description).toBe('Aha Agile Coming Soon')
  })
})