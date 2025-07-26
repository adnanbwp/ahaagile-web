import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders copyright notice with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} Aha Agile\\.`))
    expect(copyrightText).toBeInTheDocument()
  })

  it('renders Privacy Policy link', () => {
    render(<Footer />)
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
    expect(privacyLink).toBeInTheDocument()
    expect(privacyLink).toHaveAttribute('href', '/privacy-policy')
  })

  it('renders Terms of Service link', () => {
    render(<Footer />)
    const termsLink = screen.getByRole('link', { name: /terms of service/i })
    expect(termsLink).toBeInTheDocument()
    expect(termsLink).toHaveAttribute('href', '/terms-of-service')
  })

  it('applies correct CSS classes for styling', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('bg-secondary-800', 'text-white')
  })

  it('has responsive layout structure', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer.querySelector('.flex.flex-col.md\\:flex-row')).toBeInTheDocument()
  })
})