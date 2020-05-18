import React, { useEffect, useContext } from "react";
import { FVSidebarProps, FVSidebarClassNameContract } from "./FVSidebar.props";
import {
  DesignSystem,
  neutralLayerL1,
  neutralOutlineActive,
  applyPillCornerRadius,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { motion, useTransform } from "framer-motion";
import { tween } from "popmotion";
import { cubicBezier } from "@popmotion/easing";
import { Heading, HeadingSize, HeadingTag } from "@microsoft/fast-components-react-msft";
import { SidebarData } from "./FVSidebarContext";
import FVSidebarContent from "./FVSidebarContent";
import FVSidebarFooter from "./FVSidebarFooter";
import { useTranslation } from "react-i18next";
import { useRouteInterception } from "../../../_DesignSystem";

/**
 * The position where on the x-axis the button is placed by default
 */
const defaultButtonPos = 17;

/**
 * The width of the sidebar by default
 */
const defaultSidebarWidth = 400;

const styles: ComponentStyles<FVSidebarClassNameContract, DesignSystem> = {
  fv_sidebar_button: {
    zIndex: "63",
    position: "absolute",
    right: defaultButtonPos + "px",
    top: "14px",
    ...applyPillCornerRadius(),
  },
  fv_sidebar: {
    display: "flex",
    flexDirection: "column",
    width: defaultSidebarWidth + "px",
    height: "100%",
    background: neutralLayerL1,
    borderInlineStart: "1px solid",
    borderInlineStartColor: neutralOutlineActive,
    zIndex: "60",
    position: "absolute",
    top: "0",
    right: "0",
    "& > h1": {
      padding: "19px 25px 17px 75px",
    },
  },
  fv_sidebar_container: {
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
};

const FVSidebar: React.ComponentType<FVSidebarProps> = ({ managedClasses, fileData }) => {
  const { sidebarWidth, sidebarPos, isSidebarVisible, setSidebarVisibility } = useContext(
    SidebarData
  );

  const { addNavigationHandler } = useRouteInterception();
  const { t } = useTranslation("fileview");

  /**
   * The transitionX position of the sidebar.
   *
   * We need to invert the values, as this value
   * is relative to the initial position of the
   * sidebar, which is inside the viewport.
   */
  const sidebarContainerX = useTransform(
    sidebarPos,
    pos => -1 * (pos - sidebarWidth.get())
  );

  /**
   * Custom tween animator for opening and closing
   */
  useEffect(() => {
    sidebarPos.start(complete => {
      const anim = tween({
        from: sidebarPos.get(),
        to: isSidebarVisible ? defaultSidebarWidth : 0,
        duration: isSidebarVisible ? 400 : 300,
        ease: isSidebarVisible
          ? cubicBezier(0.2, 0.66, 0, 1)
          : cubicBezier(0.0, 0.0, 0.85, 0.05),
      }).start({
        complete,
        update: (val: number) => sidebarPos.set(val),
      });
      return anim.stop;
    });
  }, [sidebarPos, isSidebarVisible]);

  useEffect(() => {
    if (isSidebarVisible) {
      return addNavigationHandler(async () => {
        if (isSidebarVisible) {
          setSidebarVisibility(false);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        return true;
      });
    } else return () => {};
  }, [addNavigationHandler, isSidebarVisible, setSidebarVisibility]);

  return (
    <>
      <motion.div
        className={managedClasses.fv_sidebar}
        style={{
          x: sidebarContainerX,
        }}
      >
        <Heading size={HeadingSize._5} tag={HeadingTag.h1}>
          {t("inspector")}
        </Heading>
        <div className={managedClasses.fv_sidebar_container}>
          <FVSidebarContent fileData={fileData} />
          <FVSidebarFooter fileData={fileData} />
        </div>
      </motion.div>
    </>
  );
};

export default manageJss(styles)(FVSidebar);
