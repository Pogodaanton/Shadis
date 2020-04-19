import { ButtonAppearance } from "@microsoft/fast-components-react-msft";
import { DesignSystem, baseLayerLuminance } from "@microsoft/fast-components-styles-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import React, { useContext } from "react";
import { FaAdjust, FaSearchPlus, FaShareAlt } from "react-icons/fa";
import { Button, DesignToolkit } from "../../../_DesignSystem";
import { ButtonClassNameContract } from "../../../_DesignSystem/Button/Button.props";
import { HeaderRightContentProps } from "./HeaderRightContent.props";

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
    marginRight: "57px",
  },
};

export const HeaderRightContent: React.ComponentType<HeaderRightContentProps> = ({
  onMagnify,
  onShare,
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
        jssStyleSheet={marginLeftStyleSheet}
      />
    </>
  );
};
