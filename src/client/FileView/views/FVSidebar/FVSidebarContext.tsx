import React, { useState, useLayoutEffect, useMemo } from "react";
import { useMotionValue, MotionValue } from "framer-motion";

/**
 * The width of the sidebar by default
 */
const defaultSidebarWidth = 400;

/**
 * This context contains an array of useful
 * positional data about the sidebar which can be
 * subscribed to, so that affected elements can
 * move along the sidebar smoothly.
 */
export interface ISidebarData {
  /**
   * The width of the sidebar
   */
  sidebarWidth: MotionValue<number>;
  /**
   * The current position of the sidebar.
   * `sidebarPos` <= 0 := closed / `sidebarPos` > 0 := visible
   *
   * We assume that the sidebar cannot be opened
   * in a size smaller than 100
   */
  sidebarPos: MotionValue<number>;
  /**
   * True, already while it's opening.
   * False, already while closing.
   */
  isSidebarVisible: boolean;
  setSidebarVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarData = React.createContext<ISidebarData>(null);

const FVSidebarProvider: React.ComponentType<{}> = ({ children }) => {
  const sidebarWidth = useMotionValue(defaultSidebarWidth);
  const sidebarPos = useMotionValue(0);
  const [isSidebarVisible, setSidebarVisibility] = useState(false);
  const sidebarValues = useMemo(
    () => ({
      sidebarWidth,
      sidebarPos,
      isSidebarVisible,
      setSidebarVisibility,
    }),
    [isSidebarVisible, sidebarPos, sidebarWidth]
  );

  return <SidebarData.Provider children={children} value={sidebarValues} />;
};

export default FVSidebarProvider;
