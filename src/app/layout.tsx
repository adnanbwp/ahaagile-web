import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
      <body className={`${inter.variable} ${sourceSerif4.variable} font-sans`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}