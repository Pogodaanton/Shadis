import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface DropzoneUploadClassNameContract {
  dropzoneUpload?: string;
  dropzoneUpload_rejectIcon?: string;
  dropzoneUpload_preview?: string;
  dropzoneUpload_background?: string;
  dropzoneUpload_details?: string;
  dropzoneUpload_error?: string;
  dropzoneUpload_progress?: string;
  dropzoneUpload_icon?: string;
}

/**
 * Props for the component
 */
export interface DropzoneUploadProps
  extends ManagedClasses<DropzoneUploadClassNameContract> {
  key: string;
  file: File;
  rejected: boolean;
  preview?: string;
  onRemoveRequest?: () => void;
}
