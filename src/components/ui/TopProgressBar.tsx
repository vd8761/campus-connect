'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function TopProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress on route change
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept all internal navigation clicks for immediate visual feedback with safety auto-completion
  useEffect(() => {
    let t1: NodeJS.Timeout | null = null;
    let t2: NodeJS.Timeout | null = null;
    let t3: NodeJS.Timeout | null = null;
    let t4: NodeJS.Timeout | null = null;

    const clearTimers = () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
      if (t3) clearTimeout(t3);
      if (t4) clearTimeout(t4);
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external links, anchor hashes, new tabs, download links
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // Check if navigating to a different URL
      const currentUrl = window.location.pathname + window.location.search;
      if (href !== currentUrl) {
        clearTimers();
        setLoading(true);
        setProgress(25);

        // Smooth artificial progression
        t1 = setTimeout(() => setProgress(65), 120);
        t2 = setTimeout(() => setProgress(85), 320);

        // Safety fallback: auto-complete if navigation completes without route change or stalls
        t3 = setTimeout(() => setProgress(100), 900);
        t4 = setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 1150);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      clearTimers();
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-1 overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-purple via-indigo-500 to-brand-turquoise shadow-[0_0_12px_rgba(112,44,143,0.6)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  );
}

export function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <TopProgressBarInner />
    </Suspense>
  );
}
