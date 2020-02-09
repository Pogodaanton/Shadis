import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * The class name contract for the header component
 */
export interface HeaderClassNameContract {
  /**
   * The root of the header component
   */
  header?: string;
}

/**
 * Props for the header component
 */
export interface HeaderProps extends ManagedClasses<HeaderClassNameContract> {}
