import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ServicesCTASectionProps {}

export default function ServicesCTASection(): JSX.Element {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 dark:from-primary-800 dark:via-primary-700 dark:to-primary-900 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 dark:from-brand-navy dark:via-brand-navy-light dark:to-brand-navy-dark opacity-95"></div>
      
      {/* Content container */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading leading-tight">
            Ready to Transform Your Workflows?
          </h2>
          
          {/* Compelling copy */}
          <div className="text-xl md:text-2xl text-slate-100 dark:text-primary-100 mb-12 font-serif leading-relaxed space-y-4">
            <p className="text-slate-100 dark:text-primary-100">
              Stop losing revenue to inefficient processes. Our expert consultants deliver measurable workflow improvements that drive real business transformation.
            </p>
            <p className="text-lg md:text-xl text-slate-200 dark:text-primary-200">
              Join the growing number of professional services firms achieving 30-50% efficiency gains through intelligent automation.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Primary CTA - Book Process Audit */}
            <Button 
              asChild 
              size="lg"
              className="bg-accent-400 hover:bg-accent-500 text-slate-900 dark:text-primary-900 font-semibold px-8 py-4 h-auto text-lg font-heading shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Link href="/book-a-consultation">
                Book Your Free Process Audit
              </Link>
            </Button>
            
            {/* Secondary CTA - Download Case Study */}
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="border-2 border-accent-400 text-accent-400 hover:bg-accent-400 hover:text-slate-900 dark:hover:text-primary-900 font-semibold px-8 py-4 h-auto text-lg font-heading shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-transparent"
            >
              <Link href="/case-study">
                Download Case Study
              </Link>
            </Button>
          </div>
          
          {/* Trust indicator */}
          <div className="mt-12 text-sm font-heading">
            <p className="text-slate-300 dark:text-primary-300">Trusted by 200+ professional services firms across Australia</p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400 opacity-10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400 opacity-10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
    </section>
  );
}