import ReactMarkdown from 'react-markdown';
import { getMarkdownContent, transformMarkdownLinks } from '@/lib/markdown';
import Link from 'next/link';
import type { Components } from 'react-markdown';
import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import ServicesGridSection from '@/components/sections/ServicesGridSection';
import ServicesCTASection from '@/components/sections/ServicesCTASection';

interface ServicesPageProps {}

export default async function ServicesPage(): Promise<JSX.Element> {
  const { content } = await getMarkdownContent('services.md');
  const transformedContent = transformMarkdownLinks(content);

  const components: Components = {
    a: ({ href, children, ...props }) => {
      if (href?.startsWith('/book-a-consultation')) {
        return (
          <Link 
            href={href} 
            className="inline-block bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold font-heading py-3 px-6 rounded-lg transition-all duration-300 no-underline shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {children}
          </Link>
        );
      }
      if (href?.startsWith('/')) {
        return (
          <Link href={href} className="text-brand-navy hover:text-accent-400 underline transition-colors duration-200 font-medium">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className="text-brand-navy hover:text-accent-400 underline transition-colors duration-200 font-medium" {...props}>
          {children}
        </a>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-brand-navy mb-6 leading-tight font-heading">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-brand-navy mb-4 mt-8 font-heading">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-brand-navy mb-3 mt-6 font-heading">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-lg text-secondary-700 mb-4 leading-relaxed font-serif">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="text-lg text-secondary-700 font-serif">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-brand-navy">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-secondary-600">{children}</em>
    ),
    hr: () => (
      <hr className="border-secondary-300 my-8" />
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent-500 pl-4 italic text-secondary-700 my-6 bg-accent-50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  };

  return (
    <div>
      {/* Services Hero Section */}
      <ServicesHeroSection />
      
      {/* Services Grid & Implementation Process Section */}
      <ServicesGridSection />
      
      {/* Existing Services Content */}
      <div className="container mx-auto px-4 py-lg">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <ReactMarkdown components={components}>
              {transformedContent}
            </ReactMarkdown>
          </article>
        </div>
      </div>
      
      {/* Enhanced CTA Section */}
      <ServicesCTASection />
    </div>
  );
}