import React, { useState, useEffect, useContext, useCallback } from "react";
import { FVSidebarProps, FVSidebarClassNameContract } from "./FVSidebar.props";
import {
  DesignSystem,
  neutralLayerL1,
  neutralOutlineActive,
  neutralLayerL2,
  applyPillCornerRadius,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { motion, useMotionValue, useTransform, usePresence } from "framer-motion";
import { Button } from "../../../_DesignSystem";
import { FaCaretLeft, FaInfo } from "react-icons/fa";
import { ButtonClassNameContract } from "../../../_DesignSystem/Button/Button.props";
import { tween } from "popmotion";
import { cubicBezier } from "@popmotion/easing";
import { designSystemContext } from "@microsoft/fast-jss-manager-react/dist/context";
import { parseColorHexRGBA } from "@microsoft/fast-colors";
import { Heading, HeadingSize, HeadingTag } from "@microsoft/fast-components-react-msft";
import FVSidebarContent from "./FVSidebarContent";
import FVSidebarFooter from "./FVSidebarFooter";

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
      padding: "18px 25px 17px 75px",
    },
  },
  fv_sidebar_container: {
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
};

/**
 * Custom styling for sidebar toggle.
 */
const customCaretStyle: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    paddingTop: "6px",
    paddingLeft: "6px",
    margin: "0",
    "& > svg": {
      paddingBottom: "2px",
    },
    "& > div": {
      height: "17px",
    },
    "&:hover:enabled": {
      background: "transparent",
    },
  },
};

const FVSidebar: React.ComponentType<FVSidebarProps> = ({ managedClasses, fileData }) => {
  const [visible, setVisibility] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const designCtx = useContext(designSystemContext) as DesignSystem;
  const [isPresent, safeToRemove] = usePresence();

  /**
   * The width of the sidebar
   */
  const sidebarWidth = useMotionValue(defaultSidebarWidth);

  /**
   * Main motion value
   *
   * We assume that the sidebar cannot be opened
   * in a size smaller than 100
   */
  const sidebarPos = useMotionValue(0);

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
   * Only move button if sidebarPos > defaultButtonPos
   * We add 1 px more in order to avoid animation glitches
   */
  const buttonPosition = useTransform(
    sidebarPos,
    pos => -1 * Math.max(pos - (defaultButtonPos + 63), 0)
  );

  /**
   * Change background-color if sidebarPos > defaultButtonPos
   *
   * We use `neutralLayerL1` as does the background of the sidebar.
   * The first color, though, needs to be the same only in transparent.
   */
  const buttonBackground = useTransform(
    sidebarPos,
    [defaultButtonPos, 82],
    [
      parseColorHexRGBA(neutralLayerL2(designCtx) + "00").toStringWebRGBA(),
      neutralLayerL2(designCtx),
    ]
  );

  /**
   * Rotate icon if sidebar is opened.
   */
  const buttonIconRotation = useTransform(sidebarPos, [defaultButtonPos, 82], [0, 180]);

  /**
   * Custom tween animator for opening and closing
   */
  useEffect(() => {
    sidebarPos.start(complete => {
      const anim = tween({
        from: sidebarPos.get(),
        to: visible ? defaultSidebarWidth : 0,
        duration: visible ? 400 : 350,
        ease: visible ? cubicBezier(0.2, 0.66, 0, 1) : cubicBezier(0.0, 0.0, 0.85, 0.05),
      }).start({
        complete,
        update: (val: number) => sidebarPos.set(val),
      });
      return anim.stop;
    });
  }, [sidebarPos, visible]);

  /**
   * Resetting hover state if visible state changes.
   * This is for avoiding visual bugs.
   */
  useEffect(() => setButtonHover(false), [visible]);

  /**
   * Close sidebar while unmounting component.
   * We set a timeout for the image repositoning animation to kick in.
   *
   * TODO: Find a way to close sidebar BEFORE unmounting
   * ! Maybe call an upper safeToRemove prop?
   */
  const allowUnmount = useCallback(
    (pos: number) => {
      if (!isPresent && pos === 0) {
        setTimeout(safeToRemove, 200);
      }
    },
    [isPresent, safeToRemove]
  );

  /**
   * Listen to isPresent for starting closing animation.
   */
  useEffect(() => {
    if (!safeToRemove) return;
    if (!isPresent) {
      if (visible) setVisibility(false);
      else if (!sidebarPos.isAnimating()) {
        console.log("bruh");
        safeToRemove();
        return;
      }
      return sidebarPos.onChange(allowUnmount);
    }
  }, [allowUnmount, isPresent, safeToRemove, sidebarPos, visible]);

  return (
    <>
      <motion.div
        className={managedClasses.fv_sidebar_button}
        style={{
          x: buttonPosition,
          background: buttonBackground,
        }}
        exit={{
          opacity: 0,
        }}
        onHoverStart={() => setButtonHover(true)}
        onHoverEnd={() => setButtonHover(false)}
      >
        <Button
          beforeContent={classname => (
            <>
              <motion.div
                animate={{
                  // Hover animation
                  // We also move the caret by a few pixels for optical centering
                  x: isButtonHover ? (visible ? 5 : -3) : visible ? 2 : 0,
                }}
                style={{ rotate: buttonIconRotation }}
              >
                <FaCaretLeft className={classname} />
              </motion.div>
              <FaInfo className={classname} />
            </>
          )}
          onClick={() => setVisibility(!visible)}
          jssStyleSheet={customCaretStyle}
        />
      </motion.div>
      <motion.div
        style={{
          width: sidebarPos,
        }}
      />
      <motion.div
        className={managedClasses.fv_sidebar}
        style={{
          x: sidebarContainerX,
        }}
      >
        <Heading size={HeadingSize._5} tag={HeadingTag.h1}>
          File Inspector
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
