import { ButtonAppearance } from "@microsoft/fast-components-react-msft";
import { DesignSystem, baseLayerLuminance } from "@microsoft/fast-components-styles-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import React, { useContext, useMemo } from "react";
import { FaAdjust, FaSearchPlus, FaVideo, FaImage } from "react-icons/fa";
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
import { SidebarData, SidebarEventEmitter } from "../FVSidebar/FVSidebarContext";
import { Orientation } from "@microsoft/fast-web-utilities";
import { TabItem } from "../../../_DesignSystem/Tabs/TabBar/TabBar.props";
import { ThemeName } from "../../../_DesignSystem/Toolkit/DesignSystem.props";
import { useTranslation } from "react-i18next";

/**
 * Rotate the theme switcher icon based on the current theme
 */
const customThemeSwitcherStyle: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    marginRight: "60px",
    "& svg": {
      transform: des => {
        const luminance: number = baseLayerLuminance(des);
        return `rotate(${luminance > 0.5 ? 180 : 0}deg)`;
      },
      transition: "transform .3s",
    },
    "&:active": {
      transition: "background .1s",
    },
  },
};

const tabBarItems: TabItem[] = [
  { icon: FaVideo, id: "video", title: "Video" },
  { icon: FaImage, id: "gif", title: "Gif" },
];

export const HeaderRightContent: React.ComponentType<HeaderRightContentProps> = React.memo(
  ({ isVideo, hasGif }) => {
    const themeCtx = useContext(DesignToolkit);
    const { sidebarPos, isSidebarFloating } = useContext(SidebarData);
    const { t } = useTranslation(["common", "fileview"]);

    const isDarkMode: boolean = useMemo(() => themeCtx.theme === ThemeName.dark, [
      themeCtx.theme,
    ]);

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

    const toggleZoom = () => SidebarEventEmitter.emit("toggle-zoom");

    return (
      <motion.div style={{ x: headerRightPosX }}>
        {isVideo && hasGif && (
          <>
            <TabBar
              id="video-gif"
              label={t("fileview:gif.toggle")}
              orientation={Orientation.horizontal}
              items={tabBarItems}
            />
          </>
        )}
        {!isVideo && (
          <Button
            appearance={ButtonAppearance.lightweight}
            icon={FaSearchPlus}
            onClick={toggleZoom}
            aria-label={t("fileview:toggleZoom")}
            title={t("fileview:toggleZoom")}
          />
        )}
        <Button
          appearance={ButtonAppearance.lightweight}
          icon={FaAdjust}
          onClick={themeCtx.toggleTheme}
          jssStyleSheet={customThemeSwitcherStyle}
          aria-label={isDarkMode ? t("common:theme.useLight") : t("common:theme.useDark")}
          title={isDarkMode ? t("common:theme.useLight") : t("common:theme.useDark")}
        />
        {/*
        <Button
          appearance={ButtonAppearance.lightweight}
          icon={FaShareAlt}
          onClick={onShare}
          jssStyleSheet={marginLeftStyleSheet}
        />
        */}
      </motion.div>
    );
  }
);
