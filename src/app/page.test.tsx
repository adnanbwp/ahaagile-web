import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Homepage', () => {
  it('renders the "Aha Agile Coming Soon" text', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { 
      name: /aha agile coming soon/i 
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders with correct styling classes', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-center', 'p-24')
    
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('text-4xl', 'font-bold')
  })
})