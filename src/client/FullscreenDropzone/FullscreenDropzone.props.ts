import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface FullscreenDropzoneClassNameContract {
  fullscreenDropzone?: string;
  fullscreenDropzone_visisble?: string;
  fullscreenDropzone_dragging?: string;
  fullscreenDropzoneDialogContent_header?: string;
  fullscreenDropzoneDialogContent_buttons?: string;
}

/**
 * Props for the component
 */
export interface FullscreenDropzoneProps
  extends ManagedClasses<FullscreenDropzoneClassNameContract> {}

export interface WrappedDropzoneComponentProps {
  openDropzoneDialog: () => void;
}
