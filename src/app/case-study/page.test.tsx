import { render, screen } from '@testing-library/react'
import CaseStudyPage from './page'

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
    
    // Mock processing of different markdown elements for case study content
    if (content.includes('# How We Saved Henderson & Associates')) {
      return (
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-8 leading-tight">How We Saved Henderson & Associates 320 Hours Annually</h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed font-serif">$184,000 in Recovered Capacity | 68% Reduction in Email Processing Time | 4-Month ROI Payback</p>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed font-serif">When Henderson & Associates had built a strong reputation but was losing capacity to email chaos, we transformed their workflows.</p>
          <h2 className="text-3xl md:text-4xl font-semibold font-heading text-primary mb-6 mt-12 leading-tight">The Challenge: Email Workflows Consuming Billable Hours</h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed font-serif">Henderson & Associates had built a strong reputation serving mid-market manufacturing clients over 15 years.</p>
          <h3 className="text-2xl md:text-3xl font-semibold font-heading text-primary mb-4 mt-8">The Daily Reality:</h3>
          <ul className="list-disc list-inside mb-6 space-y-3 ml-4">
            <li className="text-lg text-muted-foreground leading-relaxed font-serif">Partners spending 3.5 hours daily on email triage</li>
            <li className="text-lg text-muted-foreground leading-relaxed font-serif">47 hours weekly lost across the team</li>
          </ul>
          <a href="/book-a-consultation" className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 no-underline shadow-brand hover:shadow-accent mx-1 my-2">
            Book Your Free 15-Minute Process Audit
          </a>
          <strong className="font-bold text-primary">$184,000 in Recovered Capacity</strong>
          <hr className="border-border my-12" />
          <blockquote className="border-l-4 border-accent pl-6 py-2 italic text-muted-foreground my-8 bg-accent/10 rounded-r-lg font-serif">
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed font-serif">We were drowning in our own success</p>
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

describe('Case Study Page', () => {
  const mockMarkdownContent = `# How We Saved Henderson & Associates 320 Hours Annually Through Intelligent Email Automation

**$184,000 in Recovered Capacity | 68% Reduction in Email Processing Time | 4-Month ROI Payback**

When Henderson & Associates, a 12-person accounting and advisory firm, was losing 40% of their billable capacity to email chaos, we transformed their workflows with intelligent automation that delivered measurable results within 8 weeks.

[Book Your Free Process Audit](#consultation)

---

## The Challenge: Email Workflows Consuming Billable Hours

Henderson & Associates had built a strong reputation serving mid-market manufacturing clients over 15 years. But by 2023, their growth was being strangled by operational inefficiencies that were bleeding profitability.

### The Daily Reality:
- Partners spending 3.5 hours daily on email triage and client communication
- 47 hours weekly lost across the team to repetitive email tasks

> "We were drowning in our own success," recalls Sarah Henderson, Managing Partner.
`

  const mockTransformedContent = `# How We Saved Henderson & Associates 320 Hours Annually Through Intelligent Email Automation

**$184,000 in Recovered Capacity | 68% Reduction in Email Processing Time | 4-Month ROI Payback**

When Henderson & Associates, a 12-person accounting and advisory firm, was losing 40% of their billable capacity to email chaos, we transformed their workflows with intelligent automation that delivered measurable results within 8 weeks.

[Book Your Free Process Audit](/book-a-consultation)

---

## The Challenge: Email Workflows Consuming Billable Hours

Henderson & Associates had built a strong reputation serving mid-market manufacturing clients over 15 years. But by 2023, their growth was being strangled by operational inefficiencies that were bleeding profitability.

### The Daily Reality:
- Partners spending 3.5 hours daily on email triage and client communication
- 47 hours weekly lost across the team to repetitive email tasks

> "We were drowning in our own success," recalls Sarah Henderson, Managing Partner.
`

  beforeEach(() => {
    jest.clearAllMocks()
    getMarkdownContent.mockResolvedValue({ content: mockMarkdownContent })
    transformMarkdownLinks.mockReturnValue(mockTransformedContent)
  })

  it('renders the Case Study page without errors', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    expect(screen.getByText('How We Saved Henderson & Associates 320 Hours Annually')).toBeInTheDocument()
    expect(screen.getByText('$184,000 in Recovered Capacity | 68% Reduction in Email Processing Time | 4-Month ROI Payback')).toBeInTheDocument()
  })

  it('loads markdown content from the correct file', async () => {
    await CaseStudyPage()
    
    expect(getMarkdownContent).toHaveBeenCalledWith('case-study.md')
    expect(getMarkdownContent).toHaveBeenCalledTimes(1)
  })

  it('transforms markdown links correctly', async () => {
    await CaseStudyPage()
    
    expect(transformMarkdownLinks).toHaveBeenCalledWith(mockMarkdownContent)
    expect(transformMarkdownLinks).toHaveBeenCalledTimes(1)
  })

  it('renders markdown content with proper HTML structure and long-form styling', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    // Check headings with responsive classes and design system typography
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('How We Saved Henderson & Associates 320 Hours Annually')
    expect(h1).toHaveClass('text-4xl', 'md:text-5xl', 'font-bold', 'font-heading', 'text-primary', 'mb-8', 'leading-tight')
    
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2).toHaveTextContent('The Challenge: Email Workflows Consuming Billable Hours')
    expect(h2).toHaveClass('text-3xl', 'md:text-4xl', 'font-semibold', 'font-heading', 'text-primary', 'mb-6', 'mt-12', 'leading-tight')
    
    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3).toHaveTextContent('The Daily Reality:')
    expect(h3).toHaveClass('text-2xl', 'md:text-3xl', 'font-semibold', 'font-heading', 'text-primary', 'mb-4', 'mt-8')
    
    // Check paragraph content with proper spacing
    expect(screen.getByText(/When Henderson & Associates had built a strong reputation/)).toBeInTheDocument()
    
    // Check list items with proper spacing
    expect(screen.getByText('Partners spending 3.5 hours daily on email triage')).toBeInTheDocument()
    expect(screen.getByText('47 hours weekly lost across the team')).toBeInTheDocument()
  })

  it('renders call-to-action links with correct styling and routing', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    const ctaLink = screen.getByRole('link', { name: /book your free 15-minute process audit/i })
    expect(ctaLink).toBeInTheDocument()
    expect(ctaLink).toHaveAttribute('href', '/book-a-consultation')
    expect(ctaLink).toHaveClass(
      'inline-block',
      'bg-accent-500',
      'hover:bg-accent-600',
      'text-white',
      'font-semibold',
      'py-3',
      'px-6',
      'rounded-lg',
      'shadow-brand',
      'hover:shadow-accent',
      'mx-1',
      'my-2'
    )
  })

  it('applies responsive design classes correctly', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    const { container } = render(CaseStudyPageComponent)
    
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('container', 'mx-auto', 'px-4', 'py-lg')
    
    const content = mainContainer?.firstChild
    expect(content).toHaveClass('max-w-4xl', 'mx-auto')
    
    const article = content?.firstChild
    expect(article).toHaveClass('prose', 'prose-lg', 'max-w-none')
  })

  it('handles strong text and emphasis correctly for metrics', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    const strongText = screen.getByText('$184,000 in Recovered Capacity')
    expect(strongText).toHaveClass('font-bold', 'text-primary')
  })

  it('renders blockquotes with proper styling for testimonials', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    const quote = screen.getByText('We were drowning in our own success')
    const blockquote = quote.closest('blockquote')
    expect(blockquote).toHaveClass(
      'border-l-4',
      'border-accent',
      'pl-6',
      'py-2',
      'italic',
      'text-muted-foreground',
      'my-8',
      'bg-accent-50',
      'rounded-r-lg',
      'font-serif'
    )
  })

  it('renders horizontal rules with proper spacing for content sections', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    const hr = document.querySelector('hr')
    expect(hr).toHaveClass('border-secondary-300', 'my-12')
  })

  it('maintains accessibility with proper semantic structure', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    // Check that headings form proper hierarchy
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(3) // H1, H2, H3
    
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

  it('renders content with optimized spacing for long-form reading', async () => {
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    // Check that paragraphs have proper spacing (mb-6)
    const paragraphs = document.querySelectorAll('p')
    paragraphs.forEach(p => {
      expect(p).toHaveClass('mb-6')
    })
    
    // Check that lists have proper spacing (mb-6, space-y-3)
    const lists = document.querySelectorAll('ul')
    lists.forEach(ul => {
      expect(ul).toHaveClass('mb-6', 'space-y-3')
    })
  })

  it('handles markdown content rendering errors gracefully', async () => {
    getMarkdownContent.mockRejectedValue(new Error('File not found'))
    
    // Should throw error for missing file (this is expected behavior)
    await expect(CaseStudyPage()).rejects.toThrow()
  })

  it('supports multiple call-to-action links throughout the content', async () => {
    // Test that multiple CTA links can be rendered (case study has multiple CTAs)
    const CaseStudyPageComponent = await CaseStudyPage()
    render(CaseStudyPageComponent)
    
    const ctaLinks = screen.getAllByRole('link')
    const consultationLinks = ctaLinks.filter(link => 
      link.getAttribute('href') === '/book-a-consultation'
    )
    
    expect(consultationLinks.length).toBeGreaterThanOrEqual(1)
  })
})