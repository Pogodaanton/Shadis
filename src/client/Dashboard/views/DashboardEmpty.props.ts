import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface DashboardEmptyClassNameContract {
  dashboardEmpty?: string;
  dashboardEmptyIcon?: string;
}

/**
 * Props for the component
 */
export interface DashboardEmptyProps
  extends ManagedClasses<DashboardEmptyClassNameContract> {}
