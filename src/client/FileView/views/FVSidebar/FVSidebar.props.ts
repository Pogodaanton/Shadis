import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface FVSidebarClassNameContract {
  fv_sidebar: string;
  fv_sidebar_button: string;
  fv_sidebar_container: string;
}

/**
 * Props for the component
 */
export interface FVSidebarProps extends ManagedClasses<FVSidebarClassNameContract> {
  fileData: Window["fileData"];
}
