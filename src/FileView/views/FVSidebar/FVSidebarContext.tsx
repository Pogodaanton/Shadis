import React, { useState, useMemo, useRef } from "react";
import { useMotionValue } from "framer-motion";
import { ISidebarData, NavigationHandler } from "./FVSidebarContext.props";
import { useWindowBreakpoint } from "../../../_DesignSystem";
import ReactRouterPause, { NavigationAttemptHandler } from "@allpro/react-router-pause";
import { uniqueId, findIndex } from "lodash-es";

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
  const navigationHandlers = useRef<NavigationHandler[]>([]);

  /**
   * Adds a listener to `navigationHandlers` and returns a function
   * that can be used as a return value in a `useEffect` hook.
   */
  const addNavigationHandler = (handler: NavigationHandler["handler"]) => {
    const id = uniqueId("navHandler");
    navigationHandlers.current.push({ id, handler });
    return () => {
      const index = findIndex(navigationHandlers.current, { id });
      navigationHandlers.current.splice(index, 1);
      return;
    };
  };

  /**
   * Listen to changes in navigation and trigger every
   * function that is in `navigationHandlers`.
   */
  const onNavigationAttempt: NavigationAttemptHandler = (navigation, location, action) =>
    new Promise(resolveAttempt => {
      let shouldNavigate: Promise<boolean>[] = [];
      console.log(action);

      navigationHandlers.current.forEach(obj => {
        const res = obj.handler(navigation, location, action);
        if (typeof res === "boolean") {
          shouldNavigate.push(new Promise(resolve => resolve(!!res)));
        } else shouldNavigate.push(res);
      });

      Promise.all(shouldNavigate).then(bools => {
        resolveAttempt(!bools.includes(false));
      });
    });

  const sidebarValues: ISidebarData = useMemo(
    () => ({
      sidebarWidth,
      sidebarPos,
      isSidebarVisible,
      setSidebarVisibility,
      isSidebarFloating,
      fileTitle,
      setFileTitle,
      addNavigationHandler,
    }),
    [fileTitle, isSidebarFloating, isSidebarVisible, sidebarPos, sidebarWidth]
  );

  return (
    <SidebarData.Provider value={sidebarValues}>
      <ReactRouterPause handler={onNavigationAttempt} />
      {children}
    </SidebarData.Provider>
  );
};

export default FVSidebarProvider;
