import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import {
  ManagedClasses,
  CSSRules,
  CSSRuleResolver,
  CSSStaticRule,
} from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the header component
 */
export interface HeaderClassNameContract {
  /**
   * Root of the header component
   */
  header: string;
  header_fixed?: string;
  /**
   * Left-side logo section
   */
  headerLeft?: string;
  /**
   * Left-side info which could be used for simple notifications.
   * Currently it has no other use than being a fancy title for the app.
   */
  headerLeftInfo?: string;
}

/**
 * Props for the header component
 */
export interface HeaderProps extends ManagedClasses<HeaderClassNameContract> {
  fixed?: boolean;
}

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
