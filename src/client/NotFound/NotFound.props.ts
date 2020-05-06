import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface NotFoundClassNameContract {
  notFound?: string;
  notFound_container?: string;
  notFound_icon?: string;
}

/**
 * Props for the component
 */
export interface NotFoundProps extends ManagedClasses<NotFoundClassNameContract> {}
