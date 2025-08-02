import React from 'react'
import { respectsReducedMotion } from '@/lib/accessibility'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const reducedMotion = respectsReducedMotion()

  return (
    <div 
      className={`${sizeClasses[size]} ${className} border-2 border-accent-500 border-t-transparent rounded-full ${
        reducedMotion ? '' : 'animate-spin'
      }`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4' 
}) => {
  const reducedMotion = respectsReducedMotion()

  return (
    <div 
      className={`${width} ${height} bg-secondary-200 rounded ${
        reducedMotion ? '' : 'animate-pulse'
      } ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  )
}

interface CardSkeletonProps {
  className?: string
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`card-elevated p-6 space-y-4 ${className}`}>
      <Skeleton width="w-3/4" height="h-6" />
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-1/2" height="h-4" />
    </div>
  )
}

interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  children,
  className = '',
  disabled = false,
  onClick,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative ${className} ${isLoading ? 'cursor-not-allowed' : ''}`}
      aria-busy={isLoading}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-current" />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  )
}

interface ProgressBarProps {
  progress: number
  className?: string
  label?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  label = 'Progress' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-700">{label}</span>
        <span className="text-sm text-secondary-500">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-secondary-200 rounded-full h-2">
        <div 
          className="bg-accent-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${Math.round(progress)}% complete`}
        />
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  className?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Loading...', 
  className = '' 
}) => {
  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="bg-card rounded-lg p-6 flex flex-col items-center space-y-4 max-w-sm mx-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground text-center">{message}</p>
      </div>
    </div>
  )
}

const LoadingStates = {
  LoadingSpinner,
  Skeleton,
  CardSkeleton,
  ButtonLoading,
  ProgressBar,
  LoadingOverlay
}

export default LoadingStates