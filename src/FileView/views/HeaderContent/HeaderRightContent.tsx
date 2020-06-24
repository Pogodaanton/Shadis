import { ButtonAppearance } from "@microsoft/fast-components-react-msft";
import { DesignSystem, baseLayerLuminance } from "@microsoft/fast-components-styles-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import React, { useContext } from "react";
import { FaAdjust, FaSearchPlus, FaShareAlt, FaVideo, FaImage } from "react-icons/fa";
import {
  Button,
  DesignToolkit,
  useMotionValueFactory,
  TabBar,
} from "../../../_DesignSystem";
import { ButtonClassNameContract } from "../../../_DesignSystem/Button/Button.props";
import { HeaderRightContentProps } from "./HeaderRightContent.props";
import { defaultButtonPos } from "../FVSidebar/FVSidebarToggleButton";
import { motion } from "framer-motion";
import { SidebarData } from "../FVSidebar/FVSidebarContext";
import { Orientation } from "@microsoft/fast-web-utilities";
import { TabItem } from "../../../_DesignSystem/Tabs/TabBar/TabBar.props";

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
    "&:active": {
      transition: "transform .3s, background .1s",
    },
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

const tabBarItems: TabItem[] = [
  { icon: FaVideo, id: "video", title: "Video" },
  { icon: FaImage, id: "gif", title: "Gif" },
];

export const HeaderRightContent: React.ComponentType<HeaderRightContentProps> = React.memo(
  ({ onMagnify, onShare, isVideo, hasGif }) => {
    const themeCtx = useContext(DesignToolkit);
    const { sidebarPos, isSidebarFloating } = useContext(SidebarData);

    /**
     * Move right-side header contents alongside sidebar
     * if the window is big enough
     */
    const headerRightPosX = useMotionValueFactory(
      () =>
        isSidebarFloating
          ? 0
          : Math.min((sidebarPos.get() - (defaultButtonPos + 63 - 12 - 5)) * -1, 0),
      [sidebarPos, isSidebarFloating]
    );

    return (
      <motion.div style={{ x: headerRightPosX }}>
        {isVideo && hasGif && (
          <>
            <TabBar
              id="video-gif"
              label="Switch between video and gif view"
              orientation={Orientation.horizontal}
              items={tabBarItems}
            />
          </>
        )}
        {!isVideo && (
          <Button
            appearance={ButtonAppearance.lightweight}
            icon={FaSearchPlus}
            onClick={onMagnify}
          />
        )}
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
  }
);
