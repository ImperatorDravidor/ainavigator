/**
 * Enterprise Performance Hooks
 * React hooks for performance optimization and monitoring
 */

import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { logger } from '@/lib/services/logger.service'

/**
 * Debounce hook for input optimization
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Throttle hook for rate limiting
 */
export function useThrottle<T>(value: T, limit: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRun = useRef<number>(0)

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= limit) {
        setThrottledValue(value)
        lastRun.current = Date.now()
      }
    }, limit - (Date.now() - lastRun.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [React.RefObject<HTMLElement | null>, boolean] {
  const elementRef = useRef<HTMLElement | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return [elementRef, isIntersecting]
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0)
  const renderStartTime = useRef<number>(0)
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    renderCount: 0,
    lastRender: new Date()
  })

  useEffect(() => {
    renderStartTime.current = performance.now()
    const currentRenderCount = ++renderCount.current

    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current
        
        setMetrics({
          renderTime,
          renderCount: currentRenderCount,
          lastRender: new Date()
        })

        // Log slow renders
        if (renderTime > 16) { // Slower than 60fps
          logger.warn(`Slow render detected in ${componentName}`, {
            renderTime,
            renderCount: currentRenderCount
          })
        }
      }
    }
  })

  return metrics
}

/**
 * Memory leak prevention hook
 */
export function useSafeAsync<T>() {
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const safeAsync = useCallback(
    async (asyncFunction: () => Promise<T>): Promise<T | undefined> => {
      try {
        const result = await asyncFunction()
        if (isMounted.current) {
          return result
        }
      } catch (error) {
        if (isMounted.current) {
          throw error
        }
      }
    },
    []
  )

  return safeAsync
}

/**
 * Virtual scrolling hook for large lists
 */
export function useVirtualScroll<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    
    return { startIndex, endIndex }
  }, [scrollTop, items.length, containerHeight, itemHeight, overscan])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange])

  const totalHeight = items.length * itemHeight

  const offsetY = visibleRange.startIndex * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleRange
  }
}

/**
 * Web Worker hook for heavy computations
 */
export function useWebWorker<T, R>(
  workerFunction: (data: T) => R,
  deps: React.DependencyList = []
) {
  const [result, setResult] = useState<R | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runWorker = useCallback((data: T) => {
    setLoading(true)
    setError(null)

    // Create blob from function
    const workerCode = `
      self.addEventListener('message', function(e) {
        try {
          const result = (${workerFunction.toString()})(e.data);
          self.postMessage({ success: true, result });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      });
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(blob)
    
    workerRef.current = new Worker(workerUrl)

    workerRef.current.onmessage = (e) => {
      setLoading(false)
      if (e.data.success) {
        setResult(e.data.result)
      } else {
        setError(new Error(e.data.error))
      }
      URL.revokeObjectURL(workerUrl)
      workerRef.current?.terminate()
    }

    workerRef.current.onerror = () => {
      setLoading(false)
      setError(new Error('Worker error'))
      URL.revokeObjectURL(workerUrl)
      workerRef.current?.terminate()
    }

    workerRef.current.postMessage(data)
  }, [workerFunction, ...deps])

  return { result, error, loading, runWorker }
}

/**
 * Request Animation Frame hook
 */
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>(0)
  const previousTimeRef = useRef<number>(0)

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
  }, [callback])

  useEffect(() => {
    const animateFrame = (time: number) => {
      animate(time)
      requestRef.current = requestAnimationFrame(animateFrame)
    }
    requestRef.current = requestAnimationFrame(animateFrame)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])
}

/**
 * Idle callback hook for non-critical work
 */
export function useIdleCallback(
  callback: () => void,
  options?: IdleRequestOptions
) {
  const callbackRef = useRef(callback)
  const idleCallbackId = useRef<number>(0)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const cb = () => callbackRef.current()
    
    if ('requestIdleCallback' in window) {
      idleCallbackId.current = window.requestIdleCallback(cb, options)
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      const timeoutId = setTimeout(cb, 1)
      return () => clearTimeout(timeoutId)
    }

    return () => {
      if (idleCallbackId.current) {
        window.cancelIdleCallback(idleCallbackId.current)
      }
    }
  }, [options])
}
