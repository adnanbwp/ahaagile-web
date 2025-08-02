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
    
    // Mock processing of homepage content (updated for new structure without main headline)
    if (content.includes('## The Hidden Cost of Manual Workflows')) {
      return (
        <div>
          <h2 className="text-3xl font-semibold text-primary mb-4 mt-8">The Hidden Cost of Manual Workflows</h2>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">Your team is trapped in time-consuming, repetitive processes that drain productivity and profitability:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li className="text-lg text-muted-foreground">35% of weekly capacity lost to email chaos and manual coordination</li>
            <li className="text-lg text-muted-foreground">Partners billing at $180/hour stuck on $20/hour administrative tasks</li>
          </ul>
          <strong className="font-semibold text-primary">The financial impact is staggering:</strong>
          <span> A typical 3-person professional services firm loses </span>
          <strong className="font-semibold text-primary">$236,000 to $330,000 annually</strong>
          <span> in unrealized revenue due to workflow inefficiencies.</span>
          <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground my-6 bg-accent/10 py-4">
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">Within 6 weeks, our team reclaimed 2.5 hours per day per employee. The automation handles client onboarding, document requests, and progress updates automatically. ROI was immediate.</p>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">— Managing Partner, Mid-tier Accounting Firm</p>
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
  const mockMarkdownContent = `---

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

  const mockTransformedContent = `---

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
    
    // Check main heading (now from HeroSection)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Reclaim 150+ Hours Per Employee Annually')
    expect(h1).toHaveClass('text-hero', 'mb-6', 'text-primary-foreground')
    
    // Check section headings - there should be multiple h2s now (ProblemSection + SolutionSection + Markdown)
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s).toHaveLength(5) // One from ProblemSection, three from SolutionSection, one from markdown
    expect(h2s[0]).toHaveTextContent('The Hidden Cost of Manual Workflows')
    expect(h2s[0]).toHaveClass('text-hero', 'text-primary') // ProblemSection styling
    
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
    
    // Check case study CTA (now from HeroSection)
    const caseStudyLink = screen.getByRole('link', { name: /watch demo/i })
    expect(caseStudyLink).toBeInTheDocument()
    expect(caseStudyLink).toHaveAttribute('href', '/case-study')
    expect(caseStudyLink).toHaveClass('btn-secondary')

    // Check consultation CTA (now from HeroSection)
    const consultationLink = screen.getByRole('link', { name: /start free analysis/i })
    expect(consultationLink).toBeInTheDocument()
    expect(consultationLink).toHaveAttribute('href', '/book-a-consultation')
    expect(consultationLink).toHaveClass('btn-accent')
  })

  it('applies responsive design classes correctly', async () => {
    const HomePageComponent = await Home()
    const { container } = render(HomePageComponent)
    
    const main = container.firstChild
    expect(main).toHaveClass('min-h-screen')
    
    // Hero section should be the first child
    const heroSection = main?.firstChild
    expect(heroSection).toHaveClass('relative', 'min-h-screen', 'py-20')
    
    // Check that the markdown content container still exists with proper classes
    const markdownContainer = main?.lastChild
    expect(markdownContainer).toHaveClass('container', 'mx-auto', 'px-4', 'py-lg')
  })

  it('handles strong and emphasis text correctly', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    const strongText = screen.getByText('The financial impact is staggering:')
    expect(strongText).toHaveClass('font-semibold', 'text-primary')
    
    const financialImpactText = screen.getByText('$236,000 to $330,000 annually')
    expect(financialImpactText).toHaveClass('font-semibold', 'text-primary')
  })

  it('renders blockquote testimonial with proper styling', async () => {
    const HomePageComponent = await Home()
    const { container } = render(HomePageComponent)
    
    // There are now two blockquotes - one from SolutionSection and one from markdown content
    const blockquotes = container.querySelectorAll('blockquote')
    expect(blockquotes.length).toBeGreaterThanOrEqual(1)
    
    // Test the markdown blockquote specifically (should be the last one)
    const markdownBlockquote = blockquotes[blockquotes.length - 1]
    expect(markdownBlockquote).toHaveClass(
      'border-l-4',
      'border-accent',
      'pl-4',
      'italic',
      'text-muted-foreground',
      'my-6',
      'bg-accent/10',
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
    
    // Verify both CTAs as specified in acceptance criteria (now from HeroSection)
    const caseStudyLink = screen.getByRole('link', { name: /watch demo/i })
    const consultationLink = screen.getByRole('link', { name: /start free analysis/i })
    
    expect(caseStudyLink).toBeInTheDocument()
    expect(consultationLink).toBeInTheDocument()
    
    // Verify they route to correct pages
    expect(caseStudyLink).toHaveAttribute('href', '/case-study')
    expect(consultationLink).toHaveAttribute('href', '/book-a-consultation')
  })

  it('renders value proposition content effectively', async () => {
    const HomePageComponent = await Home()
    render(HomePageComponent)
    
    // Check that key value proposition elements are present (headline and subtitle now come from HeroSection)
    expect(screen.getAllByText('Reclaim 150+ Hours Per Employee Annually')).toHaveLength(1)
    expect(screen.getAllByText(/intelligent automation solutions/i)).toHaveLength(3) // HeroSection, SolutionSection, and markdown
    expect(screen.getByText(/measurable ROI within weeks/i)).toBeInTheDocument()
    expect(screen.getByText(/Annual Cost of Inefficiency/i)).toBeInTheDocument()
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