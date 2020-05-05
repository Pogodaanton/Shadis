import React, { useState, useMemo } from "react";
import { useMotionValue } from "framer-motion";
import { ISidebarData } from "./FVSidebarContext.props";
import { useWindowBreakpoint } from "../../../_DesignSystem";

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

  const sidebarValues = useMemo(
    () => ({
      sidebarWidth,
      sidebarPos,
      isSidebarVisible,
      setSidebarVisibility,
      isSidebarFloating,
      fileTitle,
      setFileTitle,
    }),
    [fileTitle, isSidebarFloating, isSidebarVisible, sidebarPos, sidebarWidth]
  );

  return <SidebarData.Provider children={children} value={sidebarValues} />;
};

export default FVSidebarProvider;
