import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { MasonryCellProps, CellMeasurerCache } from "react-virtualized";
import { ListDataItem } from "../DashboardList.props";

/**
 * Class name contract for the component
 */
export interface DashboardListCellClassNameContract {
  dashboardListCell: string;
  dashboardListCell__checked?: string;
  dashboardListCell_image: string;
  dashboardListCell_metadata: string;
  dashboardListCell_checkbox: string;
  dashboardListCell_overlay?: string;
}

/**
 * Props for the component
 */
export interface DashboardListCellProps
  extends ManagedClasses<DashboardListCellClassNameContract>,
    MasonryCellProps {
  cache: CellMeasurerCache;
  data: ListDataItem;
}
