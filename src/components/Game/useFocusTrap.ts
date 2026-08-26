import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// Traps Tab/Shift+Tab cycling within the returned ref's subtree for as long
// as the component using it is mounted, moves focus into that subtree on
// mount (to the first element matching `initialFocusSelector` if given,
// else the first focusable element), and restores focus to whatever had it
// before mount (the button that opened the dialog) on unmount.
//
// `aria-modal="true"` alone doesn't make background controls inert --
// without this, Tab could walk focus out of an open dialog and into the
// game controls sitting behind its backdrop.
export function useFocusTrap<T extends HTMLElement>(initialFocusSelector?: string) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container == null) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const initial = initialFocusSelector
      ? container.querySelector<HTMLElement>(initialFocusSelector)
      : container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (initial ?? container).focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || container == null) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}
