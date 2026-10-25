import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// The portfolio scrolls inside <main>, rather than the document. Keep real native
// scroll positions so Motion, sticky UI and the laptop's projected bounds agree.
export default function usePortfolioScroll({ restoreKey } = {}) {
  const scrollRef = useRef(null), contentRef = useRef(null);

  useEffect(() => {
    const wrapper = scrollRef.current, content = contentRef.current;
    if (!wrapper || !content) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let controller, focusCleanup;
    const settle = () => controller?.scrollTo(wrapper.scrollTop, { immediate: true });
    const configure = () => {
      controller?.destroy();
      controller = undefined;
      if (preference.matches) return;
      controller = new Lenis({
        wrapper, content, autoRaf: true, lerp: .12,
        smoothWheel: true, syncTouch: false, allowNestedScroll: true,
        prevent: (node) => node.matches('textarea, select, [contenteditable="true"]'),
        virtualScroll: ({ event, deltaX, deltaY }) => {
          // The laptop consumes wheel events only inside its projected bounds.
          // Stop any remaining page inertia when it takes over the gesture.
          if (event.defaultPrevented || event.ctrlKey || event.metaKey || Math.abs(deltaX) > Math.abs(deltaY)) {
            settle();
            return false;
          }
          return true;
        },
      });
    };
    configure();
    preference.addEventListener('change', configure);

    const hashTarget = (hash) => {
      try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
      catch { return null; }
    };
    const focusTarget = (target) => {
      focusCleanup?.();
      const temporary = !target.hasAttribute('tabindex');
      if (temporary) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      focusCleanup = () => {
        if (temporary) target.removeAttribute('tabindex');
        target.removeEventListener('blur', focusCleanup);
        focusCleanup = undefined;
      };
      target.addEventListener('blur', focusCleanup, { once: true });
    };
    const navigate = (event) => {
      if (!controller || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      const target = hashTarget(url.hash);
      if (!target || !wrapper.contains(target)) return;
      event.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, '', url.hash);
      controller.scrollTo(target, {
        duration: .85, lerp: 0, easing: (t) => 1 - (1 - t) ** 3,
        onComplete: () => focusTarget(target),
      });
    };
    const followHash = () => {
      const target = hashTarget(location.hash);
      if (target && wrapper.contains(target)) {
        settle();
        if (controller) controller.scrollTo(target, { immediate: true });
        else target.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    };
    const interruptKey = (event) => {
      if (['Tab', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) settle();
    };
    wrapper.addEventListener('click', navigate);
    wrapper.addEventListener('pointerdown', settle);
    wrapper.addEventListener('keydown', interruptKey);
    window.addEventListener('hashchange', followHash);

    // Restore immediately after returning from MacFolio; never animate through
    // the whole page. Also resolve deep links after the lazy route has mounted.
    const frame = requestAnimationFrame(() => {
      let saved;
      try {
        saved = restoreKey ? sessionStorage.getItem(restoreKey) : null;
        if (saved !== null && restoreKey) sessionStorage.removeItem(restoreKey);
      } catch { /* Navigation memory is optional. */ }
      if (saved != null && Number.isFinite(Number(saved)) && Number(saved) >= 0) {
        if (controller) controller.scrollTo(Number(saved), { immediate: true });
        else wrapper.scrollTo({ top: Number(saved), behavior: 'instant' });
      } else followHash();
    });

    return () => {
      cancelAnimationFrame(frame);
      focusCleanup?.();
      controller?.destroy();
      preference.removeEventListener('change', configure);
      wrapper.removeEventListener('click', navigate);
      wrapper.removeEventListener('pointerdown', settle);
      wrapper.removeEventListener('keydown', interruptKey);
      window.removeEventListener('hashchange', followHash);
    };
  }, [restoreKey]);

  return { scrollRef, contentRef };
}
