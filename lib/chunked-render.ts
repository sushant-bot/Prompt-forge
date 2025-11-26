/**
 * Chunked Rendering Utility
 * Implements requestIdleCallback-based rendering for large lists
 * to prevent blocking the main thread and improve Speed Index
 */

/**
 * Renders items in chunks to avoid blocking the main thread
 * @param items - Array of items to render
 * @param chunkSize - Number of items to render per chunk
 * @returns Promise that resolves when all chunks are rendered
 */
export function useChunkedRender<T>(
  items: T[],
  chunkSize: number = 15
): { chunkedItems: T[][]; isRendering: boolean } {
  const chunks: T[][] = []
  
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  
  return {
    chunkedItems: chunks,
    isRendering: chunks.length > 0
  }
}

/**
 * Process items in chunks using requestIdleCallback
 * @param items - Array of items to process
 * @param processor - Function to process each item
 * @param chunkSize - Number of items to process per chunk
 */
export function processInChunks<T>(
  items: T[],
  processor: (item: T, index: number) => void,
  chunkSize: number = 15
): Promise<void> {
  return new Promise((resolve) => {
    let currentIndex = 0
    
    function processChunk() {
      const endIndex = Math.min(currentIndex + chunkSize, items.length)
      
      for (let i = currentIndex; i < endIndex; i++) {
        processor(items[i], i)
      }
      
      currentIndex = endIndex
      
      if (currentIndex < items.length) {
        // Use requestIdleCallback if available, otherwise use setTimeout
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(processChunk)
        } else {
          setTimeout(processChunk, 0)
        }
      } else {
        resolve()
      }
    }
    
    processChunk()
  })
}

/**
 * Hook for progressive rendering of lists
 */
export function useProgressiveRender<T>(
  items: T[],
  initialCount: number = 15,
  incrementBy: number = 10
) {
  const [visibleCount, setVisibleCount] = React.useState(initialCount)
  
  const loadMore = React.useCallback(() => {
    setVisibleCount(prev => Math.min(prev + incrementBy, items.length))
  }, [items.length, incrementBy])
  
  const hasMore = visibleCount < items.length
  const visibleItems = items.slice(0, visibleCount)
  
  return {
    visibleItems,
    hasMore,
    loadMore,
    visibleCount,
    totalCount: items.length
  }
}

// For React import
import * as React from 'react'
