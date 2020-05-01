import { ButtonAppearance } from "@microsoft/fast-components-react-msft";
import { DesignSystem, baseLayerLuminance } from "@microsoft/fast-components-styles-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import React, { useContext } from "react";
import { FaAdjust, FaSearchPlus, FaShareAlt } from "react-icons/fa";
import { Button, DesignToolkit } from "../../../_DesignSystem";
import { ButtonClassNameContract } from "../../../_DesignSystem/Button/Button.props";
import { HeaderRightContentProps } from "./HeaderRightContent.props";
import { defaultButtonPos } from "../FVSidebar/FVSidebarToggleButton";
import { motion, useTransform } from "framer-motion";
import { SidebarData } from "../FVSidebar/FVSidebarContext";

/**
 * Rotate the theme switcher icon based on the current theme
 */
const customThemeSwitcherStyle: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    transform: des => {
      const luminance: number = baseLayerLuminance(des);
      return `rotate(${luminance > 0.5 ? 180 : 0}deg)`;
    },
    transition: "transform .3s",
  },
};

/**
 * We need to make space for the sidebar button.
 */
const marginLeftStyleSheet: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    marginRight: "60px",
  },
};

export const HeaderRightContent: React.ComponentType<HeaderRightContentProps> = ({
  onMagnify,
  onShare,
}) => {
  const themeCtx = useContext(DesignToolkit);
  const { sidebarPos } = useContext(SidebarData);

  /**
   * Move right-side header contents alongside sidebar
   * if the window is big enough
   */
  const headerRightPosX = useTransform(sidebarPos, pos =>
    Math.min((pos - (defaultButtonPos + 63 - 12 - 5)) * -1, 0)
  );

  return (
    <motion.div style={{ x: headerRightPosX }}>
      <Button
        appearance={ButtonAppearance.lightweight}
        icon={FaSearchPlus}
        onClick={onMagnify}
      />
      <Button
        appearance={ButtonAppearance.lightweight}
        icon={FaAdjust}
        onClick={themeCtx.toggleTheme}
        jssStyleSheet={customThemeSwitcherStyle}
      />
      <Button
        appearance={ButtonAppearance.lightweight}
        icon={FaShareAlt}
        onClick={onShare}
        jssStyleSheet={marginLeftStyleSheet}
      />
    </motion.div>
  );
};
