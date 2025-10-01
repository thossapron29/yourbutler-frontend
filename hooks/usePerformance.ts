import { useEffect, useRef } from 'react';

/**
 * Hook to measure component render performance
 * Only active in development mode
 */
export function useRenderPerformance(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  if (__DEV__) {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  }

  useEffect(() => {
    if (__DEV__) {
      const renderTime = performance.now() - renderStartTime.current;
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(
          `[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
        );
      }
    }
  });

  return {
    renderCount: __DEV__ ? renderCount.current : 0,
  };
}

/**
 * Hook to measure async operation performance
 */
export function useAsyncPerformance() {
  const measureAsync = async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    if (!__DEV__) {
      return operation();
    }

    const startTime = performance.now();
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 1000) { // More than 1 second
        console.warn(
          `[Performance] ${operationName} took ${duration.toFixed(2)}ms`
        );
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(
        `[Performance] ${operationName} failed after ${duration.toFixed(2)}ms:`,
        error
      );
      throw error;
    }
  };

  return { measureAsync };
}

/**
 * Performance monitoring for list items
 */
export function useListPerformance(itemCount: number, listName: string) {
  useEffect(() => {
    if (__DEV__ && itemCount > 100) {
      console.warn(
        `[Performance] ${listName} has ${itemCount} items. Consider virtualization for better performance.`
      );
    }
  }, [itemCount, listName]);
}
