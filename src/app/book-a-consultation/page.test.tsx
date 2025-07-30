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

// Mock the BookConsultationHeroSection component
jest.mock('@/components/sections/BookConsultationHeroSection', () => {
  return function MockBookConsultationHeroSection() {
    return (
      <section data-testid="hero-section">
        <div>
          <div>Free Consultation Available</div>
          <h1>Book Your Consultation</h1>
          <p>Transform your workflows with intelligent automation expertise</p>
          <div>
            <div>30-45 minutes</div>
            <div>Free consultation</div>
            <div>Expert guidance</div>
            <div>Virtual meeting</div>
          </div>
        </div>
      </section>
    )
  }
})

// Mock Lucide React icons for the hero section
jest.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  User: () => <div data-testid="user-icon" />,
  Video: () => <div data-testid="video-icon" />
}))

describe('BookConsultationPage', () => {

  it('renders the enhanced hero section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByText('Free Consultation Available')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /book your consultation/i })).toBeInTheDocument()
    expect(screen.getByText(/transform your workflows with intelligent automation expertise/i)).toBeInTheDocument()
  })

  it('renders consultation detail cards in hero section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByText('30-45 minutes')).toBeInTheDocument()
    expect(screen.getByText('Free consultation')).toBeInTheDocument()
    expect(screen.getByText('Expert guidance')).toBeInTheDocument()
    expect(screen.getByText('Virtual meeting')).toBeInTheDocument()
  })

  it('renders the page with correct title and description', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByRole('heading', { name: /book your consultation/i })).toBeInTheDocument()
    expect(screen.getByText(/transform your workflows with intelligent automation expertise/i)).toBeInTheDocument()
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