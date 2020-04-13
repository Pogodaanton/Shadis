import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface FileViewClassNameContract {
  fileView?: string;
  fileViewContainer?: string;
  fileViewBackground?: string;
}

/**
 * Props for the component
 */
export interface FileViewProps extends ManagedClasses<FileViewClassNameContract> {
  fileData?: Window["fileData"];
}
