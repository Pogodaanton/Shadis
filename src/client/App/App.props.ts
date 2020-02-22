import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface AppClassNameContract {
  /**
   * Root of the component
   */
  container?: string;
}

/**
 * Props for the component
 */
export interface AppProps extends ManagedClasses<AppClassNameContract> {}
