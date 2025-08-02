import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import '@/styles/themes/ocean.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/lib/theme-context'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sourceSerif4 = Source_Serif_4({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-source-serif-4',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aha Agile',
  description: 'Aha Agile Coming Soon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.variable} ${sourceSerif4.variable} font-sans`}>
        <ThemeProvider>
          {/* Skip Links for Accessibility */}
          <a 
            href="#main-content" 
            className="skip-link focus-visible-only"
            tabIndex={1}
          >
            Skip to main content
          </a>
          <a 
            href="#main-navigation" 
            className="skip-link focus-visible-only"
            tabIndex={2}
          >
            Skip to navigation
          </a>
          
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
          
          {/* Theme Switcher - Global accessibility for development */}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  )
}