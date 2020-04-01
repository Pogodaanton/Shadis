import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface DropzoneUploadManagerClassNameContract {
  dropzoneUploadManager: string;
  dropzoneUploadManager_hidden: string;
}

/**
 * Props for the component
 */
export interface DropzoneUploadManagerProps
  extends ManagedClasses<DropzoneUploadManagerClassNameContract> {
  dropData: {
    acceptedFiles: File[];
    rejectedFiles: File[];
  };
}
