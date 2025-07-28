import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer Component', () => {
  const currentYear = new Date().getFullYear()

  describe('Rendering and Basic Structure', () => {
    it('renders footer with brand logo and description', () => {
      render(<Footer />)
      
      const logo = screen.getByRole('link', { name: /aha agile/i })
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('href', '/')
      
      const description = screen.getByText(/intelligent workflow automation for professional services/i)
      expect(description).toBeInTheDocument()
    })

    it('renders copyright notice with current year', () => {
      render(<Footer />)
      
      const copyrightText = screen.getByText(new RegExp(`© ${currentYear} Aha Agile`))
      expect(copyrightText).toBeInTheDocument()
    })

    it('applies correct styling classes from design system', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('bg-gradient-navy', 'text-white', 'relative', 'overflow-hidden')
    })

    it('has proper responsive grid layout', () => {
      render(<Footer />)
      
      const gridContainer = screen.getByRole('contentinfo').querySelector('.grid.grid-cols-1.md\\:grid-cols-3')
      expect(gridContainer).toBeInTheDocument()
    })
  })

  describe('Navigation Links Section', () => {
    it('renders Quick Links section with navigation', () => {
      render(<Footer />)
      
      expect(screen.getByText('Quick Links')).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: /footer navigation/i })).toBeInTheDocument()
    })

    it('renders all main navigation links', () => {
      render(<Footer />)
      
      const servicesLink = screen.getByRole('link', { name: /^services$/i })
      expect(servicesLink).toBeInTheDocument()
      expect(servicesLink).toHaveAttribute('href', '/services')
      
      const caseStudyLink = screen.getByRole('link', { name: /^case study$/i })
      expect(caseStudyLink).toBeInTheDocument()
      expect(caseStudyLink).toHaveAttribute('href', '/case-study')
      
      const consultationLink = screen.getByRole('link', { name: /^book a consultation$/i })
      expect(consultationLink).toBeInTheDocument()
      expect(consultationLink).toHaveAttribute('href', '/book-a-consultation')
    })

    it('applies correct styling to navigation links', () => {
      render(<Footer />)
      
      const servicesLink = screen.getByRole('link', { name: /^services$/i })
      expect(servicesLink).toHaveClass('text-secondary-300', 'hover:text-accent-300', 'focus-brand')
    })
  })

  describe('Contact Section', () => {
    it('renders Get in Touch section with CTA', () => {
      render(<Footer />)
      
      expect(screen.getByText('Get in Touch')).toBeInTheDocument()
      expect(screen.getByText(/ready to transform your workflows/i)).toBeInTheDocument()
      
      const scheduleButton = screen.getByRole('link', { name: /schedule a call/i })
      expect(scheduleButton).toBeInTheDocument()
      expect(scheduleButton).toHaveAttribute('href', '/book-a-consultation')
    })

    it('applies btn-accent styling to CTA button', () => {
      render(<Footer />)
      
      const scheduleButton = screen.getByRole('link', { name: /schedule a call/i })
      expect(scheduleButton).toHaveClass('btn-accent', 'hover:scale-105')
    })

    it('includes arrow icon in CTA button', () => {
      render(<Footer />)
      
      const scheduleButton = screen.getByRole('link', { name: /schedule a call/i })
      const arrowIcon = scheduleButton.querySelector('svg')
      expect(arrowIcon).toBeInTheDocument()
      expect(arrowIcon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Social Links Section', () => {
    it('renders social media links with proper attributes', () => {
      render(<Footer />)
      
      const linkedInLink = screen.getByLabelText('LinkedIn')
      expect(linkedInLink).toBeInTheDocument()
      expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/company/aha-agile')
      expect(linkedInLink).toHaveAttribute('target', '_blank')
      expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer')
      
      const emailLink = screen.getByLabelText('Email')
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute('href', 'mailto:hello@ahaagile.com.au')
      expect(emailLink).toHaveAttribute('target', '_blank')
      expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('includes proper SVG icons for social links', () => {
      render(<Footer />)
      
      const linkedInLink = screen.getByLabelText('LinkedIn')
      const linkedInIcon = linkedInLink.querySelector('svg')
      expect(linkedInIcon).toBeInTheDocument()
      expect(linkedInIcon).toHaveAttribute('aria-hidden', 'true')
      
      const emailLink = screen.getByLabelText('Email')
      const emailIcon = emailLink.querySelector('svg')
      expect(emailIcon).toBeInTheDocument()
      expect(emailIcon).toHaveAttribute('aria-hidden', 'true')
    })

    it('applies correct styling to social links', () => {
      render(<Footer />)
      
      const linkedInLink = screen.getByLabelText('LinkedIn')
      expect(linkedInLink).toHaveClass('text-secondary-300', 'hover:text-accent-300', 'focus-brand')
    })
  })

  describe('Bottom Bar Section', () => {
    it('renders legal links in bottom bar', () => {
      render(<Footer />)
      
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
      expect(privacyLink).toBeInTheDocument()
      expect(privacyLink).toHaveAttribute('href', '/privacy-policy')
      
      const termsLink = screen.getByRole('link', { name: /terms of service/i })
      expect(termsLink).toBeInTheDocument()
      expect(termsLink).toHaveAttribute('href', '/terms-of-service')
    })

    it('applies correct styling to legal links', () => {
      render(<Footer />)
      
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
      expect(privacyLink).toHaveClass('text-secondary-400', 'hover:text-accent-300', 'focus-brand')
    })

    it('has proper border separator for bottom bar', () => {
      render(<Footer />)
      
      const bottomBar = screen.getByRole('contentinfo').querySelector('.border-t.border-secondary-700')
      expect(bottomBar).toBeInTheDocument()
    })
  })

  describe('Brand and Design System Integration', () => {
    it('uses Inter font for headings', () => {
      render(<Footer />)
      
      const quickLinksHeading = screen.getByText('Quick Links')
      expect(quickLinksHeading).toHaveClass('font-heading')
      
      const contactHeading = screen.getByText('Get in Touch')
      expect(contactHeading).toHaveClass('font-heading')
    })

    it('applies brand colors consistently', () => {
      render(<Footer />)
      
      const logo = screen.getByRole('link', { name: /aha agile/i })
      expect(logo).toHaveClass('text-white', 'hover:text-accent-300')
      
      const description = screen.getByText(/intelligent workflow automation/i)
      expect(description).toHaveClass('text-secondary-300', 'font-serif')
    })

    it('includes focus-brand class for accessibility', () => {
      render(<Footer />)
      
      const logo = screen.getByRole('link', { name: /aha agile/i })
      expect(logo).toHaveClass('focus-brand')
      
      const servicesLink = screen.getByRole('link', { name: /^services$/i })
      expect(servicesLink).toHaveClass('focus-brand')
    })
  })

  describe('Background Pattern and Visual Design', () => {
    it('includes subtle background pattern overlay', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      const backgroundPattern = footer.querySelector('.absolute.inset-0.opacity-5')
      expect(backgroundPattern).toBeInTheDocument()
      
      const gradientOverlay = backgroundPattern?.querySelector('.bg-gradient-to-br.from-accent-400')
      expect(gradientOverlay).toBeInTheDocument()
    })

    it('has proper relative positioning for content layering', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('relative')
      
      const contentWrapper = footer.querySelector('.relative')
      expect(contentWrapper).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('has responsive layout classes for mobile-first design', () => {
      render(<Footer />)
      
      const gridContainer = screen.getByRole('contentinfo').querySelector('.grid-cols-1.md\\:grid-cols-3')
      expect(gridContainer).toBeInTheDocument()
      
      const bottomBarFlex = screen.getByRole('contentinfo').querySelector('.flex-col.md\\:flex-row')
      expect(bottomBarFlex).toBeInTheDocument()
    })

    it('applies proper spacing and padding for different screen sizes', () => {
      render(<Footer />)
      
      const mainContent = screen.getByRole('contentinfo').querySelector('.py-12')
      expect(mainContent).toBeInTheDocument()
      
      const bottomBar = screen.getByRole('contentinfo').querySelector('.py-6')
      expect(bottomBar).toBeInTheDocument()
    })
  })

  describe('Accessibility Features', () => {
    it('has proper semantic structure with contentinfo role', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer.tagName).toBe('FOOTER')
    })

    it('includes proper aria-labels for navigation sections', () => {
      render(<Footer />)
      
      const footerNav = screen.getByRole('navigation', { name: /footer navigation/i })
      expect(footerNav).toBeInTheDocument()
    })

    it('has accessible external link attributes', () => {
      render(<Footer />)
      
      const linkedInLink = screen.getByLabelText('LinkedIn')
      expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer')
      
      const emailLink = screen.getByLabelText('Email')
      expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('includes aria-hidden for decorative icons', () => {
      render(<Footer />)
      
      const allIcons = screen.getByRole('contentinfo').querySelectorAll('svg[aria-hidden="true"]')
      expect(allIcons.length).toBeGreaterThan(0)
    })
  })
})