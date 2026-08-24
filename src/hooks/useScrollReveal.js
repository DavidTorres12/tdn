import { useEffect } from 'react';

/**
 * Custom hook to trigger entrance animations as elements scroll into view.
 * Observes all elements with class `.reveal-on-scroll`.
 */
export default function useScrollReveal(dependencies = []) {
  const depsKey = Array.isArray(dependencies) ? dependencies.join('-') : String(dependencies);

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Once revealed, unobserve to optimize performance
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Give DOM a tick to ensure elements are rendered
    const timeoutId = setTimeout(() => {
      const targets = document.querySelectorAll('.reveal-on-scroll');
      targets.forEach((target) => observer.observe(target));
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      const targets = document.querySelectorAll('.reveal-on-scroll');
      targets.forEach((target) => observer.unobserve(target));
    };
  }, [depsKey]);
}
