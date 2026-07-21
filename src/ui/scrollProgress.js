/**
 * Scroll → normalized progress for the backdrop choreography.
 * Pure math is exported for tests; watchScrollProgress adds the thin
 * DOM wiring (rAF-throttled scroll/resize listeners).
 */
export function normalizeScroll(scrollY, documentHeight, viewportHeight) {
  const range = documentHeight - viewportHeight;
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / range));
}

/** One damping step: move `current` toward `target` by `factor`. */
export function damp(current, target, factor) {
  return current + (target - current) * factor;
}

/** Calls onChange(progress 0..1) at most once per frame on scroll/resize. */
export function watchScrollProgress(onChange) {
  let queued = false;
  const measure = () => {
    queued = false;
    onChange(
      normalizeScroll(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      ),
    );
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(measure);
    }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  measure();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  };
}
