import React, { useEffect, useRef, useState } from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { FileViewClassNameContract, FileViewProps } from "./FileView.props";
import {
  neutralForegroundRest,
  DesignSystem,
  neutralLayerL1,
} from "@microsoft/fast-components-styles-msft";
import { motion } from "framer-motion";
import { Header } from "../_DesignSystem";
import { HeaderClassNameContract } from "../_DesignSystem/Header/Header.props";
import ImageViewer from "./views/ImageViewer";
import { HeaderCenterContent } from "./views/HeaderCenterContent";
import { HeaderRightContent } from "./views/HeaderRightContent";

const styles: ComponentStyles<FileViewClassNameContract, DesignSystem> = {
  fileView: {
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
};

let largeImage: HTMLImageElement = null;

const FileView: React.FC<FileViewProps> = ({
  managedClasses,
  fileData,
}: FileViewProps) => {
  fileData = fileData || window.fileData;
  const { id, extension } = fileData || window.fileData;
  const onImageLoaded = useRef<() => void>(null);
  const [largeImageLoaded, setLargeImageLoadedState] = useState(false);

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

  /**
   * Setting up imageLoad event handler for large image
   */
  useEffect(() => {
    onImageLoaded.current = () => setLargeImageLoadedState(true);
    return () => {
      if (largeImage) largeImage.removeEventListener("load", onImageLoaded.current);
    };
  }, []);

  /**
   * Load image in background before rendering
   */
  const loadLargeImage = () => {
    largeImage = new Image();
    largeImage.addEventListener("load", onImageLoaded.current);
    largeImage.src = `${window.location.origin}/${id}.${extension}`;
  };

  // imageURL for <ImageViewer/>
  const imageURL = `${window.location.origin}/${id}.${
    largeImageLoaded ? extension : "thumb.jpg"
  }`;

  return (
    <div className={managedClasses.fileView}>
      <motion.div
        className={managedClasses.fileViewBackground}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={loadLargeImage}
      >
        <Header
          position="absolute"
          jssStyleSheet={headerStyles}
          centerContent={<HeaderCenterContent fileData={fileData} />}
          rightSideContent={<HeaderRightContent fileData={fileData} />}
        />
      </motion.div>
      <ImageViewer imageURL={imageURL} fileData={fileData} />
    </div>
  );
};

export default manageJss(styles)(FileView);
