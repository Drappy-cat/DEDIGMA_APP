import { useMemo } from "react";

/**
 * Performance detection hook.
 * Detects low-end devices and provides helpers to scale down
 * particle counts, blur effects, and animation complexity.
 *
 * This runs once per component mount and caches the result.
 * Does NOT change any UI elements, layout, colors, or routing.
 */

function detectLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Respect OS-level "prefers-reduced-motion" setting
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) return true;

  // 2. Check CPU cores (≤ 4 cores = likely low-end mobile)
  const cores = (navigator as any).hardwareConcurrency ?? 8;
  if (cores <= 4) return true;

  // 3. Check device memory if available (≤ 4 GB = low-end)
  const memory = (navigator as any).deviceMemory ?? 8;
  if (memory <= 4) return true;

  return false;
}

// Cache the result globally so we don't re-detect every render
let _cachedIsLowEnd: boolean | null = null;

function getIsLowEnd(): boolean {
  if (_cachedIsLowEnd === null) {
    _cachedIsLowEnd = detectLowEndDevice();
  }
  return _cachedIsLowEnd;
}

export interface PerformanceConfig {
  /** True if the device is detected as low-end */
  isLowEnd: boolean;
  /** Scale a particle count: returns reduced count on low-end devices */
  particleCount: (normalCount: number) => number;
  /** Get transition duration: shorter on low-end */
  transitionDuration: (normalDuration: number) => number;
  /** Whether to show decorative blur effects */
  showBlurEffects: boolean;
  /** Whether to show continuous CSS animations (pulse, bounce) */
  showContinuousAnimations: boolean;
}

export function usePerformance(): PerformanceConfig {
  return useMemo<PerformanceConfig>(() => {
    const isLowEnd = getIsLowEnd();

    return {
      isLowEnd,
      particleCount: (normalCount: number) =>
        isLowEnd ? Math.max(Math.round(normalCount * 0.35), 2) : normalCount,
      transitionDuration: (normalDuration: number) =>
        isLowEnd ? normalDuration * 0.6 : normalDuration,
      showBlurEffects: !isLowEnd,
      showContinuousAnimations: !isLowEnd,
    };
  }, []);
}

/**
 * Non-hook version for use outside React components (e.g. confetti.ts utility)
 */
export function getPerformanceConfig(): PerformanceConfig {
  const isLowEnd = getIsLowEnd();
  return {
    isLowEnd,
    particleCount: (normalCount: number) =>
      isLowEnd ? Math.max(Math.round(normalCount * 0.35), 2) : normalCount,
    transitionDuration: (normalDuration: number) =>
      isLowEnd ? normalDuration * 0.6 : normalDuration,
    showBlurEffects: !isLowEnd,
    showContinuousAnimations: !isLowEnd,
  };
}
