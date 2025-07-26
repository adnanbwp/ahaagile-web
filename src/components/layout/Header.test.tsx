import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders the Aha Agile branding', () => {
    render(<Header />)
    const brandingLink = screen.getByRole('link', { name: /aha agile/i })
    expect(brandingLink).toBeInTheDocument()
    expect(brandingLink).toHaveAttribute('href', '/')
  })

  it('renders navigation links for Services, Case Study, and Book a Consultation', () => {
    render(<Header />)
    
    const servicesLink = screen.getByRole('link', { name: /services/i })
    expect(servicesLink).toBeInTheDocument()
    expect(servicesLink).toHaveAttribute('href', '/services')

    const caseStudyLink = screen.getByRole('link', { name: /case study/i })
    expect(caseStudyLink).toBeInTheDocument()
    expect(caseStudyLink).toHaveAttribute('href', '/case-study')

    const consultationLink = screen.getByRole('link', { name: /book a consultation/i })
    expect(consultationLink).toBeInTheDocument()
    expect(consultationLink).toHaveAttribute('href', '/book-a-consultation')
  })

  it('renders mobile menu button', () => {
    render(<Header />)
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b', 'border-gray-200')
  })
})