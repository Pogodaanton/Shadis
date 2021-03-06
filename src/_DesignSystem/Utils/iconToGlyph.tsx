import React from "react";
import { IconType } from "react-icons/lib";

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
