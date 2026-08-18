'use client';

import { useCallback } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function useGtagEvent() {
  return useCallback((name: string, params: Record<string, unknown> = {}) => {
    if (!process.env.NEXT_PUBLIC_GTAG_TRACK_ID || typeof window === 'undefined') return;
    if (window.gtag) {
      window.gtag('event', name, params);
      return;
    }
    window.dataLayer ??= [];
    window.dataLayer.push({ event: name, ...params });
  }, []);
}
