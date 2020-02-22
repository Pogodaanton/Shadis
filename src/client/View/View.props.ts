import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface ViewClassNameContract {
  view?: string;
  viewIcon?: string;
}

/**
 * Props for the component
 */
export interface ViewProps extends ManagedClasses<ViewClassNameContract> {}
