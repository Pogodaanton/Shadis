import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface FVSidebarFooterClassNameContract {
  fv_sidebarFooter: string;
  fv_sidebarFooter_buttons: string;
  fv_sidebarFooter_links: string;
}

/**
 * Props for the component
 */
export interface FVSidebarFooterProps
  extends ManagedClasses<FVSidebarFooterClassNameContract> {
  fileData: Window["fileData"];
}
