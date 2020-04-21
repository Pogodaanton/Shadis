import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface FVSidebarContentClassNameContract {
  fv_sidebarContent: string;
  fv_sidebarContent_list: string;
}

/**
 * Props for the component
 */
export interface FVSidebarContentProps
  extends ManagedClasses<FVSidebarContentClassNameContract> {
  fileData: Window["fileData"];
}
