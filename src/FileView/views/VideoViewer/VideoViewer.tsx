import React, { useContext, useRef, useLayoutEffect, useMemo, useCallback } from "react";
import { VideoViewerProps, VideoViewerClassNameContract } from "./VideoViewer.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { headerHeight, TabViewer, toast } from "../../../_DesignSystem";
import { ThumbnailContext, ssrContainer } from "../ThumbnailViewer/ThumbnailViewer";
import { SidebarData } from "../FVSidebar/FVSidebarContext";
import { useTranslation } from "react-i18next";
import { TabPanel } from "../../../_DesignSystem/Tabs/TabViewer/TabViewer.props";
import tabEventEmitter from "../../../_DesignSystem/Tabs/TabEvents";

const styles: ComponentStyles<VideoViewerClassNameContract, DesignSystem> = {
  videoViewer: {
    position: "absolute",
    top: "64px",
    transition: "width .15s",
    "& video, & img": {
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
  const { t } = useTranslation("fileview");

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
   * React.ref of the gif container
   */
  const imgRef = useRef<HTMLImageElement>(null);

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

  const onGifAppear = useCallback(() => {
    const imgEl = imgRef.current;
    if (imgEl && !imgEl.src) {
      let toastScheduler: number = null;
      let toastId: React.ReactText = null;

      const removeListeners = () => {
        imgEl.onerror = () => {};
        imgEl.onload = () => {};
      };

      const removeScheduledToast = () => {
        clearTimeout(toastScheduler);
        if (toastId) toast.dismiss(toastId);
        return true;
      };

      imgEl.onerror = () => {
        removeScheduledToast();
        imgEl.style.display = "none";
        toast.error(t("gif.loadError"), "", { autoClose: 10000 });
        tabEventEmitter.emit("video-gif-update", "video");
        removeListeners();
        imgEl.src = "";
      };

      imgEl.onload = () => removeScheduledToast() && removeListeners();

      toastScheduler = setTimeout(() => {
        toastId = toast.info(t("gif.load"), "", { progress: 0 });
      }, 500) as any;

      imgEl.src = `${window.location.origin}/${id}.gif`;
    }
  }, [id, t]);

  const onVideoAppear = useCallback(() => {
    const videoEl = videoRef.current;
    if (videoEl && videoEl.src) {
      videoEl.currentTime = 0;
    }
  }, []);

  const tabContentItems: TabPanel[] = useMemo(
    () => [
      {
        id: "video",
        children: <video muted autoPlay loop ref={videoRef} />,
        onLoad: onVideoAppear,
      },
      {
        id: "gif",
        children: <img alt={t("gif.alt")} ref={imgRef} />,
        onLoad: onGifAppear,
      },
    ],
    [onGifAppear, onVideoAppear, t]
  );

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
      <TabViewer id="video-gif" items={tabContentItems} />
    </div>
  );
};

export default manageJss(styles)(VideoViewer);
