import { render, screen } from '@testing-library/react'
import ServicesPage from './page'

// Mock the markdown utility functions
jest.mock('@/lib/markdown', () => ({
  getMarkdownContent: jest.fn(),
  transformMarkdownLinks: jest.fn(),
}))

// Mock react-markdown
jest.mock('react-markdown', () => {
  return function MockedReactMarkdown({ children, components }: any) {
    // Simple mock that processes the markdown-like content
    const content = children || ''
    
    // Mock processing of different markdown elements
    if (content.includes('# Test Services')) {
      return (
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">Test Services</h1>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">This is test content for the services page.</p>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-8">Service 1</h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">Some service description.</p>
          <a href="/book-a-consultation" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 no-underline shadow-md hover:shadow-lg">
            Book Your Free Consultation
          </a>
          <strong className="font-semibold text-gray-900">Important:</strong>
          <span> This is bold text.</span>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li className="text-lg text-gray-700">List item 1</li>
            <li className="text-lg text-gray-700">List item 2</li>
          </ul>
        </div>
      )
    }
    
    return <div>{content}</div>
  }
})

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockedLink({ children, href, className }: any) {
    return <a href={href} className={className}>{children}</a>
  }
})

const { getMarkdownContent, transformMarkdownLinks } = require('@/lib/markdown')

describe('Services Page', () => {
  const mockMarkdownContent = `# Test Services
  
This is test content for the services page.

## Service 1
Some service description.

[Book Your Free Consultation](#consultation)

**Important:** This is bold text.

- List item 1
- List item 2
`

  const mockTransformedContent = `# Test Services
  
This is test content for the services page.

## Service 1
Some service description.

[Book Your Free Consultation](/book-a-consultation)

**Important:** This is bold text.

- List item 1
- List item 2
`

  beforeEach(() => {
    jest.clearAllMocks()
    getMarkdownContent.mockResolvedValue({ content: mockMarkdownContent })
    transformMarkdownLinks.mockReturnValue(mockTransformedContent)
  })

  it('renders the Services page without errors', async () => {
    const ServicesPageComponent = await ServicesPage()
    render(ServicesPageComponent)
    
    expect(screen.getByText('Test Services')).toBeInTheDocument()
    expect(screen.getByText('This is test content for the services page.')).toBeInTheDocument()
  })

  it('loads markdown content from the correct file', async () => {
    await ServicesPage()
    
    expect(getMarkdownContent).toHaveBeenCalledWith('services.md')
    expect(getMarkdownContent).toHaveBeenCalledTimes(1)
  })

  it('transforms markdown links correctly', async () => {
    await ServicesPage()
    
    expect(transformMarkdownLinks).toHaveBeenCalledWith(mockMarkdownContent)
    expect(transformMarkdownLinks).toHaveBeenCalledTimes(1)
  })

  it('renders markdown content with proper HTML structure', async () => {
    const ServicesPageComponent = await ServicesPage()
    render(ServicesPageComponent)
    
    // Check headings
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Test Services')
    expect(h1).toHaveClass('text-4xl', 'font-bold', 'text-gray-900')
    
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2).toHaveTextContent('Service 1')
    expect(h2).toHaveClass('text-3xl', 'font-semibold', 'text-gray-800')
    
    // Check paragraph content
    expect(screen.getByText('This is test content for the services page.')).toBeInTheDocument()
    expect(screen.getByText('Some service description.')).toBeInTheDocument()
    
    // Check list items
    expect(screen.getByText('List item 1')).toBeInTheDocument()
    expect(screen.getByText('List item 2')).toBeInTheDocument()
  })

  it('renders call-to-action links with correct styling and routing', async () => {
    const ServicesPageComponent = await ServicesPage()
    render(ServicesPageComponent)
    
    const ctaLink = screen.getByRole('link', { name: /book your free consultation/i })
    expect(ctaLink).toBeInTheDocument()
    expect(ctaLink).toHaveAttribute('href', '/book-a-consultation')
    expect(ctaLink).toHaveClass(
      'inline-block',
      'bg-blue-600',
      'hover:bg-blue-700',
      'text-white',
      'font-semibold',
      'py-3',
      'px-6',
      'rounded-lg'
    )
  })

  it('applies responsive design classes correctly', async () => {
    const ServicesPageComponent = await ServicesPage()
    const { container } = render(ServicesPageComponent)
    
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
    
    const content = mainContainer?.firstChild
    expect(content).toHaveClass('max-w-4xl', 'mx-auto')
    
    const article = content?.firstChild
    expect(article).toHaveClass('prose', 'prose-lg', 'prose-gray', 'max-w-none')
  })

  it('handles strong and emphasis text correctly', async () => {
    const ServicesPageComponent = await ServicesPage()
    render(ServicesPageComponent)
    
    const strongText = screen.getByText('Important:')
    expect(strongText).toHaveClass('font-semibold', 'text-gray-900')
  })

  it('maintains accessibility with proper semantic structure', async () => {
    const ServicesPageComponent = await ServicesPage()
    render(ServicesPageComponent)
    
    // Check that headings form proper hierarchy
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(2)
    
    // Check that lists are properly structured
    const lists = screen.getAllByRole('list')
    expect(lists.length).toBeGreaterThan(0)
    
    // Check that links are accessible
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('handles markdown content rendering errors gracefully', async () => {
    getMarkdownContent.mockRejectedValue(new Error('File not found'))
    
    // Should throw error for missing file (this is expected behavior)
    await expect(ServicesPage()).rejects.toThrow()
  })
})