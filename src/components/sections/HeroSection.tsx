import React from 'react';
import Link from 'next/link';
import DashboardMockup from '@/components/ui/DashboardMockup';
import { TrendingUp, DollarSign, Star } from 'lucide-react';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps): JSX.Element {
  return (
    <section 
      className={`relative min-h-screen py-20 ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--brand-navy-light) 0%, var(--background) 100%)'
      }}
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1"></div>
      </div>
      
      <div className="container-brand relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-16 stagger-animation">
          {/* Main Headline */}
          <h1 className="text-hero mb-6 text-primary-foreground">
            Reclaim 150+ Hours Per Employee Annually
          </h1>
          
          {/* Subtitle */}
          <p className="text-subhero mb-12 text-foreground/80 max-w-3xl mx-auto">
            Stop losing valuable time to inefficient workflows. We help professional services firms 
            eliminate operational bottlenecks through intelligent automation solutions that deliver 
            measurable ROI within weeks.
          </p>
          
          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/book-a-consultation" 
              className="btn-accent px-8 py-4 text-lg font-semibold w-full sm:w-auto"
            >
              Start Free Analysis
            </Link>
            <Link 
              href="/case-study" 
              className="btn-secondary px-8 py-4 text-lg font-semibold w-full sm:w-auto"
            >
              Watch Demo
            </Link>
          </div>
        </div>
        
        {/* Interactive Dashboard Mockup */}
        <div className="mb-20">
          <DashboardMockup />
        </div>
        
        {/* Value Points Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
          <div className="text-center bg-card/10 backdrop-blur-md rounded-xl p-8 border border-border/20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-3xl font-bold text-primary-foreground mb-2">85% Time Reduction</h3>
            <p className="text-foreground/80">Average workflow efficiency improvement across all client implementations</p>
          </div>
          
          <div className="text-center bg-card/10 backdrop-blur-md rounded-xl p-8 border border-border/20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-3xl font-bold text-primary-foreground mb-2">$330K+ Annual Savings</h3>
            <p className="text-foreground/80">Typical revenue recovery potential for mid-sized professional services firms</p>
          </div>
        </div>
        
        {/* Trust Indicators Section */}
        <div className="text-center bg-card/5 backdrop-blur-md rounded-xl p-8 border border-border/10">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Star className="w-6 h-6 text-warning fill-current" />
            <Star className="w-6 h-6 text-warning fill-current" />
            <Star className="w-6 h-6 text-warning fill-current" />
            <Star className="w-6 h-6 text-warning fill-current" />
            <Star className="w-6 h-6 text-warning fill-current" />
          </div>
          <h3 className="text-2xl font-bold text-primary-foreground mb-4">Trusted by 500+ Companies</h3>
          <p className="text-foreground/80 mb-8">Leading professional services firms worldwide rely on our automation solutions</p>
          
          {/* Placeholder Company Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="h-12 bg-card/20 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">COMPANY A</span>
            </div>
            <div className="h-12 bg-card/20 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">COMPANY B</span>
            </div>
            <div className="h-12 bg-card/20 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">COMPANY C</span>
            </div>
            <div className="h-12 bg-card/20 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">COMPANY D</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}