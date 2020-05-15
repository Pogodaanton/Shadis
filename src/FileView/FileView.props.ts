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

/**
 * A special type for the root FileView component only
 * - Use null if data does not need to exist.
 * - Use empty if data does not exist.
 * - Use fileData if data should and does exist.
 */
export type FileData = Window["fileData"] | {} | null;
