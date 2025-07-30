'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationItem {
  href: string
  label: string
  primary?: boolean
}

const navigationItems: NavigationItem[] = [
  { href: '/services', label: 'Services' },
  { href: '/case-study', label: 'Case Study' },
  { href: '/book-a-consultation', label: 'Book a Consultation', primary: true },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <header className="bg-white shadow-brand border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-2xl font-heading font-bold text-brand-navy hover:text-accent-600 transition-colors duration-200 focus-brand"
              tabIndex={0}
            >
              Aha Agile
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              item.primary ? (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="btn-primary text-sm px-6 py-2.5 ml-4 transition-all duration-200 hover:scale-105 focus-brand"
                  tabIndex={0}
                >
                  {item.label}
                </Link>
              ) : (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`font-inter font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200 focus-brand ${
                    isActiveLink(item.href)
                      ? 'text-brand-navy bg-secondary-100 border border-secondary-200'
                      : 'text-secondary-600 hover:text-brand-navy hover:bg-secondary-50'
                  }`}
                  tabIndex={0}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              type="button" 
              className="relative p-3 text-secondary-600 hover:text-brand-navy hover:bg-secondary-50 rounded-lg transition-colors duration-200 focus-brand min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {/* Animated hamburger icon */}
              <div className="w-6 h-6 relative">
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  }`}
                />
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`fixed top-20 left-0 right-0 bg-white border-b border-secondary-200 shadow-xl z-50 transform transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="px-4 py-6 space-y-1">
          {navigationItems.map((item, index) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`block font-inter font-medium px-4 py-3 rounded-lg text-base transition-all duration-200 focus-brand ${
                item.primary 
                  ? 'btn-primary text-center mt-4' 
                  : isActiveLink(item.href)
                    ? 'text-brand-navy bg-secondary-100 border border-secondary-200'
                    : 'text-secondary-600 hover:text-brand-navy hover:bg-secondary-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}