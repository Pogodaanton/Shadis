import React, { useState, useMemo, useEffect } from "react";
import { useMotionValue } from "framer-motion";
import { ISidebarData } from "./FVSidebarContext.props";
import { useWindowBreakpoint } from "../../../_DesignSystem";
import { debounce } from "lodash-es";
import EventEmitter from "onfire.js";

/**
 * The width of the sidebar by default
 */
const defaultSidebarWidth = 400;

/**
 * Breakpoint for displaying mobile layout
 */
const mobileBreakpoint = 850;

/**
 * A react context that broadcasts positional data like
 * the position of the sidebar.
 */
export const SidebarData = React.createContext<ISidebarData>(null);

/**
 * Alternative method of communicating across components.
 * This does not re-render every component on each message it recieves.
 */
export const SidebarEventEmitter: EventEmitter = new EventEmitter();

const FVSidebarProvider: React.ComponentType<{ fileData: Window["fileData"] }> = ({
  children,
  fileData,
}) => {
  const sidebarWidth = useMotionValue(defaultSidebarWidth);
  const sidebarPos = useMotionValue(0);
  const [isSidebarVisible, setSidebarVisibility] = useState(false);
  const isSidebarFloating = useWindowBreakpoint(mobileBreakpoint, "max-width", true);
  const [fileTitle, setFileTitle] = useState(fileData ? fileData.title : "");

  /**
   * Debounce sidebar position changes, so that we can avoid
   * expensive calculations and renderings
   */
  const [debouncedSidebarPos, setSidebarPos] = useState(sidebarPos.get());
  useEffect(() => {
    const listener = () => setSidebarPos(isSidebarFloating ? 0 : sidebarPos.get());
    listener();
    return sidebarPos.onChange(debounce(listener, 25));
  }, [isSidebarFloating, sidebarPos]);

  /**
   * Toasts get in the way if the sidebar is opened,
   * this might not be the most elegant solution, but
   * it's good enough to move the toasts with the sidebar.
   */
  useEffect(() => {
    // Toasts are shown differently on smaller displays
    if (window.innerWidth <= mobileBreakpoint) return;

    const listener = (pos: number) => {
      const toastManagerDOM = document.getElementsByClassName("toastManager");
      if (toastManagerDOM.length > 0)
        Array.prototype.forEach.call(toastManagerDOM, el => {
          if ("style" in el) el.style.transform = `translateX(${pos * -1 || 0}px)`;
        });
    };

    return sidebarPos.onChange(listener);
  }, [sidebarPos]);

  const sidebarValues: ISidebarData = useMemo(
    () => ({
      sidebarWidth,
      sidebarPos,
      isSidebarVisible,
      setSidebarVisibility,
      isSidebarFloating,
      fileTitle,
      setFileTitle,
      debouncedSidebarPos,
    }),
    [
      debouncedSidebarPos,
      fileTitle,
      isSidebarFloating,
      isSidebarVisible,
      sidebarPos,
      sidebarWidth,
    ]
  );

  return <SidebarData.Provider value={sidebarValues} children={children} />;
};

export default FVSidebarProvider;
