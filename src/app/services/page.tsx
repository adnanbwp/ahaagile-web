import ReactMarkdown from 'react-markdown';
import { getMarkdownContent, transformMarkdownLinks } from '@/lib/markdown';
import Link from 'next/link';
import type { Components } from 'react-markdown';
import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import ServicesGridSection from '@/components/sections/ServicesGridSection';

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
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 no-underline shadow-md hover:shadow-lg"
          >
            {children}
          </Link>
        );
      }
      if (href?.startsWith('/')) {
        return (
          <Link href={href} className="text-blue-600 hover:text-blue-800 underline">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className="text-blue-600 hover:text-blue-800 underline" {...props}>
          {children}
        </a>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-800 mb-3 mt-6">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="text-lg text-gray-700">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-800">{children}</em>
    ),
    hr: () => (
      <hr className="border-gray-300 my-8" />
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg prose-gray max-w-none">
            <ReactMarkdown components={components}>
              {transformedContent}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}