import { render, screen } from '@testing-library/react'
import CalendlyWidget from './CalendlyWidget'

// Mock console.error to avoid script loading errors in tests
const originalConsoleError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

describe('CalendlyWidget', () => {
  it('renders widget container with default props', () => {
    render(<CalendlyWidget />)
    
    expect(screen.getByText(/schedule your consultation/i)).toBeInTheDocument()
    expect(screen.getByText(/choose a time that works best for you/i)).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CalendlyWidget className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders loading state initially', () => {
    render(<CalendlyWidget />)
    
    expect(screen.getByText(/loading calendar\.\.\./i)).toBeInTheDocument()
  })

  it('renders calendly inline widget container', () => {
    const { container } = render(<CalendlyWidget />)
    
    const calendlyDiv = container.querySelector('.calendly-inline-widget')
    expect(calendlyDiv).toBeInTheDocument()
  })

  it('uses default embed URL when none provided', () => {
    const { container } = render(<CalendlyWidget />)
    
    const calendlyDiv = container.querySelector('.calendly-inline-widget')
    expect(calendlyDiv).toHaveAttribute('data-url')
  })

  it('uses custom embed URL when provided', () => {
    const customUrl = 'https://calendly.com/custom-link'
    const { container } = render(<CalendlyWidget embedUrl={customUrl} />)
    
    const calendlyDiv = container.querySelector('.calendly-inline-widget')
    expect(calendlyDiv).toHaveAttribute('data-url', customUrl)
  })

  it('handles environment variable for embed URL', () => {
    const originalEnv = process.env.NEXT_PUBLIC_CALENDLY_EMBED_URL
    process.env.NEXT_PUBLIC_CALENDLY_EMBED_URL = 'https://calendly.com/env-link'
    
    render(<CalendlyWidget />)
    
    // Component should render without errors
    expect(screen.getByText(/schedule your consultation/i)).toBeInTheDocument()
    
    // Restore environment
    process.env.NEXT_PUBLIC_CALENDLY_EMBED_URL = originalEnv
  })

  it('has proper widget styling attributes', () => {
    const { container } = render(<CalendlyWidget />)
    
    const calendlyDiv = container.querySelector('.calendly-inline-widget')
    expect(calendlyDiv).toHaveStyle({ minWidth: '320px', height: '700px' })
  })
})