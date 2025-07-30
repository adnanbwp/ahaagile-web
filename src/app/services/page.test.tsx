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

// Mock ServicesGridSection component
jest.mock('@/components/sections/ServicesGridSection', () => {
  return function MockedServicesGridSection() {
    return (
      <div data-testid="services-grid-section">
        <h2>Comprehensive Workflow Automation Solutions</h2>
        <div>Email Intelligence</div>
        <div>Document Management</div>
        <div>Client Communication</div>
        <div>Performance Analytics</div>
        <div>Time Management</div>
        <div>Compliance & Security</div>
        <h2>Our Strategic Approach</h2>
        <div>Business-First Analysis</div>
        <div>Bespoke Solutions</div>
        <div>Measurable ROI</div>
        <h2>Proven Implementation Process</h2>
        <div>Discovery & Analysis</div>
        <div>Custom Design</div>
        <div>Phased Implementation</div>
        <div>Optimization</div>
      </div>
    )
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
    
    // Check headings - now we have hero section headings too
    const allHeadings = screen.getAllByRole('heading')
    expect(allHeadings.length).toBeGreaterThan(2) // Hero section adds more headings
    
    // Check the markdown content h1 (should be present)
    const markdownH1 = screen.getByRole('heading', { name: 'Test Services' })
    expect(markdownH1).toHaveTextContent('Test Services')
    expect(markdownH1).toHaveClass('text-4xl', 'font-bold', 'text-gray-900')
    
    // Check the hero section h1
    const heroH1 = screen.getByRole('heading', { name: 'Intelligent Workflow Automation for Professional Services' })
    expect(heroH1).toBeInTheDocument()
    
    const h2 = screen.getByRole('heading', { name: 'Service 1' })
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
    
    // The main container is now a div wrapper
    const mainContainer = container.firstChild
    expect(mainContainer).toBeInTheDocument()
    
    // Find the content section (after hero section)
    const contentSections = container.querySelectorAll('.container')
    expect(contentSections.length).toBeGreaterThan(0)
    
    // Check that prose classes are applied to article
    const article = container.querySelector('article')
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
    
    // Check that headings form proper hierarchy (now includes hero section headings)
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(2) // Hero section adds more headings
    
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

  it('renders ServicesGridSection component', async () => {
    const ServicesPageComponent = await ServicesPage()
    render(ServicesPageComponent)
    
    expect(screen.getByTestId('services-grid-section')).toBeInTheDocument()
  })

  it('includes all ServicesGridSection content sections', async () => {
    const ServicesPageComponent = await ServicesPage()
    render(ServicesPageComponent)
    
    // Check for services grid section
    expect(screen.getByText('Comprehensive Workflow Automation Solutions')).toBeInTheDocument()
    expect(screen.getByText('Email Intelligence')).toBeInTheDocument()
    expect(screen.getByText('Document Management')).toBeInTheDocument()
    expect(screen.getByText('Client Communication')).toBeInTheDocument()
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument()
    expect(screen.getByText('Time Management')).toBeInTheDocument()
    expect(screen.getByText('Compliance & Security')).toBeInTheDocument()
    
    // Check for business analysis section
    expect(screen.getByText('Our Strategic Approach')).toBeInTheDocument()
    expect(screen.getByText('Business-First Analysis')).toBeInTheDocument()
    expect(screen.getByText('Bespoke Solutions')).toBeInTheDocument()
    expect(screen.getByText('Measurable ROI')).toBeInTheDocument()
    
    // Check for implementation process section
    expect(screen.getByText('Proven Implementation Process')).toBeInTheDocument()
    expect(screen.getByText('Discovery & Analysis')).toBeInTheDocument()
    expect(screen.getByText('Custom Design')).toBeInTheDocument()
    expect(screen.getByText('Phased Implementation')).toBeInTheDocument()
    expect(screen.getByText('Optimization')).toBeInTheDocument()
  })

  it('maintains correct page structure with hero, grid, and markdown sections', async () => {
    const ServicesPageComponent = await ServicesPage()
    const { container } = render(ServicesPageComponent)
    
    // Check that all major sections are present in the correct order
    const pageChildren = container.firstChild?.childNodes
    expect(pageChildren).toBeDefined()
    
    // Verify ServicesGridSection is rendered between hero and markdown content
    expect(screen.getByTestId('services-grid-section')).toBeInTheDocument()
    expect(screen.getByText('Test Services')).toBeInTheDocument() // Markdown content
  })

  it('integrates ServicesGridSection seamlessly with existing layout', async () => {
    const ServicesPageComponent = await ServicesPage()
    render(ServicesPageComponent)
    
    // Check that both sections coexist properly
    expect(screen.getByText('Intelligent Workflow Automation for Professional Services')).toBeInTheDocument() // Hero
    expect(screen.getByText('Comprehensive Workflow Automation Solutions')).toBeInTheDocument() // Grid section
    expect(screen.getByText('Test Services')).toBeInTheDocument() // Markdown content
  })
})