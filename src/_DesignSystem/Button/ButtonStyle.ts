import {
  neutralForegroundHover,
  neutralForegroundActive,
  neutralFillActive,
} from "@microsoft/fast-components-styles-msft";
/**
 * Code taken from "@microsoft/fast-components-styles-msft"
 * Modified to fit the custom design
 */
import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
  directionSwitch,
  format,
  toPx,
  applyFocusVisible,
} from "@microsoft/fast-jss-utilities";
import {
  DesignSystem,
  accentForegroundCut,
  glyphSize,
  horizontalSpacing,
  focusOutlineWidth,
  accentPalette,
  backgroundColor,
  accentFillHover,
  applyPillCornerRadius,
  neutralForegroundRest,
  neutralFillHover,
  highContrastSelected,
  highContrastSelectedForeground,
  highContrastOutlineFocus,
  neutralFocus,
} from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64, rgbToRelativeLuminance } from "@microsoft/fast-colors";
import { parseColorString } from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";
import { getSwatch } from "@microsoft/fast-components-styles-msft/dist/utilities/color/palette";
import { ButtonStyles as MSFTStyle } from "@microsoft/fast-components-styles-msft";
import { mergeDesignSystem } from "@microsoft/fast-jss-manager-react";

/**
 * This color should be unaffected by the changes
 * between light/dark mode
 */
const applyAccentBackground: CSSRules<DesignSystem> = {
  background: ds => getSwatch(45, accentPalette(ds)),
};

const shadowOpacityMultiple = (des: DesignSystem) =>
  4 - 3 * rgbToRelativeLuminance(parseColorString(backgroundColor(des))); // white (1) = 1; black (0) = 2;

/**
 * Applies shadows to the primary button which give it the pseudo-3d look-and-feel
 * @param shadowSize Size of the bottom-border and drop-shadow
 */
const applyPrimaryShadow = (shadowSize: number): CSSRules<DesignSystem> => {
  return {
    "box-shadow": format(
      "0 {0} 0 0 {1}, 0 {2} {3} 0 {4}",
      () => toPx(shadowSize),
      des => getSwatch(65, accentPalette(des)),
      () => toPx(shadowSize + 2),
      () => toPx(shadowSize * 1.4),
      des => new ColorRGBA64(0, 0, 0, 0.35 * shadowOpacityMultiple(des)).toStringWebRGBA()
    ),
  };
};

const applyBeforeMargin: CSSRules<DesignSystem> = {
  "margin-right": directionSwitch(horizontalSpacing(4), ""),
  "margin-left": directionSwitch("", horizontalSpacing(4)),
};

const styles: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    padding: format("6px {0}", horizontalSpacing(focusOutlineWidth)),
    background: "transparent",
    "body:not(.js-focus-visible) &:focus": {
      borderColor: "transparent",
    },
  },
  button__primary: {
    fill: accentForegroundCut,
    color: accentForegroundCut,
    ...applyAccentBackground,
    ...applyPrimaryShadow(4),
    "font-weight": "bold",
    overflow: "visible",
    position: "relative",

    // More css-weighting, so that generic rules don't break the effect
    "&$button": {
      "margin-bottom": "4px",
    },

    // Additional spacing to avoid clipping
    "&::before": {
      transition: "inherit",
      content: "''",
      height: "2px",
      width: "calc(100% + 4px)", // + 2px border left/right
      display: "block",
      position: "absolute",
      left: "-2px",
      top: "-2px", // + 2px border top
    },

    "&:hover:enabled": {
      ...applyAccentBackground,
      ...applyPrimaryShadow(2),
      "margin-top": "2px",
      "margin-bottom": "2px",
      "text-decoration": "none",

      "&::before": {
        top: "-4px",
      },
    },

    "&:active:enabled": {
      ...applyAccentBackground,
    },
  },
  button_afterContent: {
    "margin-right": directionSwitch("", horizontalSpacing(4)),
    "margin-left": directionSwitch(horizontalSpacing(4), ""),
  },
  button_icon: {
    display: "inline-block",
    position: "relative",
    width: glyphSize,
    height: glyphSize,
    "flex-shrink": "0",
  },
  button__hasIconAndContent: {
    "& $button_beforeContent, & $button_icon": {
      ...applyBeforeMargin,
    },
  },
  button__justified: {
    "& span": {
      position: "relative",
      "&::before": {
        content: "''",
        position: "absolute",
        backgroundColor: accentFillHover,
        width: "100%",
        height: "2px",
        bottom: "-4px",
        transform: "scaleX(0)",
        transformOrigin: "right",
        transition: "transform .3s",
      },
    },
    "&:hover span::before": {
      transform: "scaleX(1)",
      transformOrigin: "left",
    },
  },
  button__lightweight: {
    background: "transparent",
    color: neutralForegroundRest,
    fill: neutralForegroundRest,
    outline: "none",
    "&:hover:enabled, a&:not($button__disabled):hover": {
      background: neutralFillHover,
      color: neutralForegroundHover,
      ...highContrastSelected,
      "& $button_beforeContent, & $button_afterContent": {
        ...highContrastSelectedForeground,
      },
    },
    "&:active:enabled, a&:not($button__disabled):active": {
      color: neutralForegroundActive,
      background: neutralFillActive,
    },
    ...applyFocusVisible<DesignSystem>({
      ...highContrastOutlineFocus,
      "border-color": neutralFocus,
    }),
    "body:not(.js-focus-visible) &:focus": {
      borderColor: "transparent",
    },
  },
  button__iconOnly: {
    padding: "8px",
    margin: "5px",
    height: "auto",
    ...applyPillCornerRadius(),
    "& $button_icon": {
      width: "17px",
      height: "17px",
    },
  },
};

export default mergeDesignSystem(MSFTStyle, styles);
