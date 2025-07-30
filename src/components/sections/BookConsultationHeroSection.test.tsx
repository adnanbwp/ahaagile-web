import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BookConsultationHeroSection from './BookConsultationHeroSection'

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Clock: ({ className }: { className?: string }) => <div data-testid="clock-icon" className={className} />,
  CheckCircle: ({ className }: { className?: string }) => <div data-testid="check-circle-icon" className={className} />,
  User: ({ className }: { className?: string }) => <div data-testid="user-icon" className={className} />,
  Video: ({ className }: { className?: string }) => <div data-testid="video-icon" className={className} />
}))

describe('BookConsultationHeroSection', () => {
  beforeEach(() => {
    render(<BookConsultationHeroSection />)
  })

  describe('Headline and Badge Rendering', () => {
    it('renders the main headline correctly', () => {
      const headline = screen.getByRole('heading', { level: 1 })
      expect(headline).toHaveTextContent('Book Your Consultation')
      expect(headline).toHaveClass('text-hero', 'text-white')
    })

    it('renders the free consultation badge prominently', () => {
      const badge = screen.getByText('Free Consultation Available')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-accent-400/20', 'text-accent-400')
    })
  })

  describe('Compelling Copy Content', () => {
    it('renders the main value proposition', () => {
      const mainCopy = screen.getByText('Transform your workflows with intelligent automation expertise')
      expect(mainCopy).toBeInTheDocument()
      expect(mainCopy).toHaveClass('text-subhero', 'text-white/90')
    })

    it('renders detailed description about transformation benefits', () => {
      const description = screen.getByText(/Our consultants have helped dozens of professional services firms/)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-lg', 'text-white/80', 'font-serif')
    })
  })

  describe('Consultation Detail Cards', () => {
    it('renders all four consultation detail cards', () => {
      expect(screen.getByText('30-45 minutes')).toBeInTheDocument()
      expect(screen.getByText('Free consultation')).toBeInTheDocument()
      expect(screen.getByText('Expert guidance')).toBeInTheDocument()
      expect(screen.getByText('Virtual meeting')).toBeInTheDocument()
    })

    it('renders consultation detail descriptions', () => {
      expect(screen.getByText('Focused discussion')).toBeInTheDocument()
      expect(screen.getByText('No cost or commitment')).toBeInTheDocument()
      expect(screen.getByText('Personalized insights')).toBeInTheDocument()
      expect(screen.getByText('Convenient online format')).toBeInTheDocument()
    })

    it('renders proper icons for each consultation detail', () => {
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument()
      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
      expect(screen.getByTestId('video-icon')).toBeInTheDocument()
    })

    it('applies correct styling to consultation cards', () => {
      const cards = screen.getAllByText(/30-45 minutes|Free consultation|Expert guidance|Virtual meeting/).map(text => text.closest('[class*="bg-white/10"]'))
      cards.forEach(card => {
        expect(card).toHaveClass('bg-white/10', 'backdrop-blur-sm', 'border-white/20')
      })
    })
  })

  describe('Design System Integration', () => {
    it('applies gradient hero background', () => {
      const section = screen.getByText('Book Your Consultation').closest('section')
      expect(section).toHaveClass('bg-gradient-hero')
    })

    it('uses proper brand typography classes', () => {
      const headline = screen.getByRole('heading', { level: 1 })
      expect(headline).toHaveClass('text-hero')
      
      const subheading = screen.getByText('Transform your workflows with intelligent automation expertise')
      expect(subheading).toHaveClass('text-subhero')
    })

    it('applies proper brand colors for accent elements', () => {
      const badge = screen.getByText('Free Consultation Available')
      expect(badge).toHaveClass('text-accent-400')
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive grid classes to consultation cards', () => {
      const cardsContainer = screen.getByText('30-45 minutes').closest('[class*="grid"]')
      expect(cardsContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4')
    })

    it('applies responsive spacing classes', () => {
      const section = screen.getByText('Book Your Consultation').closest('section')
      const container = section?.querySelector('[class*="container-brand"]')
      expect(container).toHaveClass('py-16', 'lg:py-24')
    })

    it('uses responsive text sizing for main content', () => {
      const headline = screen.getByRole('heading', { level: 1 })
      expect(headline).toHaveClass('text-hero') // Uses responsive text-hero utility
    })
  })

  describe('Accessibility Compliance', () => {
    it('uses proper semantic HTML structure', () => {
      const section = screen.getByText('Book Your Consultation').closest('section')
      expect(section).toBeInTheDocument()
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      
      const subHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(subHeadings).toHaveLength(4) // One for each consultation detail
    })

    it('provides meaningful text content for screen readers', () => {
      const consultationDetails = [
        { title: '30-45 minutes', description: 'Focused discussion' },
        { title: 'Free consultation', description: 'No cost or commitment' },
        { title: 'Expert guidance', description: 'Personalized insights' },
        { title: 'Virtual meeting', description: 'Convenient online format' }
      ]
      
      consultationDetails.forEach(({ title, description }) => {
        expect(screen.getByText(title)).toBeInTheDocument()
        expect(screen.getByText(description)).toBeInTheDocument()
      })
    })

    it('includes proper heading hierarchy', () => {
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Book Your Consultation')
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements).toHaveLength(4)
      expect(h3Elements[0]).toHaveTextContent('30-45 minutes')
      expect(h3Elements[1]).toHaveTextContent('Free consultation')
      expect(h3Elements[2]).toHaveTextContent('Expert guidance')
      expect(h3Elements[3]).toHaveTextContent('Virtual meeting')
    })
  })

  describe('Visual Effects and Professional Styling', () => {
    it('includes background gradient effects', () => {
      const section = screen.getByText('Book Your Consultation').closest('section')
      const gradientOverlay = section?.querySelector('[class*="bg-gradient-to-br"]')
      expect(gradientOverlay).toHaveClass('from-primary-900/20', 'to-accent-900/10')
    })

    it('includes decorative blur elements', () => {
      const section = screen.getByText('Book Your Consultation').closest('section')
      const blurElements = section?.querySelectorAll('[class*="blur-"]')
      expect(blurElements?.length).toBeGreaterThan(0)
    })

    it('applies hover effects to consultation cards', () => {
      const card = screen.getByText('30-45 minutes').closest('[class*="hover:bg-white/15"]')
      expect(card).toHaveClass('hover:bg-white/15', 'transition-all', 'duration-300')
    })
  })

  describe('Content Integration', () => {
    it('emphasizes value proposition with professional messaging', () => {
      expect(screen.getByText(/Transform your workflows with intelligent automation expertise/)).toBeInTheDocument()
      expect(screen.getByText(/dozens of professional services firms/)).toBeInTheDocument()
      expect(screen.getByText(/measurable productivity gains/)).toBeInTheDocument()
    })

    it('provides clear consultation format details', () => {
      expect(screen.getByText('Virtual meeting')).toBeInTheDocument()
      expect(screen.getByText('Convenient online format')).toBeInTheDocument()
      expect(screen.getByText('Free consultation')).toBeInTheDocument()
      expect(screen.getByText('No cost or commitment')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('maintains proper component hierarchy with section wrapper', () => {
      const section = screen.getByText('Book Your Consultation').closest('section')
      expect(section).toHaveClass('relative', 'min-h-[60vh]', 'flex', 'items-center', 'justify-center')
    })

    it('uses container utility for proper layout constraints', () => {
      const section = screen.getByText('Book Your Consultation').closest('section')
      const container = section?.querySelector('[class*="container-brand"]')
      expect(container).toHaveClass('container-brand')
    })
  })
})