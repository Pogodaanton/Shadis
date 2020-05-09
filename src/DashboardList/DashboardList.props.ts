import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface DashboardListClassNameContract {
  dashboardList: string;
}

/**
 * Object contents in an item of the listData array
 */
export interface ListDataItem {
  id: string;
  thumb_height: number;
  timestamp: number;
  title: string;
}

/**
 * Props for the component
 */
export interface DashboardListProps
  extends ManagedClasses<DashboardListClassNameContract> {
  listData: ListDataItem[];
  onDeleteSelected: (selectedItems: string[]) => void;
  frozen?: boolean;
}
