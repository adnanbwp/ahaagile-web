/**
 * Performance optimization utilities for Core Web Vitals improvement
 */

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  const fontPreloads = [
    '/fonts/inter-var.woff2',
    '/fonts/source-serif-4-var.woff2'
  ]

  fontPreloads.forEach(fontUrl => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = fontUrl
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Lazy load non-critical components
export const lazyLoadComponent = (importFn: () => Promise<any>) => {
  return importFn()
}

// Optimize images for different viewport sizes
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  sizes: string = '100vw'
) => {
  return {
    src,
    alt,
    sizes,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    style: {
      maxWidth: '100%',
      height: 'auto',
    },
  }
}

// Handle reduced motion preferences
export const respectsReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Performance monitoring utilities
export const measureWebVitals = () => {
  if (typeof window === 'undefined') return

  // Measure Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime)
      }
    }
  })

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (e) {
    // Fallback for browsers that don't support this
    console.warn('LCP measurement not supported')
  }
}

// Optimize Cumulative Layout Shift (CLS)
export const reserveLayoutSpace = (
  width: number,
  height: number,
  className: string = ''
) => {
  return {
    className: `aspect-[${width}/${height}] ${className}`,
    style: {
      width: '100%',
      height: 'auto',
    },
  }
}

// Bundle size optimization helpers
export const shouldLoadComponent = (condition: boolean) => {
  return condition
}

// Critical CSS inlining helper
export const inlineCriticalCSS = (css: string) => {
  if (typeof window === 'undefined') return

  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}