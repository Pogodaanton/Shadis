import {
  CSSRules,
  CSSRuleResolver,
  CSSStaticRule,
} from "@microsoft/fast-jss-manager-react";
import { DesignSystem, acrylicNoise } from "@microsoft/fast-components-styles-msft";
import { applyAcrylic } from "@microsoft/fast-jss-utilities";
import { CustomApplyAcrylic } from "../Header/Header.props";

/**
 * Appends CSS parameters that create a centered flexbox
 */
export const applyCenteredFlexbox = (): CSSRules<DesignSystem> => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
};

/**
 * Generates an acrylic backdrop with the given background functon.
 *
 * Since not every browser supports acrylic materials, the background
 * function needs to accept different transparency values.
 *
 * @param background Function that accpets an opacity value in Hexadecimal (2 chars)
 */
export const applyBackdropBackground = (
  background: (opacityHex: string) => CSSRuleResolver<DesignSystem> | CSSStaticRule,
  opacityHex: string = "b0",
  fallbackOpacityHex: string = "f7"
): CSSRules<DesignSystem> => {
  /**
   * We need to redeclare the type since it does not allow a function as backgroundColor
   * even though that should work fine.
   */
  const customApplyAcrylic: CustomApplyAcrylic<DesignSystem> = applyAcrylic;
  return customApplyAcrylic({
    textureImage: acrylicNoise,
    backgroundColor: background(opacityHex),
    fallbackBackgroundColor: background(fallbackOpacityHex),
  });
};
