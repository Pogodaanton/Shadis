import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface DashboardListToolbarClassNameContract {
  dashboardListToolbar: string;
  dashboardListToolbar__visible?: string;
}

/**
 * Props for the component
 */
export interface DashboardListToolbarProps
  extends ManagedClasses<DashboardListToolbarClassNameContract> {
  visible?: boolean;
  selectedAmount?: number;
  onDelete: () => void;
}
