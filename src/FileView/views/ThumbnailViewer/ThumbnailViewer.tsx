import React, { useState, useMemo, createContext, useRef, useCallback } from "react";
import {
  ThumbnailViewerProps,
  ThumbnailViewerClassNameContract,
  ThumbnailContextItems,
} from "./ThumbnailViewer.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { isLoggedIn, headerHeight, useScaleFactor } from "../../../_DesignSystem";
import { motion } from "framer-motion";
import { useViewportDimensions } from "../ImageViewer/useViewportDimensions";

const styles: ComponentStyles<ThumbnailViewerClassNameContract, DesignSystem> = {
  viewer: {
    top: "0",
    left: "0",
    display: "flex",
    zIndex: "30",
    position: "fixed",
    minWidth: "100%",
    minHeight: "100%",
    flexGrow: "1",
    "& > iframe": {
      opacity: 0,
      pointerEvents: "none",
    },
  },
  thumbnailViewer: {
    position: "absolute",
    userSelect: "none",
    top: headerHeight / 2 + "px",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
};

export const ThumbnailContext = createContext<ThumbnailContextItems>(null);

/**
 * A component that is used for magic animations
 * connecting the cards in the dashboard
 * with FileView.
 *
 * After the animation occured, we notify the actual content
 * viewer component to load the full-resolution file.
 */
const ThumbnailViewer: React.ComponentType<ThumbnailViewerProps> = ({
  fileData,
  managedClasses,
  children,
}) => {
  const { id, width, height, fromServer } = fileData;

  // Viewport dimensions
  const [resizeListener, { viewportWidth, viewportHeight }] = useViewportDimensions();

  /**
   * Visibility of the thumbnail is independent from other aspects.
   */
  const [isThumbnailVisible, setThumbnailVisibility] = useState(true);

  /**
   * Cached function that is executed on MagicAnimEnd.
   *
   * If the page was accessed directly or the user is logged-off,
   * we don't run any magic animations. Hence, we execute the function directly.
   */
  const entryFinishListener = useRef(() => {});
  const addEntryFinishListener = useCallback(
    (listener: () => void) => {
      entryFinishListener.current = listener;

      if (!isLoggedIn || fromServer) entryFinishListener.current();
    },
    [fromServer]
  );

  /**
   * Used for determining whether a magic animation
   * is running.
   */
  const [isMagicAnimRunning, setMagicAnimState] = useState(false);

  // Toggle `isMagicAnimRunning`
  const onMagicAnimStart = () => {
    if (!isMagicAnimRunning) setMagicAnimState(true);
    setThumbnailVisibility(true);
  };
  const onMagicAnimEnd = () => {
    if (isMagicAnimRunning) setMagicAnimState(false);
    entryFinishListener.current();
  };

  /**
   * Scale factor of the image.
   * If the image is bigger than the viewport, it needs to be scaled down by this number.
   */
  const defaultScale = useScaleFactor(width, height, viewportWidth, viewportHeight);
  const defaultWidth = useMemo(() => width * defaultScale, [defaultScale, width]);
  const defaultHeight = useMemo(() => height * defaultScale, [defaultScale, height]);

  /**
   * Additional attributes for the root motion.div
   * if magic motion is not available.
   */
  const extraAttributes = !isLoggedIn
    ? {
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
        initial: { opacity: 0 },
        exit: { opacity: 0 },
        onAnimationComplete: onMagicAnimEnd,
      }
    : {};

  /**
   * Caching the context value
   */
  const contextValue: ThumbnailContextItems = useMemo(
    () => ({
      isThumbnailVisible,
      viewportWidth,
      viewportHeight,
      defaultScale,
      setThumbnailVisibility,
      addEntryFinishListener,
    }),
    [
      addEntryFinishListener,
      defaultScale,
      isThumbnailVisible,
      viewportHeight,
      viewportWidth,
    ]
  );

  return (
    <ThumbnailContext.Provider value={contextValue}>
      <motion.div {...extraAttributes} className={managedClasses.viewer}>
        {resizeListener}
        <motion.div
          layoutId={`card-image-container-${id}`}
          className={managedClasses.thumbnailViewer}
          onAnimationStart={onMagicAnimStart}
          onAnimationComplete={onMagicAnimEnd}
          tabIndex={-1}
          style={{
            visibility: isThumbnailVisible ? "visible" : "hidden",
            backgroundImage: `url("${window.location.origin}/${id}.thumb.jpg")`,
            backgroundSize: `${defaultWidth}px ${defaultHeight}px`,
          }}
        />
        {children}
      </motion.div>
    </ThumbnailContext.Provider>
  );
};

export default manageJss(styles)(ThumbnailViewer);
