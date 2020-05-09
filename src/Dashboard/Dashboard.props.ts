import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface DashboardClassNameContract {
  dashboard__frozen?: string;
}

/**
 * Props for the component
 */
export interface DashboardProps extends ManagedClasses<DashboardClassNameContract> {
  frozen?: boolean;
}
