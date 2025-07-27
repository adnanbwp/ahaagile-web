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
})