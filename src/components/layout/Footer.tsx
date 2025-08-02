import Link from 'next/link'

interface FooterLink {
  href: string
  label: string
  external?: boolean
}

const footerLinks: FooterLink[] = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
]

const socialLinks: FooterLink[] = [
  { href: 'https://linkedin.com/company/aha-agile', label: 'LinkedIn', external: true },
  { href: 'mailto:hello@ahaagile.com.au', label: 'Email', external: true },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-navy text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-transparent" />
      </div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <Link 
                href="/" 
                className="text-2xl font-heading font-bold text-white hover:text-accent-300 transition-colors duration-200 focus-brand inline-block mb-4"
              >
                Aha Agile
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 font-serif">
                Intelligent workflow automation for professional services. 
                Transform your operations with our expert consultancy.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-shadcn-accent transition-colors duration-200 focus-brand"
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    aria-label={link.label}
                  >
                    {link.label === 'LinkedIn' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )}
                    {link.label === 'Email' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Quick Links
              </h3>
              <nav className="space-y-3" role="navigation" aria-label="Footer navigation">
                <Link 
                  href="/services" 
                  className="block text-muted-foreground hover:text-shadcn-accent transition-colors duration-200 focus-brand text-sm"
                >
                  Services
                </Link>
                <Link 
                  href="/case-study" 
                  className="block text-muted-foreground hover:text-shadcn-accent transition-colors duration-200 focus-brand text-sm"
                >
                  Case Study
                </Link>
                <Link 
                  href="/book-a-consultation" 
                  className="block text-muted-foreground hover:text-shadcn-accent transition-colors duration-200 focus-brand text-sm"
                >
                  Book a Consultation
                </Link>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Get in Touch
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Ready to transform your workflows?
                </p>
                <Link 
                  href="/book-a-consultation"
                  className="inline-flex items-center btn-accent text-sm px-4 py-2 hover:scale-105 transition-transform duration-200"
                >
                  Schedule a Call
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © {currentYear} Aha Agile. All rights reserved.
              </div>
              
              <div className="flex space-x-6">
                {footerLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-shadcn-accent transition-colors duration-200 focus-brand"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}