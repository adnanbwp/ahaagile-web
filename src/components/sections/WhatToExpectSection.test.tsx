import { render, screen } from '@testing-library/react'
import WhatToExpectSection from './WhatToExpectSection'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Search: ({ className }: { className?: string }) => (
    <div data-testid="search-icon" className={className}>Search Icon</div>
  ),
  Target: ({ className }: { className?: string }) => (
    <div data-testid="target-icon" className={className}>Target Icon</div>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <div data-testid="arrow-right-icon" className={className}>Arrow Right Icon</div>
  ),
}))

describe('WhatToExpectSection', () => {
  beforeEach(() => {
    render(<WhatToExpectSection />)
  })

  describe('Section Structure', () => {
    it('renders the main section with correct heading', () => {
      const heading = screen.getByRole('heading', { 
        name: /what to expect in your consultation/i 
      })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('font-heading', 'text-3xl', 'lg:text-4xl', 'font-bold', 'text-primary-800')
    })

    it('renders the section description', () => {
      const description = screen.getByText(/our structured approach ensures you get maximum value/i)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-lg', 'text-secondary-600', 'font-serif')
    })

    it('applies correct background gradient and styling', () => {
      const section = screen.getByText(/what to expect in your consultation/i).closest('section')
      expect(section).toHaveClass(
        'relative', 
        'py-16', 
        'lg:py-24', 
        'bg-gradient-to-br', 
        'from-secondary-50', 
        'via-white', 
        'to-primary-50'
      )
    })
  })

  describe('Benefit Cards', () => {
    it('renders all three benefit cards', () => {
      // Assessment card
      expect(screen.getByText('Comprehensive Assessment')).toBeInTheDocument()
      expect(screen.getByText(/analysis of current workflows and identification/i)).toBeInTheDocument()
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()

      // Strategy card
      expect(screen.getByText('Custom Strategy')).toBeInTheDocument()
      expect(screen.getByText(/development of tailored automation roadmap/i)).toBeInTheDocument()
      expect(screen.getByTestId('target-icon')).toBeInTheDocument()

      // Next Steps card
      expect(screen.getByText('Clear Next Steps')).toBeInTheDocument()
      expect(screen.getByText(/actionable implementation plan and ongoing support/i)).toBeInTheDocument()
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument()
    })

    it('applies correct styling to card titles', () => {
      const titles = [
        'Comprehensive Assessment',
        'Custom Strategy', 
        'Clear Next Steps'
      ]

      titles.forEach(title => {
        const titleElement = screen.getByText(title)
        expect(titleElement).toHaveClass(
          'font-heading',
          'font-semibold', 
          'text-xl',
          'text-primary-800'
        )
      })
    })

    it('applies correct styling to card descriptions', () => {
      const descriptions = [
        /analysis of current workflows and identification/i,
        /development of tailored automation roadmap/i,
        /actionable implementation plan and ongoing support/i
      ]

      descriptions.forEach(description => {
        const descElement = screen.getByText(description)
        expect(descElement).toHaveClass(
          'text-secondary-600',
          'leading-relaxed',
          'font-serif',
          'text-base'
        )
      })
    })

    it('renders card icons with correct styling', () => {
      const icons = ['search-icon', 'target-icon', 'arrow-right-icon']
      
      icons.forEach(iconTestId => {
        const icon = screen.getByTestId(iconTestId)
        expect(icon).toHaveClass('w-8', 'h-8', 'text-white')
      })
    })
  })

  describe('Interactive Effects', () => {
    it('applies hover and transition classes to cards', () => {
      // Get the cards by finding elements with Card component classes
      const cardTitles = ['Comprehensive Assessment', 'Custom Strategy', 'Clear Next Steps']
      
      cardTitles.forEach(title => {
        const card = screen.getByText(title).closest('.group')
        expect(card).toHaveClass(
          'group',
          'hover:shadow-accent',
          'hover:scale-105',
          'transition-all',
          'duration-300'
        )
      })
    })

    it('applies hover effects to icon containers', () => {
      // Icon containers should have gradient backgrounds and hover scale effects
      const section = screen.getByText(/what to expect in your consultation/i).closest('section')
      expect(section).toBeInTheDocument()
      
      // Test that hover classes are present in the component
      const componentHTML = section!.innerHTML
      expect(componentHTML).toContain('group-hover:scale-110')
      expect(componentHTML).toContain('bg-gradient-accent')
      expect(componentHTML).toContain('backdrop-blur-sm')
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive grid layout', () => {
      const section = screen.getByText(/what to expect in your consultation/i).closest('section')
      const gridContainer = section!.querySelector('.grid')
      expect(gridContainer).toHaveClass(
        'grid',
        'grid-cols-1',
        'md:grid-cols-3',
        'gap-8',
        'lg:gap-12'
      )
    })

    it('applies responsive typography classes', () => {
      const heading = screen.getByRole('heading', { 
        name: /what to expect in your consultation/i 
      })
      expect(heading).toHaveClass('text-3xl', 'lg:text-4xl')
    })

    it('applies responsive padding classes', () => {
      const section = screen.getByText(/what to expect in your consultation/i).closest('section')
      expect(section).toHaveClass('py-16', 'lg:py-24')
    })
  })

  describe('Accessibility', () => {
    it('uses proper semantic HTML structure', () => {
      // Main heading should be h2
      const mainHeading = screen.getByRole('heading', { 
        name: /what to expect in your consultation/i 
      })
      expect(mainHeading.tagName).toBe('H2')

      // Card titles should be h3
      const cardTitles = screen.getAllByRole('heading', { level: 3 })
      expect(cardTitles).toHaveLength(3)
    })

    it('provides meaningful text content for screen readers', () => {
      // All cards should have descriptive content
      expect(screen.getByText(/analysis of current workflows and identification of automation opportunities/i)).toBeInTheDocument()
      expect(screen.getByText(/development of tailored automation roadmap based on your specific requirements/i)).toBeInTheDocument()
      expect(screen.getByText(/actionable implementation plan and ongoing support guidance/i)).toBeInTheDocument()
    })

    it('maintains proper heading hierarchy', () => {
      const headings = screen.getAllByRole('heading')
      
      // Should have one h2 (main heading) and three h3s (card titles)
      const h2Elements = headings.filter(h => h.tagName === 'H2')
      const h3Elements = headings.filter(h => h.tagName === 'H3')
      
      expect(h2Elements).toHaveLength(1)
      expect(h3Elements).toHaveLength(3)
    })
  })

  describe('Design System Integration', () => {
    it('uses correct brand colors from design system', () => {
      const heading = screen.getByRole('heading', { 
        name: /what to expect in your consultation/i 
      })
      expect(heading).toHaveClass('text-primary-800')

      const description = screen.getByText(/our structured approach ensures/i)
      expect(description).toHaveClass('text-secondary-600')
    })

    it('uses correct font families from design system', () => {
      const heading = screen.getByRole('heading', { 
        name: /what to expect in your consultation/i 
      })
      expect(heading).toHaveClass('font-heading')

      const description = screen.getByText(/our structured approach ensures/i)
      expect(description).toHaveClass('font-serif')
    })

    it('integrates with shadcn/ui Card component', () => {
      // Cards should be rendered (testing presence of card content)
      expect(screen.getByText('Comprehensive Assessment')).toBeInTheDocument()
      expect(screen.getByText('Custom Strategy')).toBeInTheDocument()
      expect(screen.getByText('Clear Next Steps')).toBeInTheDocument()
    })
  })
})

describe('WhatToExpectSection Snapshot', () => {
  it('matches snapshot to prevent visual regression', () => {
    const { container } = render(<WhatToExpectSection />)
    expect(container.firstChild).toMatchSnapshot()
  })
})