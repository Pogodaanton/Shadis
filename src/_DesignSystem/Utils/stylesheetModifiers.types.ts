import {
  CSSRules,
  CSSRuleResolver,
  CSSStaticRule,
} from "@microsoft/fast-jss-manager-react";

/**
 * Custom type for fast-jss-utilities' applyAcrylic
 * See the comment in Header.tsx for more infos
 */
interface CustomAcrylicConfig<T> {
  textureImage?: string;
  backgroundColor: CSSRules<T> | CSSRuleResolver<T> | CSSStaticRule;
  fallbackBackgroundColor: CSSRules<T> | CSSRuleResolver<T> | CSSStaticRule;
  blurRadius?: string;
  saturation?: string;
}

export type CustomApplyAcrylic<T> = (config: CustomAcrylicConfig<T>) => CSSRules<T>;
