import React, { useEffect, useState } from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { FileViewClassNameContract, FileViewProps } from "./FileView.props";
import {
  neutralForegroundRest,
  DesignSystem,
  neutralLayerL1,
} from "@microsoft/fast-components-styles-msft";
import { motion } from "framer-motion";
import { Header, RouteInterceptionManager } from "../_DesignSystem";
import { HeaderClassNameContract } from "../_DesignSystem/Header/Header.props";
import ImageViewer from "./views/ImageViewer/ImageViewer";
import { HeaderCenterContent } from "./views/HeaderContent/HeaderCenterContent";
import { HeaderRightContent } from "./views/HeaderContent/HeaderRightContent";
import { FVSidebarProps } from "./views/FVSidebar/FVSidebar.props";
import { LoadableComponent } from "@loadable/component";
import { FullscreenLoader } from "../Loader";
import FVSidebarProvider from "./views/FVSidebar/FVSidebarContext";
import FVSidebarToggleButton from "./views/FVSidebar/FVSidebarToggleButton";
import VideoViewer from "./views/VideoViewer/VideoViewer";
import ThumbnailViewer from "./views/ThumbnailViewer/ThumbnailViewer";
import { classNames } from "@microsoft/fast-web-utilities";

const FVSidebar: LoadableComponent<FVSidebarProps> = FullscreenLoader(
  import(/* webpackChunkName: "FVSidebar" */ "./views/FVSidebar/FVSidebar")
);

const styles: ComponentStyles<FileViewClassNameContract, DesignSystem> = {
  fileView: {
    display: "flex",
    position: "fixed",
    zIndex: "30",
    top: "0",
    left: "0",
    minWidth: "100%",
    minHeight: "100%",
  },
  fileViewBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    background: neutralLayerL1,
  },
  fileViewContainer: {
    position: "absolute",
    top: "64px",
    left: "0",
    right: "0",
    bottom: "0",
    margin: "auto",
    cursor: "zoom-in",
  },
  fileViewIcon: {
    fontSize: "4em",
    color: (designSystem: DesignSystem): string => neutralForegroundRest(designSystem),
  },
};

const headerStyles: ComponentStyles<HeaderClassNameContract, DesignSystem> = {
  header: {
    zIndex: "40",
  },
  header_left: {},
  header_right: {
    flexShrink: "0",
  },
  "@media (max-width: 1270px)": {
    header_center: {
      ".fileView-hasGif &": {
        position: "initial",
      },
    },
  },
};

const FileView: React.FC<FileViewProps> = ({
  managedClasses,
  fileData,
}: FileViewProps) => {
  const { extension, has_gif } = fileData;

  /**
   * Used to decide whether to show ImageViewer or VideoViewer
   */
  const [isVideo] = useState<boolean>(extension === "mp4");

  /**
   * Image manipulation involves overflowing the body
   * Moreover, <DashboardList/> uses a body scrollbar which we want to hide.
   */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <FVSidebarProvider fileData={fileData}>
      <RouteInterceptionManager>
        <div
          className={classNames(managedClasses.fileView, ["fileView-hasGif", has_gif])}
        >
          <motion.div
            className={managedClasses.fileViewBackground}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
          >
            <Header
              position="absolute"
              jssStyleSheet={headerStyles}
              centerContent={<HeaderCenterContent />}
              rightSideContent={<HeaderRightContent isVideo={isVideo} hasGif={has_gif} />}
            />
            <FVSidebarToggleButton />
          </motion.div>
          <ThumbnailViewer fileData={fileData}>
            {isVideo ? (
              <VideoViewer fileData={fileData} />
            ) : (
              <ImageViewer fileData={fileData} />
            )}
          </ThumbnailViewer>
          <FVSidebar fileData={fileData} />
        </div>
      </RouteInterceptionManager>
    </FVSidebarProvider>
  );
};

export default manageJss(styles)(FileView);
