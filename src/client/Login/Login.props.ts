import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface LoginClassNameContract {
  login?: string;
}

/**
 * Props for the component
 */
export interface LoginProps extends ManagedClasses<LoginClassNameContract> {}
