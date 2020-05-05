import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface FVSidebarDescEditorClassNameContract {
  fv_sidebar_descEditor: string;
  fv_sidebar_descEditor_check?: string;
}

/**
 * Props for the component
 */
export interface FVSidebarDescEditorProps
  extends ManagedClasses<FVSidebarDescEditorClassNameContract> {
  fileData: Window["fileData"];
}
