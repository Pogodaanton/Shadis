import { useState, useEffect } from "react";

/**
 * Listens to a CSS media-query and returns whether it currently matches.
 *
 * @param breakpoint The breakpoint in pixels the media-query has to watch out for.
 * @param queryType The media-query to listen to.
 * @param initialValue Use this to avoid flickering due to the state updating after first render.
 */
export const useWindowBreakpoint = (
  breakpoint: number,
  queryType: "max-width" | "min-width" | "max-height" | "min-height" = "max-width",
  initialValue: boolean = false
): boolean => {
  const [isBreakpointActive, setBreakpointActivity] = useState(initialValue);

  useEffect(() => {
    if (typeof window.matchMedia === "undefined") return;

    const breakpointListener = (ev: { readonly matches: boolean }) => {
      setBreakpointActivity(ev.matches);
    };

    const mediaQuery = window.matchMedia(`(${queryType}: ${breakpoint}px)`);
    breakpointListener(mediaQuery);
    mediaQuery.addEventListener("change", breakpointListener);

    return () => {
      mediaQuery.removeEventListener("change", breakpointListener);
    };
  }, [breakpoint, queryType]);

  return isBreakpointActive;
};
