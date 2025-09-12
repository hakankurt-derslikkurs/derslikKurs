'use client'

import { useEffect, useState } from 'react'

interface ScrollAnimationProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'bounce'
  delay?: number
  duration?: number
  className?: string
}

export default function ScrollAnimation({ 
  children, 
  animation = 'fadeIn', 
  delay = 0, 
  duration = 1000,
  className = ''
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Basit bir timeout ile animasyonu başlat
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-1000 ease-out'
    
    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-0`
        case 'slideUp':
          return `${baseClasses} opacity-0 translate-y-8`
        case 'slideLeft':
          return `${baseClasses} opacity-0 -translate-x-8`
        case 'slideRight':
          return `${baseClasses} opacity-0 translate-x-8`
        case 'zoomIn':
          return `${baseClasses} opacity-0 scale-95`
        case 'bounce':
          return `${baseClasses} opacity-0 translate-y-8`
        default:
          return `${baseClasses} opacity-0`
      }
    }

    switch (animation) {
      case 'fadeIn':
        return `${baseClasses} opacity-100`
      case 'slideUp':
        return `${baseClasses} opacity-100 translate-y-0`
      case 'slideLeft':
        return `${baseClasses} opacity-100 translate-x-0`
      case 'slideRight':
        return `${baseClasses} opacity-100 translate-x-0`
      case 'zoomIn':
        return `${baseClasses} opacity-100 scale-100`
      case 'bounce':
        return `${baseClasses} opacity-100 translate-y-0 animate-bounce`
      default:
        return `${baseClasses} opacity-100`
    }
  }

  return (
    <div
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  )
}

// Staggered animation wrapper for multiple children
export function StaggeredAnimation({ 
  children, 
  staggerDelay = 100,
  animation = 'slideUp',
  className = ''
}: {
  children: React.ReactNode[]
  staggerDelay?: number
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'bounce'
  className?: string
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollAnimation
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          className="mb-4"
        >
          {child}
        </ScrollAnimation>
      ))}
    </div>
  )
}

// Grid animation wrapper
export function GridAnimation({ 
  children, 
  staggerDelay = 100,
  animation = 'zoomIn',
  className = ''
}: {
  children: React.ReactNode[]
  staggerDelay?: number
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'bounce'
  className?: string
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollAnimation
          key={index}
          animation={animation}
          delay={index * staggerDelay}
        >
          {child}
        </ScrollAnimation>
      ))}
    </div>
  )
}
