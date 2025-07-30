import { render, screen } from '@testing-library/react'
import CalendlyWidget from './CalendlyWidget'

// Mock window.matchMedia for accessibility tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

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

  it('renders calendly inline widget container', () => {
    const { container } = render(<CalendlyWidget />)
    
    const calendlyDiv = container.querySelector('.calendly-inline-widget')
    expect(calendlyDiv).toBeInTheDocument()
  })

  it('uses hardcoded Calendly URL', () => {
    const { container } = render(<CalendlyWidget />)
    
    const calendlyDiv = container.querySelector('.calendly-inline-widget')
    expect(calendlyDiv).toHaveAttribute('data-url', 'https://calendly.com/aha-agile/adnan-s-meeting-link?hide_event_type_details=1&hide_gdpr_banner=1')
  })

  it('has proper widget styling attributes', () => {
    const { container } = render(<CalendlyWidget />)
    
    const calendlyDiv = container.querySelector('.calendly-inline-widget')
    expect(calendlyDiv).toHaveStyle({ minWidth: '320px', height: '700px' })
  })

  it('renders with professional styling classes', () => {
    const { container } = render(<CalendlyWidget />)
    
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('bg-white/90', 'backdrop-blur-sm', 'rounded-2xl', 'shadow-brand')
  })

  it('renders gradient background overlay', () => {
    const { container } = render(<CalendlyWidget />)
    
    const gradientOverlay = container.querySelector('.absolute.inset-0.bg-gradient-to-br')
    expect(gradientOverlay).toBeInTheDocument()
    expect(gradientOverlay).toHaveClass('pointer-events-none')
  })

  it('applies Inter font to headings', () => {
    render(<CalendlyWidget />)
    
    const heading = screen.getByText(/schedule your consultation/i)
    expect(heading).toHaveClass('font-inter')
  })

  it('applies Source Serif 4 font to description', () => {
    render(<CalendlyWidget />)
    
    const description = screen.getByText(/choose a time that works best for you/i)
    expect(description).toHaveClass('font-source-serif-4')
  })

  it('has proper semantic structure for accessibility', () => {
    render(<CalendlyWidget />)
    
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent(/schedule your consultation/i)
  })
})