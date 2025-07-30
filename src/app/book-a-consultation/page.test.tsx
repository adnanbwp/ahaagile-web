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

// Mock the BenefitsSidebar component
jest.mock('@/components/sections/BenefitsSidebar', () => {
  return function MockBenefitsSidebar({ className }: { className?: string }) {
    return (
      <div className={className} data-testid="benefits-sidebar">
        <h3>Why Book a Consultation?</h3>
        <div>Personalized Assessment</div>
        <div>Expert Guidance</div>
        <div>Custom Roadmap</div>
        <div>No Commitment</div>
        <div>4.9/5</div>
        <div>Based on 150+ consultations</div>
      </div>
    )
  }
})

// Mock the WhatToExpectSection component  
jest.mock('@/components/sections/WhatToExpectSection', () => {
  return function MockWhatToExpectSection() {
    return (
      <section data-testid="what-to-expect-section">
        <h2>What to Expect in Your Consultation</h2>
        <div>Assessment:</div>
        <div>Strategy:</div>
        <div>Next Steps:</div>
      </section>
    )
  }
})

// Mock the CTASection component
jest.mock('@/components/sections/CTASection', () => {
  return function MockCTASection() {
    return (
      <section data-testid="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Book your free consultation today and discover how intelligent workflow automation can transform your business operations.</p>
        <button>Book Consultation Now</button>
        <a href="mailto:info@ahaagile.com">Have Questions? Contact Us</a>
      </section>
    )
  }
})

// Mock Lucide React icons for the hero section
jest.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  User: () => <div data-testid="user-icon" />,
  Video: () => <div data-testid="video-icon" />,
  Check: () => <div data-testid="check-icon" />,
  Star: () => <div data-testid="star-icon" />
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

  it('renders the what to expect section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByTestId('what-to-expect-section')).toBeInTheDocument()
    expect(screen.getByText(/what to expect in your consultation/i)).toBeInTheDocument()
    expect(screen.getByText(/assessment:/i)).toBeInTheDocument()
    expect(screen.getByText(/strategy:/i)).toBeInTheDocument()
    expect(screen.getByText(/next steps:/i)).toBeInTheDocument()
  })

  it('renders the enhanced Calendly widget', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByTestId('calendly-widget')).toBeInTheDocument()
    expect(screen.getByText(/schedule your consultation/i)).toBeInTheDocument()
  })

  it('renders the benefits sidebar', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByTestId('benefits-sidebar')).toBeInTheDocument()
    expect(screen.getByText('Why Book a Consultation?')).toBeInTheDocument()
    expect(screen.getByText('Personalized Assessment')).toBeInTheDocument()
    expect(screen.getByText('Expert Guidance')).toBeInTheDocument()
    expect(screen.getByText('Custom Roadmap')).toBeInTheDocument()
    expect(screen.getByText('No Commitment')).toBeInTheDocument()
  })

  it('renders social proof in benefits sidebar', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByText('4.9/5')).toBeInTheDocument()
    expect(screen.getByText('Based on 150+ consultations')).toBeInTheDocument()
  })

  it('renders additional information section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByText(/use the calendar above to book/i)).toBeInTheDocument()
  })

  it('renders CTA section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByTestId('cta-section')).toBeInTheDocument()
    expect(screen.getByText('Book Consultation Now')).toBeInTheDocument()
    expect(screen.getByText('Have Questions? Contact Us')).toBeInTheDocument()
  })
})