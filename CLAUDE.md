# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
MVP website for Aha Agile, a professional services consultancy specializing in intelligent workflow automation. Lead generation engine targeting medium-sized professional services firms.

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `jest path/to/specific.test.tsx` - Run single test file

## Architecture & Key Patterns

### Tech Stack
- **Next.js 14.2.3** with App Router and TypeScript
- **Static Export**: Configured for Vercel deployment (`output: 'export'`)
- **Tailwind CSS 3.4.3** with custom design system
- **Content-driven**: Markdown files in `/content/` directory
- **Testing**: Jest + React Testing Library

### Font Strategy
Uses dual font system:
- **Source Serif 4**: Primary font for body text and overall brand feel
- **Inter**: Headings and UI elements for contrast and readability
- Configured as CSS variables (`--font-source-serif-4`, `--font-inter`)

### Content Management System
Content is stored in `/content/*.md` files and processed via `src/lib/markdown.ts`:
- **Link transformation**: Automatically converts anchor links (`#consultation` → `/book-a-consultation`)
- **Dynamic rendering**: Pages fetch and render markdown content at build time
- **Type-safe**: Uses `MarkdownContent` interface for content structure

### Design System
Sophisticated color palette in `tailwind.config.ts`:
- **Primary**: Navy blue scale (50-900) for professional feel
- **Accent**: Yellow scale for CTAs and highlights
- **Brand shortcuts**: `brand.navy`, `brand.yellow` for quick access
- **shadcn/ui integration**: Separate color variables for component library compatibility

### Layout Architecture
- **Root Layout** (`src/app/layout.tsx`): Persistent Header/Footer with flex-grow main
- **Page Structure**: App Router with co-located test files
- **Component Organization**:
  - `layout/`: Header, Footer
  - `sections/`: Page-specific sections (HeroSection, etc.)
  - `ui/`: Reusable components (shadcn/ui style)

### Lead Generation Funnel
Structured user journey: Homepage → Services → Case Study → Book Consultation

### Dynamic Theme System
Advanced theming architecture with three brand themes:
- **Ocean Theme**: Default professional blue palette
- **Sunset Theme**: Warm orange/red brand alternative  
- **Forest Theme**: Natural green brand option
- **Theme Configuration**: Environment-based via `src/lib/theme-config.ts`
- **CSS Variables**: All themes use CSS custom properties for dynamic switching
- **Production Ready**: Includes removal guide for single-theme production builds

### Environment Variables (Theme System)
- `NEXT_PUBLIC_PRODUCTION_THEME=ocean|sunset|forest` - Set production theme
- `NEXT_PUBLIC_PRODUCTION_MODE=light|dark` - Set production mode
- `NEXT_PUBLIC_ENABLE_THEME_SWITCHER=true|false` - Enable theme switcher
- `NEXT_PUBLIC_FORCE_THEME_SWITCHER=true` - Force enable in production

### Performance Optimizations
- **Static Export**: Configured for CDN deployment (`output: 'export'`)
- **Webpack Optimization**: Custom chunk splitting for vendors in production
- **Font Strategy**: Optimized Google Fonts loading with `display: swap`
- **Image Optimization**: Multiple formats and device sizes configured

### Testing Approach
- **Unit tests**: Co-located `.test.tsx` files for all components
- **Component testing**: React Testing Library with Jest
- **Coverage**: Available via `coverage/` directory after test runs
- **Jest Configuration**: Custom setup with path mapping (`@/` → `src/`)