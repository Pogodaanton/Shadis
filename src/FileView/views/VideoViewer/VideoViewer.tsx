import React, { useContext, useRef, useLayoutEffect, useMemo } from "react";
import { VideoViewerProps, VideoViewerClassNameContract } from "./VideoViewer.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { headerHeight } from "../../../_DesignSystem";
import { ThumbnailContext, ssrContainer } from "../ThumbnailViewer/ThumbnailViewer";
import { SidebarData } from "../FVSidebar/FVSidebarContext";

const styles: ComponentStyles<VideoViewerClassNameContract, DesignSystem> = {
  videoViewer: {
    position: "absolute",
    top: "64px",
    transition: "width .15s",
    "& video": {
      width: "100%",
      height: "100%",
      objectFit: "scale-down",
    },
  },
  videoViewer_thumbnailContainer: {
    position: "absolute",
    userSelect: "none",
    top: headerHeight + "px",
    left: "0",
    right: "0",
    bottom: "0",
    margin: "auto",
    width: "100%",
    height: "100%",
  },
};

const VideoViewer: React.ComponentType<VideoViewerProps> = ({
  fileData,
  managedClasses,
}) => {
  const { id, extension, fromServer } = fileData;
  let {
    isThumbnailVisible,
    addEntryFinishListener,
    setThumbnailVisibility,
    viewportWidth: originalViewportWidth,
    viewportHeight,
  } = useContext(ThumbnailContext);

  // Sidebar data for viewport calculations
  const { debouncedSidebarPos } = useContext(SidebarData);
  const viewportWidth = useMemo(() => originalViewportWidth - debouncedSidebarPos, [
    debouncedSidebarPos,
    originalViewportWidth,
  ]);

  /**
   * React.ref of the video element
   */
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Listen to the finishing of the thumbnail animation.
   * Load the high-res image afterwards and hide the thumbnail.
   */
  useLayoutEffect(() => {
    if (videoRef.current && isThumbnailVisible) {
      const videoEl = videoRef.current;
      if (!videoEl.src) {
        const listener = () => {
          setThumbnailVisibility(false);
          if (fromServer && ssrContainer) ssrContainer.remove();
          videoEl.removeEventListener("canplaythrough", listener);
        };

        addEntryFinishListener(() => {
          videoEl.addEventListener("canplaythrough", listener);
          videoEl.src = `${window.location.origin}/${id}.${extension}`;
        });

        return () => {
          addEntryFinishListener(() => {});
          videoEl.removeEventListener("canplaythrough", listener);
        };
      }
    }
  }, [
    addEntryFinishListener,
    extension,
    fromServer,
    id,
    isThumbnailVisible,
    setThumbnailVisibility,
  ]);

  return (
    <div
      className={managedClasses.videoViewer}
      style={{
        display: isThumbnailVisible ? "none" : "block",
        visibility: isThumbnailVisible ? "hidden" : "visible",
        width: viewportWidth,
        height: viewportHeight,
      }}
    >
      <video muted autoPlay loop ref={videoRef} />
    </div>
  );
};

export default manageJss(styles)(VideoViewer);
