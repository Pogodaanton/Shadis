import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the fsLoader component
 */
export interface FullscreenLoadingIndicatorClassNameContract {
  /**
   * Root of the fsLoader component
   */
  fsLoaderBackdrop?: string;
}

/**
 * Props for the fsLoader component
 */
export interface FullscreenLoadingIndicatorProps
  extends ManagedClasses<FullscreenLoadingIndicatorClassNameContract> {}
