# Aha Agile Website - Claude Code Project Documentation

## Project Overview
This is the MVP website for Aha Agile, a professional services consultancy specializing in intelligent workflow automation. The website serves as a lead generation engine targeting medium-sized professional services firms.

## Tech Stack
- **Framework**: Next.js 14.2.3 with TypeScript
- **Styling**: Tailwind CSS 3.4.3
- **Content**: Markdown files in `/content/` directory
- **Testing**: Jest 29.7.0 + React Testing Library
- **Deployment**: Vercel (static export)
- **Repository**: Git-based with feature branch workflow

## Project Structure
```
ahaagile-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with Header/Footer
│   │   ├── page.tsx           # Homepage
│   │   ├── services/page.tsx  # Services page
│   │   ├── case-study/page.tsx # Case study page
│   │   └── book-a-consultation/page.tsx # Contact/booking page
│   ├── components/
│   │   ├── layout/            # Header, Footer components
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   └── markdown.ts        # Markdown processing utilities
│   └── styles/
│       └── globals.css        # Global styles and Tailwind imports
├── content/                   # Markdown content files
│   └── services.md           # Services page content
├── docs/                     # Project documentation
│   ├── prd.md               # Product Requirements Document
│   ├── architecture/        # Technical architecture docs
│   └── stories/             # User stories and implementation details
├── tests/
│   └── e2e/                 # End-to-end tests
└── public/                  # Static assets
```

## Key Configuration
- **Next.js**: Configured for static export (`output: 'export'`) for Vercel deployment
- **Tailwind**: Custom color scheme with primary (blue) and secondary (gray) palettes
- **TypeScript**: Strict configuration enabled
- **Testing**: Jest with jsdom environment for React component testing

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

## Content Management
All page content is sourced from Markdown files in the `/content/` directory. Pages use a markdown processing utility to render content dynamically.

## Current Implementation Status
Based on recent commits:
- ✅ Project foundation with Next.js, TypeScript, Tailwind CSS
- ✅ Core layout components (Header, Footer) with navigation
- ✅ Services page implementation with QA fixes
- 🚧 In progress: Case study page, consultation page, homepage content finalization

## Testing Strategy
- **Unit Tests**: All components have corresponding `.test.tsx` files
- **Integration Tests**: For key user interactions and markdown rendering
- **E2E Tests**: Planned for critical user funnel (view services → case study → book consultation)

## Deployment
- **Platform**: Vercel
- **Domain**: ahaagile.com.au (production)
- **Build**: Static export for optimal performance and cost efficiency
- **CI/CD**: Automated deployment from main branch via GitHub integration

## Lead Generation Funnel
The website implements a guided user journey:
1. **Homepage** → Clear value proposition with CTAs
2. **Services** → Detailed service offerings 
3. **Case Study** → Social proof and ROI demonstration
4. **Book Consultation** → Calendly integration for direct booking

## Goals & Success Metrics
- Generate 5+ qualified leads per month within 6 months
- Homepage bounce rate < 75%
- Case Study average session > 90 seconds
- Establish thought leadership in intelligent automation space