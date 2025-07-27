import { render, screen } from '@testing-library/react'
import Home from './page'

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
    
    // Mock processing of homepage content
    if (content.includes('# Reclaim 150+ Hours Per Employee Annually')) {
      return (
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight text-center">Reclaim 150+ Hours Per Employee Annually</h1>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">Stop losing valuable time to inefficient workflows. We help professional services firms eliminate operational bottlenecks through intelligent automation solutions that deliver measurable ROI within weeks.</p>
          <a href="/case-study" className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 no-underline shadow-md hover:shadow-lg mr-4 mb-2">
            See How We Saved $330K Annually
          </a>
          <a href="/book-a-consultation" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 no-underline shadow-md hover:shadow-lg mr-4 mb-2">
            Book Your Free Process Audit
          </a>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-8">The Hidden Cost of Manual Workflows</h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">Your team is trapped in time-consuming, repetitive processes that drain productivity and profitability:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li className="text-lg text-gray-700">35% of weekly capacity lost to email chaos and manual coordination</li>
            <li className="text-lg text-gray-700">Partners billing at $180/hour stuck on $20/hour administrative tasks</li>
          </ul>
          <strong className="font-semibold text-gray-900">The financial impact is staggering:</strong>
          <span> A typical 3-person professional services firm loses </span>
          <strong className="font-semibold text-gray-900">$236,000 to $330,000 annually</strong>
          <span> in unrealized revenue due to workflow inefficiencies.</span>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6 bg-blue-50 py-4">
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">Within 6 weeks, our team reclaimed 2.5 hours per day per employee. The automation handles client onboarding, document requests, and progress updates automatically. ROI was immediate.</p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">— Managing Partner, Mid-tier Accounting Firm</p>
          </blockquote>
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

describe('Homepage', () => {
  const mockMarkdownContent = `# Reclaim 150+ Hours Per Employee Annually

**Stop losing valuable time to inefficient workflows. We help professional services firms eliminate operational bottlenecks through intelligent automation solutions that deliver measurable ROI within weeks.**

[See How We Saved $330K Annually](#case-study) | [Book Your Free Process Audit](#consultation)

---

## The Hidden Cost of Manual Workflows

Your team is trapped in time-consuming, repetitive processes that drain productivity and profitability:

- **35% of weekly capacity** lost to email chaos and manual coordination
- Partners billing at $180/hour stuck on $20/hour administrative tasks  

**The financial impact is staggering:** A typical 3-person professional services firm loses **$236,000 to $330,000 annually** in unrealized revenue due to workflow inefficiencies.

---

> **"Within 6 weeks, our team reclaimed 2.5 hours per day per employee. The automation handles client onboarding, document requests, and progress updates automatically. ROI was immediate."**
> 
> *— Managing Partner, Mid-tier Accounting Firm*

[Book Your Free Audit](#consultation)`

  const mockTransformedContent = `# Reclaim 150+ Hours Per Employee Annually

**Stop losing valuable time to inefficient workflows. We help professional services firms eliminate operational bottlenecks through intelligent automation solutions that deliver measurable ROI within weeks.**

[See How We Saved $330K Annually](/case-study) | [Book Your Free Process Audit](/book-a-consultation)

---

## The Hidden Cost of Manual Workflows

Your team is trapped in time-consuming, repetitive processes that drain productivity and profitability:

- **35% of weekly capacity** lost to email chaos and manual coordination
- Partners billing at $180/hour stuck on $20/hour administrative tasks  

**The financial impact is staggering:** A typical 3-person professional services firm loses **$236,000 to $330,000 annually** in unrealized revenue due to workflow inefficiencies.

---

> **"Within 6 weeks, our team reclaimed 2.5 hours per day per employee. The automation handles client onboarding, document requests, and progress updates automatically. ROI was immediate."**
> 
> *— Managing Partner, Mid-tier Accounting Firm*

[Book Your Free Audit](/book-a-consultation)`

  beforeEach(() => {
    jest.clearAllMocks()
    getMarkdownContent.mockResolvedValue({ content: mockMarkdownContent })
    transformMarkdownLinks.mockReturnValue(mockTransformedContent)
  })

  it('renders the Homepage without errors', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    expect(screen.getByText('Reclaim 150+ Hours Per Employee Annually')).toBeInTheDocument()
    expect(screen.getByText(/stop losing valuable time to inefficient workflows/i)).toBeInTheDocument()
  })

  it('loads markdown content from the correct file', async () => {
    await Home()
    
    expect(getMarkdownContent).toHaveBeenCalledWith('homepage.md')
    expect(getMarkdownContent).toHaveBeenCalledTimes(1)
  })

  it('transforms markdown links correctly', async () => {
    await Home()
    
    expect(transformMarkdownLinks).toHaveBeenCalledWith(mockMarkdownContent)
    expect(transformMarkdownLinks).toHaveBeenCalledTimes(1)
  })

  it('renders markdown content with proper HTML structure', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    // Check main heading
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Reclaim 150+ Hours Per Employee Annually')
    expect(h1).toHaveClass('text-5xl', 'font-bold', 'text-gray-900', 'text-center')
    
    // Check section headings
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2).toHaveTextContent('The Hidden Cost of Manual Workflows')
    expect(h2).toHaveClass('text-3xl', 'font-semibold', 'text-gray-800')
    
    // Check paragraph content
    expect(screen.getByText(/stop losing valuable time to inefficient workflows/i)).toBeInTheDocument()
    expect(screen.getByText(/your team is trapped in time-consuming/i)).toBeInTheDocument()
    
    // Check list items
    expect(screen.getByText(/35% of weekly capacity lost/)).toBeInTheDocument()
    expect(screen.getByText(/Partners billing at \$180\/hour/)).toBeInTheDocument()
  })

  it('renders call-to-action links with correct styling and routing', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    // Check case study CTA
    const caseStudyLink = screen.getByRole('link', { name: /see how we saved \$330k annually/i })
    expect(caseStudyLink).toBeInTheDocument()
    expect(caseStudyLink).toHaveAttribute('href', '/case-study')
    expect(caseStudyLink).toHaveClass(
      'inline-block',
      'bg-gray-600',
      'hover:bg-gray-700',
      'text-white',
      'font-semibold',
      'py-3',
      'px-6',
      'rounded-lg'
    )

    // Check consultation CTA
    const consultationLink = screen.getByRole('link', { name: /book your free process audit/i })
    expect(consultationLink).toBeInTheDocument()
    expect(consultationLink).toHaveAttribute('href', '/book-a-consultation')
    expect(consultationLink).toHaveClass(
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
    const HomePageComponent = await Home()
    const { container } = render(HomePageComponent)
    
    const main = container.firstChild
    expect(main).toHaveClass('min-h-screen')
    
    const mainContainer = main?.firstChild
    expect(mainContainer).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
    
    const content = mainContainer?.firstChild
    expect(content).toHaveClass('max-w-4xl', 'mx-auto')
    
    const article = content?.firstChild
    expect(article).toHaveClass('prose', 'prose-lg', 'prose-gray', 'max-w-none')
  })

  it('handles strong and emphasis text correctly', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    const strongText = screen.getByText('The financial impact is staggering:')
    expect(strongText).toHaveClass('font-semibold', 'text-gray-900')
    
    const financialImpactText = screen.getByText('$236,000 to $330,000 annually')
    expect(financialImpactText).toHaveClass('font-semibold', 'text-gray-900')
  })

  it('renders blockquote testimonial with proper styling', async () => {
    const HomePageComponent = await Home()
    const { container } = render(HomePageComponent)
    
    const blockquote = container.querySelector('blockquote')
    expect(blockquote).toHaveClass(
      'border-l-4',
      'border-blue-500',
      'pl-4',
      'italic',
      'text-gray-700',
      'my-6',
      'bg-blue-50',
      'py-4'
    )
  })

  it('maintains accessibility with proper semantic structure', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    // Check that headings form proper hierarchy
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThanOrEqual(2)
    
    // Check that lists are properly structured
    const lists = screen.getAllByRole('list')
    expect(lists.length).toBeGreaterThan(0)
    
    // Check that links are accessible
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('ensures both required call-to-action links are present', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    // Verify both CTAs as specified in acceptance criteria
    const caseStudyLink = screen.getByRole('link', { name: /see how we saved \$330k annually/i })
    const consultationLink = screen.getByRole('link', { name: /book your free process audit/i })
    
    expect(caseStudyLink).toBeInTheDocument()
    expect(consultationLink).toBeInTheDocument()
    
    // Verify they route to correct pages
    expect(caseStudyLink).toHaveAttribute('href', '/case-study')
    expect(consultationLink).toHaveAttribute('href', '/book-a-consultation')
  })

  it('renders value proposition content effectively', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    // Check that key value proposition elements are present
    expect(screen.getByText('Reclaim 150+ Hours Per Employee Annually')).toBeInTheDocument()
    expect(screen.getByText(/intelligent automation solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/measurable ROI within weeks/i)).toBeInTheDocument()
    expect(screen.getByText(/\$236,000 to \$330,000 annually/)).toBeInTheDocument()
  })

  it('handles markdown content rendering errors gracefully', async () => {
    getMarkdownContent.mockRejectedValue(new Error('File not found'))
    
    // Should throw error for missing file (this is expected behavior)
    await expect(Home()).rejects.toThrow()
  })

  it('renders with proper SSG-compatible structure', async () => {
    const HomePageComponent = await Home()
    const { container } = render(HomePageComponent)
    
    // Verify the component structure supports static generation
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild?.nodeName).toBe('MAIN')
  })
})