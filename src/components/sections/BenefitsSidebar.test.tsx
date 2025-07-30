import { render, screen } from '@testing-library/react'
import BenefitsSidebar from './BenefitsSidebar'

describe('BenefitsSidebar', () => {
  it('renders the main heading', () => {
    render(<BenefitsSidebar />)
    
    expect(screen.getByText('Why Book a Consultation?')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<BenefitsSidebar className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders all four benefit items with correct titles', () => {
    render(<BenefitsSidebar />)
    
    expect(screen.getByText('Personalized Assessment')).toBeInTheDocument()
    expect(screen.getByText('Expert Guidance')).toBeInTheDocument()
    expect(screen.getByText('Custom Roadmap')).toBeInTheDocument()
    expect(screen.getByText('No Commitment')).toBeInTheDocument()
  })

  it('renders all benefit descriptions correctly', () => {
    render(<BenefitsSidebar />)
    
    expect(screen.getByText(/tailored analysis of your specific workflow challenges/i)).toBeInTheDocument()
    expect(screen.getByText(/15\+ years of experience helping businesses/i)).toBeInTheDocument()
    expect(screen.getByText(/strategic implementation plan designed specifically/i)).toBeInTheDocument()
    expect(screen.getByText(/free 30-45 minute consultation with zero obligation/i)).toBeInTheDocument()
  })

  it('renders checkmark icons for each benefit', () => {
    const { container } = render(<BenefitsSidebar />)
    
    // Should have 4 checkmark icons (one for each benefit)
    const checkIcons = container.querySelectorAll('svg')
    const checkmarkIcons = Array.from(checkIcons).filter(icon => 
      icon.getAttribute('class')?.includes('lucide-check')
    )
    expect(checkmarkIcons).toHaveLength(4)
  })

  describe('Social Proof Card', () => {
    it('displays the correct star rating', () => {
      render(<BenefitsSidebar />)
      
      expect(screen.getByText('4.9/5')).toBeInTheDocument()
    })

    it('shows testimonial count', () => {
      render(<BenefitsSidebar />)
      
      expect(screen.getByText('Based on 150+ consultations')).toBeInTheDocument()
    })

    it('displays the testimonial quote', () => {
      render(<BenefitsSidebar />)
      
      expect(screen.getByText(/aha agile transformed our workflows and saved us 20\+ hours per week/i)).toBeInTheDocument()
    })

    it('shows attribution for testimonial', () => {
      render(<BenefitsSidebar />)
      
      expect(screen.getByText('- Sarah M., Operations Director')).toBeInTheDocument()
    })

    it('renders star rating with correct styling', () => {
      const { container } = render(<BenefitsSidebar />)
      
      // Should have 5 star icons
      const starIcons = container.querySelectorAll('svg')
      const starRatingIcons = Array.from(starIcons).filter(icon => 
        icon.getAttribute('class')?.includes('lucide-star')
      )
      expect(starRatingIcons).toHaveLength(5)
    })
  })

  describe('Professional Styling', () => {
    it('applies backdrop blur and gradient styling to benefits card', () => {
      const { container } = render(<BenefitsSidebar />)
      
      const benefitsCard = container.querySelector('.bg-white\\/90.backdrop-blur-sm')
      expect(benefitsCard).toBeInTheDocument()
      expect(benefitsCard).toHaveClass('rounded-2xl', 'shadow-brand')
    })

    it('applies backdrop blur and gradient styling to social proof card', () => {
      const { container } = render(<BenefitsSidebar />)
      
      const cards = container.querySelectorAll('.bg-white\\/90.backdrop-blur-sm')
      expect(cards).toHaveLength(2) // Benefits card + Social proof card
    })

    it('applies Inter font to headings', () => {
      render(<BenefitsSidebar />)
      
      const mainHeading = screen.getByText('Why Book a Consultation?')
      expect(mainHeading).toHaveClass('font-inter')
      
      const benefitTitle = screen.getByText('Personalized Assessment')
      expect(benefitTitle).toHaveClass('font-inter')
    })

    it('applies Source Serif 4 font to descriptions', () => {
      render(<BenefitsSidebar />)
      
      const description = screen.getByText(/tailored analysis of your specific workflow challenges/i)
      expect(description).toHaveClass('font-source-serif-4')
    })

    it('renders gradient background overlays', () => {
      const { container } = render(<BenefitsSidebar />)
      
      const gradientOverlays = container.querySelectorAll('.absolute.inset-0.bg-gradient-to-br')
      expect(gradientOverlays).toHaveLength(2) // One for each card
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure with headings', () => {
      render(<BenefitsSidebar />)
      
      const mainHeading = screen.getByRole('heading', { level: 3 })
      expect(mainHeading).toHaveTextContent('Why Book a Consultation?')
      
      const benefitHeadings = screen.getAllByRole('heading', { level: 4 })
      expect(benefitHeadings).toHaveLength(4)
    })

    it('uses proper blockquote element for testimonial', () => {
      const { container } = render(<BenefitsSidebar />)
      
      const blockquote = container.querySelector('blockquote')
      expect(blockquote).toBeInTheDocument()
      expect(blockquote).toHaveTextContent(/aha agile transformed our workflows/i)
    })

    it('uses proper cite element for attribution', () => {
      const { container } = render(<BenefitsSidebar />)
      
      const cite = container.querySelector('cite')
      expect(cite).toBeInTheDocument()
      expect(cite).toHaveTextContent('- Sarah M., Operations Director')
    })
  })

  describe('Responsive Design', () => {
    it('has proper spacing classes for mobile and desktop', () => {
      const { container } = render(<BenefitsSidebar />)
      
      const mainContainer = container.firstChild
      expect(mainContainer).toHaveClass('space-y-6')
    })

    it('maintains visual hierarchy with proper text sizing', () => {
      render(<BenefitsSidebar />)
      
      const mainHeading = screen.getByText('Why Book a Consultation?')
      expect(mainHeading).toHaveClass('text-2xl')
      
      const rating = screen.getByText('4.9/5')
      expect(rating).toHaveClass('text-sm')
    })
  })
})