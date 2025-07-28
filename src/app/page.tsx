import ReactMarkdown from 'react-markdown';
import { getMarkdownContent, transformMarkdownLinks } from '@/lib/markdown';
import Link from 'next/link';
import type { Components } from 'react-markdown';
import HeroSection from '@/components/sections/HeroSection';

interface HomePageProps {}

export default async function Home(): Promise<JSX.Element> {
  const { content } = await getMarkdownContent('homepage.md');
  const transformedContent = transformMarkdownLinks(content);

  const components: Components = {
    a: ({ href, children, ...props }) => {
      if (href?.startsWith('/book-a-consultation')) {
        return (
          <Link 
            href={href} 
            className="btn-primary no-underline mr-4 mb-2"
          >
            {children}
          </Link>
        );
      }
      if (href?.startsWith('/case-study')) {
        return (
          <Link 
            href={href} 
            className="btn-secondary no-underline mr-4 mb-2"
          >
            {children}
          </Link>
        );
      }
      if (href?.startsWith('/')) {
        return (
          <Link href={href} className="text-accent-600 hover:text-accent-800 underline">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className="text-accent-600 hover:text-accent-800 underline" {...props}>
          {children}
        </a>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-hero mb-6 text-center">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-heading font-semibold text-primary-800 mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-heading font-semibold text-primary-800 mb-3 mt-6">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-subhero mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="text-lg text-secondary-700">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-primary-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-primary-800">{children}</em>
    ),
    hr: () => (
      <hr className="border-secondary-300 my-8" />
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent-500 pl-4 italic text-secondary-700 my-6 bg-accent-50 py-4">
        {children}
      </blockquote>
    ),
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Original Markdown Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg prose-gray max-w-none">
            <ReactMarkdown components={components}>
              {transformedContent}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </main>
  );
}