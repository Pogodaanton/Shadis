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
   * Content for the left-side section
   * of the header
   */
  leftContent?: ReactNode;
  /**
   * Content for the center section
   * of the header
   *
   * Keep in mind that this part will be
   * invisible for mobile users due to space constraints.
   */
  centerContent?: ReactNode;
  /**
   * Content for the right-side section
   * of the header
   */
  rightSideContent?: ReactNode;
}
