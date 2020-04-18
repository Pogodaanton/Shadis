import { ButtonAppearance } from "@microsoft/fast-components-react-msft";
import { DesignSystem, baseLayerLuminance } from "@microsoft/fast-components-styles-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import React, { useContext } from "react";
import { FaAdjust, FaCaretLeft, FaSearchPlus, FaShareAlt, FaInfo } from "react-icons/fa";
import { Button, DesignToolkit } from "../../_DesignSystem";
import { ButtonClassNameContract } from "../../_DesignSystem/Button/Button.props";
import { HeaderRightContentProps } from "./HeaderRightContent.props";

/**
 * Custom styling for sidebar toggle.
 */
const customCaretStyle: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    paddingTop: "6px",
    paddingLeft: "6px",
    margin: "0",
    "& svg:first-child": {
      paddingTop: "2px",
    },
  },
};

const customThemeSwitcherStyle: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    transform: des => {
      const luminance: number = baseLayerLuminance(des);
      return `rotate(${luminance > 0.5 ? 180 : 0}deg)`;
    },
    transition: "transform .3s",
  },
};

export const HeaderRightContent: React.ComponentType<HeaderRightContentProps> = ({
  onMagnify,
  onShare,
  onSidebarOpen,
}) => {
  const themeCtx = useContext(DesignToolkit);
  return (
    <>
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
      />
      <Button
        beforeContent={classname => (
          <>
            <FaCaretLeft className={classname} />
            <FaInfo className={classname} />
          </>
        )}
        onClick={onSidebarOpen}
        jssStyleSheet={customCaretStyle}
      />
    </>
  );
};
