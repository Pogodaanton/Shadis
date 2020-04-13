import React, { useEffect } from "react";
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
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    margin: "auto",
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
};

const FileView: React.FC<FileViewProps> = ({
  managedClasses,
  fileData,
}: FileViewProps) => {
  const { id, thumb_height, title } = fileData || window.fileData;

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
    <div className={managedClasses.fileView}>
      <motion.div
        className={managedClasses.fileViewBackground}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0 }}
      >
        <Header fixed jssStyleSheet={headerStyles} />
      </motion.div>
      <motion.div
        className={managedClasses.fileViewContainer}
        layoutId={`card-image-container-${id}`}
        animate
        style={{
          width: 200,
          height: thumb_height,
        }}
      >
        <img
          alt={title}
          src={`${window.location.origin}/${id}.thumb.jpg`}
          style={{
            width: "100%",
            height: "100%",
            display: "inline-block",
          }}
        />
      </motion.div>
    </div>
  );
};

export default manageJss(styles)(FileView);
