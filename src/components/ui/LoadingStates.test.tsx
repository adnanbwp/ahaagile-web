import { render, screen } from '@testing-library/react'
import { 
  LoadingSpinner, 
  Skeleton, 
  CardSkeleton, 
  ButtonLoading,
  ProgressBar,
  LoadingOverlay 
} from './LoadingStates'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('LoadingStates Components', () => {
  describe('LoadingSpinner', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('applies size classes correctly', () => {
      const { rerender } = render(<LoadingSpinner size="sm" />)
      expect(screen.getByRole('status')).toHaveClass('w-4', 'h-4')

      rerender(<LoadingSpinner size="lg" />)
      expect(screen.getByRole('status')).toHaveClass('w-8', 'h-8')
    })

    it('applies custom className', () => {
      render(<LoadingSpinner className="custom-class" />)
      expect(screen.getByRole('status')).toHaveClass('custom-class')
    })
  })

  describe('Skeleton', () => {
    it('renders with default props', () => {
      render(<Skeleton />)
      
      const skeleton = document.querySelector('.bg-secondary-200')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('w-full', 'h-4', 'rounded', 'animate-pulse')
    })

    it('applies custom dimensions', () => {
      render(<Skeleton width="w-1/2" height="h-8" />)
      
      const skeleton = document.querySelector('.bg-secondary-200')
      expect(skeleton).toHaveClass('w-1/2', 'h-8')
    })
  })

  describe('CardSkeleton', () => {
    it('renders card skeleton structure', () => {
      render(<CardSkeleton />)
      
      const card = document.querySelector('.card-elevated')
      expect(card).toBeInTheDocument()
      
      const skeletons = document.querySelectorAll('.bg-secondary-200')
      expect(skeletons).toHaveLength(4) // Title + 3 content lines
    })
  })

  describe('ButtonLoading', () => {
    it('renders button with children when not loading', () => {
      render(
        <ButtonLoading isLoading={false}>
          Click me
        </ButtonLoading>
      )
      
      const button = screen.getByText('Click me')
      expect(button).toBeInTheDocument()
      expect(button).not.toHaveAttribute('aria-busy')
    })

    it('shows loading state correctly', () => {
      render(
        <ButtonLoading isLoading={true}>
          Click me
        </ButtonLoading>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toBeDisabled()
      
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('ProgressBar', () => {
    it('renders progress bar with correct attributes', () => {
      render(<ProgressBar progress={75} label="Upload Progress" />)
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '75')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      expect(progressBar).toHaveAttribute('aria-label', 'Upload Progress: 75% complete')
      
      expect(screen.getByText('Upload Progress')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    it('handles progress values correctly', () => {
      const { rerender } = render(<ProgressBar progress={-10} />)
      expect(screen.getByRole('progressbar')).toHaveStyle('width: 0%')

      rerender(<ProgressBar progress={150} />)
      expect(screen.getByRole('progressbar')).toHaveStyle('width: 100%')
    })
  })

  describe('LoadingOverlay', () => {
    it('renders when visible', () => {
      render(<LoadingOverlay isVisible={true} message="Processing..." />)
      
      const overlay = screen.getByRole('dialog')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveAttribute('aria-modal', 'true')
      expect(overlay).toHaveAttribute('aria-label', 'Loading')
      
      expect(screen.getByText('Processing...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('does not render when not visible', () => {
      render(<LoadingOverlay isVisible={false} />)
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('provides proper ARIA labels', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
      expect(screen.getByText('Loading...')).toHaveClass('sr-only')
    })

    it('supports reduced motion preferences', () => {
      // Mock reduced motion preference
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      render(<LoadingSpinner />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).not.toHaveClass('animate-spin')
    })
  })
})