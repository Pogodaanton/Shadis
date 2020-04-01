import React from "react";
import { IconType } from "react-icons/lib";
import { CSSRules } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

/**
 * Converts an icon from "react-icons" into a glyph that can accept JSS-managed-classes
 *
 * @export
 * @param {IconType} Icon Icon to be converted into a glyph
 * @returns {(className: string) => React.ReactNode} A FAST-MSFT compatible glyph
 */
export const iconToGlyph = (Icon: IconType) => (className: string): React.ReactNode => (
  <Icon className={className} />
);

export const applyCenteredFlexbox = (): CSSRules<DesignSystem> => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
};
