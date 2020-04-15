import { ReactNode } from "react";
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
  header__fixed?: string;
  header__absolute?: string;
  /**
   * Left-side logo section
   */
  header_left: string;
  /**
   * Center section of the header
   */
  header_center?: string;
  /**
   * Right-side section of the header
   */
  header_right?: string;
}

/**
 * Props for the header component
 */
export interface HeaderProps extends ManagedClasses<HeaderClassNameContract> {
  /**
   * Changes the position parameter
   * of the main `<header/>` tag
   *
   * In `fixed` mode, all items below
   * the header will receive a `padding-top`
   * in the same size as the header
   */
  position?: "fixed" | "absolute";
  /**
   * Content for the center section
   * of the header
   */
  centerContent?: ReactNode;
  /**
   * Content for the right-side section
   * of the header
   */
  rightSideContent?: ReactNode;
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
