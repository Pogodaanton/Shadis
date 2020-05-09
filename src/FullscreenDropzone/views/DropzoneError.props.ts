import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface DropzoneErrorClassNameContract {
  dropzoneError?: string;
  dropzoneErrorIcon?: string;
}

/**
 * Props for the component
 */
export interface DropzoneErrorProps
  extends ManagedClasses<DropzoneErrorClassNameContract> {
  error: string;
}
