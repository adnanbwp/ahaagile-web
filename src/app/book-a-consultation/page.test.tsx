import { render, screen } from '@testing-library/react'
import BookConsultationPage from './page'

// Mock the Calendly widget component
jest.mock('@/components/ui/CalendlyWidget', () => {
  return function MockCalendlyWidget({ className }: { className?: string }) {
    return (
      <div className={className} data-testid="calendly-widget">
        <h2>Schedule Your Consultation</h2>
        <div>Mock Calendly Widget</div>
      </div>
    )
  }
})

describe('BookConsultationPage', () => {

  it('renders the page with correct title and description', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByRole('heading', { name: /book your consultation/i })).toBeInTheDocument()
    expect(screen.getByText(/ready to transform your workflows/i)).toBeInTheDocument()
  })

  it('renders the benefits section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByText(/what to expect in your consultation/i)).toBeInTheDocument()
    expect(screen.getByText(/assessment:/i)).toBeInTheDocument()
    expect(screen.getByText(/strategy:/i)).toBeInTheDocument()
    expect(screen.getByText(/next steps:/i)).toBeInTheDocument()
  })

  it('renders the Calendly widget', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByTestId('calendly-widget')).toBeInTheDocument()
    expect(screen.getByText(/schedule your consultation/i)).toBeInTheDocument()
  })

  it('renders additional information section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByText(/ready to get started\?/i)).toBeInTheDocument()
    expect(screen.getByText(/use the calendar above to book/i)).toBeInTheDocument()
  })
})