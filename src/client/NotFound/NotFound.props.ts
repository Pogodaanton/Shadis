import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface NotFoundClassNameContract {
  notFound?: string;
  notFoundIcon?: string;
}

/**
 * Props for the component
 */
export interface NotFoundProps extends ManagedClasses<NotFoundClassNameContract> {}
