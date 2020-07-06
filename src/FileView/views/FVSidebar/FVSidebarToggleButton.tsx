import React, { useContext, useState, useEffect } from "react";
import {
  FVSidebarToggleButtonProps,
  FVSidebarToggleButtonClassNameContract,
} from "./FVSidebarToggleButton.props";
import {
  DesignSystem,
  applyPillCornerRadius,
  neutralLayerL2,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { motion, useTransform } from "framer-motion";
import { FaCaretLeft, FaInfo } from "react-icons/fa";
import { SidebarData } from "./FVSidebarContext";
import { parseColorHexRGBA } from "@microsoft/fast-colors";
import { designSystemContext } from "@microsoft/fast-jss-manager-react/dist/context";
import { ButtonClassNameContract } from "../../../_DesignSystem/Button/Button.props";
import { Button } from "../../../_DesignSystem";
import { useTranslation } from "react-i18next";

/**
 * The position on the x-axis where the button is placed by default
 */
export const defaultButtonPos = 17;

/**
 * Styling for the component
 */
const styles: ComponentStyles<FVSidebarToggleButtonClassNameContract, DesignSystem> = {
  fv_sidebarButton: {
    zIndex: "63",
    position: "absolute",
    right: defaultButtonPos + "px",
    top: "15px",
    ...applyPillCornerRadius(),
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
  },
};

const FVSidebarToggleButton: React.ComponentType<FVSidebarToggleButtonProps> = ({
  managedClasses,
}) => {
  const { isSidebarVisible, setSidebarVisibility, sidebarPos } = useContext(SidebarData);
  const [isButtonHover, setButtonHover] = useState(false);
  const designCtx = useContext(designSystemContext) as DesignSystem;
  const { t } = useTranslation("fileview");

  /**
   * Moves the button into the sidebar when opened.
   * Consists of buttonPos + buttonWidth + paddingLeft
   */
  const buttonPosition = useTransform(sidebarPos, pos =>
    Math.min((pos - (defaultButtonPos + 64)) * -1, 0)
  );

  /**
   * Change background-color if sidebarPos > defaultButtonPos
   * The first color needs to be the same as the second one only in transparent.
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
   * Resetting hover state if `isSidebarVisible` state changes.
   * This is for avoiding visual bugs.
   */
  useEffect(() => setButtonHover(false), [isSidebarVisible]);

  return (
    <motion.div
      className={managedClasses.fv_sidebarButton}
      style={{
        x: buttonPosition,
        background: buttonBackground,
      }}
      onHoverStart={() => setButtonHover(true)}
      onHoverEnd={() => setButtonHover(false)}
    >
      <Button
        beforeContent={classname => (
          <>
            <motion.div
              animate={{
                /**
                 * Hover animation.
                 *
                 * We also move the caret by a few pixels
                 * when the sidebar is opened
                 * to ensure optical centering
                 */
                x: isButtonHover ? (isSidebarVisible ? 5 : -3) : isSidebarVisible ? 2 : 0,
              }}
              style={{ rotate: buttonIconRotation }}
            >
              <FaCaretLeft className={classname} />
            </motion.div>
            <FaInfo className={classname} />
          </>
        )}
        onClick={() => setSidebarVisibility(!isSidebarVisible)}
        jssStyleSheet={customCaretStyle}
        aria-label={isSidebarVisible ? t("hideInspector") : t("openInspector")}
        title={isSidebarVisible ? t("hideInspector") : t("openInspector")}
      />
    </motion.div>
  );
};

export default manageJss(styles)(FVSidebarToggleButton);
