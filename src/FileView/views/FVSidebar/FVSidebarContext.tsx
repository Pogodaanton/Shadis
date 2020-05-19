import React, { useState, useMemo, useEffect } from "react";
import { useMotionValue } from "framer-motion";
import { ISidebarData } from "./FVSidebarContext.props";
import { useWindowBreakpoint } from "../../../_DesignSystem";
import { debounce } from "lodash-es";

/**
 * The width of the sidebar by default
 */
const defaultSidebarWidth: number = 400;

/**
 * A react context that broadcasts positional data like
 * the position of the sidebar.
 */
export const SidebarData = React.createContext<ISidebarData>(null);

const FVSidebarProvider: React.ComponentType<{ fileData: Window["fileData"] }> = ({
  children,
  fileData,
}) => {
  const sidebarWidth = useMotionValue(defaultSidebarWidth);
  const sidebarPos = useMotionValue(0);
  const [isSidebarVisible, setSidebarVisibility] = useState(false);
  const isSidebarFloating = useWindowBreakpoint(850, "max-width", true);
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
