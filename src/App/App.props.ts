import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface AppContainerClassNameContract {
  /**
   * Root of the component
   */
  container?: string;
}

/**
 * Props for the component
 */
export interface AppContainerProps
  extends ManagedClasses<AppContainerClassNameContract> {}
