/**
 * Code taken from "@microsoft/fast-components-styles-msft"
 * Modified to fit the custom design
 */
import { ButtonAppearance } from "@microsoft/fast-components-react-msft";
import manageJss from "@microsoft/fast-jss-manager-react";
import MSFTButton from "@microsoft/fast-components-react-msft/dist/button/button";
import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import {
  applyFocusVisible,
  directionSwitch,
  format,
  subtract,
  toPx,
} from "@microsoft/fast-jss-utilities";
import {
  DesignSystem,
  DesignSystemResolver,
  applyCornerRadius,
  applyFocusPlaceholderBorder,
  accentFillRest,
  accentForegroundActive,
  accentForegroundCut,
  accentForegroundHover,
  accentForegroundRest,
  neutralFillActive,
  neutralFillHover,
  neutralFillRest,
  neutralFillStealthActive,
  neutralFillStealthHover,
  neutralFillStealthRest,
  neutralFocus,
  neutralFocusInnerAccent,
  neutralForegroundRest,
  neutralOutlineActive,
  neutralOutlineHover,
  neutralOutlineRest,
  glyphSize,
  horizontalSpacing,
  applyCursorPointer,
  focusOutlineWidth,
  getDesignSystemValue,
  outlineWidth,
  applyDisabledState,
  highContrastAccent,
  HighContrastColor,
  highContrastDisabledBorder,
  highContrastDisabledForeground,
  highContrastDoubleFocus,
  highContrastHighlightBackground,
  highContrastHighlightForeground,
  highContrastLinkBorder,
  highContrastLinkForeground,
  highContrastLinkOutline,
  highContrastLinkValue,
  highContrastOutline,
  highContrastOutlineFocus,
  highContrastSelected,
  highContrastSelectedForeground,
  highContrastSelector,
  highContrastStealth,
  applyScaledTypeRamp,
  accentPalette,
} from "@microsoft/fast-components-styles-msft";
import { getSwatch } from "@microsoft/fast-components-styles-msft/dist/utilities/color/palette";

const transparentBackground: CSSRules<DesignSystem> = {
  "background-color": "transparent",
};

const density: DesignSystemResolver<number> = getDesignSystemValue("density");

const applyAccentBackground: CSSRules<DesignSystem> = {
  background: ds => getSwatch(45, accentPalette(ds)),
};

const applyPrimaryShadow = (shadowSize: string): CSSRules<DesignSystem> => {
  return {
    "box-shadow": format(
      "0 {0} 0 0 {1}",
      () => shadowSize,
      ds => getSwatch(65, accentPalette(ds))
    ),
  };
};

const applyTransparentBackplateStyles: CSSRules<DesignSystem> = {
  color: accentForegroundRest,
  fill: accentForegroundRest,
  ...transparentBackground,
  ...applyFocusVisible({
    "border-color": "transparent",
    "box-shadow": "none",
    ...highContrastHighlightForeground,
    "& $button_contentRegion::before": {
      background: neutralForegroundRest,
      height: toPx<DesignSystem>(focusOutlineWidth),
      ...highContrastHighlightBackground,
    },
  }),
  // Underline
  "& $button_contentRegion::before": {
    [highContrastSelector]: {
      background: HighContrastColor.buttonText,
    },
  },
  "&:hover $button_contentRegion::before": {
    background: accentForegroundHover,
    ...highContrastHighlightBackground,
  },
  "&:hover$button__disabled $button_contentRegion::before": {
    display: "none",
  },
  "&:active $button_contentRegion::before": {
    background: accentForegroundActive,
  },
  "&$button__disabled, &$button__disabled $button_contentRegion::before": {
    ...transparentBackground,
  },
  "&:hover:enabled": {
    color: accentForegroundHover,
    ...transparentBackground,
    ...highContrastHighlightForeground,
    "& $button_beforeContent, & $button_afterContent": {
      fill: accentForegroundHover,
      ...highContrastHighlightForeground,
    },
  },
  "&:active:enabled": {
    color: accentForegroundActive,
    fill: accentForegroundActive,
    ...transparentBackground,
  },
  ...highContrastStealth,
};

const styles: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    ...applyScaledTypeRamp("t7"),
    "font-family": "inherit",
    ...applyCursorPointer(),
    "box-sizing": "border-box",
    "max-width": "374px",
    "min-width": (designSystem: DesignSystem): string =>
      density(designSystem) <= -2 ? "28px" : "32px",
    padding: format("6px {0}", horizontalSpacing(focusOutlineWidth)),
    display: "inline-flex",
    "justify-content": "center",
    "align-items": "center",
    ...applyFocusPlaceholderBorder(),
    ...applyCornerRadius(),
    "line-height": "1",
    overflow: "hidden",
    "text-decoration": "none",
    "white-space": "nowrap",
    transition: "all 0.1s ease-in-out",
    color: neutralForegroundRest,
    fill: neutralForegroundRest,
    background: neutralFillRest,
    "&:hover:enabled": {
      background: neutralFillHover,
      ...highContrastSelected,
      "& $button_beforeContent, & $button_afterContent": {
        ...highContrastSelectedForeground,
      },
    },
    "&:active:enabled": {
      background: neutralFillActive,
    },
    ...applyFocusVisible<DesignSystem>({
      ...highContrastOutlineFocus,
      "border-color": neutralFocus,
    }),
    "&:disabled": {
      ...highContrastDisabledBorder,
    },
    "&::-moz-focus-inner": {
      border: "0",
    },
    ...highContrastOutline,
    "a&": {
      ...highContrastLinkOutline,
      "&:hover": {
        ...highContrastLinkBorder,
      },
      "&$button__disabled": {
        ...highContrastDisabledBorder,
        "&:hover": {
          [highContrastSelector]: {
            "box-shadow": "none !important",
          },
        },
      },
    },
  },
  button__primary: {
    fill: accentForegroundCut,
    color: accentForegroundCut,
    ...applyAccentBackground,
    ...applyPrimaryShadow("4px"),
    "font-weight": "bold",
    "margin-bottom": "4px",
    overflow: "visible",
    position: "relative",
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
      "margin-top": "2px",
      "margin-bottom": "2px",
      "text-decoration": "none",
      ...applyPrimaryShadow("2px"),
      "&::before": {
        top: "-4px",
      },
    },
    "&:active:enabled": {
      ...applyAccentBackground,
    },
    ...applyFocusVisible<DesignSystem>({
      ...applyFocusPlaceholderBorder(),
      "border-color": neutralFocus,
      "box-shadow": format(
        "0 0 0 {0} inset {1}",
        toPx(focusOutlineWidth),
        neutralFocusInnerAccent(accentFillRest)
      ),
      ...highContrastDoubleFocus,
    }),
    "& $button_beforeContent, & $button_afterContent": {
      fill: accentForegroundCut,
    },
    ...highContrastAccent,
    "a&": {
      "& $button_beforeContent, & $button_afterContent": {
        ...highContrastLinkForeground,
      },
    },
  },
  button__outline: {
    background: "transparent",
    border: format("{0} solid {1}", toPx<DesignSystem>(outlineWidth), neutralOutlineRest),
    padding: format("0 {0}", horizontalSpacing(outlineWidth)),
    "&:hover:enabled": {
      background: "transparent",
      border: format(
        "{0} solid {1}",
        toPx<DesignSystem>(outlineWidth),
        neutralOutlineHover
      ),
      ...highContrastSelected,
    },
    "&:active:enabled": {
      background: "transparent",
      border: format(
        "{0} solid {1}",
        toPx<DesignSystem>(outlineWidth),
        neutralOutlineActive
      ),
    },
    ...applyFocusVisible<DesignSystem>({
      ...highContrastOutlineFocus,
      "box-shadow": format(
        "0 0 0 {0} {1} inset",
        toPx<DesignSystem>(subtract(focusOutlineWidth, outlineWidth)),
        neutralFocus
      ),
      "border-color": neutralFocus,
    }),
    ...highContrastOutline,
  },
  button__lightweight: {
    ...applyTransparentBackplateStyles,
    "a&": {
      "&:hover": {
        [highContrastSelector]: {
          "box-shadow": "none !important",
        },
        "& $button_contentRegion::before": {
          [highContrastSelector]: {
            background: highContrastLinkValue,
          },
        },
      },
      "&$button__disabled": {
        ...highContrastDisabledBorder,
      },
      "& $button_contentRegion::before": {
        [highContrastSelector]: {
          background: "transparent",
        },
      },
    },
  },
  button__justified: {
    ...applyTransparentBackplateStyles,
    "min-width": "74px",
    "padding-left": "0",
    "padding-right": "0",
    "border-width": "0",
    "justify-content": "flex-start",
    "a&": {
      "&:hover": {
        [highContrastSelector]: {
          "box-shadow": "none !important",
        },
        "& $button_contentRegion::before": {
          [highContrastSelector]: {
            background: highContrastLinkValue,
          },
        },
      },
      "&$button__disabled": {
        ...highContrastDisabledBorder,
      },
    },
  },
  button__stealth: {
    background: neutralFillStealthRest,
    "&:hover:enabled": {
      "background-color": neutralFillStealthHover,
      ...highContrastSelected,
    },
    "&:active:enabled": {
      "background-color": neutralFillStealthActive,
    },
    ...applyFocusVisible<DesignSystem>({
      ...highContrastOutlineFocus,
      "border-color": neutralFocus,
    }),
    ...highContrastStealth,
  },
  button_contentRegion: {
    position: "relative",
    "&::before": {
      content: "''",
      display: "block",
      height: toPx<DesignSystem>(outlineWidth),
      position: "absolute",
      bottom: "-3px",
      width: "100%",
      left: directionSwitch("0", ""),
      right: directionSwitch("", "0"),
    },
    "& svg": {
      width: glyphSize,
      height: glyphSize,
    },
  },
  button__disabled: {
    ...applyDisabledState(),
    ...highContrastDisabledBorder,
    "& $button_beforeContent, & $button_afterContent": {
      ...highContrastDisabledForeground,
    },
  },
  button_beforeContent: {
    width: glyphSize,
    height: glyphSize,
    "margin-right": directionSwitch(horizontalSpacing(), ""),
    "margin-left": directionSwitch("", horizontalSpacing()),
  },
  button_afterContent: {
    width: glyphSize,
    height: glyphSize,
    "margin-right": directionSwitch("", horizontalSpacing()),
    "margin-left": directionSwitch(horizontalSpacing(), ""),
  },
};

const Button = manageJss(styles)(MSFTButton);
type Button = InstanceType<typeof Button>;

export { Button, ButtonAppearance };