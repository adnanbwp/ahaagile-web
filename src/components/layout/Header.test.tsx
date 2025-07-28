import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import Header from './Header'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('Header Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
    // Reset body overflow style
    document.body.style.overflow = 'unset'
  })

  afterEach(() => {
    jest.clearAllMocks()
    document.body.style.overflow = 'unset'
  })

  describe('Rendering and Basic Structure', () => {
    it('renders header with brand logo', () => {
      render(<Header />)
      
      const logo = screen.getByRole('link', { name: /aha agile/i })
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('href', '/')
    })

    it('renders all navigation links in desktop menu', () => {
      render(<Header />)
      
      const mainNav = screen.getByRole('navigation', { name: /main navigation/i })
      
      const servicesLink = mainNav.querySelector('a[href="/services"]')
      expect(servicesLink).toBeInTheDocument()
      
      const caseStudyLink = mainNav.querySelector('a[href="/case-study"]')
      expect(caseStudyLink).toBeInTheDocument()
      
      const consultationLink = mainNav.querySelector('a[href="/book-a-consultation"]')
      expect(consultationLink).toBeInTheDocument()
    })

    it('renders mobile menu button', () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      expect(mobileButton).toBeInTheDocument()
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('applies correct styling classes from design system', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('bg-white', 'shadow-brand', 'sticky', 'top-0', 'z-50')
      
      const logo = screen.getByRole('link', { name: /aha agile/i })
      expect(logo).toHaveClass('text-brand-navy', 'font-heading', 'font-bold')
    })
  })

  describe('Mobile Menu Functionality', () => {
    it('opens mobile menu when hamburger button is clicked', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
        expect(mobileButton).toHaveAttribute('aria-expanded', 'true')
        expect(mobileButton).toHaveAttribute('aria-label', 'Close menu')
      })
    })

    it('closes mobile menu when overlay is clicked', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        const overlay = document.querySelector('.fixed.inset-0.bg-black')
        expect(overlay).toBeInTheDocument()
        
        if (overlay) {
          fireEvent.click(overlay)
        }
      })
      
      await waitFor(() => {
        expect(mobileButton).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('closes mobile menu when Escape key is pressed', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        expect(mobileButton).toHaveAttribute('aria-expanded', 'true')
      })
      
      fireEvent.keyDown(document, { key: 'Escape' })
      
      await waitFor(() => {
        expect(mobileButton).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('prevents body scroll when mobile menu is open', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })
      
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('unset')
      })
    })

    it('closes mobile menu when navigation link is clicked', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        expect(mobileButton).toHaveAttribute('aria-expanded', 'true')
      })
      
      const mobileNavigation = screen.getByRole('navigation', { name: /mobile navigation/i })
      const servicesLink = mobileNavigation.querySelector('a[href="/services"]')
      
      if (servicesLink) {
        fireEvent.click(servicesLink)
      }
      
      await waitFor(() => {
        expect(mobileButton).toHaveAttribute('aria-expanded', 'false')
      })
    })
  })

  describe('Active Link States', () => {
    it('highlights active navigation link', () => {
      mockUsePathname.mockReturnValue('/services')
      render(<Header />)
      
      const mainNav = screen.getByRole('navigation', { name: /main navigation/i })
      const servicesLink = mainNav.querySelector('a[href="/services"]')
      expect(servicesLink).toHaveClass('text-brand-navy', 'bg-secondary-100')
    })

    it('shows home as active when on root path', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Header />)
      
      const logo = screen.getByRole('link', { name: /aha agile/i })
      expect(logo).toHaveClass('text-brand-navy')
    })

    it('applies correct styling to non-active links', () => {
      mockUsePathname.mockReturnValue('/services')
      render(<Header />)
      
      const mainNav = screen.getByRole('navigation', { name: /main navigation/i })
      const caseStudyLink = mainNav.querySelector('a[href="/case-study"]')
      expect(caseStudyLink).toHaveClass('text-secondary-600')
      expect(caseStudyLink).not.toHaveClass('bg-secondary-100')
    })
  })

  describe('Accessibility Features', () => {
    it('has proper ARIA labels and roles', () => {
      render(<Header />)
      
      const mainNav = screen.getByRole('navigation', { name: /main navigation/i })
      expect(mainNav).toBeInTheDocument()
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      expect(mobileButton).toHaveAttribute('aria-controls', 'mobile-menu')
    })

    it('manages tabindex correctly for mobile menu links', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        const mobileNavigation = screen.getByRole('navigation', { name: /mobile navigation/i })
        const links = mobileNavigation.querySelectorAll('a')
        
        links.forEach(link => {
          expect(link).toHaveAttribute('tabindex', '0')
        })
      })
      
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        const mobileNavigation = screen.getByRole('navigation', { name: /mobile navigation/i })
        const links = mobileNavigation.querySelectorAll('a')
        
        links.forEach(link => {
          expect(link).toHaveAttribute('tabindex', '-1')
        })
      })
    })

    it('has screen reader text for mobile menu button', () => {
      render(<Header />)
      
      expect(screen.getByText(/open menu/i, { selector: '.sr-only' })).toBeInTheDocument()
    })

    it('applies focus-brand class for consistent focus styling', () => {
      render(<Header />)
      
      const logo = screen.getByRole('link', { name: /aha agile/i })
      expect(logo).toHaveClass('focus-brand')
      
      const allServicesLinks = screen.getAllByRole('link', { name: /services/i })
      const desktopServicesLink = allServicesLinks.find(link => 
        link.closest('nav[aria-label="Main navigation"]')
      )
      expect(desktopServicesLink).toHaveClass('focus-brand')
    })
  })

  describe('Animation and Transitions', () => {
    it('applies hamburger icon animation classes', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      const hamburgerSpans = mobileButton.querySelectorAll('span:not(.sr-only)')
      
      // Check initial state
      expect(hamburgerSpans[0]).toHaveClass('-translate-y-2')
      expect(hamburgerSpans[1]).toHaveClass('opacity-100')
      expect(hamburgerSpans[2]).toHaveClass('translate-y-2')
      
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        expect(hamburgerSpans[0]).toHaveClass('rotate-45', 'translate-y-0')
        expect(hamburgerSpans[1]).toHaveClass('opacity-0')
        expect(hamburgerSpans[2]).toHaveClass('-rotate-45', 'translate-y-0')
      })
    })

    it('applies mobile menu slide animation classes', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i })
        expect(mobileMenu).toHaveClass('translate-y-0', 'opacity-100')
      })
    })
  })

  describe('Responsive Design', () => {
    it('hides desktop navigation on mobile screens', () => {
      render(<Header />)
      
      const desktopNav = screen.getByRole('navigation', { name: /main navigation/i })
      expect(desktopNav).toHaveClass('hidden', 'md:flex')
    })

    it('hides mobile menu button on desktop screens', () => {
      render(<Header />)
      
      const mobileButtonContainer = screen.getByLabelText(/open menu/i).parentElement
      expect(mobileButtonContainer).toHaveClass('md:hidden')
    })
  })

  describe('Route Change Handling', () => {
    it('closes mobile menu when pathname changes', async () => {
      render(<Header />)
      
      const mobileButton = screen.getByLabelText(/open menu/i)
      fireEvent.click(mobileButton)
      
      await waitFor(() => {
        expect(mobileButton).toHaveAttribute('aria-expanded', 'true')
      })
      
      // Simulate route change
      mockUsePathname.mockReturnValue('/services')
      
      // Re-render with new pathname
      render(<Header />)
      
      const newMobileButton = screen.getByLabelText(/open menu/i)
      expect(newMobileButton).toHaveAttribute('aria-expanded', 'false')
    })
  })
})